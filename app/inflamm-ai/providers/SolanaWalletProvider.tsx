'use client';

import React, { useMemo, useEffect } from 'react';

// Dynamic imports to avoid type conflicts during build
const ConnectionProvider = React.lazy(() => 
  import('@solana/wallet-adapter-react').then(mod => ({ default: mod.ConnectionProvider }))
);
const WalletProvider = React.lazy(() => 
  import('@solana/wallet-adapter-react').then(mod => ({ default: mod.WalletProvider }))
);
const WalletModalProvider = React.lazy(() => 
  import('@solana/wallet-adapter-react-ui').then(mod => ({ default: mod.WalletModalProvider }))
);

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

export const WalletConnectionProvider = ({ children }: { children: React.ReactNode }) => {
    const wallets = useMemo(() => {
        if (typeof window === 'undefined') return [];
        
        try {
            const { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter, CoinbaseWalletAdapter } = 
                require('@solana/wallet-adapter-wallets');
            
            return [
                new PhantomWalletAdapter(),
                new SolflareWalletAdapter(),
                new TorusWalletAdapter(),
                new CoinbaseWalletAdapter(),
            ];
        } catch (error) {
            console.warn('Wallet adapters not available:', error);
            return [];
        }
    }, []);

    // Auto-reset wallet connection on app refresh
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('🔄 Auto-resetting wallet connection on app load...');
            
            // Clear wallet connection state to ensure fresh start
            localStorage.removeItem('walletName');
            localStorage.removeItem('walletAdapter');
            
            console.log('✅ Wallet connection reset complete');
        }
    }, [wallets]);

    return (
        <React.Suspense fallback={<div>{children}</div>}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect={false}>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </React.Suspense>
    );
};

export const SolanaWalletProvider = WalletConnectionProvider;
