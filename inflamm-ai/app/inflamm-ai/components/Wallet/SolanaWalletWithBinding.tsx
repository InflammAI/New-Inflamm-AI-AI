'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectionStatus } from './WalletConnectionStatus';

export function SolanaWalletWithBinding() {
  const { connected } = useWallet();

  return <WalletConnectionStatus />;
}
