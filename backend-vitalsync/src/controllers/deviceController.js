const pool = require('../config/database');
const axios = require('axios');
const { encryptData, decryptData } = require('../utils/crypto');
const { logActivity } = require('../services/logger');

// Connect wearable device
const connectDevice = async (req, res) => {
  const { device_type, device_name, oauth_token, oauth_refresh_token, external_device_id } = req.body;

  try {
    // Validate device type
    const validTypes = ['fitbit', 'oura', 'garmin', 'apple_watch', 'manual'];
    if (!validTypes.includes(device_type)) {
      return res.status(400).json({ error: 'Invalid device type' });
    }

    // Encrypt OAuth tokens if provided
    const encryptedToken = oauth_token ? encryptData(oauth_token) : null;
    const encryptedRefreshToken = oauth_refresh_token ? encryptData(oauth_refresh_token) : null;

    // Check if device already exists
    const existingDevice = await pool.query(
      'SELECT id FROM user_devices WHERE user_id = $1 AND device_type = $2 AND external_device_id = $3',
      [req.user.id, device_type, external_device_id || null]
    );

    if (existingDevice.rows.length > 0) {
      return res.status(409).json({ error: 'Device already connected' });
    }

    // Create device record
    const result = await pool.query(
      `INSERT INTO user_devices (user_id, device_type, device_name, external_device_id, 
                                oauth_token_encrypted, oauth_refresh_token_encrypted, is_active, connection_status)
       VALUES ($1, $2, $3, $4, $5, $6, true, 'connected')
       RETURNING uuid, device_type, device_name, connection_status, created_at`,
      [req.user.id, device_type, device_name || null, external_device_id || null, encryptedToken, encryptedRefreshToken]
    );

    const device = result.rows[0];

    // Store encrypted API key if needed
    if (oauth_token) {
      await pool.query(
        `INSERT INTO api_keys (user_id, key_name, encrypted_key, service, is_active)
         VALUES ($1, $2, $3, $4, true)`,
        [req.user.id, `${device_type}_key`, encryptedToken, device_type]
      );
    }

    // Log activity
    await logActivity(req.user.id, 'device_connected', 'device', device.uuid, req);

    res.status(201).json({
      message: `${device_type} device connected successfully`,
      device,
    });
  } catch (err) {
    console.error('Connect device error:', err);
    res.status(500).json({ error: 'Failed to connect device' });
  }
};

