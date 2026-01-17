const Anthropic = require('@anthropic-ai/sdk');
const { query } = require('../config/database');
const logger = require('../utils/logger');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Get AI recommendation based on user's vitals
 */
const getRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vitalType, includeHistory = false } = req.query;
    
    // Get latest vitals
    const vitalsResult = await query(
      `SELECT vital_type, value, unit, measured_at
       FROM vitals
       WHERE user_id = $1 AND measured_at >= NOW() - INTERVAL '24 hours'
       ORDER BY measured_at DESC`,
      [userId]
    );
    
    if (vitalsResult.rows.length === 0) {
      return res.status(404).json({
        error: 'No vitals data',
        message: 'No recent vitals data found. Please record some vitals first.'
      });
    }
    
    // Get user profile for context
    const userResult = await query(
      'SELECT first_name, date_of_birth, gender, height_cm, weight_kg FROM users WHERE id = $1',
      [userId]
    );
    
    const user = userResult.rows[0];
    const vitals = vitalsResult.rows;
    
    // Calculate age
    let age = null;
    if (user.date_of_birth) {
      const birthDate = new Date(user.date_of_birth);
      const ageDiff = Date.now() - birthDate.getTime();
      age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
    }
    
    // Build context for Claude
    const vitalsContext = vitals.map(v => 
      `${v.vital_type}: ${v.value} ${v.unit} (measured at ${v.measured_at})`
    ).join('\n');
    
    const userContext = `
Age: ${age || 'Unknown'}
Gender: ${user.gender || 'Unknown'}
Height: ${user.height_cm ? user.height_cm + ' cm' : 'Unknown'}
Weight: ${user.weight_kg ? user.weight_kg + ' kg' : 'Unknown'}
    `.trim();
    
    // Create prompt for Claude
    const prompt = `You are a health assistant analyzing vital signs data. Provide personalized health recommendations based on the following information:

User Profile:
${userContext}

Recent Vital Signs:
${vitalsContext}

Please provide:
1. A brief assessment of the vital signs
2. Any concerns or warnings if values are outside normal ranges
3. 2-3 specific, actionable recommendations to improve health metrics
4. General wellness advice

Keep the response concise, empathetic, and actionable. Format as JSON with fields: assessment, concerns, recommendations (array), wellness_tip.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const responseText = message.content[0].text;
    let recommendation;
    
    try {
      // Try to parse as JSON
      recommendation = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, use raw text
      recommendation = {
        assessment: responseText,
        concerns: [],
        recommendations: [],
        wellness_tip: ''
      };
    }
    
    // Store recommendation in database
    await query(
      `INSERT INTO ai_recommendations (user_id, recommendation_type, content, priority)
       VALUES ($1, $2, $3, $4)`,
      [
        userId,
        vitalType || 'general',
        JSON.stringify(recommendation),
        recommendation.concerns && recommendation.concerns.length > 0 ? 'high' : 'medium'
      ]
    );
    
    logger.info(`AI recommendation generated for user ${userId}`);
    
    res.json({
      message: 'Recommendation generated successfully',
      recommendation,
      vitalsAnalyzed: vitals.length,
      timestamp: new Date()
    });
    
  } catch (error) {
    logger.error('AI recommendation error:', error);
    
    // Check if it's an Anthropic API error
    if (error.status) {
      return res.status(error.status).json({
        error: 'AI service error',
        message: error.message || 'Failed to generate recommendation'
      });
    }
    
    res.status(500).json({
      error: 'Failed to generate recommendation',
      message: 'An error occurred while generating AI recommendation'
    });
  }
};

/**
 * Get user's recommendation history
 */
const getRecommendationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    
    const result = await query(
      `SELECT id, recommendation_type, content, priority, is_read, created_at
       FROM ai_recommendations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    
    res.json({
      recommendations: result.rows.map(r => ({
        ...r,
        content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content
      }))
    });
    
  } catch (error) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({
      error: 'Failed to fetch recommendations',
      message: 'An error occurred while fetching recommendation history'
    });
  }
};

/**
 * Mark recommendation as read
 */
const markRecommendationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recommendationId } = req.params;
    
    const result = await query(
      `UPDATE ai_recommendations
       SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [recommendationId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Recommendation not found',
        message: 'The specified recommendation does not exist'
      });
    }
    
    res.json({
      message: 'Recommendation marked as read'
    });
    
  } catch (error) {
    logger.error('Mark recommendation read error:', error);
    res.status(500).json({
      error: 'Failed to update recommendation',
      message: 'An error occurred while updating recommendation'
    });
  }
};

module.exports = {
  getRecommendation,
  getRecommendationHistory,
  markRecommendationRead,
};
