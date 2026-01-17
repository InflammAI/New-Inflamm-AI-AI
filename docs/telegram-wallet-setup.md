# Telegram Wallet Integration Guide

## Overview

Inflamm AI now supports **Telegram's built-in Wallet** for seamless crypto transactions within Telegram. This native wallet integration provides the best user experience for Telegram users.

---

## 🎯 What's Included

### 1. **Telegram Wallet (Built-in)**
- Native wallet integrated into Telegram app
- No external app download required
- Instant connection within Telegram Mini App
- **Recommended for Telegram users**

### 2. **Alternative TON Wallets**
- **Tonkeeper**: Popular mobile TON wallet
- **MyTonWallet**: Web-based TON wallet
- **Tonhub**: Alternative mobile wallet

### 3. **Solana Wallets** (for non-Telegram users)
- Phantom, Solflare, Torus, Coinbase Wallet

---

## 🔧 Technical Implementation

### Files Created/Modified

1. **`app/inflamm-ai/providers/TonWalletProvider.tsx`**
   - Configured with Telegram Wallet in `walletsListConfiguration`
   - Set up `twaReturnUrl` for in-app navigation
   - Universal link: `https://t.me/wallet/start`

2. **`app/inflamm-ai/components/Wallet/DualWalletSelector.tsx`**
   - Smart detection of Telegram environment
   - Context-aware messaging for Telegram users
   - Blue highlight banner recommending Telegram Wallet

3. **`public/tonconnect-manifest.json`**
   - App identity for TON Connect
   - Required for wallet connections

---

## 📱 User Experience

### For Telegram Users:

```
┌─────────────────────────────────────────┐
│  [TON Wallet]  [Solana Wallet]          │  ← Toggle
├─────────────────────────────────────────┤
│  [Connect Wallet]                        │  ← TON Connect Button
├─────────────────────────────────────────┤
│  Use Telegram Wallet (built-in) or      │
│  connect Tonkeeper, MyTonWallet          │
├─────────────────────────────────────────┤
│  💎 Telegram Wallet recommended          │  ← Blue banner
│     for best experience                  │
└─────────────────────────────────────────┘
```

**Wallet options when clicking "Connect Wallet":**
1. **Wallet** (Telegram built-in) ⭐ **First option**
2. Tonkeeper
3. MyTonWallet
4. Tonhub
5. View all wallets...

### For Non-Telegram Users:

```
┌─────────────────────────────────────────┐
│  [Select Wallet]                         │  ← Solana only
└─────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### Step 1: Create Telegram Bot (if not done)

```bash
1. Open @BotFather in Telegram
2. Send: /newbot
3. Follow prompts to name your bot
4. Save the bot token (you'll need it later)
```

### Step 2: Create Telegram Mini App

```bash
1. Send /newapp to @BotFather
2. Select your bot
3. Provide:
   - Title: Inflamm AI
   - Short name: app
   - Description: Decentralized Health Data Platform
   - Photo: Upload your app icon
   - Web App URL: https://app.inflammai.com
4. Save the short name (e.g., "app")
```

### Step 3: Update Bot Menu Button

```bash
1. Send /mybots to @BotFather
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Set Web App URL: https://app.inflammai.com
5. Set button text: "Open App"
```

### Step 4: Update twaReturnUrl (Already Done)

The code is already configured with:
```tsx
twaReturnUrl: 'https://t.me/InflammAIBot/app'
```

**Update if your bot username or app short name is different:**
- Format: `https://t.me/<YOUR_BOT_USERNAME>/<YOUR_APP_SHORT_NAME>`
- Example: `https://t.me/MyHealthBot/myapp`

---

## ✅ Testing

### Test Telegram Wallet Connection:

1. **Open app in Telegram:**
   - Open your bot in Telegram
   - Click the menu button or type `/start`
   - App loads as Telegram Mini App

2. **Connect Telegram Wallet:**
   - See TON/Solana toggle in header
   - Click "Connect Wallet"
   - **"Wallet" should appear as first option** ⭐
   - Click "Wallet" to connect
   - Authorize in Telegram Wallet

3. **Verify connection:**
   - Wallet address should display in header
   - Can now interact with VyTap and earn points
   - Transactions happen through Telegram Wallet

### Test on Desktop/Mobile Web:

1. Open https://app.inflammai.com directly
2. Should **only** see Solana wallet option
3. No TON wallet toggle visible
4. Regular Solana wallet flow

---

## 🔒 Security Features

### Wallet Configuration:
- **Universal Link**: `https://t.me/wallet/start`
- **Bridge URL**: `https://bridge.tonapi.io/bridge`
- **Manifest URL**: `https://app.inflammai.com/tonconnect-manifest.json`
- **Platforms**: iOS, Android, macOS, Windows, Linux

### Return Flow:
- `twaReturnUrl` ensures users return to your app after wallet interaction
- Only applies when dApp is opened in Telegram Mini App mode
- Falls back to `returnStrategy` if not in Telegram

---

## 🎨 Visual Design

### TON Wallet Button:
- **Blue theme** for Telegram/TON branding
- Matches Telegram's visual language
- Smooth transitions

### Solana Wallet Button:
- **Purple theme** for Solana branding
- Consistent with existing design

### Recommendation Banner:
- Blue background (`bg-blue-900/20`)
- Blue border (`border-blue-800/30`)
- Diamond emoji (💎) for premium feel
- Only shows for Telegram users on TON wallet

---

## 📊 Wallet Priority

The wallet list is configured to show wallets in this order:

**For Telegram Users:**
1. ⭐ **Wallet** (Telegram built-in) - **First**
2. Tonkeeper
3. MyTonWallet
4. Tonhub
5. Other wallets...

**For Web Users:**
1. Phantom
2. Solflare
3. Torus
4. Coinbase Wallet
5. Other wallets...

---

## 🐛 Troubleshooting

### Wallet doesn't appear:
- Ensure you're testing inside Telegram
- Check that bot is properly configured with @BotFather
- Verify manifest URL is accessible: https://app.inflammai.com/tonconnect-manifest.json

### Can't connect:
- Make sure Telegram Wallet is enabled in your Telegram settings
- Try alternative wallets (Tonkeeper, MyTonWallet)
- Check browser console for errors

### Wrong wallet shown:
- Clear cache and hard refresh
- Verify you're in Telegram environment (check for toggle)
- Test on different device/platform

---

## 📝 Configuration Reference

### TonWalletProvider Config:

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
  {children}
</TonConnectUIProvider>
```

---

## 🎯 Key Benefits

✅ **Native Integration** - No external app required  
✅ **Seamless UX** - One-click connection within Telegram  
✅ **Secure** - Built-in Telegram security  
✅ **Fast** - Instant transactions  
✅ **Universal** - Works on all Telegram platforms  
✅ **Fallback Support** - Alternative wallets available  

---

## 📚 Resources

- [TON Connect Documentation](https://docs.ton.org/develop/dapps/ton-connect/react)
- [Telegram Mini Apps Guide](https://core.telegram.org/bots/webapps)
- [TON Wallet Setup](https://wallet.tg/)
- [@BotFather](https://t.me/BotFather) - Create/manage Telegram bots

---

## 🚀 Next Steps

1. ✅ Configure bot with @BotFather
2. ✅ Test wallet connection in Telegram
3. ✅ Update `twaReturnUrl` if bot name differs
4. ✅ Deploy to production
5. ✅ Monitor wallet connections and user feedback

Your app now has **best-in-class Telegram wallet integration**! 🎉
