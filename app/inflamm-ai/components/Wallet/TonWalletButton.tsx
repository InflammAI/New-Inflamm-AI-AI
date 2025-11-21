'use client';

import { useState, useEffect } from 'react';
import { TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react';

export function TonWalletButton() {
  const [mounted, setMounted] = useState(false);
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (wallet && userFriendlyAddress) {
      console.log('TON Wallet connected:', {
        address: userFriendlyAddress,
        device: wallet.device,
      });
    }
  }, [wallet, userFriendlyAddress]);

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  return (
    <div className="ton-wallet-button">
      <TonConnectButton />
    </div>
  );
}
