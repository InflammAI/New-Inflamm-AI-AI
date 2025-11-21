import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { ErrorSuppressor } from './components/ErrorSuppressor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inflamm AI - Trustless Health, Boundless Memory',
  description: 'Every heartbeat, every neuron, creates value. In our system, that value belongs only to you.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  )
}
