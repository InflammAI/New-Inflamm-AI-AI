import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyWalletSignature } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, sessionSignature, sessionMessage, signature, message } = body;
    
    const sig = sessionSignature || signature;
    const msg = sessionMessage || message;

    // Verify wallet signature
    const verifyResult = await verifyWalletSignature(walletAddress, sig, msg, !!sessionSignature);
    
    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.error },
        { status: 401 }
      );
    }

    const result = await db.query(
      'SELECT total_points FROM users WHERE wallet_address = $1',
      [walletAddress]
    );

    return NextResponse.json({
      success: true,
      data: {
        balance: result.rows[0]?.total_points || 0
      }
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
