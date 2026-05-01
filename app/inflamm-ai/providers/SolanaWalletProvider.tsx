'use client';

import React, { useMemo, useEffect } from 'react';

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

export const WalletConnectionProvider = ({ children }: { children: React.ReactNode }) => {
    // For now, just return children without Solana wallet integration
    // This avoids the TypeScript conflicts during build
    // We can add wallet integration later when needed
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('🔄 Auto-resetting wallet connection on app load...');
            
            // Clear wallet connection state to ensure fresh start
            localStorage.removeItem('walletName');
            localStorage.removeItem('walletAdapter');
            
            console.log('✅ Wallet connection reset complete');
        }
    }, []);

    return <>{children}</>;
};

export const SolanaWalletProvider = WalletConnectionProvider;
