const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');
const { authenticateToken } = require('../middleware/auth');
const { validateVitalEntry, validatePagination, validateDateRange, handleValidationErrors } = require('../middleware/validation');

// All vitals routes require authentication
router.use(authenticateToken);

// Record new vital
router.post('/', validateVitalEntry, handleValidationErrors, vitalsController.recordVital);

// Get latest vital
router.get('/latest', vitalsController.getLatestVitals);

// Get vitals history with pagination
router.get('/history', validatePagination, validateDateRange, handleValidationErrors, vitalsController.getVitalsHistory);

// Get vitals statistics
router.get('/stats', validateDateRange, handleValidationErrors, vitalsController.getVitalsStats);

// Delete vital entry
router.delete('/:vitalId', vitalsController.deleteVital);

module.exports = router;
