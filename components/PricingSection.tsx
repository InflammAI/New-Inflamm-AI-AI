'use client'

import React from 'react'
import { motion } from 'framer-motion'

const PricingSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-orange-50 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get a tailored predictive health agent for your vitals
        </motion.h2>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              POPULAR
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$9<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-gray-600">Perfect for individuals starting their health journey</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-5 h-5 bg-green-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Encrypted vitals tracking</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-green-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Predictive AI insights</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-green-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Daily Health Boost</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-green-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Weekly health summaries</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-green-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Data export</span>
              </li>
            </ul>
            
            <motion.a 
              href="https://www.inflammai.com/inflamm-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.a>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-8 shadow-xl relative overflow-hidden text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Best Value Badge */}
            <div className="absolute top-4 right-4 bg-white text-orange-500 text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">$29<span className="text-lg font-normal opacity-90">/month</span></div>
              <p className="opacity-90">Advanced predictive health analytics</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-5 h-5 bg-white rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span>Everything in Basic</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-white rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span>Access to micro-transaction features</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-white rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span>Ability to create predictive science hypotheses</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-white rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span>Real-time vitals monitoring</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-white rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span>Personalized health recommendations</span>
              </li>
            </ul>
            
            <motion.a 
              href="https://www.inflammai.com/inflamm-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-orange-500 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors text-center block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Premium Trial
            </motion.a>
          </motion.div>

          {/* Pro / Family Plan */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro / Family Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$49<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-gray-600">Perfect for families and power users</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-5 h-5 bg-purple-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Everything in Premium</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-purple-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Shared access for multiple users (family or group accounts)</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-purple-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Centralized dashboard to monitor all linked profiles</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-purple-400 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700">Priority support and extended analytics</span>
              </li>
            </ul>
            
            <motion.a 
              href="https://www.inflammai.com/inflamm-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.a>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600 mb-8">Trusted by leading healthcare providers and wellness programs</p>
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">HIPAA Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
