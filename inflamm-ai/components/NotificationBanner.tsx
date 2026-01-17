'use client'

import React from 'react'

const NotificationBanner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4 flex-1">
            {/* PULSE Badge */}
            <div className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              PULSE NFT
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="font-bold text-lg">
                  🚀 Pulze Genesis Collection Mint Coming Soon!
                </div>
                
                <div className="text-sm text-purple-100 space-y-1 mt-1 sm:mt-0">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded">5555 Total Supply</span>
                    <span className="bg-white/20 px-2 py-1 rounded">99999 Vital Points</span>
                    <span className="bg-white/20 px-2 py-1 rounded">1 Month Free AI Agent</span>
                    <span className="bg-white/20 px-2 py-1 rounded">5% $INFL Token Supply</span>
                  </div>
                  <div className="text-xs">
                    ✨ No Whitelist • No Gatekeepers • 100% Public Mint
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="ml-4">
            <button
              className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-yellow-400 animate-pulse" />
    </div>
  )
}

export default NotificationBanner
