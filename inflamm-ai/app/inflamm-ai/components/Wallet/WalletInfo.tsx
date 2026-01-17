'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WalletInfo: React.FC = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (connected && publicKey) {
      // Generate a user ID from the wallet address
      // In production, this would come from your backend after wallet verification
      const address = publicKey.toString();
      const id = `USER-${address.slice(0, 8).toUpperCase()}`;
      setUserId(id);
    } else {
      setUserId('');
    }
  }, [connected, publicKey]);

  return (
    <AnimatePresence>
      {connected && publicKey && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[var(--surface)] border border-gray-800 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-white font-semibold">Wallet Connected</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--muted)]">User ID: </span>
                  <span className="text-white font-mono font-semibold">{userId}</span>
                </div>
                
                <div>
                  <span className="text-[var(--muted)]">Wallet: </span>
                  <span className="text-white font-semibold">{wallet?.adapter.name || 'Unknown'}</span>
                </div>
                
                <div>
                  <span className="text-[var(--muted)]">Address: </span>
                  <span className="text-white font-mono text-xs break-all">
                    {publicKey.toString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Solana logo */}
            <div className="ml-4">
              <svg width="40" height="40" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                <linearGradient id="solanaGradient" x1="360.88" y1="351.46" x2="141.21" y2="-69.29" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#00ffa3"/>
                  <stop offset="1" stopColor="#dc1fff"/>
                </linearGradient>
                <path fill="url(#solanaGradient)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
                <path fill="url(#solanaGradient)" d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
                <path fill="url(#solanaGradient)" d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
              </svg>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-[var(--muted)]">
              ✓ Your wallet is securely connected. This ID is unique to your Solana address.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
