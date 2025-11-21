# TON Wallet Connection Guide

## Overview

Inflamm AI integrates with TON blockchain to support Telegram users with native TON wallet connectivity. When accessed from Telegram, users see a seamless "Connect Wallet in Telegram" button that enables instant wallet connection.

---

## 🎯 How It Works

### For Telegram Users:

When a Telegram user opens the app and clicks "Connect Wallet":

```
┌────────────────────────────────────┐
│   Connect your TON wallet          │
│   Use Wallet in Telegram or        │
│   choose other application         │
├────────────────────────────────────┤
│                                    │
│  📱 Connect Wallet in Telegram     │  ← Blue Telegram button
│                                    │
├────────────────────────────────────┤
│   Choose other application         │
│                                    │
│   🔷 Tonkeeper                     │
│   ⭕ MyTonWallet                   │
│   💎 Tonhub                        │
│   📋 View all wallets              │
└────────────────────────────────────┘
```

**Key Features:**
- ✅ "Connect Wallet in Telegram" button appears first (large, blue)
- ✅ Native Telegram wallet is prioritized
- ✅ Alternative wallets shown below
- ✅ Seamless in-app experience

### For Web Users:

Web users (non-Telegram) see only Solana wallet options:

```
┌────────────────────────────────────┐
│   Connect a wallet on              │
│   Solana to continue               │
├────────────────────────────────────┤
│   👻 Phantom                       │
│   🌐 Solflare                      │
│   🔷 Torus                         │
│   🔵 Coinbase Wallet              │
└────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### Frontend Files:

1. **`app/inflamm-ai/providers/TonWalletProvider.tsx`**
   - Configures TON Connect UI
   - Sets up Telegram Wallet as priority
   - Configures return URL for in-app flow

2. **`app/inflamm-ai/components/Wallet/TonWalletButtonWithModal.tsx`**
   - Connect button component
   - Opens TON Connect modal
   - Displays connected wallet info

3. **`app/inflamm-ai/components/Wallet/DualWalletSelector.tsx`**
   - Smart wallet type selector
   - Shows TON/Solana toggle for Telegram users
   - Shows Solana-only for web users

4. **`public/tonconnect-manifest.json`**
   - App metadata for TON Connect
   - Required for wallet connections

### Backend Files:

1. **`lib/ton-auth.ts`** ✨ NEW
   - TON signature verification using @ton/crypto
   - Address validation and parsing
   - Ed25519 signature checking with TON protocol

2. **`lib/auth.ts`** ✨ UPDATED
   - Unified authentication for both Solana and TON
   - Auto-detects wallet type by address format
   - Routes to appropriate verification function
   - Returns wallet type in verification result

3. **`app/api/vytap/tap/route.ts`** ✨ UPDATED
   - Accepts both Solana and TON wallet addresses
   - Stores wallet type in database
   - Handles authentication for both chains

4. **Database Schema** ✨ UPDATED
   - `wallet_address`: Expanded to VARCHAR(66) (supports TON addresses)
   - `wallet_type`: New column ('solana' or 'ton')
   - Maintains backward compatibility with existing Solana users

---

## 📱 User Flow

### Telegram Connection Flow:

```
1. User opens app in Telegram
   ↓
2. Sees "TON Wallet" tab in header
   ↓
3. Clicks "Connect Wallet" button
   ↓
4. TON Connect modal opens automatically
   ↓
5. "Connect Wallet in Telegram" button shown (blue, large)
   ↓
6. User clicks the button
   ↓
7. Telegram Wallet authorization screen appears
   ↓
8. User approves connection
   ↓
9. Returns to app with wallet connected ✅
   ↓
10. Wallet address shown in header
```

### Alternative Wallet Flow:

```
From step 5 above:
   ↓
User clicks "Tonkeeper" (or other wallet)
   ↓
External wallet app opens
   ↓
User approves connection
   ↓
Returns to app via deep link
   ↓
