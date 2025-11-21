'use client';

import { useState, useEffect } from 'react';
import { useTonConnectUI, useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { useTelegramWalletBinding } from '../../hooks/useTelegramWalletBinding';

export function TonWalletButtonWithModal() {
  const [tonConnectUI] = useTonConnectUI();
  const [mounted, setMounted] = useState(false);
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();
  const { isBound, binding, createBinding, isLoading } = useTelegramWalletBinding();

  useEffect(() => {
    setMounted(true);
  }, []);

  // When TON wallet connects, create binding if in Telegram
  useEffect(() => {
    if (wallet && userFriendlyAddress && !isLoading) {
      console.log('TON Wallet connected:', {
        address: userFriendlyAddress,
        device: wallet.device,
        connectItems: wallet.connectItems,
      });

      // Extract TON proof for wallet ownership verification
      const tonProof = wallet.connectItems?.tonProof;
      
      if (!tonProof) {
        console.error('No TON proof available - wallet ownership cannot be verified');
        return;
      }

      // Create proof object for binding
      const proof = {
        signature: '', // Not used for TON (proof contains signature)
        message: '', // Not used for TON (proof contains domain)
        tonProof: tonProof,
      };

      // Try to create or verify binding with wallet ownership proof
      createBinding(userFriendlyAddress, 'ton', proof);
    }
  }, [wallet, userFriendlyAddress, isLoading]);

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  const handleConnectClick = async () => {
    // Open TON Connect modal - it will automatically show "Connect Wallet in Telegram" button when in Telegram
    await tonConnectUI.openModal();
  };

  const handleDisconnect = async () => {
    await tonConnectUI.disconnect();
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // If wallet is connected
  if (wallet && userFriendlyAddress) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">💎</span>
              <span className="text-blue-300 text-sm font-mono">
                {formatAddress(userFriendlyAddress)}
              </span>
            </div>
          </div>
          {/* Only show disconnect button if NOT bound in Telegram */}
          {!isBound && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
        
        {/* Show permanent binding message */}
        {isBound && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-500/30 rounded-lg">
            <span className="text-green-400 text-xs">
              🔒 Permanently linked to your Telegram account
            </span>
          </div>
        )}
      </div>
    );
  }

  // Show connect button
  return (
    <button
      onClick={handleConnectClick}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
    >
      Connect Wallet
    </button>
  );
}
