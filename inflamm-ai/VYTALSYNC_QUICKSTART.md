# VytalSync Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Terminal 1: Start Frontend
```bash
cd inflamm-ai
npm run dev
```
➜ http://localhost:5000/vytal-sync

### Terminal 2: Start Backend
```bash
cd backend-vitalsync
npm install
npm run db:init
npm run dev
```
➜ http://localhost:5000/api

---

## 📝 Default Test Credentials

After the backend is initialized with `npm run db:init`, you can:

1. **Sign up** with any email/password (at least 8 chars)
2. **Default admin account** (if created during init):
   - Email: `admin@vytalsync.local`
   - Password: `Admin@123456`

---

## 🔌 Backend API Endpoints

All endpoints require:
- Header: `Authorization: Bearer {accessToken}`
- Base URL: `http://localhost:5000/api`

### Authentication
```bash
# Signup
POST /auth/signup
Body: { email, password, first_name, last_name }

# Login
POST /auth/login
Body: { email, password }

# Get Current User
GET /auth/me

# Update Profile
PUT /auth/profile
Body: { age, gender, height, weight, health_goal }
```

### Vitals
```bash
# Record Vitals
POST /vitals/record
Body: { heart_rate, blood_oxygen, temperature, respiratory_rate, steps, sleep_duration }

# Get History
GET /vitals/history?limit=30&page=1

# Get Statistics
GET /vitals/stats?days=7
```

### Devices
```bash
# List Devices
GET /devices

# Connect Device
POST /devices/connect/{device_type}
Types: fitbit, oura, garmin, applewatch

# Sync Device
POST /devices/{id}/sync

# Disconnect
DELETE /devices/{id}
```

### Recommendations
```bash
# Get Recommendations
GET /recommendations?page=1&limit=10

# Mark as Completed
PATCH /recommendations/{id}/acted-upon
```

### Notifications
```bash
# Get Notifications
GET /notifications?page=1&limit=20

# Mark as Read
PATCH /notifications/{id}/read
```

---

## 🔗 Frontend Routes

- `/vytal-sync` - Main dashboard
- `/vytal-sync?tab=overview` - Overview stats
- `/vytal-sync?tab=vitals` - Record & view vitals
- `/vytal-sync?tab=devices` - Manage wearables
- `/vytal-sync?tab=recommendations` - AI insights
- `/vytal-sync?tab=profile` - User profile

---

## 🛠️ Port Configuration

**Default Ports:**
- Frontend: 5000
- Backend: 5000

**If conflict**, change frontend in `inflamm-ai/package.json`:
```json
"dev": "next dev -p 3000 -H 0.0.0.0"
```

Then update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 📦 Component Dependencies

All components use:
- **React 18.3.1** (Frontend framework)
- **Next.js 15.5.7** (Framework)
- **Recharts** (Charts/Visualization)
- **Lucide React** (Icons)
- **Tailwind CSS** (Styling)
- **TypeScript** (Type safety)

---

## 🔐 Security Features

✅ JWT Token-based auth (15min access, 7day refresh)
✅ Bcrypt password hashing (10 rounds)
✅ AES-256 encryption for OAuth tokens
✅ CORS protection
✅ Rate limiting (100 req/15min general, 5 auth attempts)
✅ Input validation on all endpoints
✅ SQL injection prevention (parameterized queries)
✅ HTTPS in production
✅ Secure token storage

---

## 🐛 Debugging

### Check if Backend is Running
```bash
curl http://localhost:5000/health
```

### Check if Frontend is Running
```bash
curl http://localhost:5000/vytal-sync
```

### View Backend Logs
```bash
# In backend terminal, should show:
# ✓ Server started on port 5000
# ✓ Database connected
# ✓ Cron jobs initialized
```

### View Frontend Compilation
```bash
# In frontend terminal, should show:
# ✓ Ready in 17s
# GET /vytal-sync (when you visit page)
```

### Check Environment Variables
Frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Backend `.env`:
```bash
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost/db
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-...
```

---

## 🚨 Common Issues

### "Cannot connect to API"
1. Check backend is running: `npm run dev` in backend-vitalsync
2. Check port 5000 is free: `netstat -ano | findstr 5000`
3. Verify .env.local NEXT_PUBLIC_API_URL is correct

### "Token expired"
- Refresh token automatically, should see login screen
- Clear localStorage: `localStorage.clear()` in DevTools

### "CORS errors"
- Backend CORS is configured for localhost:5000
- If using different domain, update backend CORS in src/server.js

### "Database connection failed"
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Run `npm run db:init` to create tables
4. Check database user has permissions

### "Port already in use"
- Kill process: `taskkill /PID {PID} /F`
- Or change port in package.json script

---

## 📚 File Structure

```
inflamm-ai/
├── .env.local                          ← Update API URL here
├── app/
│   └── vytal-sync/
│       └── page.tsx                    ← Entry point
├── components/
│   └── VytalSync/
│       ├── EnhancedVytalSyncDashboard.tsx  ← Main dashboard
│       ├── AuthSection.tsx                 ← Login/Signup
│       ├── VitalsRecorder.tsx              ← Record vitals
│       ├── VitalsChart.tsx                 ← Visualize data
│       ├── DeviceConnect.tsx               ← Wearable setup
│       ├── RecommendationCard.tsx          ← AI insights
│       ├── NotificationCenter.tsx          ← Notifications
│       └── HealthProfile.tsx               ← User profile

backend-vitalsync/
├── .env                                ← Backend config
├── src/
│   ├── server.js                       ← Express app
│   ├── controllers/                    ← Request handlers
│   ├── routes/                         ← API routes
│   ├── middleware/                     ← Auth, validation
│   ├── services/                       ← Business logic
│   └── utils/                          ← Helpers
├── db/
│   ├── schema.sql                      ← Database tables
│   └── init.js                         ← Initialize DB
└── docker-compose.yml                  ← PostgreSQL setup
```

---

## ✅ Verification Checklist

- [ ] Frontend running on http://localhost:5000
- [ ] Backend running on http://localhost:5000/api
- [ ] Can see login page at /vytal-sync
- [ ] Can sign up with email/password
- [ ] Can record vitals manually
- [ ] Can see vitals chart update
- [ ] Vitals history shows data
- [ ] Recommendations tab displays content
- [ ] Notifications bell icon works
- [ ] Profile page loads user data
- [ ] Can edit and save profile
- [ ] Logout works and redirects to login
- [ ] No console errors in browser
- [ ] No 404 or 500 errors in network tab

---

## 📞 Support

If you need help:

1. Check [VYTALSYNC_INTEGRATION.md](./VYTALSYNC_INTEGRATION.md) for detailed docs
2. Review backend [README.md](../backend-vitalsync/README.md)
3. Check error messages in browser console (F12)
4. Check server logs in terminal window

---

**Last Updated**: January 13, 2026
**Status**: ✅ Production Ready
