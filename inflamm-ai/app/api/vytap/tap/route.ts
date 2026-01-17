import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyWalletSignature } from '@/lib/auth';
import { getTelegramUserFromRequest } from '@/lib/telegram-auth';

// Helper function to update streak
async function updateStreak(client: any, userId: number) {
  const today = new Date().toISOString().split('T')[0];
  
  const streakResult = await client.query(
    'SELECT current_streak, last_tap_date FROM user_streaks WHERE user_id = $1',
    [userId]
  );

  if (streakResult.rows.length === 0) {
    // Create new streak
    await client.query(
      'INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_tap_date) VALUES ($1, 1, 1, $2)',
      [userId, today]
    );
  } else {
    const lastDate = streakResult.rows[0].last_tap_date?.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    
    if (lastDate === yesterdayStr) {
      // Consecutive day
      newStreak = streakResult.rows[0].current_streak + 1;
    } else if (lastDate === today) {
      // Same day, keep streak
      newStreak = streakResult.rows[0].current_streak;
    }
    // else: streak broken, reset to 1

    await client.query(
      `UPDATE user_streaks 
       SET current_streak = $1, 
           longest_streak = GREATEST(longest_streak, $1),
           last_tap_date = $2
       WHERE user_id = $3`,
      [newStreak, today, userId]
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, sessionSignature, sessionMessage, signature, message, publicKey, tonProof } = body;
    
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing wallet address' },
        { status: 400 }
      );
    }

    // Check if we have valid proof (either TON proof OR Solana signature)
    const hasTonProof = !!tonProof;
    const hasSolanaProof = !!(sessionSignature || signature) && !!(sessionMessage || message);

    if (!hasTonProof && !hasSolanaProof) {
      return NextResponse.json(
        { success: false, error: 'Missing authentication credentials. Provide either tonProof or signature+message' },
        { status: 400 }
      );
    }

    const sig = sessionSignature || signature || '';
    const msg = sessionMessage || message || '';

    // Verify wallet signature (supports both Solana and TON)
    // Proof structure determines wallet type (proof-first validation)
    const verifyResult = await verifyWalletSignature(
      walletAddress, 
      sig, 
      msg, 
      !!sessionSignature, 
      publicKey,
      tonProof
    );
    
    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.error },
        { status: 401 }
      );
    }

    // CRITICAL: Wallet type MUST be derived from proof (never default to 'solana')
    if (!verifyResult.walletType) {
      return NextResponse.json(
        { success: false, error: 'Wallet type could not be verified from proof' },
        { status: 400 }
      );
    }

    // CRITICAL SECURITY: Use ONLY the proof-derived wallet address (never trust client claim)
    if (!verifyResult.walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address could not be verified from proof' },
        { status: 400 }
      );
    }

    const walletType = verifyResult.walletType;
    const verifiedWalletAddress = verifyResult.walletAddress;

    // CRITICAL SECURITY: Check if this wallet is bound to ANY Telegram user
    const walletBindingCheck = await db.query(
      'SELECT telegram_user_id, wallet_address, wallet_type FROM telegram_wallet_bindings WHERE wallet_address = $1',
      [verifiedWalletAddress]
    );

    if (walletBindingCheck.rows.length > 0) {
      // This wallet is bound to a Telegram user - MUST have valid Telegram authentication
      const telegramUser = await getTelegramUserFromRequest(req);
      
      if (!telegramUser) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This wallet is linked to a Telegram account. Please authenticate via Telegram to earn points.' 
          },
          { status: 401 }
        );
      }

      const boundTelegramUserId = walletBindingCheck.rows[0].telegram_user_id;

      // Verify the authenticated Telegram user matches the bound user
      if (telegramUser.telegramUserId !== boundTelegramUserId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This wallet is linked to a different Telegram account. You can only earn points with your own bound wallet.' 
          },
          { status: 403 }
        );
      }

      // Verify wallet type matches the binding
      if (walletBindingCheck.rows[0].wallet_type !== walletType) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Wallet type mismatch. Please use your bound wallet type.' 
          },
          { status: 403 }
        );
      }
    }
    // If wallet is not bound to any Telegram user, allow tap (regular web users)

    // Verify tap timing (prevent spam)
    const lastTapResult = await db.query(
      'SELECT last_tap_at FROM users WHERE wallet_address = $1',
      [verifiedWalletAddress]
    );
    
    if (lastTapResult.rows.length > 0 && lastTapResult.rows[0].last_tap_at) {
      const lastTap = new Date(lastTapResult.rows[0].last_tap_at).getTime();
      const now = Date.now();
      const cooldown = 50; // 50ms cooldown for ultra-fast tapping (20 taps/sec max)
      
      if ((now - lastTap) < cooldown) {
        return NextResponse.json({
          success: false,
          error: 'Tap too quickly. Please wait.',
          retryAfter: cooldown - (now - lastTap)
        }, { status: 429 });
      }
    }

    // Fixed 1 point per tap
    const pointsEarned = 1;

    // Start transaction
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');

      // Use UPSERT to avoid race condition (now stores wallet type)
      const upsertResult = await client.query(
        `INSERT INTO users (wallet_address, wallet_type, total_points, last_tap_at) 
         VALUES ($1, $2, $3, NOW()) 
         ON CONFLICT (wallet_address) 
         DO UPDATE SET total_points = users.total_points + $3, last_tap_at = NOW()
         RETURNING id, total_points`,
        [verifiedWalletAddress, walletType, pointsEarned]
      );
      
      const userId = upsertResult.rows[0].id;
      const newTotal = upsertResult.rows[0].total_points;

      // Record tap history
      await client.query(
        'INSERT INTO tap_history (user_id, points_earned) VALUES ($1, $2)',
        [userId, pointsEarned]
      );

      // Update streak
      await updateStreak(client, userId);

      // Get new rank
      const rankResult = await client.query(
        'SELECT COUNT(*) + 1 as rank FROM users WHERE total_points > $1',
        [newTotal]
      );

      // Get current streak
      const streakResult = await client.query(
        'SELECT current_streak FROM user_streaks WHERE user_id = $1',
        [userId]
      );

      await client.query('COMMIT');
      client.release();

      return NextResponse.json({
        success: true,
        data: {
          pointsEarned,
          totalPoints: newTotal,
          newRank: parseInt(rankResult.rows[0].rank),
          streak: streakResult.rows[0]?.current_streak || 0
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }
  } catch (error) {
    console.error('Tap error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process tap' },
      { status: 500 }
    );
  }
}
