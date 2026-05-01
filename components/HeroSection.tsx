'use client'

import React from 'react'
import { motion } from 'framer-motion'

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
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-dark-gray leading-[0.9] mb-6 md:mb-8 tracking-tight px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Your Health,
          <br />
          <span className="text-orange-500">Intelligently</span>
          <br />
          Connected
        </motion.h1>

        <motion.p 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-gray max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed font-light px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Experience the future of personal health management with our integrated platform featuring 
          real-time vitals monitoring, AI-powered health chat, scientific insights, wellness education, and peptide therapy tracking.
        </motion.p>

        {/* Feature Pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">
            <span className="text-sm">●</span>
            <span>Vitalsync</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 font-medium">
            <span className="text-sm">●</span>
            <span>AI Health Chat</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-medium">
            <span className="text-sm">●</span>
            <span>SciCast Insights</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-medium">
            <span className="text-sm">●</span>
            <span>Wellness Blog</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 font-medium">
            <span className="text-sm">●</span>
            <span>PeptideSync</span>
          </div>
        </motion.div>

        {/* All In One App Text */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-gray mb-2">
            All In One
            <span className="text-orange-500"> App</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Watch Visualization */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Watch Device */}
            <motion.div 
              className="w-32 h-40 bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden border-4 border-gray-800"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Watch Screen */}
              <div className="absolute inset-2 bg-black rounded-2xl">
                {/* Heart Rate Display */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-red-500 text-2xl font-bold">72</div>
                  <div className="text-gray-400 text-xs">BPM</div>
                </div>
                
                {/* Heart Rate Line Graph */}
                <motion.div 
                  className="absolute top-12 left-4 right-4 h-8 flex items-center"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-full h-full" viewBox="0 0 100 30">
                    <motion.path
                      d="M0,15 L20,15 L25,5 L30,25 L35,10 L40,15 L60,15 L65,8 L70,22 L75,12 L80,15 L100,15"
                      stroke="#ef4444"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </svg>
                </motion.div>
                
                {/* Connection Status */}
                <motion.div 
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-12 h-6 border-2 border-green-400 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-green-400 text-xs mt-1">Connected</div>
                </motion.div>
              </div>
              
              {/* Watch Crown */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-gray-700 rounded-full"></div>
            </motion.div>
            
            {/* Connection Waves */}
            <motion.div 
              className="absolute inset-0 rounded-3xl border-2 border-blue-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="flex justify-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <motion.a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSdt14MkbLddfebAPUSH5I5jBVSnQz3nSeiv9B7w6Un-2gROKQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border-2 border-dark-gray text-dark-gray px-10 md:px-14 py-4 md:py-5 rounded-full text-xl md:text-2xl font-semibold hover:bg-dark-gray hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto max-w-sm sm:max-w-none inline-block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Waitlist
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
