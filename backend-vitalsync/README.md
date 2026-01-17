# Vital Sync Backend - Complete Setup Guide

## Overview

This is a production-ready Node.js + Express + PostgreSQL backend for the Vital Sync health tracking platform. It provides comprehensive APIs for user authentication, vital signs tracking, device syncing, AI recommendations, and notifications.

## Features

✅ **Authentication & Security**
- Email/password signup & login
- JWT access + refresh tokens
- Bcrypt password hashing
- Session management
- Rate limiting
- Input validation

✅ **User Management**
- User profiles with health data
- Daily streaks tracking
- Water intake logging
- Reminders & task management
- Activity logging

✅ **Vitals Tracking**
- Real-time vital signs recording
- Heart rate, blood oxygen, temperature
- Sleep tracking with stages
- Active minutes & steps
- Vitals history & statistics

✅ **Device Integration**
- OAuth-based device connections
- Support: Fitbit, Oura, Garmin, Apple Watch
- Automatic data syncing
- Secure token storage

✅ **AI Recommendations**
- Anthropic Claude integration
- Personalized health insights
- Confidence scoring
- Recommendation tracking

✅ **Notifications**
- In-app, email, and push notifications
- Inactivity alerts
- Daily health summaries
- Vital threshold alerts
- Customizable preferences

