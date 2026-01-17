'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function CustomWalletButton() {
  const [mounted, setMounted] = useState(false);
  const [showPopupHelp, setShowPopupHelp] = useState(false);
  const { publicKey, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connecting) {
      const timeout = setTimeout(() => {
        if (connecting && !connected) {
          console.warn('⚠️ Connection timeout - popup may be blocked');
          setShowPopupHelp(true);
        }
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      setShowPopupHelp(false);
    }
  }, [connecting, connected]);

  const handleConnect = () => {
    console.log('🔵 Select Wallet button clicked');
    console.log('🔵 Wallet modal setVisible:', setVisible);
    console.log('🔵 In iframe?', window !== window.parent);
    setShowPopupHelp(false);
    setVisible(true);
    console.log('🔵 Modal visibility set to true');
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      localStorage.removeItem('walletName');
    } catch (error) {
      if (error instanceof Error && !error.message.includes('message channel closed')) {
        console.error('Disconnect error:', error);
      }
    }
  };

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  if (!connected) {
    return (
      <div className="relative">
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold transition-colors"
        >
          {connecting ? 'Connecting...' : 'Select Wallet'}
        </button>
        
        {showPopupHelp && (
          <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-yellow-900/90 border border-yellow-600 rounded-lg shadow-xl z-50">
            <div className="flex items-start gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="text-sm text-white">
                <p className="font-semibold mb-2">Popup Blocked!</p>
                <p className="mb-2">Your browser is blocking the Phantom wallet popup.</p>
                <p className="text-xs">
                  <strong>Fix:</strong> Look for a 🚫 icon in your browser's address bar and click "Always allow popups"
                </p>
                <button
                  onClick={() => setShowPopupHelp(false)}
                  className="mt-2 text-xs underline hover:text-yellow-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
