const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Get latest vitals for user
 */
const getLatestVitals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vitalType } = req.query;
    
    let queryText = `
      SELECT 
        id, vital_type, value, unit, measured_at, metadata,
        ROW_NUMBER() OVER (PARTITION BY vital_type ORDER BY measured_at DESC) as rn
      FROM vitals 
      WHERE user_id = $1
    `;
    
    const params = [userId];
    
    if (vitalType) {
      queryText += ' AND vital_type = $2';
      params.push(vitalType);
    }
    
    queryText = `
      SELECT id, vital_type, value, unit, measured_at, metadata
      FROM (${queryText}) sub
      WHERE rn = 1
      ORDER BY vital_type
    `;
    
    const result = await query(queryText, params);
    
    res.json({
      vitals: result.rows
    });
    
  } catch (error) {
    logger.error('Get vitals error:', error);
    res.status(500).json({
      error: 'Failed to fetch vitals',
      message: 'An error occurred while fetching vital signs'
    });
  }
};

/**
 * Get vitals history
 */
const getVitalsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vitalType, startDate, endDate, limit = 100 } = req.query;
    
    if (!vitalType) {
      return res.status(400).json({
        error: 'Vital type required',
        message: 'Please specify a vital type'
      });
    }
    
    let queryText = `
      SELECT id, vital_type, value, unit, measured_at, metadata
      FROM vitals 
      WHERE user_id = $1 AND vital_type = $2
    `;
    
    const params = [userId, vitalType];
    let paramCount = 2;
    
    if (startDate) {
      paramCount++;
      queryText += ` AND measured_at >= $${paramCount}`;
      params.push(startDate);
    }
    
    if (endDate) {
      paramCount++;
      queryText += ` AND measured_at <= $${paramCount}`;
      params.push(endDate);
    }
    
    queryText += ` ORDER BY measured_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await query(queryText, params);
    
    res.json({
      vitalType,
      count: result.rows.length,
      data: result.rows
    });
    
  } catch (error) {
    logger.error('Get vitals history error:', error);
    res.status(500).json({
      error: 'Failed to fetch vitals history',
      message: 'An error occurred while fetching vitals history'
    });
  }
};

/**
 * Record new vital sign
 */
const recordVital = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vitalType, value, unit, measuredAt, deviceId, metadata } = req.body;
    
    // Insert vital record
    const result = await query(
      `INSERT INTO vitals (user_id, device_id, vital_type, value, unit, measured_at, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, vital_type, value, unit, measured_at`,
      [userId, deviceId || null, vitalType, value, unit, measuredAt || new Date(), metadata || null]
    );
    
    const vital = result.rows[0];
    
    // Check if vital exceeds thresholds
    const thresholdCheck = await query(
      `SELECT min_value, max_value, alert_enabled 
       FROM vital_thresholds 
       WHERE user_id = $1 AND vital_type = $2 AND alert_enabled = true`,
      [userId, vitalType]
    );
    
    if (thresholdCheck.rows.length > 0) {
      const threshold = thresholdCheck.rows[0];
      
      if ((threshold.min_value && value < threshold.min_value) ||
          (threshold.max_value && value > threshold.max_value)) {
        // Create alert notification
        await query(
          `INSERT INTO notifications (user_id, notification_type, title, message, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            'vital_threshold',
            `${vitalType} Alert`,
            `Your ${vitalType} (${value} ${unit}) is outside normal range.`,
            { vitalId: vital.id, vitalType, value, unit }
          ]
        );
      }
    }
    
    logger.info(`Vital recorded: ${vitalType} for user ${userId}`);
    
    res.status(201).json({
      message: 'Vital recorded successfully',
      vital
    });
    
  } catch (error) {
    logger.error('Record vital error:', error);
    res.status(500).json({
      error: 'Failed to record vital',
      message: 'An error occurred while recording vital sign'
    });
  }
};

/**
 * Batch record vitals (for device sync)
 */
const batchRecordVitals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vitals, deviceId } = req.body;
    
    if (!Array.isArray(vitals) || vitals.length === 0) {
      return res.status(400).json({
        error: 'Invalid data',
        message: 'Please provide an array of vitals'
      });
    }
    
    const insertedVitals = [];
    
    for (const vital of vitals) {
      const result = await query(
        `INSERT INTO vitals (user_id, device_id, vital_type, value, unit, measured_at, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, vital_type, value, unit, measured_at`,
        [
          userId,
          deviceId || null,
          vital.vitalType,
          vital.value,
          vital.unit,
          vital.measuredAt || new Date(),
          vital.metadata || null
        ]
      );
      
      insertedVitals.push(result.rows[0]);
    }
    
    logger.info(`Batch vitals recorded: ${vitals.length} for user ${userId}`);
    
    res.status(201).json({
      message: 'Vitals recorded successfully',
      count: insertedVitals.length,
      vitals: insertedVitals
    });
    
  } catch (error) {
    logger.error('Batch record vitals error:', error);
    res.status(500).json({
      error: 'Failed to record vitals',
      message: 'An error occurred while recording vitals'
    });
  }
};

/**
 * Get vitals summary/statistics
 */
const getVitalsSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vitalType, days = 7 } = req.query;
    
    if (!vitalType) {
      return res.status(400).json({
        error: 'Vital type required',
        message: 'Please specify a vital type'
      });
    }
    
    const result = await query(
      `SELECT 
        COUNT(*) as count,
        AVG(value) as avg_value,
        MIN(value) as min_value,
        MAX(value) as max_value,
        STDDEV(value) as std_dev
       FROM vitals
       WHERE user_id = $1 
         AND vital_type = $2 
         AND measured_at >= NOW() - INTERVAL '${parseInt(days)} days'`,
      [userId, vitalType]
    );
    
    res.json({
      vitalType,
      period: `${days} days`,
      summary: result.rows[0]
    });
    
  } catch (error) {
    logger.error('Get vitals summary error:', error);
    res.status(500).json({
      error: 'Failed to fetch summary',
      message: 'An error occurred while fetching vitals summary'
    });
  }
};

module.exports = {
  getLatestVitals,
  getVitalsHistory,
  recordVital,
  batchRecordVitals,
  getVitalsSummary,
};
