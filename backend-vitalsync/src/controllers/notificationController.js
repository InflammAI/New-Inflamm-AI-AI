const { getUserNotifications, getUnreadCount, markAsRead } = require('../services/notificationService');

// Get user's notifications
const getNotifications = async (req, res) => {
  const { page = 1, limit = 20, unread = false } = req.query;

  try {
    const result = await getUserNotifications(req.user.id, parseInt(page), parseInt(limit), unread === 'true');
    res.json(result);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get unread notification count
const getUnread = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.id);
    res.json({ unread_count: count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

// Mark notification as read
const markRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const result = await markAsRead(req.user.id, notificationId);
    res.json({
      message: 'Notification marked as read',
      notification: result,
    });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

module.exports = {
  getNotifications,
  getUnread,
  markRead,
};
