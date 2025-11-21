import express from 'express';
import { verifyWallet, optionalAuth } from '../middleware/auth';
import db from '../config/database';

const router = express.Router();

// GET /api/v1/vytap/leaderboard
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const walletAddress = req.user?.walletAddress;

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
    }

    // Get total user count
    const totalUsersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    res.json({
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
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// POST /api/v1/vytap/tap
router.post('/tap', verifyWallet, async (req, res) => {
  try {
    const { walletAddress } = req.user!;
    const { timestamp } = req.body;

    // Verify tap timing (prevent spam)
    const lastTapResult = await db.query(
      'SELECT last_tap_at FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (lastTapResult.rows.length > 0 && lastTapResult.rows[0].last_tap_at) {
      const lastTap = new Date(lastTapResult.rows[0].last_tap_at).getTime();
      const now = Date.now();
      const cooldown = 200; // 200ms cooldown for faster tapping
      
      if ((now - lastTap) < cooldown) {
        return res.status(429).json({
          success: false,
          error: 'Tap too quickly. Please wait.',
          retryAfter: cooldown - (now - lastTap)
        });
      }
    }

    // Fixed 1 point per tap
    const pointsEarned = 1;

    // Start transaction
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');

      // Get or create user
      let userResult = await client.query(
        'SELECT id, total_points FROM users WHERE wallet_address = $1',
        [walletAddress]
      );

      let userId: number;
      let newTotal: number;

      if (userResult.rows.length === 0) {
        // Create new user
        const createResult = await client.query(
          'INSERT INTO users (wallet_address, total_points, last_tap_at) VALUES ($1, $2, NOW()) RETURNING id, total_points',
          [walletAddress, pointsEarned]
        );
        userId = createResult.rows[0].id;
        newTotal = pointsEarned;
      } else {
        // Update existing user
        userId = userResult.rows[0].id;
        const updateResult = await client.query(
          'UPDATE users SET total_points = total_points + $1, last_tap_at = NOW() WHERE id = $2 RETURNING total_points',
          [pointsEarned, userId]
        );
        newTotal = updateResult.rows[0].total_points;
      }

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

      res.json({
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
    res.status(500).json({ success: false, error: 'Failed to process tap' });
  }
});

// GET /api/v1/vytap/balance
router.get('/balance', verifyWallet, async (req, res) => {
  try {
    const { walletAddress } = req.user!;

    const result = await db.query(
      'SELECT total_points FROM users WHERE wallet_address = $1',
      [walletAddress]
    );

    res.json({
      success: true,
      data: {
        balance: result.rows[0]?.total_points || 0
      }
    });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// GET /api/v1/vytap/streak
router.get('/streak', verifyWallet, async (req, res) => {
  try {
    const { walletAddress } = req.user!;

    const userResult = await db.query(
      'SELECT id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );

    if (userResult.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          currentStreak: 0,
          longestStreak: 0
        }
      });
    }

    const streakResult = await db.query(
      'SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = $1',
      [userResult.rows[0].id]
    );

    res.json({
      success: true,
      data: {
        currentStreak: streakResult.rows[0]?.current_streak || 0,
        longestStreak: streakResult.rows[0]?.longest_streak || 0
      }
    });
  } catch (error) {
    console.error('Streak error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch streak' });
  }
});

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

export default router;