// Get user's connected devices
const getConnectedDevices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT uuid, device_type, device_name, connection_status, last_synced, is_active, created_at, updated_at
       FROM user_devices
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      devices: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error('Get devices error:', err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

// Disconnect device
const disconnectDevice = async (req, res) => {
  const { deviceId } = req.params;

  try {
    // Get device
    const deviceResult = await pool.query(
      'SELECT id, device_type FROM user_devices WHERE uuid = $1 AND user_id = $2',
      [deviceId, req.user.id]
    );

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const device = deviceResult.rows[0];

    // Revoke API key
    await pool.query(
      'UPDATE api_keys SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND service = $2',
      [req.user.id, device.device_type]
    );

    // Update device status
    await pool.query(
      'UPDATE user_devices SET is_active = false, connection_status = $1 WHERE uuid = $2',
      ['disconnected', deviceId]
    );

    // Log activity
    await logActivity(req.user.id, 'device_disconnected', 'device', device.id, req);

    res.json({ message: 'Device disconnected successfully' });
  } catch (err) {
    console.error('Disconnect device error:', err);
    res.status(500).json({ error: 'Failed to disconnect device' });
  }
};

// Sync data from device
const syncDeviceData = async (req, res) => {
  const { deviceId } = req.params;

  try {
    // Get device details
    const deviceResult = await pool.query(
      `SELECT id, device_type, external_device_id, oauth_token_encrypted, oauth_refresh_token_encrypted
       FROM user_devices WHERE uuid = $1 AND user_id = $2`,
      [deviceId, req.user.id]
    );

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const device = deviceResult.rows[0];

    // Decrypt tokens
    const decryptedToken = device.oauth_token_encrypted 
      ? decryptData(device.oauth_token_encrypted) 
      : null;

    // Route to appropriate sync service
    let syncedData = {};
    switch (device.device_type) {
      case 'fitbit':
        syncedData = await syncFitbitData(decryptedToken, device.external_device_id);
        break;
      case 'oura':
        syncedData = await syncOuraData(decryptedToken);
        break;
      case 'garmin':
        syncedData = await syncGarminData(decryptedToken);
        break;
      default:
        return res.status(400).json({ error: 'Device type not supported for syncing' });
    }

    // Store synced vitals
    if (syncedData.vitals && syncedData.vitals.length > 0) {
      for (const vital of syncedData.vitals) {
        await pool.query(
          `INSERT INTO vitals (user_id, device_id, heart_rate, blood_oxygen_percentage, 
                              respiratory_rate, steps, active_minutes, sleep_duration_minutes, 
                              sleep_quality_score, recorded_at, data_source)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT DO NOTHING`,
          [
            req.user.id,
            device.id,
            vital.heart_rate || null,
            vital.blood_oxygen || null,
            vital.respiratory_rate || null,
            vital.steps || null,
            vital.active_minutes || null,
            vital.sleep_minutes || null,
            vital.sleep_quality || null,
            vital.timestamp,
            device.device_type,
          ]
        );
      }
    }

    // Update last synced timestamp
    await pool.query(
      'UPDATE user_devices SET last_synced = CURRENT_TIMESTAMP WHERE id = $1',
      [device.id]
    );

    // Log activity
    await logActivity(req.user.id, 'device_synced', 'device', device.id, req);

    res.json({
      message: 'Device data synced successfully',
      synced_vitals_count: syncedData.vitals ? syncedData.vitals.length : 0,
    });
  } catch (err) {
    console.error('Sync device error:', err);
    
    // Update device status on error
    await pool.query(
      'UPDATE user_devices SET connection_status = $1, error_message = $2 WHERE uuid = $3',
      ['error', err.message, req.params.deviceId]
    );

    res.status(500).json({ error: 'Failed to sync device data' });
  }
};

// Fitbit sync implementation
const syncFitbitData = async (accessToken, deviceId) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Get heart rate
    const heartRateRes = await axios.get(
      'https://api.fitbit.com/1/user/-/activities/date/today.json',
      { headers }
    );

    // Get sleep data
    const sleepRes = await axios.get(
      'https://api.fitbit.com/1.2/user/-/sleep/date/today.json',
      { headers }
    );

    return {
      vitals: [
        {
          heart_rate: heartRateRes.data.activities[0]?.heartRate || null,
          steps: heartRateRes.data.summary?.steps || null,
          active_minutes: heartRateRes.data.summary?.fairlyActiveMinutes || null,
          sleep_minutes: sleepRes.data.sleep[0]?.duration / 60 || null,
          sleep_quality: sleepRes.data.sleep[0]?.efficiency || null,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error('Fitbit sync error:', err.message);
    throw new Error('Failed to sync Fitbit data');
  }
};

// Oura sync implementation
const syncOuraData = async (accessToken) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const today = new Date().toISOString().split('T')[0];

    // Get daily summary
    const dailyRes = await axios.get(
      `https://api.oura.io/v2/usercollection/daily_summary?start_date=${today}`,
      { headers }
    );

    const daily = dailyRes.data.data[0] || {};

    return {
      vitals: [
        {
          heart_rate: daily.heart_rate || null,
          respiratory_rate: daily.respiratory_rate || null,
          body_temperature: daily.skin_temperature?.value || null,
          sleep_minutes: daily.sleep?.total_sleep_duration / 60 || null,
          sleep_quality: daily.sleep?.sleep_efficiency || null,
          recovery_index: daily.readiness?.score || null,
          stress_level: daily.stress?.category || null,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error('Oura sync error:', err.message);
    throw new Error('Failed to sync Oura data');
  }
};

// Garmin sync implementation
const syncGarminData = async (accessToken) => {
  try {
    // Garmin API implementation would go here
    // This is a placeholder
    return {
      vitals: [
        {
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error('Garmin sync error:', err.message);
    throw new Error('Failed to sync Garmin data');
  }
};

module.exports = {
  connectDevice,
  getConnectedDevices,
  disconnectDevice,
  syncDeviceData,
};
