'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnectionStatus: React.FC = () => {
  return (
    <div className="relative">
      <WalletMultiButton />
    </div>
  );
};
