const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');
const { validatePagination, handleValidationErrors } = require('../middleware/validation');

// All notification routes require authentication
router.use(authenticateToken);

// Get notifications
router.get('/', validatePagination, handleValidationErrors, notificationController.getNotifications);

// Get unread count
router.get('/unread/count', notificationController.getUnread);

// Mark as read
router.put('/:notificationId/read', notificationController.markRead);

module.exports = router;
