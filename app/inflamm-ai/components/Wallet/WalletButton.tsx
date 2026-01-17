'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, disconnect, connecting, connected, wallet } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('Wallet state changed:', { connected, connecting, wallet: wallet?.adapter.name, publicKey: publicKey?.toString() });
  }, [connected, connecting, wallet, publicKey]);

  const handleConnect = () => {
    console.log('🔵 [WalletButton] Select Wallet clicked');
    console.log('🔵 [WalletButton] Opening modal...');
    console.log('🔵 [WalletButton] Modal state before:', { visible: false });
    
    // Check if wallet is available
    if (typeof window !== 'undefined') {
      console.log('🔵 [WalletButton] Window.solana exists?', !!window.solana);
      console.log('🔵 [WalletButton] Window.phantom exists?', !!(window as any).phantom);
    }
    
    setVisible(true);
    console.log('🔵 [WalletButton] setVisible(true) called');
    
    // Verify modal appears
    setTimeout(() => {
      const modal = document.querySelector('.wallet-adapter-modal-wrapper');
      console.log('🔵 [WalletButton] Modal element in DOM?', !!modal);
      if (modal) {
        console.log('🔵 [WalletButton] Modal display style:', (modal as HTMLElement).style.display);
        const walletButtons = document.querySelectorAll('.wallet-adapter-modal-list button');
        console.log('🔵 [WalletButton] Wallet buttons found:', walletButtons.length);
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect wallet
      await disconnect();
      
      // Clear wallet adapter local storage
      localStorage.removeItem('walletName');
      
      console.log('Wallet disconnected and cache cleared');
    } catch (error) {
      // Suppress wallet extension errors
      if (error instanceof Error && !error.message.includes('message channel closed')) {
        console.error('Disconnect error:', error);
      }
    }
  };

  const handleForceReset = () => {
    try {
      // Clear all wallet-related local storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('wallet') || key.includes('solana'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Force disconnect
      disconnect();
      
      // Reload page to reset state
      window.location.reload();
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold transition-colors"
      >
        {connecting ? 'Connecting...' : 'Select Wallet'}
      </button>
    );
  }

  const base58 = publicKey?.toBase58();
  const shortAddress = base58 ? `${base58.slice(0, 4)}...${base58.slice(-4)}` : '';

  return (
    <button
      onClick={handleDisconnect}
      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-red-600 text-white font-semibold transition-colors"
      title="Click to disconnect"
    >
      {shortAddress}
    </button>
  );
}
