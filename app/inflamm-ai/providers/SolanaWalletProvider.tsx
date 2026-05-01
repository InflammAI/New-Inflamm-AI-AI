'use client';

import React, { useMemo, useEffect } from 'react';
import {
    ConnectionProvider,
    WalletProvider
} from '@solana/wallet-adapter-react';

import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui';

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

export const WalletConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new CoinbaseWalletAdapter(),
        ],
        []
    );

    // Auto-reset wallet connection on app refresh
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('🔄 Auto-resetting wallet connection on app load...');
            
            // Clear wallet connection state to ensure fresh start
            localStorage.removeItem('walletName');
            localStorage.removeItem('walletAdapter');
            
            // Note: We preserve 'hasEverConnectedWallet' flag for UX purposes
            // This helps us show helpful messages only to returning users
            console.log('✅ Wallet connection reset complete');
        }
    }, [wallets]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={false}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export const SolanaWalletProvider = WalletConnectionProvider;
