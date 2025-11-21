'use client'

import React from 'react'
import { motion } from 'framer-motion'

const CoreFeaturesSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Core Features
        </motion.h2>

        {/* Feature Cards Grid - Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* On-Chain Data Rewards Card */}
          <motion.div 
            className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Illustration */}
            <div className="relative mb-8 h-48 flex items-center justify-center">
              {/* White cards stack */}
              <div className="relative">
                {/* Back card */}
                <div className="absolute top-0 left-4 w-64 h-20 bg-white rounded-2xl shadow-lg transform rotate-2" />
                {/* Middle card */}
                <div className="absolute top-4 left-2 w-64 h-20 bg-white rounded-2xl shadow-lg transform -rotate-1" />
                {/* Front card */}
                <div className="relative w-64 h-20 bg-white rounded-2xl shadow-xl flex items-center px-4 gap-3">
                  <div className="w-10 h-10 bg-pink-400 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>

              {/* Floating icons */}
              <div className="absolute top-2 left-8 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">₿</span>
              </div>
              <div className="absolute top-0 left-24 w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⚡</span>
              </div>
              <div className="absolute top-8 left-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">€</span>
              </div>
              <div className="absolute bottom-4 right-8 w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="absolute top-12 left-32 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">😊</span>
              </div>
              <div className="absolute top-16 left-56 w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🔒</span>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                On-Chain Data Rewards
              </h3>
              <p className="text-base md:text-lg text-gray-800 font-medium">
                Power health innovation with your anonymized data and share in the value
              </p>
            </div>
          </motion.div>

          {/* Plug-and-Play API Card */}
          <motion.div 
            className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Illustration */}
            <div className="relative mb-8 h-48 flex items-center justify-center">
              {/* Code/API blocks */}
              <div className="relative">
                {/* Main code block */}
                <div className="w-40 h-32 bg-yellow-400 rounded-2xl shadow-xl relative overflow-hidden">
                  {/* Code lines */}
                  <div className="absolute top-4 left-4 right-4 space-y-2">
                    <div className="h-2 bg-purple-500 rounded w-3/4" />
                    <div className="h-2 bg-purple-500 rounded w-full" />
                    <div className="h-2 bg-purple-500 rounded w-2/3" />
                    <div className="h-2 bg-purple-500 rounded w-5/6" />
                  </div>
                  {/* Brackets */}
                  <div className="absolute top-2 left-2 text-purple-600 text-2xl font-bold">{'{'}</div>
                  <div className="absolute bottom-2 right-2 text-purple-600 text-2xl font-bold">{'}'}</div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 left-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-purple-500 text-2xl font-bold">{'<>'}</span>
              </div>
              <div className="absolute top-8 right-8 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-purple-500 text-3xl">✦</span>
              </div>
              <div className="absolute bottom-8 left-12 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-1 p-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-sm" />
                  <div className="w-2 h-2 bg-purple-500 rounded-sm" />
                  <div className="w-2 h-2 bg-purple-500 rounded-sm" />
                  <div className="w-2 h-2 bg-purple-500 rounded-sm" />
                </div>
              </div>
              <div className="absolute bottom-12 right-12 w-10 h-10 bg-yellow-300 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl font-bold">⚡</span>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Plug-and-Play API
              </h3>
              <p className="text-base md:text-lg text-white font-medium">
                For developers building trustless health intelligence
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid - Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Secure & Interoperable Card */}
          <motion.div 
            className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Illustration */}
            <div className="relative mb-8 h-48 flex items-center justify-center">
              {/* Document with lock */}
              <div className="relative">
                {/* Yellow document */}
                <div className="w-40 h-48 bg-yellow-400 rounded-2xl shadow-xl relative overflow-hidden">
                  {/* Document lines */}
                  <div className="absolute top-6 left-4 right-4 space-y-2">
                    <div className="h-2 bg-orange-400 rounded w-3/4" />
                    <div className="h-2 bg-orange-400 rounded w-full" />
                    <div className="h-2 bg-orange-400 rounded w-2/3" />
                  </div>
                  {/* Lock badge */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="relative">
                      <div className="w-6 h-7 border-3 border-gray-800 rounded-lg" style={{ borderWidth: '3px' }} />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 border-3 border-gray-800 rounded-t-full" style={{ borderWidth: '3px', borderBottom: 'none' }} />
                    </div>
                  </div>
                </div>
                {/* Floating squares */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded" />
                <div className="absolute top-8 -right-4 w-4 h-4 bg-yellow-300 rounded" />
                <div className="absolute top-16 -right-2 w-5 h-5 bg-green-300 rounded" />
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-orange-300 rounded" />
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Compliant & Connected
              </h3>
              <p className="text-base md:text-lg text-white font-medium">
                Circular Data Compliance Architecture
              </p>
            </div>
          </motion.div>

          {/* Personal Health Twin Card */}
          <motion.div 
            className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Illustration */}
            <div className="relative mb-8 h-48 flex items-center justify-center">
              {/* Pills and health items */}
              <div className="relative">
                {/* Large pill */}
                <div className="w-32 h-16 bg-white rounded-full shadow-lg relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-yellow-300" />
                </div>
                {/* Small pill */}
                <div className="absolute -top-4 right-8 w-20 h-10 bg-yellow-300 rounded-full shadow-lg" />
              </div>

              {/* Floating icons */}
              <div className="absolute top-2 left-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-purple-400 text-xl">✦</span>
              </div>
              <div className="absolute bottom-8 left-4 w-12 h-12 bg-green-400 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-white text-xl">🥗</span>
              </div>
              <div className="absolute bottom-4 right-12 w-14 h-14 bg-yellow-300 rounded-full shadow-lg relative">
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 rounded-full" />
                <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-gray-800 rounded-full" />
              </div>
              <div className="absolute top-12 right-16 w-16 h-12 bg-white rounded-2xl shadow-lg flex items-center px-2 gap-1">
                <div className="flex-1 h-1 bg-orange-400 rounded" />
                <div className="flex-1 h-1 bg-orange-400 rounded" />
                <div className="flex-1 h-1 bg-orange-400 rounded" />
              </div>
              <div className="absolute top-8 left-16 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-red-400 text-xl">❤️</span>
              </div>
              {/* Star */}
              <div className="absolute bottom-16 left-8 text-yellow-200 text-2xl">⭐</div>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                AI Health Replica
              </h3>
              <p className="text-base md:text-lg text-white font-medium">
                Collect and structure your lifelong health record, interoperable and intelligent
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CoreFeaturesSection
