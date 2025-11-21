'use client'

import React from 'react'
import { motion } from 'framer-motion'

const CTASection = () => {
  return (
    <section className="w-full relative overflow-hidden bg-white">
      {/* Curved Orange Background */}
      <div className="relative">
        <svg 
          className="w-full h-auto" 
          viewBox="0 0 1440 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 0 L1440 0 L1440 450 Q1440 480 1410 480 L30 480 Q0 480 0 450 Z" 
            fill="url(#orangeGradient)"
          />
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FF9800', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FF6F00', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-center px-6 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Main Heading */}
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Deploy, Earn, Or Align —<br />
              Step Into The Decentralized Health Frontier
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed opacity-95"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We're creating the open infrastructure for self-owned health data. Secure, interoperable, and intelligence-ready. Powered by blockchain, enhanced by AI, and governed by you.
            </motion.p>

            {/* CTA Button */}
            <motion.a 
              href="https://forms.gle/jHaGvRq4xDpbxWEb8"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-500 px-8 md:px-12 py-3 md:py-4 rounded-full text-lg md:text-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Now
            </motion.a>

            {/* Animated Characters */}
            {/* Left Character */}
            <motion.div 
              className="absolute -left-4 sm:left-8 md:left-16 bottom-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-yellow-300 rounded-full shadow-xl hidden sm:flex items-center justify-center"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              animate={{ y: [0, -10, 0] }}
              style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 rounded-full" />
                <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-gray-800 rounded-full" />
              </div>
            </motion.div>

            {/* Right Character */}
            <motion.div 
              className="absolute -right-4 sm:right-8 md:right-16 bottom-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-400 rounded-full shadow-xl hidden sm:flex items-center justify-center"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              animate={{ y: [0, -15, 0] }}
              style={{ animationDuration: '3.5s', animationIterationCount: 'infinite' }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 rounded-full" />
                <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-gray-800 rounded-full" />
              </div>
            </motion.div>

            {/* Top Right Character */}
            <motion.div 
              className="absolute top-4 right-4 sm:right-12 md:right-20 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-400 rounded-full shadow-xl hidden md:flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-gray-800 rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gray-800 rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
