const pool = require('../config/database');
// TODO: Uncomment when @anthropic-ai/sdk is installed
// const { Anthropic } = require('@anthropic-ai/sdk');
const { logActivity } = require('./logger');

// const client = new Anthropic();

// Generate AI health recommendations based on vitals
const generateRecommendations = async (userId, vitalsData) => {
  try {
    // Get user health profile
    const userResult = await pool.query(
      `SELECT first_name, health_goals, height_cm, weight_kg 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult.rows[0];

    // Prepare prompt for Claude
    // TODO: Uncomment when @anthropic-ai/sdk is installed
    // const prompt = buildHealthPrompt(user, vitalsData);

    // For now, use mock recommendations
    const responseText = generateMockRecommendations(vitalsData);

    // Parse recommendations
    const recommendations = parseRecommendations(responseText);

    // Store recommendations in database
    const storedRecommendations = [];
    for (const rec of recommendations) {
      const result = await pool.query(
        `INSERT INTO ai_recommendations 
         (user_id, recommendation_type, title, content, vitals_data, model_version, confidence_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING uuid, recommendation_type, title, content, created_at`,
        [
          userId,
          rec.type,
          rec.title,
          rec.content,
          JSON.stringify(vitalsData),
          'claude-3-5-sonnet-20241022',
          rec.confidence || 0.85,
        ]
      );

      storedRecommendations.push(result.rows[0]);
    }

    // Log activity
    await logActivity(userId, 'recommendation_generated', 'recommendation', userId, {});

    return storedRecommendations;
  } catch (err) {
    console.error('Generate recommendations error:', err);
    throw err;
  }
};

// Build health analysis prompt for Claude
const buildHealthPrompt = (user, vitalsData) => {
  const { first_name, health_goals, height_cm, weight_kg } = user;

  // Calculate BMI
  const bmi = height_cm && weight_kg 
    ? (weight_kg / ((height_cm / 100) ** 2)).toFixed(1) 
    : 'unknown';

  return `You are a health and wellness advisor. Analyze the following health metrics and provide personalized recommendations.

User Profile:
- Name: ${first_name || 'User'}
- Health Goals: ${health_goals || 'Not specified'}
- BMI: ${bmi}

Current Health Metrics:
- Heart Rate: ${vitalsData.heart_rate || 'N/A'} bpm
- Blood Oxygen: ${vitalsData.blood_oxygen_percentage || 'N/A'}%
- Respiratory Rate: ${vitalsData.respiratory_rate || 'N/A'} breaths/min
- Body Temperature: ${vitalsData.body_temperature || 'N/A'}°C
- Steps Today: ${vitalsData.steps || 'N/A'}
- Active Minutes: ${vitalsData.active_minutes || 'N/A'}
- Sleep Duration: ${vitalsData.sleep_duration_minutes || 'N/A'} minutes
- Sleep Quality Score: ${vitalsData.sleep_quality_score || 'N/A'}/100
- Stress Level: ${vitalsData.stress_level || 'N/A'}
- Energy Level: ${vitalsData.energy_level || 'N/A'}/100

Please provide 3-4 specific, actionable recommendations in the following JSON format:
[
  {
    "type": "wellness|exercise|nutrition|sleep|stress",
    "title": "Brief title",
    "content": "Detailed recommendation",
    "confidence": 0.0-1.0
  }
]

Focus on practical, evidence-based recommendations that directly address the user's current health metrics and goals.`;
};

// Parse Claude's response into structured recommendations
const parseRecommendations = (responseText) => {
  try {
    // Extract JSON from response (Claude might include text before/after)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return generateDefaultRecommendations();
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    return recommendations.filter(rec => rec.type && rec.title && rec.content);
  } catch (err) {
    console.error('Parse recommendations error:', err);
    return generateDefaultRecommendations();
  }
};

// Generate default recommendations if parsing fails
const generateDefaultRecommendations = () => {
  return [
    {
      type: 'wellness',
      title: 'Stay Hydrated',
      content: 'Drink at least 8 glasses of water daily to maintain optimal health and cognitive function.',
      confidence: 0.9,
    },
    {
      type: 'exercise',
      title: 'Increase Activity',
      content: 'Aim for 150 minutes of moderate-intensity activity per week to improve cardiovascular health.',
      confidence: 0.85,
    },
    {
      type: 'sleep',
      title: 'Improve Sleep Hygiene',
      content: 'Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep each night.',
      confidence: 0.88,
    },
  ];
};

// Get user's recommendations
const getUserRecommendations = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT uuid, recommendation_type, title, content, confidence_score, is_acted_upon, created_at
       FROM ai_recommendations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM ai_recommendations WHERE user_id = $1',
      [userId]
    );

    return {
      recommendations: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    };
  } catch (err) {
    console.error('Get recommendations error:', err);
    throw err;
  }
};

