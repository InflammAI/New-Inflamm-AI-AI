const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Verify JWT access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Verify JWT refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

// Middleware: Authenticate access token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }

  // Verify token still exists in sessions table
  try {
    const sessionResult = await pool.query(
      'SELECT * FROM sessions WHERE access_token = $1 AND revoked_at IS NULL',
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Token has been revoked' });
    }

    req.user = { id: decoded.id, uuid: decoded.uuid, role: decoded.role };
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ error: 'Authentication service error' });
  }
};

// Middleware: Optional authentication (doesn't fail if token missing)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  const decoded = verifyAccessToken(token);
  if (decoded) {
    req.user = { id: decoded.id, uuid: decoded.uuid, role: decoded.role };
  }
  next();
};

// Middleware: Check role-based permission
const authorize = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
  authenticateToken,
  optionalAuth,
  authorize,
};