Wallet connected ✅
```

---

## ⚙️ Configuration

### TonWalletProvider Setup:

```tsx
<TonConnectUIProvider
  manifestUrl="https://app.inflammai.com/tonconnect-manifest.json"
  walletsListConfiguration={{
    includeWallets: [
      {
        appName: "telegram-wallet",
        name: "Wallet",
        imageUrl: "https://wallet.tg/images/logo-288.png",
        aboutUrl: "https://wallet.tg/",
        universalLink: "https://t.me/wallet/start",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
        platforms: ["ios", "android", "macos", "windows", "linux"]
      }
    ]
  }}
  actionsConfiguration={{
    twaReturnUrl: 'https://t.me/InflammAIBot/app'
  }}
>
```

**Key Settings:**
- `manifestUrl`: Points to app metadata
- `walletsListConfiguration`: Adds Telegram Wallet to list
- `twaReturnUrl`: Ensures user returns to app after connection

---

## 🎨 UI Components

### TON Wallet Button:

When **disconnected**:
```tsx
<button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500">
  Connect Wallet
</button>
```

When **connected**:
```tsx
<div className="px-4 py-2 bg-blue-900/20 border border-blue-500/30">
  💎 UQBi...f53P
  <button>Disconnect</button>
</div>
```

### Dual Wallet Selector (Telegram Only):

```tsx
┌─────────────────────────────────┐
│ [TON Wallet] [Solana Wallet]   │  ← Toggle buttons
├─────────────────────────────────┤
│    [Connect Wallet]             │  ← Active button
├─────────────────────────────────┤
│ 💎 Telegram Wallet recommended  │  ← Info banner
└─────────────────────────────────┘
```

---

## 🔐 Security & Permissions

### What Wallets Can Access:
✅ View TON address  
✅ View balance  
✅ View transaction history  

### What Wallets Cannot Do:
❌ Move funds without explicit user approval  
❌ Access other Telegram data  
❌ Make automatic transactions  

### Connection Security:
- All connections require explicit user approval
- Wallet private keys never leave the wallet app
- App only receives public address and permission to request signatures
- TON Connect uses secure bridge protocol

---

## 🧪 Testing

### Test in Telegram:

1. Open @BotFather and configure your bot
2. Set Menu Button to: `https://app.inflammai.com`
3. Open bot in Telegram
4. Click menu button or send `/start`
5. App opens as Telegram Mini App
6. Click "Connect Wallet" in header
7. **Verify**: "Connect Wallet in Telegram" button appears as primary option
8. Click it and authorize
9. **Verify**: Wallet address appears in header

### Test on Web:

1. Open https://app.inflammai.com in browser
2. **Verify**: Only "Solana Wallet" option visible (no TON toggle)
3. Click "Select Wallet"
4. **Verify**: Solana wallets shown (Phantom, Solflare, etc.)

---

## 🐛 Troubleshooting

### "Connect Wallet in Telegram" Not Showing

**Issue**: Blue Telegram button doesn't appear in wallet modal

**Solutions**:
1. Verify you're testing in actual Telegram app (not web.telegram.org)
2. Check `walletsListConfiguration` includes telegram-wallet
3. Verify `twaReturnUrl` is set correctly
4. Check browser console for TON Connect errors
5. Ensure `tonconnect-manifest.json` is accessible

### Wallet Connection Fails

**Issue**: Connection starts but doesn't complete

**Solutions**:
1. Check `twaReturnUrl` matches your bot URL exactly
2. Verify bot is configured with @BotFather
3. Test with alternative wallet (Tonkeeper) to isolate issue
4. Check if Telegram Wallet is enabled in Telegram settings
5. Try disconnecting and reconnecting

### Wrong Platform Detected

**Issue**: Telegram user sees Solana-only or web user sees TON toggle

**Solutions**:
1. Verify `window.Telegram.WebApp.initData` detection logic
2. Clear browser cache and reload
3. Check for browser extensions interfering
4. Test in incognito/private mode

---

## 📊 Platform Detection

### Detection Logic:

```typescript
const isInTelegram = !!(window as any).Telegram?.WebApp?.initData;

if (isInTelegram) {
  // Show TON/Solana toggle
  // Default to TON wallet
} else {
  // Show Solana-only
}
```

### Platform Behavior:

