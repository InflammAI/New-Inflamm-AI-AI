'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { VitalPointsBadge } from './VitalPointsBadge';
import { VyTapLeaderboard } from '../Leaderboard/VyTapLeaderboard';

// Dynamically import DualWalletSelector with no SSR
const DualWalletSelector = dynamic(
  async () => (await import('../Wallet/DualWalletSelector')).DualWalletSelector,
  { ssr: false }
);

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-[var(--surface)] border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left side - Toggle button for mobile/tablet */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Toggle sidebar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Right side - VitalPoints, Leaderboard, and Wallet */}
      <div className="flex items-center gap-4">
        <VitalPointsBadge />
        
        {/* Leaderboard Button */}
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)] border border-gray-700 text-white hover:border-[var(--accent-orange)] transition-all hover:scale-105"
          aria-label="Leaderboard"
        >
          <span className="text-xl">🏆</span>
          <span className="hidden md:inline text-sm font-semibold">Leaderboard</span>
        </button>
        
        {mounted && <DualWalletSelector />}
      </div>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeaderboard(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-20 right-4 w-[90vw] md:w-[500px] max-h-[80vh] overflow-y-auto z-50"
            >
              <div className="relative">
                {/* Close button */}
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--accent-orange)] text-white flex items-center justify-center hover:scale-110 transition-transform z-10"
                  aria-label="Close leaderboard"
                >
                  ✕
                </button>
                
                <VyTapLeaderboard />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
