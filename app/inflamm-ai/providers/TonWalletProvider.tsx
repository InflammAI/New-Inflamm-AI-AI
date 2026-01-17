'use client';

import React, { PropsWithChildren } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/tonconnect-manifest.json'
  : 'https://app.inflammai.com/tonconnect-manifest.json';

const returnUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/inflamm-ai'
  : 'https://app.inflammai.com/inflamm-ai';

export function TonWalletProvider({ children }: PropsWithChildren) {
  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "telegram-wallet",
            name: "Wallet",
            imageUrl: "https://wallet.tg/images/logo-288.png",
            aboutUrl: "https://wallet.tg/",
            universalLink: "https://t.me/wallet?attach=wallet",
            deepLink: "tg://resolve?domain=wallet&attach=wallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"],
            jsBridgeKey: "telegram-wallet"
          },
          {
            appName: "tonkeeper",
            name: "Tonkeeper",
            imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
            aboutUrl: "https://tonkeeper.com",
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "chrome", "firefox", "safari"]
          },
          {
            appName: "mytonwallet",
            name: "MyTonWallet",
            imageUrl: "https://static.mytonwallet.io/icon-256.png",
            aboutUrl: "https://mytonwallet.io",
            universalLink: "https://connect.mytonwallet.org",
            bridgeUrl: "https://tonconnectbridge.mytonwallet.org/bridge",
            platforms: ["chrome", "firefox", "safari", "ios", "android"]
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: returnUrl
      }}
    >
      {children}
    </TonConnectUIProvider>
  );
}
