'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  userId: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export const VyTapLeaderboard: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [connected, publicKey]);

  // Expose refresh function for external use (e.g., after tapping)
  useEffect(() => {
    (window as any).__refreshLeaderboard = fetchLeaderboard;
    return () => {
      delete (window as any).__refreshLeaderboard;
    };
  }, [connected, publicKey]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const walletAddress = connected && publicKey ? publicKey.toString() : '';
      const url = walletAddress 
        ? `/api/vytap/leaderboard?walletAddress=${walletAddress}&limit=10`
        : '/api/vytap/leaderboard?limit=10';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data.entries);
        
        // Set user's rank and points if available
        if (data.data.userRank) {
          setUserRank(data.data.userRank);
          setUserPoints(data.data.userPoints || 0);
        } else {
          setUserRank(null);
          setUserPoints(0);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">VyTap Leaderboard</h2>
          <p className="text-sm text-[var(--muted)]">Top tappers this week</p>
        </div>
        <div className="text-3xl">🏆</div>
      </div>

      {/* User's Current Rank (if connected and not in top 10) */}
      {connected && userRank && userRank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-lg bg-gradient-to-r from-[var(--accent-orange)]/20 to-[var(--accent-yellow)]/20 border border-[var(--accent-orange)]/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white">#{userRank}</span>
              <div>
                <div className="text-sm text-white font-semibold">Your Rank</div>
                <div className="text-xs text-[var(--muted)]">Keep tapping to climb!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[var(--accent-orange)]">
                {userPoints.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--muted)]">points</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-[var(--muted)]">Loading leaderboard...</div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[var(--muted)]">No users yet. Be the first to tap!</div>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-[var(--accent-orange)]/20 to-[var(--accent-yellow)]/20 border border-[var(--accent-orange)]/50'
                  : 'bg-[#0F1720] hover:bg-[#1a2332]'
              }`}
            >
            {/* Rank and User ID */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 text-center">
                <span className="text-2xl font-bold">
                  {getRankIcon(entry.rank)}
                </span>
              </div>
              <div>
                <div className={`font-mono font-semibold ${
                  entry.isCurrentUser ? 'text-[var(--accent-orange)]' : 'text-white'
                }`}>
                  {entry.userId}
                  {entry.isCurrentUser && (
                    <span className="ml-2 text-xs bg-[var(--accent-orange)] text-white px-2 py-0.5 rounded">
                      You
                    </span>
                  )}
                </div>
                {entry.rank <= 3 && (
                  <div className="text-xs text-[var(--muted)] mt-0.5">
                    Top {entry.rank} Tapper
                  </div>
                )}
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className={`text-lg font-bold ${
                entry.isCurrentUser ? 'text-[var(--accent-orange)]' : 'text-white'
              }`}>
                {entry.points.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--muted)]">points</div>
            </div>
          </motion.div>
          ))
        )}
      </div>

      {/* Footer Note */}
      {!connected && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-sm text-[var(--muted)] text-center">
            🔗 Connect your wallet to see your rank
          </p>
        </div>
      )}
    </div>
  );
};
