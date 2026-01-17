# Complete Backend Setup Guide

## 📋 Overview

This guide will help you set up the complete backend for the Inflamm AI VyTap Points system.

## 🎯 What You're Building

- PostgreSQL database for user data and leaderboards
- Express.js API server with TypeScript
- Solana wallet authentication
- Real-time point tracking and streaks
- Secure wallet signature verification

## 📦 Prerequisites

Install these before starting:

1. **Node.js** (v18+): https://nodejs.org/
2. **PostgreSQL** (v14+): https://www.postgresql.org/download/
3. **Git** (optional): https://git-scm.com/

## 🚀 Step-by-Step Setup

### Step 1: Install PostgreSQL

**Windows:**
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run installer, remember the password you set for 'postgres' user
3. Keep default port 5432

**Verify installation:**
```powershell
psql --version
```

### Step 2: Create Database

Open PowerShell and run:

```powershell
# Connect to PostgreSQL (enter password when prompted)
psql -U postgres

# Create the database
CREATE DATABASE inflammai;

# List databases to verify
\l

# Exit psql
\q
```

### Step 3: Install Backend Dependencies

```powershell
cd "C:\Users\Best\Inflamm New Site\backend"
npm install
```

This will install all required packages and fix the TypeScript lint errors.

### Step 4: Configure Environment

Create a `.env` file in the backend folder:

```powershell
# Copy the example file
cp .env.example .env

# Edit the .env file with your details
notepad .env
```

Update `.env` with your database credentials:

```env
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/inflammai
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-this
```

**Important:** Replace `your_password_here` with your actual PostgreSQL password!

### Step 5: Run Database Migration

```powershell
npm run db:migrate
```

You should see:
```
🔄 Running database migration...
✅ Database migration completed successfully!

📊 Created tables:
   - users
   - tap_history
   - user_streaks
```

### Step 6: Start the Backend Server

```powershell
# Development mode (auto-restart on changes)
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📍 Environment: development
🔗 Frontend URL: http://localhost:3000
```

### Step 7: Test the API

Open a new PowerShell window and test:

```powershell
# Health check
curl http://localhost:3001/health

# Get leaderboard
curl http://localhost:3001/api/v1/vytap/leaderboard?limit=10
```

Expected response:
```json
{"success":true,"data":{"entries":[],"userRank":null,"userPoints":null,"totalUsers":0}}
```

## 🔗 Connect Frontend to Backend

The frontend is already configured to connect! Just make sure:

1. Backend is running on `http://localhost:3001`
2. Frontend is running on `http://localhost:3000`
3. Both are running at the same time

### Update API URLs in Frontend (if needed)

If your backend runs on a different port, update these files:

**For VyTap taps:**
```typescript
// app/inflamm-ai/modules/vytap/VyTapScreen.tsx
const response = await fetch('http://localhost:3001/api/v1/vytap/tap', {
  // ...
});
```

**For Leaderboard:**
```typescript
// app/inflamm-ai/components/Leaderboard/VyTapLeaderboard.tsx
const response = await fetch('http://localhost:3001/api/v1/vytap/leaderboard', {
  // ...
});
```

## ✅ Verify Everything Works

### Test Complete Flow

1. **Start backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **In another terminal, start frontend:**
   ```powershell
   cd ..
   npm run dev
   ```

3. **Open browser:** http://localhost:3000/inflamm-ai

4. **Connect Phantom wallet**

5. **Click the tap button** - Points should be saved to database!

6. **Click the 🏆 Leaderboard button** - You should see your rank!

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `ECONNREFUSED` or `connection refused`

**Fix:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Verify password and port

**Test connection:**
```powershell
psql -U postgres -d inflammai
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Fix:**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Migration Fails

**Error:** `relation "users" already exists`

**Fix:** Database tables already exist, migration completed previously.

To reset database:
```powershell
psql -U postgres
DROP DATABASE inflammai;
CREATE DATABASE inflammai;
\q
npm run db:migrate
```

### Signature Verification Fails

**Error:** `Invalid signature`

**Fix:**
- Ensure wallet is properly connected
- Check message timestamp is current
- Verify wallet adapter is working

## 📊 Database Management

### View Data

```powershell
# Connect to database
psql -U postgres -d inflammai

# View all users
SELECT * FROM users ORDER BY total_points DESC LIMIT 10;

# View tap history
SELECT * FROM tap_history ORDER BY tapped_at DESC LIMIT 20;

# View streaks
SELECT * FROM user_streaks;

# Exit
\q
```

### Backup Database

```powershell
pg_dump -U postgres inflammai > backup.sql
```

### Restore Database

```powershell
psql -U postgres inflammai < backup.sql
```

## 🚀 Production Deployment

### For Heroku/Railway/Render

1. **Add PostgreSQL addon** in your hosting dashboard

2. **Set environment variables:**
   - `DATABASE_URL` (auto-set by addon)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `JWT_SECRET=<generate-secure-random-string>`

3. **Deploy:**
   ```powershell
   git add .
   git commit -m "Add backend"
   git push heroku main
   ```

4. **Run migration:**
   ```powershell
   heroku run npm run db:migrate
   ```

## 📝 Next Steps

Once backend is running:

1. ✅ Test tap functionality
2. ✅ Check leaderboard updates in real-time
3. ✅ Test streak tracking (tap daily!)
4. ✅ Monitor database for user data
5. ✅ Add more features (trading, achievements, etc.)

## 🆘 Need Help?

Common issues:
- **Forgot PostgreSQL password:** Reset via pgAdmin or reinstall
- **Backend won't start:** Check all dependencies installed
- **Frontend can't connect:** Verify CORS settings in backend

## 🎉 Success!

If you see:
- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000
- ✅ Wallet connects successfully
- ✅ Taps increase points
- ✅ Leaderboard shows your rank

**Congratulations! Your backend is fully operational!** 🚀
