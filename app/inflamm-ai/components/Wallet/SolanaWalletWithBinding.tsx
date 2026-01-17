'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectionStatus } from './WalletConnectionStatus';
import { useTelegramWalletBinding } from '../../hooks/useTelegramWalletBinding';
import bs58 from 'bs58';

export function SolanaWalletWithBinding() {
  const { publicKey, signMessage, connected } = useWallet();
  const { isBound, binding, createBinding, isLoading } = useTelegramWalletBinding();
  const [bindingAttempted, setBindingAttempted] = useState(false);

  useEffect(() => {
    async function handleSolanaConnection() {
      if (!connected || !publicKey || isLoading || bindingAttempted) {
        return;
      }

      if (typeof window === 'undefined') return;
      
      const isTelegram = !!(window as any).Telegram?.WebApp?.initData;
      if (!isTelegram) return;

      if (isBound && binding?.walletAddress === publicKey.toString()) {
        return;
      }

      if (!signMessage) {
        console.error('This Solana wallet does not support message signing. Wallet binding requires signature capability.');
        alert('⚠️ This wallet does not support message signing. Please use a wallet that supports signing (Phantom, Solflare, etc.) to bind your account.');
        return;
      }

      setBindingAttempted(true);

      try {
        const message = JSON.stringify({
          action: 'bind_wallet',
          walletAddress: publicKey.toString(),
          timestamp: Date.now(),
        });

        const messageBytes = new TextEncoder().encode(message);
        const signature = await signMessage(messageBytes);
        const signatureBase58 = bs58.encode(signature);

        const proof = {
          signature: signatureBase58,
          message: message,
          publicKey: publicKey.toString(),
        };

        const success = await createBinding(publicKey.toString(), 'solana', proof);
        
        if (success) {
          console.log('Solana wallet bound successfully');
        } else {
          setBindingAttempted(false);
        }
      } catch (error) {
        console.error('Failed to bind Solana wallet:', error);
        setBindingAttempted(false);
      }
    }

    handleSolanaConnection();
  }, [connected, publicKey, signMessage, isLoading, isBound, binding, bindingAttempted, createBinding]);

  useEffect(() => {
    if (!connected) {
      setBindingAttempted(false);
    }
  }, [connected]);

  return (
    <div className="flex flex-col gap-2">
      <WalletConnectionStatus />
      
      {isBound && binding && connected && publicKey?.toString() === binding.walletAddress && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-500/30 rounded-lg">
          <span className="text-green-400 text-xs">
            🔒 Permanently linked to your Telegram account
          </span>
        </div>
      )}
    </div>
  );
}
