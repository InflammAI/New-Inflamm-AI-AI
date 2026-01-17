'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

type Web3ContextType = {
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  account: string | null;
  balance: string;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  network: ethers.providers.Network | null;
};

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<ethers.providers.Network | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock Web3 connection
  const connectWallet = async () => {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock provider and signer
      const mockProvider = {
        getNetwork: async () => ({ name: 'demo', chainId: 1 }),
        listAccounts: async () => ['0x1234567890abcdef1234567890abcdef12345678'],
        getBalance: async () => ethers.utils.parseEther('1000')
      } as unknown as ethers.providers.Web3Provider;
      
      const mockSigner = {
        getAddress: async () => '0x1234567890abcdef1234567890abcdef12345678',
        signMessage: async (message: string) => `0x${'a'.repeat(130)}`
      } as unknown as ethers.Signer;
      
      // Set mock data
      setProvider(mockProvider);
      setSigner(mockSigner);
      setAccount('0x1234...5678');
      setBalance('1,000.00');
      setNetwork({ name: 'demo', chainId: 1 } as ethers.providers.Network);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnect = () => {
    // Just reset the demo state
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setBalance('0');
    setNetwork(null);
    setIsConnected(false);
  };

  // Auto-connect mock wallet in development
  useEffect(() => {
    // Auto-connect in development for demo purposes
    if (process.env.NODE_ENV === 'development') {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnect,
        account,
        balance,
        isConnected,
        provider,
        signer,
        network,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === null) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
