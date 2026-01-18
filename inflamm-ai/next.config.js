/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Allow dev origins for Replit iframe environment
  allowedDevOrigins: [
    '*.replit.dev', 
    '*.repl.co',
    '*.kirk.replit.dev'
  ],
  // Fix workspace root detection
  outputFileTracingRoot: __dirname,
  // CORS and CSP headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Content Security Policy for Solana Wallet Adapter and TON Connect
    const cspHeader = `
      default-src 'self';
      script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://telegram.org;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https:;
      font-src 'self' data: https://fonts.gstatic.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self' https://*.replit.dev https://*.repl.co https://*.kirk.replit.dev;
      connect-src 'self' https://api.mainnet-beta.solana.com https://api.devnet.solana.com https://api.testnet.solana.com https://telegram.org https://config.ton.org https://bridge.tonapi.io https://tonconnectbridge.mytonwallet.org https://connect.mytonwallet.org https://tonkeeper.com https://wallet.tg https://t.me;
    `.replace(/\s{2,}/g, ' ').trim();
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
    };
    return config;
  },
  // Add empty turbopack config to silence warning
  turbopack: {}
}

module.exports = nextConfig;
