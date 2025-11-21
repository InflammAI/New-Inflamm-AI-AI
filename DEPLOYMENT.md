# 🚀 Deployment Guide - Inflamm AI to Vercel & Supabase

## ✅ Completed Setup

### Backend Converted to Serverless Functions
- ✅ Created `/lib/db.ts` - Database connection singleton
- ✅ Created `/lib/auth.ts` - Wallet signature verification
- ✅ Created `/app/api/vytap/leaderboard/route.ts` - GET leaderboard
- ✅ Created `/app/api/vytap/tap/route.ts` - POST tap
- ✅ Created `/app/api/vytap/balance/route.ts` - POST balance
- ✅ Created `/app/api/health/route.ts` - Health check
- ✅ Updated all frontend API calls to use serverless routes
- ✅ Installed dependencies: `pg`, `tweetnacl`, `@types/pg`

---

## 📋 Deployment Steps

### 1. Setup Supabase Database

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `inflamm-ai-db`
   - Region: Choose closest to your users

2. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run the SQL from `/backend/database/schema.sql`
   - Or run these commands:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(44) UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_tap_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);

-- Tap history table
CREATE TABLE IF NOT EXISTS tap_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  tapped_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tap_history_user_date ON tap_history(user_id, tapped_at DESC);

-- Daily streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_tap_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

3. **Get Connection String**
   - Settings → Database → Connection String
   - Copy "URI" format (starts with `postgresql://`)
   - Save this for Vercel environment variables

---

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Convert to serverless functions for Vercel"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `.` (leave as default)

3. **Configure Environment Variables**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   ```
   DATABASE_URL=postgresql://[your-supabase-connection-string]
   NODE_ENV=production
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally (if npm fails, use npx instead)
npx vercel

# Login
npx vercel login

# Deploy to production
npx vercel --prod

# Add environment variables
npx vercel env add DATABASE_URL
npx vercel env add NODE_ENV
```

---

### 3. Post-Deployment

1. **Test API Endpoints**
   - Health check: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Wallet Connection**
   - Connect your Solana wallet
   - Try tapping
   - Check leaderboard

3. **Monitor Logs**
   - Vercel Dashboard → Deployments → Functions
   - Check for any errors

---

## 🔧 Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string from Supabase
- `NODE_ENV` - Set to `production`

### Optional
- `NEXT_PUBLIC_SOLANA_NETWORK` - `devnet`, `testnet`, or `mainnet-beta`

---

## 📁 Project Structure

```
inflamm-ai/
├── app/
│   ├── api/                    # Serverless API Routes
│   │   ├── health/
│   │   │   └── route.ts       # Health check endpoint
│   │   └── vytap/
│   │       ├── leaderboard/
│   │       │   └── route.ts   # GET leaderboard
│   │       ├── tap/
│   │       │   └── route.ts   # POST tap
│   │       └── balance/
│   │           └── route.ts   # POST balance
│   └── inflamm-ai/            # Frontend app
├── lib/
│   ├── db.ts                  # Database connection
│   └── auth.ts                # Wallet verification
└── backend/                   # Old Express server (can be removed)
```

---

## 🐛 Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correctly set in Vercel
- Check Supabase project is active
- Ensure connection string includes `?sslmode=require`

### API 404 Errors
- Run `npm run build` locally to check for errors
- Verify route files are in `/app/api/` directory
- Check Vercel function logs

### Wallet Signature Fails
- Ensure `tweetnacl` is installed
- Check browser console for errors
- Verify wallet is connected

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain

2. **Analytics** (Optional)
   - Enable Vercel Analytics
   - Add monitoring

3. **Rate Limiting** (Recommended)
   - Implement with Vercel Edge Config
   - Protect API endpoints

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase connection
3. Verify environment variables
4. Test locally with `npm run dev`

---

**Ready to deploy!** 🚀