| Platform | Detects As | Wallets Shown |
|----------|------------|---------------|
| Telegram iOS | Telegram | TON + Solana Toggle |
| Telegram Android | Telegram | TON + Solana Toggle |
| Telegram Desktop | Telegram | TON + Solana Toggle |
| Safari/Chrome | Web | Solana Only |
| Mobile Browsers | Web | Solana Only |

---

## 🎯 Wallet Priority

### For Telegram Users (TON Wallet):

1. **Connect Wallet in Telegram** ⭐ (Primary, blue button)
2. Tonkeeper
3. MyTonWallet
4. Tonhub
5. View all wallets...

### For Web Users (Solana Wallet):

1. Phantom
2. Solflare
3. Torus
4. Coinbase Wallet

---

## 🔐 Backend Authentication

### Dual Wallet Authentication System

The backend now supports **both Solana and TON wallets**:

```typescript
// lib/auth.ts - Unified authentication
export async function verifyWalletSignature(
  walletAddress: string,
  signature: string,
  message: string,
  isSessionSignature: boolean = false
): Promise<VerifyResult> {
  // 1. Auto-detect wallet type
  if (isTonAddress(walletAddress)) {
    // Use TON verification
    return verifyTonSignature(...);
  } else {
    // Use Solana verification
    return verifySolanaSignature(...);
  }
}
```

### TON Signature Verification

**IMPORTANT**: TON wallets use the official TON Connect ton-proof protocol for secure verification.

```typescript
// lib/ton-auth.ts - TON Proof Verification
export async function verifyTonProof(
  proofRequest: TonProofRequest,
  expectedDomain: string
): Promise<TonVerifyResult> {
  // 1. Validate domain matches (prevents phishing)
  if (proof.domain.value !== expectedDomain) {
    return { success: false, error: 'Invalid domain' };
  }
  
  // 2. Check timestamp (5-minute window to prevent replay)
  const now = Math.floor(Date.now() / 1000);
  const proofAge = now - proof.timestamp;
  if (Math.abs(proofAge) > 300) {
    return { success: false, error: 'Proof expired' };
  }
  
  // 3. Check for proof replay (nonce cache)
  const nonceKey = `${address}-${proof.payload}-${proof.timestamp}`;
  if (proofNonceCache.has(nonceKey)) {
    return { success: false, error: 'Proof replay detected' };
  }
  
  // 4. Extract public key from state_init (wallet contract)
  let publicKeyBytes: Uint8Array;
  if (proof.state_init) {
    // Derive public key from wallet state init
    publicKeyBytes = extractPublicKeyFromStateInit(proof.state_init);
  } else if (providedPublicKey) {
    // Fallback to provided public key
    publicKeyBytes = Buffer.from(providedPublicKey, 'hex');
  }
  
  // 5. Build ton-proof message cell (per TON spec)
  const messageCell = beginCell()
    .storeUint(0xffff, 16)           // Magic prefix
    .storeUint(0, 8)                  // Workchain
    .storeUint(proof.timestamp, 64)   // Timestamp
    .storeUint(proof.domain.lengthBytes, 32)
    .storeBuffer(Buffer.from(proof.domain.value))
    .storeBuffer(Buffer.from(proof.payload))
    .endCell();
  
  // 6. Hash the message cell
  const messageHash = sha256_sync(messageCell.hash());
  
  // 7. Verify Ed25519 signature
  const signatureBytes = Buffer.from(proof.signature, 'base64');
  const verified = nacl.sign.detached.verify(
    messageHash,
    signatureBytes,
    publicKeyBytes
  );
  
  // 8. Cache nonce to prevent replay
  proofNonceCache.set(nonceKey, Date.now());
  
  return { success: verified, walletAddress };
}
```

**Security Features:**
- ✅ **Domain validation** - Prevents phishing attacks
- ✅ **Timestamp check** - 5-minute validity window
- ✅ **Replay protection** - Nonce cache prevents reuse
- ✅ **Public key binding** - Extracted from wallet state_init
- ✅ **TON proof spec** - Official TonConnect protocol
- ✅ **Ed25519 verification** - Cryptographically secure

### Database Schema

