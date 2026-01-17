'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGoogleAuth } from '../../providers/GoogleAuthProvider';
import { TapHeart } from '../TapHeart/TapHeart';

interface WalletAwareContentProps {
  children: React.ReactNode;
}

export const WalletAwareContent: React.FC<WalletAwareContentProps> = ({ children }) => {
  // Wallet connection state
  const { connected: solanaConnected } = useWallet();
  const { user: googleUser } = useGoogleAuth();
  const isConnected = solanaConnected || !!googleUser;

  return (
    <>
      {children}
      {/* Tap Heart - Fun Element */}
      <TapHeart isConnected={isConnected} />
    </>
  );
};
