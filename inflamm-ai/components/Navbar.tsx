'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-beige/95 backdrop-blur-sm shadow-sm' : 'bg-beige'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 relative">
            <Image src="/logo.png" alt="Inflamm AI" width={48} height={48} priority />
          </div>
          <span className="text-xl font-bold text-dark-gray">Inflamm AI</span>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <motion.a 
            href="/health-tracker"
            className="text-dark-gray font-medium hover:text-muted-gray transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Health Tracker
          </motion.a>
          <motion.a 
            href="/wearable"
            className="text-dark-gray font-medium hover:text-muted-gray transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Wearable Sync
          </motion.a>
          <motion.a 
            href="/vytal-sync"
            className="text-dark-gray font-medium hover:text-muted-gray transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Vytal Sync
          </motion.a>
          <motion.a 
            href="https://www.inflammai.com/inflamm-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            App
          </motion.a>
          <motion.a 
            href="https://t.me/InflammAI" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-gray font-medium hover:text-muted-gray transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Community
          </motion.a>
          <motion.a 
            href="https://medium.com/@InflammAI/inflammation-the-underdog-killer-disease-d3f27a12aa48" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-gray font-medium hover:text-muted-gray transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Blog
          </motion.a>
          <motion.a 
            href="/Whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dark-gray text-white px-6 py-2.5 rounded-full font-medium hover:bg-opacity-90 transition-all duration-200 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Read the Whitepaper
          </motion.a>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2">
          <svg className="w-6 h-6 text-dark-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.header>
  )
}

export default Navbar

