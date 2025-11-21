'use client'

import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="w-full relative">
      {/* Curved Top Wave */}
      <div className="w-full overflow-hidden">
        <svg 
          className="w-full h-auto" 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 0 L0 80 Q360 20 720 80 T1440 80 L1440 0 Z" 
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#78350f', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#92400e', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gradient-to-br from-amber-900 to-amber-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="Inflamm AI" width={40} height={40} />
              </div>
              <h3 className="text-2xl font-bold">Inflamm AI</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Inflamm AI unlocks trustless ownership of health memory in an intelligent world
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a 
                href="https://t.me/InflammAI" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.094.036.308.02.475z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/InflamAI" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Farcaster"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 3h-17A1.5 1.5 0 002 4.5v15A1.5 1.5 0 003.5 21h17a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0020.5 3zM8 17.5v-6h2v6H8zm4 0v-11h2v11h-2zm4 0v-8h2v8h-2z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Discord"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h4 className="text-lg font-bold mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://app.inflammai.com/inflamm-ai" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  Launch App
                </a>
              </li>
              <li>
                <a href="https://t.me/InflammAI" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="https://medium.com/@InflammAI/inflammation-the-underdog-killer-disease-d3f27a12aa48" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/Whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>
        </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gradient-to-br from-amber-900 to-amber-800 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2025 Inflamm AI. All rights reserved
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
