import { NextRequest, NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { getTelegramUserFromRequest } from '@/lib/telegram-auth';
import { verifyWalletSignature } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Validate Telegram user from initData
    const telegramUser = await getTelegramUserFromRequest(req);
    
    if (!telegramUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Telegram authentication' },
        { status: 401 }
      );
    }

    // Check if this Telegram user has a bound wallet
    const result = await query(
      'SELECT wallet_address, wallet_type, bound_at FROM telegram_wallet_bindings WHERE telegram_user_id = $1',
      [telegramUser.telegramUserId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        isBound: false,
        binding: null
      });
    }

    const binding = result.rows[0];
    return NextResponse.json({
      isBound: true,
      binding: {
        walletAddress: binding.wallet_address,
        walletType: binding.wallet_type,
        boundAt: binding.bound_at
      }
    });
  } catch (error) {
    console.error('Error checking wallet binding:', error);
    return NextResponse.json(
      { error: 'Failed to check wallet binding' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const client = await getClient();
  
  try {
    // Validate Telegram user from initData
    const telegramUser = await getTelegramUserFromRequest(req);
    
    if (!telegramUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Telegram authentication' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { walletAddress, walletType, signature, message, publicKey, tonProof } = body;

    if (!walletAddress || !walletType) {
      return NextResponse.json(
        { error: 'Wallet address and wallet type required' },
        { status: 400 }
      );
    }

    if (!['solana', 'ton'].includes(walletType)) {
      return NextResponse.json(
        { error: 'Invalid wallet type. Must be "solana" or "ton"' },
        { status: 400 }
      );
    }

    // CRITICAL SECURITY: Verify wallet ownership FIRST to derive actual wallet type
    // Don't trust client-supplied walletType before verification
    // Accept either tonProof OR signature+message and let verification determine type
    if (!tonProof && (!signature || !message)) {
      return NextResponse.json(
        { error: 'Wallet ownership proof required (either tonProof for TON or signature+message for Solana)' },
        { status: 400 }
      );
    }

    // Verify the proof proves ownership and derives the actual wallet type
    const verifyResult = await verifyWalletSignature(
      walletAddress,
      signature || '',
      message || '',
      false, // Not a session signature
      publicKey,
      tonProof
    );

    if (!verifyResult.success) {
      return NextResponse.json(
        { error: `Wallet ownership verification failed: ${verifyResult.error}` },
        { status: 401 }
      );
    }

    // CRITICAL: Wallet type MUST be derived from the proof, not trusted from client
    if (!verifyResult.walletType) {
      return NextResponse.json(
        { error: 'Wallet type could not be verified from proof. Invalid proof format.' },
        { status: 400 }
      );
    }

    // CRITICAL SECURITY: Use ONLY the proof-derived wallet address (never trust client claim)
    if (!verifyResult.walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address could not be verified from proof' },
        { status: 400 }
      );
    }

    // Verify the PROOF-DERIVED wallet type matches the client's claim
    // This prevents clients from lying about wallet type
    if (verifyResult.walletType !== walletType) {
      return NextResponse.json(
        { error: `Wallet type mismatch: proof indicates ${verifyResult.walletType} but client claims ${walletType}. Cannot bind.` },
        { status: 400 }
      );
    }

    // At this point, we have verified wallet ownership AND confirmed the wallet type
    const verifiedWalletType = verifyResult.walletType;
    const verifiedWalletAddress = verifyResult.walletAddress;

    // Begin transaction to handle race conditions
    await client.query('BEGIN');

    try {
      // Check if this Telegram user already has a binding (with row lock)
      const existingBinding = await client.query(
        'SELECT wallet_address, wallet_type FROM telegram_wallet_bindings WHERE telegram_user_id = $1 FOR UPDATE',
        [telegramUser.telegramUserId]
      );

      if (existingBinding.rows.length > 0) {
        const existing = existingBinding.rows[0];
        
        // If trying to bind a different wallet, reject
        if (existing.wallet_address !== verifiedWalletAddress) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            {
              error: 'Wallet already bound',
              message: 'This Telegram account is permanently linked to another wallet. You cannot change your wallet once connected.',
              boundWallet: {
                address: existing.wallet_address,
                type: existing.wallet_type
              }
            },
            { status: 409 }
          );
        }

        // Same wallet, return success
        await client.query('COMMIT');
        return NextResponse.json({
          success: true,
          message: 'Wallet already bound to this account',
          binding: {
            walletAddress: existing.wallet_address,
            walletType: existing.wallet_type
          }
        });
      }

      // Create new binding with INSERT ... ON CONFLICT
      const insertResult = await client.query(
        `INSERT INTO telegram_wallet_bindings (telegram_user_id, wallet_address, wallet_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (telegram_user_id) DO NOTHING
         RETURNING wallet_address, wallet_type`,
        [telegramUser.telegramUserId, verifiedWalletAddress, verifiedWalletType]
      );

      // If no rows returned, another concurrent request won - fetch the existing binding
      if (insertResult.rows.length === 0) {
        const concurrentBinding = await client.query(
          'SELECT wallet_address, wallet_type FROM telegram_wallet_bindings WHERE telegram_user_id = $1',
          [telegramUser.telegramUserId]
        );

        const existing = concurrentBinding.rows[0];
        if (existing.wallet_address !== verifiedWalletAddress) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            {
              error: 'Wallet already bound',
              message: 'This Telegram account is permanently linked to another wallet.',
              boundWallet: {
                address: existing.wallet_address,
                type: existing.wallet_type
              }
            },
            { status: 409 }
          );
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Wallet successfully bound',
        binding: {
          walletAddress: verifiedWalletAddress,
          walletType: verifiedWalletType
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error binding wallet:', error);
    return NextResponse.json(
      { error: 'Failed to bind wallet' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
