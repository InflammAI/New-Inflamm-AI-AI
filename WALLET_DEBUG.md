# Wallet Connection Debug Guide

## Current Status
✅ Wallet components properly configured
✅ Solana wallet provider initialized
✅ Wallet modal z-index set to 99999
✅ WalletButton rendering correctly
✅ WalletGate showing connection prompt

## Known Replit Environment Issue

**CRITICAL**: Wallet extensions (Phantom, Solflare) **DO NOT work** in Replit's iframe preview. This is a **browser security limitation**, not a bug in the code.

### Why Wallets Don't Work in Iframe:
1. Browser extensions cannot inject into cross-origin iframes
2. Replit preview runs in `https://*.replit.dev` iframe
3. Wallet extensions can only access the parent domain

## Testing Instructions

### ✅ CORRECT Way to Test:
1. Click the **"Open in new tab"** button in Replit webview
2. Or copy the URL and paste in new browser tab
3. Click "Select Wallet" button
4. Wallet modal should appear
5. Select your wallet (Phantom, Solflare, etc.)
6. Approve connection
7. Start using the app

### ❌ WRONG Way to Test:
- Trying to connect wallet inside Replit's iframe preview
- This will NEVER work due to browser security

## Debug Checklist

### 1. Check Wallet Modal Appears
- [ ] Click "Select Wallet" button
- [ ] Modal with wallet list appears
- [ ] Can see Phantom, Solflare, Torus options

### 2. Check Wallet Extension Installed
- [ ] Phantom extension installed in browser
- [ ] Extension shows up in browser toolbar
- [ ] Extension is enabled

### 3. Check Console Logs
Open browser DevTools (F12) and check for:
```
Wallet state changed: {connected: false, connecting: false, wallet: undefined, publicKey: undefined}
Opening wallet modal...
```

### 4. Test Wallet Connection
After modal opens:
- [ ] Click on Phantom (or other wallet)
- [ ] Wallet popup appears asking for approval
- [ ] Click "Connect"
- [ ] Address appears in top-right instead of "Select Wallet"

### 5. Test VyTap Feature
After wallet connected:
- [ ] No more "Wallet Connection Required" screen
- [ ] Can see the TAP button
- [ ] Click TAP button
- [ ] Wallet asks to sign message (only first time)
- [ ] Points increase after tapping

## Common Issues

### Issue: Modal doesn't appear
**Solution**: Check z-index in browser DevTools
```css
.wallet-adapter-modal-wrapper {
  z-index: 99999 !important;
}
```

### Issue: "No wallet found"
**Solution**: 
1. Install Phantom wallet extension
2. Reload page after installing
3. Make sure testing in NEW TAB, not iframe

### Issue: Wallet connects but immediately disconnects
**Solution**: Clear localStorage and try again
```javascript
localStorage.clear();
location.reload();
```

### Issue: "Signature cancelled"
**Solution**: Click "Approve" in wallet popup, don't reject

## Technical Details

### Wallet Provider Configuration
```typescript
// Mainnet-beta endpoint
network = 'mainnet-beta'
endpoint = clusterApiUrl(network)

// Supported wallets
- PhantomWalletAdapter
- SolflareWalletAdapter  
- TorusWalletAdapter

// Auto-connect disabled (user must click button)
autoConnect = false
```

### Session Signature System
- First tap: Requires wallet signature
- Subsequent taps: Uses cached session signature
- No need to sign every tap
- Signature valid until wallet disconnects

## Expected Behavior

### In Replit Iframe (Current View):
❌ Wallet connection will NOT work
✅ Everything else works (UI, buttons, navigation)

### In New Browser Tab:
✅ Full wallet functionality
✅ Can connect Phantom/Solflare
✅ Can earn VyTap points
✅ Points sync with database
✅ Leaderboard shows rankings

## Next Steps

1. **Open app in new tab** (click "Open in new tab" icon)
2. **Install Phantom wallet** if not installed
3. **Click "Select Wallet"** button
4. **Choose Phantom** from modal
5. **Approve connection** in wallet popup
6. **Start tapping** to earn points!

---

**Bottom Line**: The wallet code is working correctly. The issue is the Replit iframe environment. Testing MUST be done in a new browser tab for wallet extensions to work.
