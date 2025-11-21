import express, { Request, Response } from 'express';
import { verifyWallet, optionalAuth } from '../middleware/auth';
import db, { ExtendedClient } from '../config/database';

const router = express.Router();

// Typed Request with optional user
interface AuthRequest extends Request {
  user?: { walletAddress: string };
}

// GET /api/v1/vytap/leaderboard
router.get('/leaderboard', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const walletAddress = req.user?.walletAddress;

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

    let userRank: number | null = null;
    let userPoints: number | null = null;
    
    if (walletAddress) {
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
        userRank = parseInt(userStats.rows[0].rank, 10);
        topUsers.rows = topUsers.rows.map((row: any) => ({
          ...row,
          isCurrentUser: row.wallet_address === walletAddress
        }));
      }
    }

    const totalUsersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

    return res.json({
      success: true,
      data: {
        entries: topUsers.rows.map((row: any) => ({
          userId: row.user_id,
          points: row.points,
          rank: parseInt(row.rank, 10),
          isCurrentUser: row.isCurrentUser || false
        })),
        userRank,
        userPoints,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// POST /api/v1/vytap/tap
router.post('/tap', verifyWallet, async (req: AuthRequest, res: Response) => {
  try {
    const { walletAddress } = req.user!;
    const { timestamp } = req.body;

    const lastTapResult = await db.query(
      'SELECT last_tap_at FROM users WHERE wallet_address = $1',
      [walletAddress]
    );

    if (lastTapResult.rows.length > 0 && lastTapResult.rows[0].last_tap_at) {
      const lastTap = new Date(lastTapResult.rows[0].last_tap_at).getTime();
      const now = Date.now();
      const cooldown = 200;
      if ((now - lastTap) < cooldown) {
        return res.status(429).json({
          success: false,
          error: 'Tapping too fast, please wait a moment.',
          retryAfter: cooldown - (now - lastTap)
        });
      }
    }

    const pointsEarned = 1;
    const client = await db.getClient() as ExtendedClient;

    try {
      await client.query('BEGIN');

      let userResult = await client.query(
        'SELECT id, total_points FROM users WHERE wallet_address = $1',
        [walletAddress]
      );

      let userId: number;
      let newTotal: number;

      if (userResult.rows.length === 0) {
        const createResult = await client.query(
          'INSERT INTO users (wallet_address, total_points, last_tap_at) VALUES ($1, $2, NOW()) RETURNING id, total_points',
          [walletAddress, pointsEarned]
        );
        userId = createResult.rows[0].id;
        newTotal = pointsEarned;
      } else {
        userId = userResult.rows[0].id;
        const updateResult = await client.query(
          'UPDATE users SET total_points = total_points + $1, last_tap_at = NOW() WHERE id = $2 RETURNING total_points',
          [pointsEarned, userId]
        );
        newTotal = updateResult.rows[0].total_points;
      }

      await client.query(
        'INSERT INTO tap_history (user_id, points_earned) VALUES ($1, $2)',
        [userId, pointsEarned]
      );

      await updateStreak(client, userId);

      const rankResult = await client.query(
        'SELECT COUNT(*) + 1 as rank FROM users WHERE total_points > $1',
        [newTotal]
      );

      const streakResult = await client.query(
        'SELECT current_streak FROM user_streaks WHERE user_id = $1',
        [userId]
      );

      await client.query('COMMIT');
      client.release();

      return res.json({
        success: true,
        data: {
          pointsEarned,
          totalPoints: newTotal,
          newRank: parseInt(rankResult.rows[0].rank, 10),
          streak: streakResult.rows[0]?.current_streak || 0
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      client.release();
      throw err;
    }
  } catch (error) {
    console.error('Tap error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process tap' });
  }
});

// GET /api/v1/vytap/balance
router.get('/balance', verifyWallet, async (req: AuthRequest, res: Response) => {
  try {
    const { walletAddress } = req.user!;
    const result = await db.query(
      'SELECT total_points FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    return res.json({ success: true, data: { balance: result.rows[0]?.total_points || 0 } });
  } catch (error) {
    console.error('Balance error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// GET /api/v1/vytap/streak
router.get('/streak', verifyWallet, async (req: AuthRequest, res: Response) => {
  try {
    const { walletAddress } = req.user!;
    const userResult = await db.query(
      'SELECT id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );

    if (userResult.rows.length === 0) {
      return res.json({ success: true, data: { currentStreak: 0, longestStreak: 0 } });
    }

    const streakResult = await db.query(
      'SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = $1',
      [userResult.rows[0].id]
    );

    return res.json({
      success: true,
      data: {
        currentStreak: streakResult.rows[0]?.current_streak || 0,
        longestStreak: streakResult.rows[0]?.longest_streak || 0
      }
    });
  } catch (error) {
    console.error('Streak error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch streak' });
  }
});

// Helper
async function updateStreak(client: ExtendedClient, userId: number) {
  const today = new Date().toISOString().split('T')[0];
  const streakResult = await client.query(
    'SELECT current_streak, last_tap_date FROM user_streaks WHERE user_id = $1',
    [userId]
  );

  if (streakResult.rows.length === 0) {
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
    if (lastDate === yesterdayStr) newStreak = streakResult.rows[0].current_streak + 1;
    else if (lastDate === today) newStreak = streakResult.rows[0].current_streak;

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

export default router;
