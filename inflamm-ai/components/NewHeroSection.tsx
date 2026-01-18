'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, MessageCircle, TrendingUp, Edit3 } from 'react-feather'

const NewHeroSection = () => {
  return (
    <section className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center bg-beige px-6 pt-24 py-20 relative overflow-hidden z-20">
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
          {/* Neutral mouth */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-8 h-1 border-b-3 border-gray-700 rounded-full" />
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
          x: { duration: 1.2, ease: "easeOut" },
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 1.2, ease: "easeOut" },
          y: { duration: 1.2, ease: "easeOut", delay: 0.2 }
        }}
      >
        <div className="relative w-full h-full">
          {/* Circle body */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg" />
          {/* Wide curious eyes */}
          <div className="absolute top-1/3 left-1/4 w-4 h-2 bg-white rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-4 h-2 bg-white rounded-full" />
          {/* Small 'o' mouth */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-8 h-1 border-b-3 border-gray-700 rounded-full" />
        </div>
      </motion.div>

      {/* Emoji 4 (Bottom Right) */}
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300 rounded-full opacity-70"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Eyes */}
        <div className="absolute top-4 left-6 w-3 h-3 bg-black rounded-full opacity-80" />
        <div className="absolute top-4 right-6 w-3 h-3 bg-black rounded-full opacity-80" />
        
        {/* Mouth */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black rounded-full" />

        {/* Feet */}
        <div className="absolute bottom-2 left-2 w-5 h-2 bg-black rounded-full" />
        <div className="absolute bottom-2 right-2 w-5 h-2 bg-black rounded-full" />

        {/* Blush */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-pink-200 rounded-full opacity-60" />
      </motion.div>

      <div className="max-w-5xl mx-auto text-center z-10 relative">
        {/* Main Title */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-dark-gray mb-6 leading-tight"
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

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-gray mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Experience the future of personal health management with our integrated platform featuring 
          real-time vitals monitoring, AI-powered health chat, scientific insights, and wellness education.
        </motion.p>

        {/* Feature Pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {[
            { icon: Activity, label: "Vitalsync", color: "bg-blue-100 text-blue-600" },
            { icon: MessageCircle, label: "AI Health Chat", color: "bg-green-100 text-green-600" },
            { icon: TrendingUp, label: "SciCast Insights", color: "bg-purple-100 text-purple-600" },
            { icon: Edit3, label: "Wellness Blog", color: "bg-orange-100 text-orange-600" }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${feature.color} font-medium`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <feature.icon size={16} />
              <span>{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <motion.a
            href="https://www.inflammai.com/inflamm-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Launch App
          </motion.a>
          <motion.a
            href="#waitlist"
            className="px-8 py-4 bg-dark-gray text-white rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all duration-200"
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

export default NewHeroSection
