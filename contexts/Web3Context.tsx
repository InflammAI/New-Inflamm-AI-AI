import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { InjectedConnector } from '@web3-react/injected-connector';

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

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<ethers.providers.Network | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Web3Modal
  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions: {}
  });

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      
      // Get accounts
      const accounts = await provider.listAccounts();
      const account = accounts[0];
      
      // Get balance (in ETH for now, will be INFLAMM tokens later)
      const balance = await provider.getBalance(account);
      
      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setBalance(ethers.utils.formatEther(balance));
      setNetwork(network);
      setIsConnected(true);
      
      // Set up event listeners
      instance.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });
      
      instance.on('chainChanged', () => {
        window.location.reload();
      });
      
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnect = () => {
    web3Modal.clearCachedProvider();
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setBalance('0');
    setNetwork(null);
    setIsConnected(false);
  };

  // Check if user is already connected
  useEffect(() => {
    if (web3Modal.cachedProvider) {
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
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
