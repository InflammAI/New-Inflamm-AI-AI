# Inflamm AI Backend

Backend API for the VyTap Points system with Solana wallet integration and leaderboard functionality.

## Features

- ✅ Solana wallet authentication
- ✅ VyTap points tracking
- ✅ Real-time leaderboard
- ✅ Streak management
- ✅ Anti-spam protection
- ✅ PostgreSQL database
- ✅ RESTful API

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

First, create a PostgreSQL database:

```bash
# Using psql
createdb inflammai

# Or using PostgreSQL CLI
psql -U postgres
CREATE DATABASE inflammai;
\q
```

### 3. Configure Environment

Copy the example environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/inflammai
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Start Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Leaderboard

**GET** `/api/v1/vytap/leaderboard?walletAddress={address}&limit={number}`

Returns top users and optionally the requesting user's rank.

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "userId": "7XmR...1a2B",
        "points": 15420,
        "rank": 1,
        "isCurrentUser": false
      }
    ],
    "userRank": 42,
    "userPoints": 1261,
    "totalUsers": 150
  }
}
```

### Tap

**POST** `/api/v1/vytap/tap`

Records a tap and awards points.

**Request:**
```json
{
  "walletAddress": "5GH4aBD83DRyDXcxrFCoLoTTHmrahcLnR4cTE4MEJn",
  "signature": "base58_encoded_signature",
  "message": "{\"action\":\"tap\",\"timestamp\":1699999999999}",
  "timestamp": 1699999999999
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pointsEarned": 12,
    "totalPoints": 1273,
    "newRank": 41,
    "streak": 7
  }
}
```

### Balance

**GET** `/api/v1/vytap/balance`

Get user's current balance (requires wallet auth).

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 1273
  }
}
```

### Streak

**GET** `/api/v1/vytap/streak`

Get user's streak information (requires wallet auth).

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStreak": 7,
    "longestStreak": 15
  }
}
```

## Database Schema

### Tables

- **users** - Wallet addresses and total points
- **tap_history** - Record of all taps
- **user_streaks** - Daily streak tracking

See `database/schema.sql` for full schema.

## Security

- Wallet signature verification using Solana's ed25519
- Message timestamp validation (60-second window)
- Tap rate limiting (1-second cooldown)
- SQL injection protection via parameterized queries
- CORS protection
- Helmet security headers

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `401` - Unauthorized (invalid wallet signature)
- `429` - Too Many Requests (tap cooldown)
- `500` - Server Error

## Development

### Project Structure

```
backend/
├── config/
│   └── database.ts       # Database connection
├── database/
│   └── schema.sql        # Database schema
├── middleware/
│   └── auth.ts           # Wallet authentication
├── routes/
│   └── vytap.ts          # VyTap API routes
├── scripts/
│   └── migrate.js        # Database migration
├── src/
│   └── server.ts         # Express server
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3001/health

# Get leaderboard
curl http://localhost:3001/api/v1/vytap/leaderboard?limit=10
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure PostgreSQL connection pooling
- [ ] Set up database backups
- [ ] Enable SSL for PostgreSQL
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Use reverse proxy (nginx)

### Deploy to Heroku/Railway/Render

1. Push code to git repository
2. Connect to hosting platform
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy!

## Troubleshooting

**Database connection error:**
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

**Signature verification fails:**
- Ensure message format matches exactly
- Check timestamp is within 60-second window
- Verify wallet signed the correct message

**Tap cooldown error:**
- Wait 1 second between taps
- Check server time is synchronized

## License

MIT
