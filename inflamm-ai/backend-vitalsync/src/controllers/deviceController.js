const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Get user's connected devices
 */
const getDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      `SELECT id, device_type, device_name, is_connected, last_sync, created_at
       FROM user_devices
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    
    res.json({
      devices: result.rows
    });
    
  } catch (error) {
    logger.error('Get devices error:', error);
    res.status(500).json({
      error: 'Failed to fetch devices',
      message: 'An error occurred while fetching devices'
    });
  }
};

/**
 * Connect a new device (manual entry)
 */
const connectDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceType, deviceName, metadata } = req.body;
    
    // Check if device type is valid
    const validTypes = ['fitbit', 'oura', 'garmin', 'apple_watch', 'manual'];
    if (!validTypes.includes(deviceType)) {
      return res.status(400).json({
        error: 'Invalid device type',
        message: `Device type must be one of: ${validTypes.join(', ')}`
      });
    }
    
    // Insert device
    const result = await query(
      `INSERT INTO user_devices (user_id, device_type, device_name, metadata)
       VALUES ($1, $2, $3, $4)
       RETURNING id, device_type, device_name, is_connected, created_at`,
      [userId, deviceType, deviceName, metadata || null]
    );
    
    const device = result.rows[0];
    
    logger.info(`Device connected: ${deviceType} for user ${userId}`);
    
    res.status(201).json({
      message: 'Device connected successfully',
      device
    });
    
  } catch (error) {
    logger.error('Connect device error:', error);
    res.status(500).json({
      error: 'Failed to connect device',
      message: 'An error occurred while connecting device'
    });
  }
};

/**
 * Initiate OAuth flow for external devices (Fitbit, Oura, Garmin)
 */
const initiateDeviceOAuth = async (req, res) => {
  try {
    const { deviceType } = req.params;
    const userId = req.user.id;
    
    // OAuth URLs and configuration
    const oauthConfigs = {
      fitbit: {
        authUrl: 'https://www.fitbit.com/oauth2/authorize',
        clientId: process.env.FITBIT_CLIENT_ID,
        scope: 'activity heartrate sleep profile',
        redirectUri: `${process.env.FRONTEND_URL}/api/v1/devices/oauth/callback/fitbit`
      },
      oura: {
        authUrl: 'https://cloud.ouraring.com/oauth/authorize',
        clientId: process.env.OURA_CLIENT_ID,
        scope: 'daily',
        redirectUri: `${process.env.FRONTEND_URL}/api/v1/devices/oauth/callback/oura`
      },
      garmin: {
        authUrl: 'https://connect.garmin.com/oauthConfirm',
        clientId: process.env.GARMIN_CONSUMER_KEY,
        scope: 'all',
        redirectUri: `${process.env.FRONTEND_URL}/api/v1/devices/oauth/callback/garmin`
      }
    };
    
    const config = oauthConfigs[deviceType];
    
    if (!config || !config.clientId) {
      return res.status(400).json({
        error: 'Unsupported device or missing configuration',
        message: 'This device type is not configured for OAuth'
      });
    }
    
    // Build authorization URL
    const authUrl = `${config.authUrl}?` +
      `client_id=${config.clientId}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(config.scope)}&` +
      `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
      `state=${userId}`;
    
    res.json({
      authorizationUrl: authUrl,
      message: 'Redirect user to this URL to authorize device access'
    });
    
  } catch (error) {
    logger.error('OAuth initiation error:', error);
    res.status(500).json({
      error: 'Failed to initiate OAuth',
      message: 'An error occurred while initiating device authorization'
    });
  }
};

/**
 * Handle OAuth callback (exchange code for token)
 * Note: This is a simplified version. In production, implement full OAuth flow.
 */
const handleOAuthCallback = async (req, res) => {
  try {
    const { deviceType } = req.params;
    const { code, state: userId } = req.query;
    
    if (!code) {
      return res.status(400).json({
        error: 'Authorization code missing',
        message: 'OAuth callback did not include authorization code'
      });
    }
    
    // TODO: Exchange code for access token with device API
    // This is device-specific and requires actual API integration
    
    // For now, store a placeholder
    const result = await query(
      `INSERT INTO user_devices (user_id, device_type, device_name, oauth_token, is_connected)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, device_type, device_name`,
      [userId, deviceType, `${deviceType} Device`, code]
    );
    
    logger.info(`OAuth device connected: ${deviceType} for user ${userId}`);
    
    res.json({
      message: 'Device connected successfully via OAuth',
      device: result.rows[0]
    });
    
  } catch (error) {
    logger.error('OAuth callback error:', error);
    res.status(500).json({
      error: 'OAuth callback failed',
      message: 'An error occurred while processing device authorization'
    });
  }
};

/**
 * Sync data from connected device
 */
const syncDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceId } = req.params;
    
    // Get device info
    const deviceResult = await query(
      'SELECT * FROM user_devices WHERE id = $1 AND user_id = $2',
      [deviceId, userId]
    );
    
    if (deviceResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Device not found',
        message: 'The specified device does not exist or does not belong to you'
      });
    }
    
    const device = deviceResult.rows[0];
    
    if (!device.is_connected) {
      return res.status(400).json({
        error: 'Device not connected',
        message: 'Please reconnect your device before syncing'
      });
    }
    
    // TODO: Implement actual device sync logic based on device type
    // This would involve calling the device's API to fetch latest data
    
    // Update last sync time
    await query(
      'UPDATE user_devices SET last_sync = CURRENT_TIMESTAMP WHERE id = $1',
      [deviceId]
    );
    
    logger.info(`Device synced: ${device.device_type} for user ${userId}`);
    
    res.json({
      message: 'Device synced successfully',
      lastSync: new Date()
    });
    
  } catch (error) {
    logger.error('Device sync error:', error);
    res.status(500).json({
      error: 'Sync failed',
      message: 'An error occurred while syncing device data'
    });
  }
};

/**
 * Disconnect device
 */
const disconnectDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceId } = req.params;
    
    const result = await query(
      `UPDATE user_devices 
       SET is_connected = false, oauth_token = NULL, oauth_refresh_token = NULL
       WHERE id = $1 AND user_id = $2
       RETURNING device_type`,
      [deviceId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Device not found',
        message: 'The specified device does not exist'
      });
    }
    
    logger.info(`Device disconnected: ${result.rows[0].device_type} for user ${userId}`);
    
    res.json({
      message: 'Device disconnected successfully'
    });
    
  } catch (error) {
    logger.error('Disconnect device error:', error);
    res.status(500).json({
      error: 'Failed to disconnect device',
      message: 'An error occurred while disconnecting device'
    });
  }
};

module.exports = {
  getDevices,
  connectDevice,
  initiateDeviceOAuth,
  handleOAuthCallback,
  syncDevice,
  disconnectDevice,
};
