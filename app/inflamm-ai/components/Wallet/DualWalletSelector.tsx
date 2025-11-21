'use client';

import { useState, useEffect } from 'react';
import { WalletConnectionStatus } from './WalletConnectionStatus';
import { SolanaWalletWithBinding } from './SolanaWalletWithBinding';
import { TonWalletButtonWithModal } from './TonWalletButtonWithModal';
import { useTelegramWalletBinding } from '../../hooks/useTelegramWalletBinding';

type WalletType = 'solana' | 'ton';

export function DualWalletSelector() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType>('solana');
  const [mounted, setMounted] = useState(false);
  const { isBound, binding } = useTelegramWalletBinding();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isInTelegram = !!(window as any).Telegram?.WebApp?.initData;
      setIsTelegram(isInTelegram);
      
      if (isInTelegram) {
        setSelectedWallet('ton');
      }
    }
  }, []);

  // If user is bound, lock to their bound wallet type
  useEffect(() => {
    if (isBound && binding) {
      setSelectedWallet(binding.walletType);
    }
  }, [isBound, binding]);

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  // Non-Telegram users: only show Solana wallet
  if (!isTelegram) {
    return <WalletConnectionStatus />;
  }

  // Telegram users: show TON/Solana wallet toggle (unless bound)
  return (
    <div className="flex flex-col gap-3">
      {/* Wallet Type Selector - hide if user is already bound to a wallet */}
      {!isBound && (
        <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
          <button
            onClick={() => setSelectedWallet('ton')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              selectedWallet === 'ton'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            TON Wallet
          </button>
          <button
            onClick={() => setSelectedWallet('solana')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              selectedWallet === 'solana'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Solana Wallet
          </button>
        </div>
      )}

      {/* Wallet Connection UI */}
      <div className="flex justify-center">
        {selectedWallet === 'ton' ? (
          <TonWalletButtonWithModal />
        ) : (
          <SolanaWalletWithBinding />
        )}
      </div>

      {/* Helper Text */}
      {selectedWallet === 'ton' && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-center text-gray-400">
            Connect TON wallet via TonConnect protocol
          </p>
          <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <span className="text-lg">💎</span>
            <p className="text-xs text-blue-300">
              Telegram Wallet, Tonkeeper, MyTonWallet supported
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
