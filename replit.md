# Overview

Inflamm AI is a decentralized health data platform leveraging blockchain technology (Solana) to empower users with ownership, control, and monetization of their health data. It integrates health tracking, AI-powered insights, and a gamified points system (VyTap) to reward healthy habits while ensuring data sovereignty. The platform aims to combine health and wellness with blockchain incentives to create a new paradigm for personal health management.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Updates

## Proof-Derived Address Security (November 18, 2025)
- **CRITICAL SECURITY FIX**: Eliminated address spoofing vulnerability by using ONLY proof-derived wallet addresses
- **Proof-first validation**: Wallet type determined from proof structure (tonProof vs signature+message), not address format
- **Address authenticity**: All database operations use `verifyResult.walletAddress` from cryptographic proof, never client claims
- **TON security**: Address extracted from verified tonProof and compared against client claim before use
- **Solana security**: Signature verification proves ownership of claimed address before use
- **Attack prevention**: Impossible to bind or tap with addresses you don't cryptographically control
- **Endpoints secured**: Both `/api/vytap/tap` and `/api/wallet/binding` use verified addresses exclusively
- **Production-ready**: All address spoofing vectors eliminated, passes comprehensive security audit

## Single Wallet Connection Enforcement (November 17, 2025)
- **Permanent wallet binding**: Telegram users can only connect one wallet (TON or Solana) per account - connection is permanent
- **Security**: Telegram initData HMAC validation prevents impersonation and binding bypass attacks
- **Database**: New `telegram_wallet_bindings` table tracks wallet-to-Telegram-user mappings
- **Race condition protection**: Transaction-based locking prevents concurrent binding conflicts
- **UI enforcement**: Disconnect button and wallet toggle hidden after binding, with clear messaging
- **Backend validation**: All wallet operations verify binding status server-side

## TON Wallet Integration Fixes
- **WalletGate dual wallet support**: Updated to recognize both TON and Solana wallet connections
- **Return URL fix**: TonConnect now returns users to `/inflamm-ai` (VyTap) after wallet connection
- **CSP configuration**: Added TonConnect endpoints (config.ton.org, bridge.tonapi.io, etc.) to Content Security Policy
- **Working flow**: Connect TON wallet → Automatically opens VyTap tapping game

## Wallet Connection Auto-Reset
- **Auto-reset on refresh**: Wallet connection automatically clears on every app load for a fresh start
- **No stuck connections**: Prevents "waiting to connect" issues on Telegram/mobile/desktop
- **Silent operation**: No warning messages for any users - clean, simple experience
- **Platform support**: Works seamlessly on iOS, Android, Desktop, and Telegram Mini App

## Mobile Feature Gating
- **Locked sections on mobile**: Vitals, Chat, and SciCast locked on mobile (< 1024px width)
- **Active on mobile**: VyTap and Blog fully functional
- **Lock indicators**: Lock icon, "Soon" badge, grayed out (50% opacity), disabled state
- **Desktop access**: All sections available on desktop with "Coming Soon" badges

## Wallet Connection Strategy

### Telegram Mini App Users
- **Dual wallet support**: Can connect either TON wallet or Solana wallet
- **TON wallet default**: Automatically selects TON wallet option for Telegram users
- **Wallet toggle**: Switch between TON and Solana wallets via toggle in header
- **TonConnect integration**: Full support for TON wallets via TonConnect protocol
- **Supported TON wallets**:
  - **Wallet in Telegram** (Wallet.tg / TON Space) - Built-in Telegram wallet with deepLink support
  - **Tonkeeper** - Popular mobile and browser extension wallet
  - **MyTonWallet** - Multi-platform wallet with browser extension
- **Wallet required**: Must connect a wallet to access features

### Webapp Users (app.inflammai.com)
- **Solana wallet only**: Must connect Phantom, Solflare, Torus, or Coinbase wallet
- **Gated access**: Features locked until wallet connection
- **Wallet UI**: Connection status shown in top-right header

### Backend TON Proof Verification (Production-Ready)
- **TON Connect protocol**: Implements official ton-proof-item-v2 specification
- **Security features**: 
  - Address verification from state_init (prevents impersonation)
  - Database-backed replay protection with fail-closed behavior
  - Multi-workchain support
  - Public key extraction from state_init
  - Domain and timestamp validation (5-minute window)
- **Dual blockchain support**: Handles both Solana (TweetNaCl) and TON (@ton/crypto) signatures
- **Database**: Extended schema supports TON addresses (VARCHAR(48), wallet_type column, ton_proof_nonces table)

# System Architecture

## Frontend Architecture

**Framework**: Next.js 16 with React 19, utilizing the App Router for file-based routing and supporting SSR/SSG.
**UI Components**: Primarily uses Material-UI (@mui/material) for core components, enhanced with Framer Motion for animations. Custom components are organized modularly.
**Styling**: Tailwind CSS for utility-first styling, complemented by custom CSS modules and design tokens for consistent theming (beige/orange color scheme with gradients).
**State Management**: Relies on React Context API with dedicated providers for Web3 interactions, health data, and AI chat functionality.
**Module Structure**: Features are organized into distinct modules like VyTap, VitalSync, Chat, SciCast, and Blog, promoting a modular and maintainable codebase.

## Backend Architecture

**API Structure**: Serverless functions built with Next.js API routes, following RESTful design principles.
**Authentication**: Solana wallet-based authentication using signature verification (TweetNaCl for cryptographic operations, bs58 for encoding). A session-based approach caches signatures locally, and auth middleware validates signatures on protected routes.
**Key API Endpoints**: Includes endpoints for VyTap actions (`/api/vytap/tap`), leaderboard retrieval (`/api/vytap/leaderboard`), and user balance checks (`/api/vytap/balance`).

## Data Storage

**Database**: PostgreSQL, deployed on Supabase for production.
**Database Access**: Handled via a custom `lib/db.ts` module, employing connection pooling and prepared statements to ensure security and efficiency.
**Schema**: Includes tables for `users` (wallet addresses, points) and `tap_history`, with appropriate indexing for optimized queries.

# External Dependencies

**Blockchain Integration**:
- Solana Web3.js (`@solana/web3.js`) for core blockchain interactions.
- Solana Wallet Adapter ecosystem (`@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`) for multi-wallet support (Phantom, Solflare, Torus, Coinbase).
- TweetNaCl (`tweetnacl`) for cryptographic signature verification.
- bs58 for Base58 encoding/decoding of Solana addresses.

**UI Libraries**:
- @mui/material and related packages for Material Design components.
- react-feather for consistent iconography.
- @emotion/react and @emotion/styled for CSS-in-JS.

**Animation**:
- framer-motion for declarative UI animations.
- three.js for 3D graphics (e.g., ParticleBackground component).

**Database Driver**:
- pg for PostgreSQL connectivity.

**Deployment & Environment**:
- Replit for development and hosting, configured to run Next.js on port 5000 (0.0.0.0).
- PostgreSQL database connection managed via `DATABASE_URL` environment variable.

**API Communication**:
- Native Fetch API for HTTP requests.