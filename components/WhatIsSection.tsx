'use client'

import React from 'react'
import { motion } from 'framer-motion'

const WhatIsSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-white px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Subtitle with Curve */}
        <motion.div 
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <svg viewBox="0 0 800 100" className="w-full max-w-4xl mx-auto" style={{ height: 'auto' }}>
            <defs>
              <path
                id="curve"
                d="M 50 80 Q 400 20 750 80"
                fill="transparent"
              />
            </defs>
            <text className="text-lg md:text-xl lg:text-2xl font-medium fill-current" style={{ fill: '#D84315', fontSize: '20px' }}>
              <textPath href="#curve" startOffset="50%" textAnchor="middle" className="tracking-wide">
                Secure, self-sovereign memory for intelligent health
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Main Heading */}
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark-gray mb-8 md:mb-12 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          What Makes Inflamm AI Trustless
        </motion.h2>

        {/* Description */}
        <motion.p 
          className="text-base md:text-lg lg:text-xl text-muted-gray leading-relaxed max-w-4xl mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          We're building the trustless layer where your health lives with you. A programmable health infrastructure built on blockchain and AI. Secure, interoperable, and user-owned.
        </motion.p>
      </div>
    </section>
  )
}

export default WhatIsSection
