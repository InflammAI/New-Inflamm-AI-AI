'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTonWallet } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';

interface WalletGateProps {
  children: React.ReactNode;
}

export const WalletGate: React.FC<WalletGateProps> = ({ children }) => {
  const { connected: solanaConnected } = useWallet();
  const tonWallet = useTonWallet();
  const tonConnected = !!tonWallet;

  const isConnected = solanaConnected || tonConnected;

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-yellow)] flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 15V12M12 9H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Wallet Connection Required
            </h2>
            <p className="text-[var(--muted)] mb-8">
              Please connect your wallet to access this feature and start tracking your health journey.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Click "Connect Wallet" in the top right to get started</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
