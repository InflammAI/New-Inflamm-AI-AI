const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticateToken } = require('../middleware/auth');
const { validateDeviceConnection, handleValidationErrors } = require('../middleware/validation');

// All device routes require authentication
router.use(authenticateToken);

// Connect device
router.post('/connect', validateDeviceConnection, handleValidationErrors, deviceController.connectDevice);

// Get connected devices
router.get('/', deviceController.getConnectedDevices);

// Disconnect device
router.post('/:deviceId/disconnect', deviceController.disconnectDevice);

// Sync device data
router.post('/:deviceId/sync', deviceController.syncDeviceData);

module.exports = router;
