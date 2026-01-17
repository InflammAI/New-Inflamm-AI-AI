import { useState, useEffect } from 'react';

interface WalletBinding {
  walletAddress: string;
  walletType: 'solana' | 'ton';
  boundAt: string;
}

interface WalletProof {
  signature: string;
  message: string;
  publicKey?: string;
  tonProof?: any;
}

interface UseWalletBindingResult {
  isBound: boolean;
  binding: WalletBinding | null;
  isLoading: boolean;
  checkBinding: () => Promise<void>;
  createBinding: (walletAddress: string, walletType: 'solana' | 'ton', proof: WalletProof) => Promise<boolean>;
}

export function useTelegramWalletBinding(): UseWalletBindingResult {
  const [isBound, setIsBound] = useState(false);
  const [binding, setBinding] = useState<WalletBinding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);

  // Get Telegram user ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const webApp = (window as any).Telegram?.WebApp;
      if (webApp?.initDataUnsafe?.user?.id) {
        setTelegramUserId(String(webApp.initDataUnsafe.user.id));
      } else {
        setIsLoading(false); // Not in Telegram, no binding needed
      }
    }
  }, []);

  const checkBinding = async () => {
    if (!telegramUserId) {
      setIsLoading(false);
      return;
    }

    try {
      // Get Telegram initData for authentication
      const webApp = (window as any).Telegram?.WebApp;
      const initData = webApp?.initData;

      if (!initData) {
        console.warn('No Telegram initData available');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/wallet/binding', {
        method: 'GET',
        headers: {
          'X-Telegram-Init-Data': initData,
        },
      });
      
      const data = await response.json();

      setIsBound(data.isBound);
      setBinding(data.binding);
    } catch (error) {
      console.error('Error checking wallet binding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBinding = async (walletAddress: string, walletType: 'solana' | 'ton', proof: WalletProof): Promise<boolean> => {
    if (!telegramUserId) {
      console.warn('Cannot create binding: not in Telegram context');
      return false;
    }

    try {
      // Get Telegram initData for authentication
      const webApp = (window as any).Telegram?.WebApp;
      const initData = webApp?.initData;

      if (!initData) {
        console.warn('No Telegram initData available');
        return false;
      }

      // Build payload based on wallet type
      const payload: any = {
        walletAddress,
        walletType,
      };

      // Add type-specific proof fields
      if (walletType === 'ton') {
        payload.tonProof = proof.tonProof;
      } else {
        payload.signature = proof.signature;
        payload.message = proof.message;
        payload.publicKey = proof.publicKey;
      }

      const response = await fetch('/api/wallet/binding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Wallet already bound to different address
        alert(`This Telegram account is already linked to another ${data.boundWallet.type} wallet. You cannot change your wallet once connected.`);
        return false;
      }

      if (response.ok) {
        setIsBound(true);
        setBinding(data.binding);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error creating wallet binding:', error);
      return false;
    }
  };

  // Check binding on mount
  useEffect(() => {
    if (telegramUserId) {
      checkBinding();
    }
  }, [telegramUserId]);

  return {
    isBound,
    binding,
    isLoading,
    checkBinding,
    createBinding,
  };
}
