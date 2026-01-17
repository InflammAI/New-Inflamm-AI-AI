# Solana Wallet Connection

## Overview
The app now includes Solana wallet integration, allowing users to connect their wallets and receive unique user IDs based on their wallet address.

## Supported Wallets
- **Phantom** - Most popular Solana wallet
- **Solflare** - Feature-rich Solana wallet
- **Torus** - Web-based wallet with social login

## Components

### WalletButton
- Located in the header
- Shows "Connect Wallet" when disconnected
- Displays shortened wallet address when connected
- Styled with orange→yellow gradient matching app theme

### WalletInfo
- Displays when wallet is connected
- Shows:
  - User ID (generated from wallet address)
  - Wallet name (e.g., "Phantom")
  - Full wallet address
  - Connection status indicator
- Auto-hides when wallet disconnects

### SolanaWalletProvider
- Wraps the entire app
- Provides wallet context to all components
- Handles connection state management
- Configured for Solana mainnet-beta

## User ID Generation
When a user connects their wallet:
```typescript
const address = publicKey.toString();
const userId = `USER-${address.slice(0, 8).toUpperCase()}`;
```

Example: Wallet `7Xm...abc` → User ID `USER-7XM`

## How It Works

1. **User clicks "Connect Wallet"**
2. **Wallet selector modal appears**
3. **User chooses their wallet (Phantom, Solflare, etc.)**
4. **Wallet prompts for approval**
5. **Connection confirmed → User ID generated**
6. **WalletInfo card appears showing details**

## Network Configuration
Currently set to **mainnet-beta**. To change:

```typescript
// In SolanaWalletProvider.tsx
const network = 'devnet'; // or 'testnet' or 'mainnet-beta'
```

## Backend Integration
For production, you should:

1. **Verify wallet signatures**
```typescript
// Example API call
const response = await fetch('/api/v1/wallet/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: publicKey.toString(),
    signature: signedMessage,
  }),
});
```

2. **Store wallet ↔ user mapping**
3. **Enforce unique wallet per user**
4. **Link Vital Points balance to wallet address**

## Security Notes
- ✅ Auto-connect on refresh (convenience)
- ✅ No private keys stored
- ✅ Only public address exposed
- ⚠️ Always verify signatures server-side
- ⚠️ Never trust client-side wallet data for critical operations

## Styling
The wallet components use:
- CSS variables from `tokens.css`
- Orange→yellow gradient (`--accent-orange` → `--accent-yellow`)
- Dark surface backgrounds (`--surface`)
- Consistent with app design system

## Testing
To test locally:
1. Install Phantom wallet extension
2. Run `npm run dev`
3. Visit `http://localhost:3001/inflamm-ai`
4. Click "Connect Wallet" in header
5. Approve connection in Phantom
6. See WalletInfo card appear

## Future Enhancements
- [ ] Wallet disconnection handling
- [ ] Transaction signing for Vital Points transfers
- [ ] NFT-gated features
- [ ] Solana Pay integration
- [ ] Multi-wallet support (connect multiple wallets)