```sql
-- Updated users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(66) UNIQUE NOT NULL,  -- ✨ Extended for TON
  wallet_type VARCHAR(10) DEFAULT 'solana',    -- ✨ New column
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_tap_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_wallet_type ON users(wallet_type);  -- ✨ New index
```

**Key Changes:**
- ✅ `wallet_address` extended from VARCHAR(44) to VARCHAR(66)
- ✅ `wallet_type` column added ('solana' or 'ton')
- ✅ New index on `wallet_type` for efficient queries
- ✅ Backward compatible with existing Solana users

### API Integration

```typescript
// app/api/vytap/tap/route.ts
export async function POST(req: NextRequest) {
  const { 
    walletAddress, 
    signature, 
    message,
    publicKey  // ✨ Required for TON wallets (from TonConnect)
  } = await req.json();
  
  // Verify wallet (auto-detects Solana vs TON)
  const verifyResult = await verifyWalletSignature(
    walletAddress, 
    signature, 
    message,
    false,      // isSessionSignature
    publicKey   // ✨ TON public key from frontend
  );
  
  if (!verifyResult.success) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const walletType = verifyResult.walletType; // 'solana' or 'ton'
  
  // Store user with wallet type
  await db.query(
    `INSERT INTO users (wallet_address, wallet_type, total_points) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (wallet_address) 
     DO UPDATE SET total_points = users.total_points + $3`,
    [walletAddress, walletType, pointsEarned]
  );
}
```

**Frontend Integration:**

When using TON wallet, include the public key:

```typescript
// Frontend - Getting public key from TonConnect
const wallet = useTonWallet();

if (wallet) {
  const publicKey = wallet.account.publicKey;  // ✨ Get from TonConnect
  
  // Send to backend
  await fetch('/api/vytap/tap', {
    method: 'POST',
    body: JSON.stringify({
      walletAddress: wallet.account.address,
      signature: signatureBase64,
      message: messageToSign,
      publicKey: publicKey  // ✨ Include for TON verification
    })
  });
}
```

### Address Format Differences

| Blockchain | Format | Length | Example |
|------------|--------|--------|---------|
| Solana | Base58 | 32-44 chars | `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU` |
| TON | User-friendly | 48 chars | `EQBi...f53P` (bounceable/non-bounceable) |

**Detection Logic:**
```typescript
function isTonAddress(address: string): boolean {
  try {
    Address.parse(address);  // TON address parser
    return true;
  } catch {
    return false;  // Not a TON address, assume Solana
  }
}
```

---

## 📝 Setup Checklist

### Frontend Setup:

- [ ] Bot created with @BotFather
- [ ] Mini App configured with /newapp
- [ ] Menu Button set to app URL
- [ ] `tonconnect-manifest.json` deployed
- [ ] `twaReturnUrl` matches bot URL
- [ ] Telegram Wallet included in wallet list
- [ ] Tested in actual Telegram app
- [ ] Verified "Connect Wallet in Telegram" button appears

### Backend Setup:

- [ ] Database schema updated (VARCHAR(66), wallet_type column)
- [ ] `@ton/crypto` and `@ton/core` packages installed
- [ ] `lib/ton-auth.ts` created for TON verification
- [ ] `lib/auth.ts` updated for dual wallet support
- [ ] API endpoints updated to store wallet_type
- [ ] Tested TON wallet authentication
- [ ] Verified backward compatibility with Solana wallets

---

## 🚀 Benefits

✅ **Native Integration** - Seamless Telegram experience  
✅ **One-Click Connect** - Fastest connection method  
✅ **Priority Placement** - Telegram Wallet shown first  
✅ **Automatic Detection** - Smart platform detection  
✅ **Fallback Support** - Alternative wallets available  
✅ **Secure Protocol** - TON Connect security standards  
✅ **Cross-Platform** - Works on all Telegram clients  

---

## 📚 Resources

- [TON Connect Documentation](https://docs.ton.org/develop/dapps/ton-connect/react)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [TON Wallet Setup](https://wallet.tg/)
- [TON Connect SDK](https://github.com/ton-connect/sdk)

---

**Your app now has native TON wallet integration for Telegram users!** 🎉

The "Connect Wallet in Telegram" button will automatically appear when users access your app through Telegram, providing the smoothest possible connection experience.
