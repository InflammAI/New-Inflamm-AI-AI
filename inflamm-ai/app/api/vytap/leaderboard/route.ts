import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { PublicKey } from '@solana/web3.js';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const walletAddress = searchParams.get('walletAddress');

    // Get top users
    const topUsersQuery = `
      SELECT 
        wallet_address,
        SUBSTRING(wallet_address, 1, 4) || '...' || SUBSTRING(wallet_address, LENGTH(wallet_address) - 3, 4) as user_id,
        total_points as points,
        ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank
      FROM users
      ORDER BY total_points DESC
      LIMIT $1
    `;
    
    const topUsers = await db.query(topUsersQuery, [limit]);

    // If wallet provided, get user's rank and points
    let userRank = null;
    let userPoints = null;
    
    if (walletAddress) {
      try {
        new PublicKey(walletAddress);
        
        const userStatsQuery = `
          SELECT 
            total_points,
            (
              SELECT COUNT(*) + 1 
              FROM users 
              WHERE total_points > u.total_points
            ) as rank
          FROM users u
          WHERE wallet_address = $1
        `;
        
        const userStats = await db.query(userStatsQuery, [walletAddress]);

        if (userStats.rows.length > 0) {
          userPoints = userStats.rows[0].total_points;
          userRank = parseInt(userStats.rows[0].rank);
          
          // Mark user's entry in top list if present
          topUsers.rows = topUsers.rows.map((row: any) => ({
            ...row,
            isCurrentUser: row.wallet_address === walletAddress
          }));
        }
      } catch (error) {
        // Invalid wallet, just continue without user data
      }
    }

    // Get total user count
    const totalUsersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    return NextResponse.json({
      success: true,
      data: {
        entries: topUsers.rows.map((row: any) => ({
          userId: row.user_id,
          points: row.points,
          rank: parseInt(row.rank),
          isCurrentUser: row.isCurrentUser || false
        })),
        userRank,
        userPoints,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
