const pool = require('../config/database');

// Log user activity
const logActivity = async (userId, action, resourceType, resourceId, req) => {
  try {
    const ip = (req && req.ip) || '0.0.0.0';
    const userAgent = (req && req.get && req.get('user-agent')) || '';

    await pool.query(
      `INSERT INTO activity_logs (user_id, action, resource_type, resource_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, resourceType, resourceId, ip, userAgent]
    );
  } catch (err) {
    console.error('Log activity error:', err);
  }
};

// Get activity logs
const getActivityLogs = async (userId, page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT uuid, action, resource_type, ip_address, created_at
       FROM activity_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  } catch (err) {
    console.error('Get activity logs error:', err);
    throw err;
  }
};

module.exports = {
  logActivity,
  getActivityLogs,
};
