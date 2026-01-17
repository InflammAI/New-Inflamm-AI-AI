const { body, validationResult, param, query } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Auth validators
const validateSignup = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be 1-100 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be 1-100 characters'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

// Vitals validators
const validateVitalEntry = [
  body('heart_rate')
    .optional()
    .isInt({ min: 30, max: 200 })
    .withMessage('Heart rate must be 30-200 bpm'),
  body('blood_oxygen_percentage')
    .optional()
    .isFloat({ min: 70, max: 100 })
    .withMessage('Blood oxygen must be 70-100%'),
  body('respiratory_rate')
    .optional()
    .isInt({ min: 10, max: 60 })
    .withMessage('Respiratory rate must be 10-60'),
  body('body_temperature')
    .optional()
    .isFloat({ min: 35, max: 42 })
    .withMessage('Body temperature must be 35-42°C'),
  body('steps')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Steps must be non-negative'),
  body('active_minutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Active minutes must be non-negative'),
  body('sleep_duration_minutes')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Sleep duration must be 0-1440 minutes'),
  body('recorded_at')
    .optional()
    .isISO8601()
    .withMessage('Invalid timestamp'),
];

// Device validators
const validateDeviceConnection = [
  body('device_type')
    .isIn(['fitbit', 'oura', 'garmin', 'apple_watch', 'manual'])
    .withMessage('Invalid device type'),
  body('device_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Device name must be 1-100 characters'),
  body('oauth_token')
    .optional()
    .notEmpty()
    .withMessage('OAuth token required'),
];

// Water intake validator
const validateWaterIntake = [
  body('amount_ml')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Amount must be 1-10000 ml'),
  body('recorded_at')
    .optional()
    .isISO8601()
    .withMessage('Invalid timestamp'),
];

// Reminder validator
const validateReminder = [
  body('reminder_type')
    .isIn(['drink_water', 'exercise', 'sleep', 'meditation', 'medication', 'custom'])
    .withMessage('Invalid reminder type'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be 1-255 characters'),
  body('scheduled_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)'),
  body('days_of_week')
    .optional()
    .matches(/^[0-1]{7}$/)
    .withMessage('Days of week must be 7 digits (0-1)'),
];

// Pagination validator
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Page must be positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('Limit must be 1-100'),
];

// Date range validator
const validateDateRange = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date'),
];

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateVitalEntry,
  validateDeviceConnection,
  validateWaterIntake,
  validateReminder,
  validatePagination,
  validateDateRange,
};