---

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/))
- **Docker & Docker Compose** (optional, for containerization)
- **Anthropic API Key** ([Get here](https://console.anthropic.com/))
- **Git** for version control

---

## Installation

### Option 1: Local Development (Without Docker)

#### 1. Clone the repository
```bash
cd backend-vitalsync
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Set up PostgreSQL database
```bash
# Create database and user
createdb vitalsync_db
createuser vitalsync_user --pwprompt

# Or using psql:
psql -U postgres
CREATE DATABASE vitalsync_db;
CREATE USER vitalsync_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vitalsync_db TO vitalsync_user;
\q
```

#### 4. Create .env file
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=vitalsync_user
DB_PASSWORD=your_password
DB_NAME=vitalsync_db
JWT_SECRET=your_32_char_random_string
JWT_REFRESH_SECRET=your_32_char_random_string
ENCRYPTION_KEY=your_32_char_random_string
ANTHROPIC_API_KEY=your_api_key
```

#### 5. Initialize database
```bash
npm run db:init
```

#### 6. Start development server
```bash
npm run dev
```

Server will be available at `http://localhost:5000`

---

### Option 2: Docker Deployment

#### 1. Build and run with Docker Compose
```bash
docker-compose up -d
```

#### 2. Initialize database
```bash
docker-compose exec backend npm run db:init
```

#### 3. Check status
```bash
docker-compose ps
```

To stop: `docker-compose down`

---

## Project Structure

```
backend-vitalsync/
├── src/
│   ├── server.js                 # Main application entry point
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── controllers/              # Route handlers
│   │   ├── authController.js
│   │   ├── vitalsController.js
│   │   ├── deviceController.js
│   │   ├── recommendationController.js
│   │   └── notificationController.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT authentication
│   │   └── validation.js         # Input validation
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.js
│   │   ├── vitalsRoutes.js
│   │   ├── deviceRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/                 # Business logic
│   │   ├── recommendationService.js  # AI recommendations
│   │   ├── notificationService.js    # Notifications & emails
│   │   └── logger.js                 # Activity logging
│   └── utils/
│       └── crypto.js             # JWT & encryption utilities
├── db/
│   ├── schema.sql                # Database schema
│   └── init.js                   # Database initialization
├── .env.example                  # Environment variables template
├── Dockerfile                    # Container image
├── docker-compose.yml            # Docker Compose config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Sign Up
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "uuid": "...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "uuid": "...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "message": "Access token refreshed",
  "accessToken": "eyJhbGc..."
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": 1,
  "uuid": "...",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "height_cm": 180,
  "weight_kg": 75,
  "role": "user"
}
```

### Vitals Endpoints

#### Record Vital Signs
```
POST /vitals
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "heart_rate": 72,
  "blood_oxygen_percentage": 98.5,
  "respiratory_rate": 16,
  "body_temperature": 37.2,
  "steps": 5000,
  "active_minutes": 30,
  "sleep_duration_minutes": 480,
  "sleep_quality_score": 85,
  "stress_level": "low",
  "energy_level": 75,
  "notes": "Feeling good today"
}

Response: 201 Created
{
  "message": "Vital signs recorded successfully",
  "vital": {
    "uuid": "...",
    "heart_rate": 72,
    "blood_oxygen_percentage": 98.5,
    "recorded_at": "2024-01-13T10:30:00Z"
  }
}
```

#### Get Latest Vitals
```
GET /vitals/latest
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "uuid": "...",
  "heart_rate": 72,
  "blood_oxygen_percentage": 98.5,
  "respiratory_rate": 16,
  "steps": 5000,
  "active_minutes": 30,
  "recorded_at": "2024-01-13T10:30:00Z"
}
```

#### Get Vitals History
```
GET /vitals/history?page=1&limit=30&start_date=2024-01-01&end_date=2024-01-13
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 100,
    "pages": 4
  }
}
```

#### Get Vitals Statistics
```
GET /vitals/stats?start_date=2024-01-01&end_date=2024-01-13
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "avg_heart_rate": 72.5,
  "min_heart_rate": 60,
  "max_heart_rate": 85,
  "avg_blood_oxygen": 97.8,
  "total_steps": 50000,
  "total_active_minutes": 300,
  "avg_sleep_duration": 480,
  "record_count": 10
}
```

### Device Endpoints

#### Connect Device
```
POST /devices/connect
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "device_type": "fitbit",
  "device_name": "Fitbit Charge 5",
  "oauth_token": "token_from_fitbit_oauth",
  "external_device_id": "fitbit_user_id"
}

Response: 201 Created
{
  "message": "fitbit device connected successfully",
  "device": {
    "uuid": "...",
    "device_type": "fitbit",
    "connection_status": "connected"
  }
}
```

#### Get Connected Devices
```
GET /devices
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "devices": [
    {
      "uuid": "...",
      "device_type": "fitbit",
      "device_name": "Fitbit Charge 5",
      "connection_status": "connected",
      "last_synced": "2024-01-13T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Sync Device Data
```
POST /devices/{deviceId}/sync
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Device data synced successfully",
  "synced_vitals_count": 5
}
```

### AI Recommendations

#### Generate Recommendations
```
POST /recommendations/generate
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "vitals": {
    "heart_rate": 72,
    "blood_oxygen_percentage": 98.5,
    "steps": 5000,
    "sleep_duration_minutes": 480,
    "stress_level": "medium"
  }
}

