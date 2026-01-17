'use client';

import { useState, useEffect } from 'react';
import { WalletConnectionStatus } from './WalletConnectionStatus';
import { SolanaWalletWithBinding } from './SolanaWalletWithBinding';

export function DualWalletSelector() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  // Only show Solana wallet
  return <WalletConnectionStatus />;
}
