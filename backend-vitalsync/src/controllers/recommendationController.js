const { generateRecommendations, getUserRecommendations, markRecommendationActedUpon } = require('../services/recommendationService');

// Generate recommendations for current user
const generateUserRecommendations = async (req, res) => {
  const { vitals } = req.body;

  if (!vitals) {
    return res.status(400).json({ error: 'Vitals data required' });
  }

  try {
    const recommendations = await generateRecommendations(req.user.id, vitals);

    res.status(201).json({
      message: 'Recommendations generated successfully',
      recommendations,
    });
  } catch (err) {
    console.error('Generate recommendations error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

// Get user's recommendations
const getUserRecs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const result = await getUserRecommendations(req.user.id, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

// Mark recommendation as acted upon
const markActedUpon = async (req, res) => {
  const { recommendationId } = req.params;

  try {
    const result = await markRecommendationActedUpon(req.user.id, recommendationId);
    res.json({
      message: 'Recommendation marked as acted upon',
      recommendation: result,
    });
  } catch (err) {
    console.error('Mark acted upon error:', err);
    res.status(500).json({ error: 'Failed to update recommendation' });
  }
};

module.exports = {
  generateUserRecommendations,
  getUserRecs,
  markActedUpon,
};
