const pool = require('../config/database');
const { generateAccessToken, generateRefreshToken, hashPassword, comparePassword, generateVerificationToken } = require('../utils/crypto');
const { logActivity } = require('../services/logger');

// User signup
const signup = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, email_verification_token, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, uuid, email, first_name, last_name, role, created_at`,
      [email, passwordHash, first_name || null, last_name || null, verificationToken, 'user']
    );

    const user = result.rows[0];

    // Create notification preferences
    await pool.query(
      `INSERT INTO notification_preferences (user_id) VALUES ($1)`,
      [user.id]
    );

    // Create daily streak record
    await pool.query(
      `INSERT INTO daily_streaks (user_id) VALUES ($1)`,
      [user.id]
    );

    // Log activity
    await logActivity(user.id, 'signup', 'user', user.id, req);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: {
        uuid: user.uuid,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user
    const userResult = await pool.query(
      'SELECT id, uuid, email, password_hash, role FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordValid = await comparePassword(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Calculate expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store session
    await pool.query(
      `INSERT INTO sessions (user_id, access_token, refresh_token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        user.id,
        accessToken,
        refreshToken,
        req.ip,
        req.get('user-agent'),
        expiresAt,
      ]
    );

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Log activity
    await logActivity(user.id, 'login', 'user', user.id, req);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        uuid: user.uuid,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Refresh access token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    // Verify refresh token in database
    const sessionResult = await pool.query(
      'SELECT user_id FROM sessions WHERE refresh_token = $1 AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP',
      [refreshToken]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const userId = sessionResult.rows[0].user_id;

    // Get user details
    const userResult = await pool.query(
      'SELECT id, uuid, role, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Update session with new access token
    await pool.query(
      'UPDATE sessions SET access_token = $1 WHERE refresh_token = $2',
      [newAccessToken, refreshToken]
    );

    res.json({
      message: 'Access token refreshed',
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

// Logout
const logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    // Revoke session
    await pool.query(
      'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE access_token = $1',
      [token]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const userResult = await pool.query(
      `SELECT id, uuid, email, first_name, last_name, date_of_birth, gender, 
              profile_picture_url, height_cm, weight_kg, role, is_active, email_verified, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, height_cm, weight_kg, bio } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           date_of_birth = COALESCE($3, date_of_birth),
           gender = COALESCE($4, gender),
           height_cm = COALESCE($5, height_cm),
           weight_kg = COALESCE($6, weight_kg),
           bio = COALESCE($7, bio)
       WHERE id = $8
       RETURNING uuid, email, first_name, last_name, date_of_birth, gender, height_cm, weight_kg, bio, updated_at`,
      [first_name, last_name, date_of_birth, gender, height_cm, weight_kg, bio, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  updateProfile,
};
