# Vital Sync Backend - Quick Reference

## Project Structure

```
backend-vitalsync/
├── src/
│   ├── server.js                 ← Main entry point
│   ├── config/database.js        ← DB connection
│   ├── controllers/              ← Request handlers
│   ├── middleware/               ← Auth, validation, logging
│   ├── routes/                   ← API endpoint definitions
│   ├── services/                 ← Business logic
│   └── utils/                    ← Helper functions
├── db/
│   ├── schema.sql                ← Database tables
│   └── init.js                   ← DB initialization script
├── Dockerfile                    ← Container image
├── docker-compose.yml            ← Multi-container setup
├── .env.example                  ← Environment template
├── package.json                  ← Dependencies
├── README.md                     ← Getting started
├── DEPLOYMENT.md                 ← Deployment guide
├── ARCHITECTURE.md               ← System design
└── OPENAPI.yaml                  ← API specification
```

---

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
```bash
# Create .env
cp .env.example .env

# Edit .env with your PostgreSQL credentials
```

### 3. Initialize Database
```bash
npm run db:init
```

### 4. Start Server
```bash
npm run dev
```

Server: `http://localhost:5000`

---

## Key Endpoints

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/signup` | Register new user |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/refresh` | Get new access token |
| `GET` | `/auth/me` | Get current user |
| `PUT` | `/auth/profile` | Update profile |

### Vitals
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/vitals` | Record vital signs |
| `GET` | `/vitals/latest` | Get latest vitals |
| `GET` | `/vitals/history` | Get vitals history |
| `GET` | `/vitals/stats` | Get statistics |

### Devices
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/devices/connect` | Connect wearable |
| `GET` | `/devices` | List connected devices |
| `POST` | `/devices/{id}/sync` | Sync device data |

### Recommendations
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/recommendations/generate` | Generate recommendations |
| `GET` | `/recommendations` | Get recommendations |

### Notifications
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/notifications` | Get notifications |
| `PUT` | `/notifications/{id}/read` | Mark as read |

---

## Common Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm test                # Run tests
npm lint                # Check code style

# Database
npm run db:init         # Initialize schema
npm run migrate          # Run migrations

# Production
npm start                # Start server
npm run build            # Build for production

# Docker
docker-compose up -d    # Start containers
docker-compose logs -f  # View logs
docker-compose down     # Stop containers
```

---

## Environment Variables

### Required
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET, JWT_REFRESH_SECRET, ENCRYPTION_KEY
ANTHROPIC_API_KEY
```

### Optional
```
NODE_ENV, PORT, CORS_ORIGIN
SMTP_HOST, SMTP_USER, SMTP_PASSWORD
```

---

## Authentication Flow

```
1. User submits email + password to /auth/login
2. Server verifies credentials (bcrypt)
3. Generates JWT tokens (access + refresh)
4. Stores session in database
5. Returns tokens to client
6. Client includes token in Authorization header
7. Server verifies token on each request
```

---

## Request/Response Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "uuid": "550e8400...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Record Vital
```bash
curl -X POST http://localhost:5000/api/vitals \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "heart_rate": 72,
    "blood_oxygen_percentage": 98.5,
    "steps": 5000,
    "sleep_duration_minutes": 480
  }'
```

---

## Database Tables

### Core Tables
- `users` - User accounts
- `sessions` - Active sessions
- `vitals` - Vital signs data
- `user_devices` - Connected devices
- `ai_recommendations` - AI suggestions
- `notifications` - User notifications

### Lookup Tables
- `daily_streaks` - Habit tracking
- `activity_logs` - Audit trail
- `notification_preferences` - User settings

---

## API Rate Limits

- **General**: 100 req/15min per IP
- **Auth**: 5 failed attempts/15min
- **Recommendations**: 10 per hour
- **Device Sync**: 5 per hour

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Check endpoint |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Check logs |

---

## Security Checklist

- ✅ HTTPS in production
- ✅ Strong JWT secrets (32+ chars)
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS configured
- ✅ Helmet.js headers
- ✅ SQL injection protection
- ✅ OAuth token encryption
- ✅ Activity logging

---

## Performance Tips

1. Use pagination for large datasets
2. Enable database indexes
3. Monitor API response times
4. Use caching where appropriate
5. Keep JWT secrets strong
6. Regular database backups
7. Monitor server resources
8. Use connection pooling

---

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL running
psql -U postgres

# Verify .env settings
grep DB_ .env
```

### JWT Token Invalid
```bash
# Token may be expired
# Use refresh endpoint to get new token
curl -X POST /api/auth/refresh
```

### Port Already in Use
```bash
# Change PORT in .env or kill process
lsof -i :5000
kill -9 <PID>
```

---

## Docker Quick Commands

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run database init
docker-compose exec backend npm run db:init

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

---

## Testing Endpoints (Postman)

1. **Signup**
   - POST `/api/auth/signup`
   - Body: email, password, first_name, last_name

2. **Login**
   - POST `/api/auth/login`
   - Body: email, password
   - Save `accessToken`

3. **Record Vital**
   - POST `/api/vitals`
   - Header: `Authorization: Bearer {accessToken}`
   - Body: heart_rate, blood_oxygen_percentage, etc.

4. **Get Vitals**
   - GET `/api/vitals/latest`
   - Header: `Authorization: Bearer {accessToken}`

---

## API Documentation

- **OpenAPI Spec**: `OPENAPI.yaml`
- **View Docs**: http://localhost:5000/api/docs
- **Full Guide**: See `README.md`

---

## Support

- **Documentation**: README.md, ARCHITECTURE.md
- **Issues**: GitHub Issues
- **Logs**: `npm run dev` output or Docker logs
- **Errors**: Check console and database

---

## Version

**v1.0.0** - January 2024

Complete, production-ready backend for Vital Sync health platform.