// Mark recommendation as acted upon
const markRecommendationActedUpon = async (userId, recommendationId) => {
  try {
    const result = await pool.query(
      `UPDATE ai_recommendations 
       SET is_acted_upon = true, updated_at = CURRENT_TIMESTAMP
       WHERE uuid = $1 AND user_id = $2
       RETURNING uuid, is_acted_upon`,
      [recommendationId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Recommendation not found');
    }

    return result.rows[0];
  } catch (err) {
    console.error('Mark acted upon error:', err);
    throw err;
  }
};

// Scheduled job: Generate recommendations for users with recent vitals
const generateDailyRecommendations = async () => {
  try {
    console.log('[Job] Generating daily recommendations...');

    // Get users with vitals recorded in last 24 hours
    const usersResult = await pool.query(
      `SELECT DISTINCT u.id, u.first_name, u.health_goals
       FROM users u
       JOIN vitals v ON u.id = v.user_id
       WHERE v.recorded_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'
       AND v.recorded_at > (
         SELECT COALESCE(MAX(created_at), CURRENT_TIMESTAMP - INTERVAL '7 days')
         FROM ai_recommendations
         WHERE user_id = u.id
       )`
    );

    for (const user of usersResult.rows) {
      try {
        // Get latest vitals
        const vitalsResult = await pool.query(
          `SELECT heart_rate, blood_oxygen_percentage, respiratory_rate, body_temperature,
                  steps, active_minutes, sleep_duration_minutes, sleep_quality_score,
                  stress_level, energy_level
           FROM vitals
           WHERE user_id = $1
           ORDER BY recorded_at DESC
           LIMIT 1`,
          [user.id]
        );

        if (vitalsResult.rows.length > 0) {
          const vitals = vitalsResult.rows[0];
          await generateRecommendations(user.id, vitals);
          console.log(`✓ Generated recommendations for user ${user.id}`);
        }
      } catch (err) {
        console.error(`Error generating recommendations for user ${user.id}:`, err);
      }
    }

    console.log('[Job] Daily recommendations generation completed');
  } catch (err) {
    console.error('Daily recommendations job error:', err);
  }
};

// Mock recommendation generator (placeholder until @anthropic-ai/sdk is installed)
const generateMockRecommendations = (vitalsData) => {
  const recommendations = [];
  
  if (vitalsData.heart_rate > 100) {
    recommendations.push('High heart rate detected. Try deep breathing exercises and reduce caffeine intake.');
  } else if (vitalsData.heart_rate < 60) {
    recommendations.push('Low heart rate detected. Consider increasing your physical activity.');
  }
  
  if (vitalsData.blood_oxygen < 95) {
    recommendations.push('Low blood oxygen. Ensure proper ventilation and consider consulting a doctor.');
  }
  
  if (vitalsData.temperature > 37.5) {
    recommendations.push('Elevated temperature. Stay hydrated and rest. Monitor for other symptoms.');
  }
  
  if (!recommendations.length) {
    recommendations.push('Your vitals look good! Keep up with regular exercise and healthy eating.');
  }
  
  return recommendations.join('\n');
};

module.exports = {
  generateRecommendations,
  getUserRecommendations,
  markRecommendationActedUpon,
  generateDailyRecommendations,
};
