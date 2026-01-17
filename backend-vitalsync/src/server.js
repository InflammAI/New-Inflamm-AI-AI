const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { sendInactivityAlerts, sendDailyHealthSummaries } = require('./services/notificationService');
const { generateDailyRecommendations } = require('./services/recommendationService');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter limit for auth endpoints
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});

app.use(generalLimiter);

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Vital Sync API',
    version: '1.0.0',
    description: 'Health tracking and device syncing backend',
    baseUrl: process.env.API_URL || `http://localhost:${PORT}`,
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        getCurrentUser: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
      },
      vitals: {
        recordVital: 'POST /api/vitals',
        getLatestVitals: 'GET /api/vitals/latest',
        getVitalsHistory: 'GET /api/vitals/history',
        getVitalsStats: 'GET /api/vitals/stats',
        deleteVital: 'DELETE /api/vitals/:vitalId',
      },
      devices: {
        connectDevice: 'POST /api/devices/connect',
        getConnectedDevices: 'GET /api/devices',
        disconnectDevice: 'POST /api/devices/:deviceId/disconnect',
        syncDeviceData: 'POST /api/devices/:deviceId/sync',
      },
      recommendations: {
        generateRecommendations: 'POST /api/recommendations/generate',
        getUserRecommendations: 'GET /api/recommendations',
        markActedUpon: 'PUT /api/recommendations/:recommendationId/acted',
      },
      notifications: {
        getNotifications: 'GET /api/notifications',
        getUnreadCount: 'GET /api/notifications/unread/count',
        markAsRead: 'PUT /api/notifications/:notificationId/read',
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// SCHEDULED JOBS (Cron)
// ============================================

// Run every 30 minutes: Check for inactive users and send alerts
cron.schedule('*/30 * * * *', sendInactivityAlerts);

// Run daily at 8:00 AM: Send health summaries
cron.schedule('0 8 * * *', sendDailyHealthSummaries);

// Run daily at 9:00 AM: Generate AI recommendations
cron.schedule('0 9 * * *', generateDailyRecommendations);

// ============================================
// SERVER START
// ============================================

const startServer = async () => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected at', result.rows[0].now);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API docs available at http://localhost:${PORT}/api/docs`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
