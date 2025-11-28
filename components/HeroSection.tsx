'use client'

import React from 'react'
import { motion } from 'framer-motion'

const NotificationBanner = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white relative z-50 mb-8 rounded-2xl shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* PULSE Badge */}
            <div className="bg-[#FFF9F3] text-orange-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
              PULSE NFT
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="font-bold text-lg">
                  🚀 Pulze Genesis Collection Mint Coming Soon!
                </div>
                
                <div className="text-sm text-orange-100 space-y-1 mt-1 sm:mt-0">
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
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFB74D] via-[#FF9800] to-[#FFB74D] animate-pulse" />
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="w-full min-h-[calc(100vh-88px)] flex items-center justify-center bg-beige px-6 py-20 relative overflow-hidden">
      {/* Animated Characters */}
      
      {/* Character 1 - Top Left (Calm/Trustless) */}
      <motion.div 
        className="absolute top-32 left-20 w-32 h-32 md:w-40 md:h-40"
        initial={{ x: -100, opacity: 0, rotate: -20 }}
        animate={{ 
          x: 0, 
          opacity: 1, 
          rotate: 0,
          y: [0, -15, 0]
        }}
        transition={{ 
          x: { duration: 1, ease: "easeOut" },
          opacity: { duration: 1, ease: "easeOut" },
          rotate: { duration: 1, ease: "easeOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-full h-full">
          {/* Circle body */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg" />
          {/* Calm eyes */}
          <div className="absolute top-1/3 left-1/4 w-4 h-2 bg-gray-700 rounded-full transform -rotate-12" />
          <div className="absolute top-1/3 right-1/4 w-4 h-2 bg-gray-700 rounded-full transform rotate-12" />
          {/* Smile */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-3 border-gray-700 rounded-full" style={{ borderBottomWidth: '3px' }} />
        </div>
      </motion.div>

      {/* Character 2 - Top Right (Curious/Memory) */}
      <motion.div 
        className="absolute top-40 right-24 w-28 h-28 md:w-36 md:h-36"
        initial={{ x: 100, opacity: 0, scale: 0.5 }}
        animate={{ 
          x: 0, 
          opacity: 1, 
          scale: 1,
          y: [0, -20, 0]
        }}
        transition={{ 
          x: { duration: 1.2, ease: "easeOut", delay: 0.2 },
          opacity: { duration: 1.2, ease: "easeOut", delay: 0.2 },
          scale: { duration: 1.2, ease: "easeOut", delay: 0.2 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
      >
        <div className="relative w-full h-full">
          {/* Circle body */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-lg" />
          {/* Wide curious eyes */}
          <div className="absolute top-1/3 left-1/4 w-5 h-5 bg-white rounded-full">
            <div className="absolute top-1 left-1 w-3 h-3 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-white rounded-full">
            <div className="absolute top-1 right-1 w-3 h-3 bg-gray-800 rounded-full" />
          </div>
          {/* Surprised mouth */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-4 h-5 bg-gray-700 rounded-full" />
        </div>
      </motion.div>

      {/* Character 3 - Bottom Left (Happy/Health) */}
      <motion.div 
        className="absolute bottom-32 left-32 w-36 h-36 md:w-44 md:h-44"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          x: [0, 10, 0]
        }}
        transition={{ 
          y: { duration: 1.3, ease: "easeOut", delay: 0.4 },
          opacity: { duration: 1.3, ease: "easeOut", delay: 0.4 },
          x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
      >
        <div className="relative w-full h-full">
          {/* Circle body */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-lg" />
          {/* Arms */}
          <div className="absolute top-1/2 -left-4 w-16 h-4 bg-yellow-600 rounded-full transform -rotate-12 origin-right" />
          <div className="absolute top-1/2 -right-4 w-16 h-4 bg-yellow-600 rounded-full transform rotate-12 origin-left" />
          {/* Happy eyes */}
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-gray-700 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-700 rounded-full" />
          {/* Big smile */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-12 h-6 border-b-3 border-gray-700 rounded-full" style={{ borderBottomWidth: '3px' }} />
          {/* Legs */}
          <div className="absolute -bottom-2 left-1/3 w-3 h-8 bg-gray-700 rounded-full" />
          <div className="absolute -bottom-2 right-1/3 w-3 h-8 bg-gray-700 rounded-full" />
        </div>
      </motion.div>

      {/* Character 4 - Bottom Right (Thinking/Boundless) */}
      <motion.div 
        className="absolute bottom-40 right-28 w-24 h-24 md:w-32 md:h-32"
        initial={{ scale: 0, opacity: 0, rotate: 180 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          rotate: 0,
          y: [0, -10, 0]
        }}
        transition={{ 
          scale: { duration: 1.1, ease: "easeOut", delay: 0.6 },
          opacity: { duration: 1.1, ease: "easeOut", delay: 0.6 },
          rotate: { duration: 1.1, ease: "easeOut", delay: 0.6 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
        }}
      >
        <div className="relative w-full h-full">
          {/* Circle body */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-lg" />
          {/* Thoughtful eyes */}
          <div className="absolute top-1/3 left-1/4 w-2 h-4 bg-gray-700 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-2 h-4 bg-gray-700 rounded-full" />
          {/* Neutral mouth */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-700 rounded-full" />
        </div>
      </motion.div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <NotificationBanner />
        
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-dark-gray leading-[0.9] mb-6 md:mb-8 tracking-tight px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Trustless Health,<br />
          Boundless Memory
        </motion.h1>

        <motion.p 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-gray max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed font-light px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Every heartbeat, every neuron, creates value. In our system, that value belongs only to you. Encrypted Health. Infinite Recall.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <motion.a 
            href="https://www.inflammai.com/inflamm-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none inline-block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Launch App {/* Updated to www.inflammai.com */}
          </motion.a>
          <motion.a 
            href="https://t.me/InflammAI"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border-2 border-dark-gray text-dark-gray px-8 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl font-semibold hover:bg-dark-gray hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none inline-block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Community
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