Response: 201 Created
{
  "message": "Recommendations generated successfully",
  "recommendations": [
    {
      "uuid": "...",
      "recommendation_type": "wellness",
      "title": "Stay Hydrated",
      "content": "Drink at least 8 glasses of water..."
    }
  ]
}
```

#### Get Recommendations
```
GET /recommendations?page=1&limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "recommendations": [...],
  "pagination": { ... }
}
```

### Notifications

#### Get Notifications
```
GET /notifications?page=1&limit=20&unread=false
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "notifications": [...],
  "pagination": { ... }
}
```

#### Get Unread Count
```
GET /notifications/unread/count
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "unread_count": 3
}
```

#### Mark as Read
```
PUT /notifications/{notificationId}/read
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Notification marked as read",
  "notification": { ... }
}
```

---

## Database Schema

### Core Tables

**users** - User accounts and profiles
**sessions** - Active sessions with tokens
**user_devices** - Connected wearable devices
**vitals** - Recorded vital signs
**notifications** - User notifications
**ai_recommendations** - AI-generated recommendations
**activity_logs** - User activity tracking

### Support Tables

**daily_streaks** - Streak tracking
**water_intake** - Water intake logging
**reminders** - Health reminders
**tasks** - User tasks
**notification_preferences** - User notification settings
**api_keys** - Encrypted API keys for services

---

## Deployment

### Render Deployment

1. **Create account** on [render.com](https://render.com)

2. **Create PostgreSQL instance**
   - Click "New" > "PostgreSQL"
   - Set name: `vitalsync-db`
   - Choose region and plan
   - Note the connection string

3. **Create Web Service**
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables from `.env.example`

4. **Run database migrations**
   - In Render shell: `npm run db:init`

### Railway Deployment

1. **Create account** on [railway.app](https://railway.app)

2. **Create PostgreSQL plugin**
   - Click "Add" > "PostgreSQL"
   - Note environment variables

3. **Deploy from GitHub**
   - Connect repository
   - Set environment variables
   - Railway auto-deploys on push

### Heroku Deployment (Legacy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set ANTHROPIC_API_KEY=your_key

# Deploy
git push heroku main

# Initialize database
heroku run npm run db:init
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Initialize database
npm run db:init

# Lint code
npm lint

# Start production server
npm start
```

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development`, `production` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database user | `vitalsync_user` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `DB_NAME` | Database name | `vitalsync_db` |
| `JWT_SECRET` | Access token secret | Random 32+ chars |
| `JWT_REFRESH_SECRET` | Refresh token secret | Random 32+ chars |
| `ENCRYPTION_KEY` | Data encryption key | Random 32 chars |
| `ANTHROPIC_API_KEY` | Claude API key | From console.anthropic.com |
| `SMTP_HOST` | Email server | `smtp.gmail.com` |
| `SMTP_USER` | Email address | `your@email.com` |
| `SMTP_PASSWORD` | Email password | `app_password` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3000` |

---

## Security Best Practices

✅ **Implemented**
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Rate limiting on auth endpoints
- CORS protection
- Helmet security headers
- Input validation with express-validator
- Encrypted OAuth tokens
- SQL parameterized queries
- Environment variable protection

⚠️ **Additional Recommendations**
- Use HTTPS in production
- Set strong `JWT_SECRET` (32+ random characters)
- Enable PostgreSQL SSL connection
- Implement API key rotation
- Use secrets manager (AWS Secrets, etc.)
- Enable CORS only for trusted origins
- Regular security audits
- Keep dependencies updated: `npm audit fix`

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
- Ensure PostgreSQL is running
- Check DB_HOST, DB_PORT in .env
- Verify database exists: psql -l
```

### JWT Token Invalid
```
Error: invalid signature

Solution:
- Ensure JWT_SECRET matches between login and verification
- Check token expiration (15 minutes for access token)
- Refresh token: POST /api/auth/refresh
```

### Module Not Found
```
Error: Cannot find module 'express'

Solution:
npm install
```

### Port Already In Use
```
Error: listen EADDRINUSE :::5000

Solution:
# Change PORT in .env or kill process:
lsof -i :5000
kill -9 <PID>
```

---

## Monitoring & Logging

- Server logs to console (Morgan middleware)
- Activity logs stored in `activity_logs` table
- Errors logged with full stack traces
- Cron jobs log execution status

View logs in Docker:
```bash
docker-compose logs -f backend
```

---

## Performance Optimization

✅ Database indexes on frequently queried columns
✅ Connection pooling (max 20 connections)
✅ Pagination support (default 30 items)
✅ Rate limiting to prevent abuse
✅ Caching through database queries

---

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- authController.test.js

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

---

## API Rate Limits

- **General endpoints**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 failed attempts per 15 minutes per IP
- **Recommendation generation**: 10 per hour per user
- **Device sync**: 5 per hour per device

---

## Support & Contributing

- Report bugs via GitHub Issues
- Follow code style: `npm lint`
- Add tests for new features
- Update documentation

---

## License

MIT License - See LICENSE file

---

## Version

**v1.0.0** - January 13, 2024

---

## Contact

For support or questions, contact the Vital Sync team.
