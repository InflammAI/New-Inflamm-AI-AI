const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/auth');
const { validatePagination, handleValidationErrors } = require('../middleware/validation');

// All recommendation routes require authentication
router.use(authenticateToken);

// Generate recommendations
router.post('/generate', recommendationController.generateUserRecommendations);

// Get user's recommendations
router.get('/', validatePagination, handleValidationErrors, recommendationController.getUserRecs);

// Mark recommendation as acted upon
router.put('/:recommendationId/acted', recommendationController.markActedUpon);

module.exports = router;
