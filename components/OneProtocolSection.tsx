'use client'

import React from 'react'
import { motion } from 'framer-motion'

const OneProtocolSection = () => {
  const paths = [
    {
      icon: "👤",
      title: "For Web3 Users",
      description: "Not Your Data? Not Your Health. Monetize Your Memory On Your Terms",
      bgColor: "bg-gradient-to-r from-orange-400 to-orange-500"
    },
    {
      icon: "🏥",
      title: "For Healthcare Providers",
      description: "Access structured, patient-owned health data with built-in consent",
      bgColor: "bg-gradient-to-r from-blue-400 to-blue-500"
    },
    {
      icon: "💼",
      title: "For Investors",
      description: "We're building a new data economy powered by health intelligence",
      bgColor: "bg-gradient-to-r from-purple-400 to-purple-500"
    },
    {
      icon: "💻",
      title: "For Developers",
      description: "Build the next generation of health apps on trustless infrastructure",
      bgColor: "bg-gradient-to-r from-green-400 to-green-500"
    }
  ]

  return (
    <section className="w-full py-20 md:py-32 bg-beige px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            One Trustless Layer, Endless Pathways
          </h2>
          <p className="text-lg md:text-xl text-muted-gray max-w-3xl mx-auto">
            Many Agents, One Trustless Health Layer
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="space-y-6">
          {paths.map((path, pathIndex) => (
            <motion.div
              key={`path-${path.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={`${path.bgColor} rounded-3xl p-8 md:p-10 shadow-xl flex items-center gap-6 md:gap-8`}
              initial={{ opacity: 0, x: pathIndex % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: pathIndex * 0.1 }}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl md:text-4xl">{path.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {path.title}
                </h3>
                <p className="text-base md:text-lg text-white font-medium opacity-95">
                  {path.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OneProtocolSection
