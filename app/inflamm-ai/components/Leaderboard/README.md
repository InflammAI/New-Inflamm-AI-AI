# VyTap Leaderboard

## Overview
The VyTap Leaderboard displays the top users ranked by their total VyTap points, allowing users to track their progress and compete with others.

## Features

### 🏆 Top 10 Ranking
- Displays the top 10 users with the highest VyTap points
- Ranks are shown with medals for top 3:
  - 🥇 Rank 1 (Gold)
  - 🥈 Rank 2 (Silver)
  - 🥉 Rank 3 (Bronze)
  - #4-10 (Numbered ranks)

### 👤 User Tracking
- **Connected Wallet**: Shows your current rank and points
- **Highlighted Entry**: Your entry is highlighted with orange gradient
- **"You" Badge**: Displays next to your User ID
- **Outside Top 10**: Shows your rank in a separate card above the leaderboard

### 🎨 Visual Design
- Dark surface with gradient highlights
- Animated entry with staggered fade-in
- Hover effects on leaderboard entries
- Orange→yellow gradient for current user
- Monospace font for User IDs

## Layout

### Desktop (lg+)
```
┌─────────────────┬──────────────────┐
│   Tap Button    │   Leaderboard    │
│   (Left Col)    │   (Right Col)    │
└─────────────────┴──────────────────┘
```

### Mobile
```
┌──────────────────┐
│   Tap Button     │
├──────────────────┤
│   Leaderboard    │
└──────────────────┘
```

## Data Structure

```typescript
interface LeaderboardEntry {
  userId: string;        // e.g., "7XmR...1a2B"
  points: number;        // Total VyTap points
  rank: number;          // Position on leaderboard
  isCurrentUser?: boolean; // Highlight if current user
}
```

## User ID Format
User IDs are derived from wallet addresses:
```typescript
const userId = `${address.slice(0, 4)}...${address.slice(-4)}`;
```
Example: `5GH4aBD83DRyDXcxrFCoLoTTHmrahcLnR4cTE4MEJn` → `5GH4...MEJn`

## Mock Data
Currently uses mock leaderboard data:
- 10 sample users with points ranging from 3,800 to 15,420
- If user's wallet matches a top 10 entry, it's highlighted
- If user is outside top 10, shows rank #42 with 1,261 points

## Backend Integration

### API Endpoints Needed

1. **Get Leaderboard**
```typescript
GET /api/v1/vytap/leaderboard
Response: {
  entries: LeaderboardEntry[],
  userRank?: number,
  userPoints?: number,
  totalUsers: number
}
```

2. **Update Points** (called after tap)
```typescript
POST /api/v1/vytap/tap
Body: { walletAddress: string, timestamp: number }
Response: { 
  pointsEarned: number,
  totalPoints: number,
  newRank: number
}
```

### Real-time Updates
Consider implementing:
- WebSocket connection for live leaderboard updates
- Polling every 30-60 seconds
- Event-based updates when user taps

## Wallet Integration
- **Requires wallet connection** to show user's rank
- Uses `@solana/wallet-adapter-react` for wallet state
- Displays "Connect your wallet to see your rank" when disconnected

## Animations
- **Entry animation**: Staggered fade-in with 50ms delay per item
- **User highlight**: Gradient border and background
- **Hover effect**: Subtle background color change
- **Rank display**: Bounces in on mount

## States

### Disconnected Wallet
- Shows top 10 only
- Footer message: "🔗 Connect your wallet to see your rank"

### Connected - In Top 10
- Entry highlighted in leaderboard
- Orange gradient background
- "You" badge displayed

### Connected - Outside Top 10
- Separate card above leaderboard
- Shows: Your rank, points, and "Keep tapping to climb!" message
- Example: "#42 | 1,261 points"

## Responsive Behavior
- **Mobile (<1024px)**: Leaderboard below tap button, full width
- **Desktop (≥1024px)**: Side-by-side layout, 50/50 split
- **Tablet (768px-1023px)**: Stacked, optimized spacing

## Future Enhancements
- [ ] Time-based leaderboards (daily, weekly, monthly, all-time)
- [ ] Pagination for viewing ranks beyond top 10
- [ ] Search functionality to find specific users
- [ ] Point history graph
- [ ] Achievement badges
- [ ] Social sharing ("I'm rank #X!")
- [ ] Leaderboard reset schedule
- [ ] Regional/global leaderboards
