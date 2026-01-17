const pool = require('../config/database');
const { logActivity } = require('../services/logger');

// Record new vital signs
const recordVital = async (req, res) => {
  const {
    heart_rate,
    heart_rate_variability,
    blood_oxygen_percentage,
    respiratory_rate,
    body_temperature,
    steps,
    calories_burned,
    active_minutes,
    distance_km,
    sleep_duration_minutes,
    sleep_stage_light_minutes,
    sleep_stage_deep_minutes,
    sleep_stage_rem_minutes,
    sleep_quality_score,
    recovery_index,
    stress_level,
    energy_level,
    recorded_at,
    device_id,
    notes,
  } = req.body;

  try {
    const recordedTimestamp = recorded_at || new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO vitals (
        user_id, device_id, heart_rate, heart_rate_variability, blood_oxygen_percentage,
        respiratory_rate, body_temperature, steps, calories_burned, active_minutes,
        distance_km, sleep_duration_minutes, sleep_stage_light_minutes, sleep_stage_deep_minutes,
        sleep_stage_rem_minutes, sleep_quality_score, recovery_index, stress_level, energy_level,
        recorded_at, is_manual_entry, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
       RETURNING uuid, user_id, heart_rate, blood_oxygen_percentage, respiratory_rate, 
                 steps, active_minutes, sleep_duration_minutes, recorded_at, created_at`,
      [
        req.user.id,
        device_id || null,
        heart_rate || null,
        heart_rate_variability || null,
        blood_oxygen_percentage || null,
        respiratory_rate || null,
        body_temperature || null,
        steps || null,
        calories_burned || null,
        active_minutes || null,
        distance_km || null,
        sleep_duration_minutes || null,
        sleep_stage_light_minutes || null,
        sleep_stage_deep_minutes || null,
        sleep_stage_rem_minutes || null,
        sleep_quality_score || null,
        recovery_index || null,
        stress_level || null,
        energy_level || null,
        recordedTimestamp,
        !device_id, // is_manual_entry if no device
        notes || null,
      ]
    );

    const vital = result.rows[0];

    // Log activity
    await logActivity(req.user.id, 'vital_recorded', 'vital', vital.user_id, req);

    res.status(201).json({
      message: 'Vital signs recorded successfully',
      vital,
    });
  } catch (err) {
    console.error('Record vital error:', err);
    res.status(500).json({ error: 'Failed to record vital signs' });
  }
};

// Get latest vital signs
const getLatestVitals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT uuid, heart_rate, blood_oxygen_percentage, respiratory_rate, body_temperature,
              steps, calories_burned, active_minutes, sleep_duration_minutes, sleep_quality_score,
              stress_level, energy_level, recorded_at, created_at
       FROM vitals
       WHERE user_id = $1
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No vital signs recorded yet' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get latest vitals error:', err);
    res.status(500).json({ error: 'Failed to fetch vital signs' });
  }
};

// Get vital signs history with pagination
const getVitalsHistory = async (req, res) => {
  const { page = 1, limit = 30, start_date, end_date } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM vitals WHERE user_id = $1';
    const params = [req.user.id];

    if (start_date && end_date) {
      query += ` AND recorded_at BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(start_date, end_date);
    }

    query += ` ORDER BY recorded_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM vitals WHERE user_id = $1';
    const countParams = [req.user.id];

    if (start_date && end_date) {
      countQuery += ` AND recorded_at BETWEEN $2 AND $3`;
      countParams.push(start_date, end_date);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get vitals history error:', err);
    res.status(500).json({ error: 'Failed to fetch vital signs history' });
  }
};

// Get vitals statistics for date range
const getVitalsStats = async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date and end_date required' });
  }

  try {
    const result = await pool.query(
      `SELECT
        AVG(heart_rate) as avg_heart_rate,
        MIN(heart_rate) as min_heart_rate,
        MAX(heart_rate) as max_heart_rate,
        AVG(blood_oxygen_percentage) as avg_blood_oxygen,
        AVG(respiratory_rate) as avg_respiratory_rate,
        AVG(body_temperature) as avg_temperature,
        SUM(steps) as total_steps,
        SUM(active_minutes) as total_active_minutes,
        AVG(sleep_duration_minutes) as avg_sleep_duration,
        AVG(sleep_quality_score) as avg_sleep_quality,
        COUNT(*) as record_count
       FROM vitals
       WHERE user_id = $1 AND recorded_at BETWEEN $2 AND $3`,
      [req.user.id, start_date, end_date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get vitals stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Delete vital entry
const deleteVital = async (req, res) => {
  const { vitalId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM vitals WHERE uuid = $1 AND user_id = $2 RETURNING uuid',
      [vitalId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vital not found' });
    }

    res.json({ message: 'Vital deleted successfully' });
  } catch (err) {
    console.error('Delete vital error:', err);
    res.status(500).json({ error: 'Failed to delete vital' });
  }
};

module.exports = {
  recordVital,
  getLatestVitals,
  getVitalsHistory,
  getVitalsStats,
  deleteVital,
};
