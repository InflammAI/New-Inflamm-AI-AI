'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGoogleAuth } from '../../providers/GoogleAuthProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { GoogleSignInButton } from '../Google/GoogleSignInButton';

export const WalletConnectionStatus: React.FC = () => {
  const { connected: walletConnected } = useWallet();
  const { user: googleUser, signOut: googleSignOut } = useGoogleAuth();

  const isConnected = walletConnected || !!googleUser;

  return (
    <div className="flex items-center gap-2">
      {/* Google Auth Status */}
      {googleUser ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <img 
              src={googleUser.picture || ''} 
              alt={googleUser.name || ''} 
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-sm text-green-400 max-w-24 truncate">
              {googleUser.name || googleUser.email}
            </span>
          </div>
          <button
            onClick={googleSignOut}
            className="px-3 py-2 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            title="Disconnect Google Account"
          >
            Disconnect
          </button>
        </div>
      ) : null}
      
      {/* Wallet Connection - Show if not connected via Google */}
      {!googleUser && (
        <div className="relative">
          <WalletMultiButton />
        </div>
      )}
    </div>
  );
};
