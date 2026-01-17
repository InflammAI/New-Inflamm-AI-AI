const pool = require('../config/database');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send notification
const sendNotification = async (userId, notificationType, title, message, data = {}, deliveryMethod = 'in_app') => {
  try {
    // Check notification preferences
    const prefResult = await pool.query(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    );

    if (prefResult.rows.length === 0) {
      console.warn(`No notification preferences for user ${userId}`);
      return;
    }

    const preferences = prefResult.rows[0];

    // Determine if notification should be sent
    const shouldSendEmail = 
      deliveryMethod === 'email' || 
      (notificationType === 'inactivity_alert' && preferences.email_inactivity_alerts) ||
      (notificationType === 'health_summary' && preferences.email_health_summary) ||
      (notificationType === 'vital_threshold' && preferences.email_vital_alerts);

    const shouldSendPush =
      deliveryMethod === 'push' ||
      (notificationType === 'inactivity_alert' && preferences.push_inactivity_alerts) ||
      (notificationType === 'health_summary' && preferences.push_health_summary) ||
      (notificationType === 'vital_threshold' && preferences.push_vital_alerts);

    // Store notification in database
    const result = await pool.query(
      `INSERT INTO notifications (user_id, notification_type, title, message, data, delivery_method, delivery_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING uuid, created_at`,
      [userId, notificationType, title, message, JSON.stringify(data), deliveryMethod]
    );

    const notificationId = result.rows[0].uuid;

    // Send email if preferred
    if (shouldSendEmail) {
      const userResult = await pool.query(
        'SELECT email, first_name FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await sendEmail(user.email, user.first_name, title, message, data);
      }
    }

    // Mark notification as sent
    await pool.query(
      'UPDATE notifications SET delivery_status = $1, delivered_at = CURRENT_TIMESTAMP WHERE uuid = $2',
      ['sent', notificationId]
    );

    return notificationId;
  } catch (err) {
    console.error('Send notification error:', err);
  }
};

// Send email notification
const sendEmail = async (toEmail, name, subject, message, data) => {
  try {
    const htmlContent = buildEmailTemplate(name, subject, message, data);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject,
      html: htmlContent,
    });

    console.log(`✓ Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Send email error:', err);
    throw err;
  }
};

// Build HTML email template
const buildEmailTemplate = (name, subject, message, data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
        .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; display: inline-block; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Vital Sync Health Update</h2>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <h3>${subject}</h3>
          <p>${message}</p>
          ${data.recommendation ? `<p><strong>Recommendation:</strong> ${data.recommendation}</p>` : ''}
          ${data.action_url ? `<a href="${data.action_url}" class="button">View Details</a>` : ''}
        </div>
        <div class="footer">
          <p>© 2024 Vital Sync. All rights reserved.</p>
          <p>You're receiving this email because you have notifications enabled in Vital Sync.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Get user's notifications
const getUserNotifications = async (userId, page = 1, limit = 20, onlyUnread = false) => {
  try {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM notifications WHERE user_id = $1';
    const params = [userId];

    if (onlyUnread) {
      query += ' AND is_read = false';
    }

    query += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1';
    const countParams = [userId];
    if (onlyUnread) {
      countQuery += ' AND is_read = false';
      countParams.push();
    }

    const countResult = await pool.query(countQuery, countParams);

    return {
      notifications: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        unreadCount: onlyUnread ? parseInt(countResult.rows[0].count) : await getUnreadCount(userId),
      },
    };
  } catch (err) {
    console.error('Get notifications error:', err);
    throw err;
  }
};

// Get unread notification count
const getUnreadCount = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    return parseInt(result.rows[0].count);
  } catch (err) {
    console.error('Get unread count error:', err);
    return 0;
  }
};

// Mark notification as read
const markAsRead = async (userId, notificationId) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true, read_at = CURRENT_TIMESTAMP 
       WHERE uuid = $1 AND user_id = $2
       RETURNING uuid, is_read`,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Notification not found');
    }

    return result.rows[0];
  } catch (err) {
    console.error('Mark as read error:', err);
    throw err;
  }
};

// Scheduled job: Send inactivity alerts
const sendInactivityAlerts = async () => {
  try {
    console.log('[Job] Checking for inactive users...');

    // Get users inactive for 2+ hours
    const inactiveUsersResult = await pool.query(
      `SELECT u.id, u.first_name, u.email, MAX(v.recorded_at) as last_activity
       FROM users u
       LEFT JOIN vitals v ON u.id = v.user_id
       LEFT JOIN notifications n ON u.id = n.user_id AND n.notification_type = 'inactivity_alert'
       WHERE u.is_active = true
       GROUP BY u.id
       HAVING MAX(v.recorded_at) < CURRENT_TIMESTAMP - INTERVAL '2 hours'
       AND MAX(n.created_at) < CURRENT_TIMESTAMP - INTERVAL '6 hours'`
    );

    for (const user of inactiveUsersResult.rows) {
      await sendNotification(
        user.id,
        'inactivity_alert',
        'You\'ve been inactive for 2 hours',
        'Keep your health goals on track! Log your vitals or sync your wearable device.',
        { last_activity: user.last_activity }
      );
    }

    console.log(`✓ Sent inactivity alerts to ${inactiveUsersResult.rows.length} users`);
  } catch (err) {
    console.error('Inactivity alerts job error:', err);
  }
};

// Scheduled job: Send daily health summaries
const sendDailyHealthSummaries = async () => {
  try {
    console.log('[Job] Generating daily health summaries...');

    const usersResult = await pool.query(
      `SELECT DISTINCT u.id, u.first_name, u.email
       FROM users u
       WHERE u.is_active = true`
    );

    for (const user of usersResult.rows) {
      try {
        // Get today's vitals
        const vitalsResult = await pool.query(
          `SELECT 
             COUNT(*) as entries,
             AVG(heart_rate) as avg_hr,
             AVG(blood_oxygen_percentage) as avg_o2,
             SUM(steps) as total_steps,
             AVG(sleep_quality_score) as avg_sleep_quality
           FROM vitals
           WHERE user_id = $1
           AND DATE(recorded_at) = CURRENT_DATE`,
          [user.id]
        );

        const stats = vitalsResult.rows[0];

        if (stats.entries > 0) {
          const summary = `
            Today's Summary:
            - Heart Rate (avg): ${Math.round(stats.avg_hr)} bpm
            - Blood Oxygen: ${Math.round(stats.avg_o2)}%
            - Steps: ${stats.total_steps || 0}
            - Sleep Quality: ${Math.round(stats.avg_sleep_quality)}/100
          `;

          await sendNotification(
            user.id,
            'health_summary',
            'Daily Health Summary',
            summary,
            stats,
            'email'
          );
        }
      } catch (err) {
        console.error(`Error generating summary for user ${user.id}:`, err);
      }
    }

    console.log('[Job] Daily health summaries completed');
  } catch (err) {
    console.error('Daily summaries job error:', err);
  }
};

module.exports = {
  sendNotification,
  sendEmail,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  sendInactivityAlerts,
  sendDailyHealthSummaries,
};
