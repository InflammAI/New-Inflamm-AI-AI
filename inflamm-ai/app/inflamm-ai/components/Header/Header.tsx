'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

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

      {/* Right side - Wallet */}
      <div className="flex items-center gap-4">
        {mounted && <DualWalletSelector />}
      </div>

    </header>
  );
};
