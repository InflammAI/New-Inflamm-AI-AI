'use client'

import React from 'react'
import { motion } from 'framer-motion'

const FeaturesSection = () => {
  const features = [
   {
  title: "🔒 Trustless and Self-Custodial",
  description: "Self-custodied data, verifiable and user-governed",
  bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
  icon: (
    <div className="relative w-full h-40 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-4xl">🔐</div>
        <div className="text-2xl">🔑</div>
      </div>
    </div>
  )
},
{
  title: "⚕️ AI-Optimized Health Record",
  description: "Optimized for Smart Health Applications",
  bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
  icon: (
    <div className="relative w-full h-40 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <div className="text-5xl">📊</div>
        <div className="text-4xl">🧠</div>
      </div>
    </div>
  )
},
{
  title: "💰 Earn From Your Data",
  description: "Turn your health data into value for you",
  bgColor: "bg-gradient-to-br from-amber-600 to-amber-700",
  icon: (
    <div className="relative w-full h-40 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <div className="text-5xl">📈</div>
        <div className="text-4xl">💎</div>
      </div>
    </div>
  )
},
{
  title: "🛡️ Privacy & Compliance",
  description: "Circular Data Certification Security And Privacy Protection",
  bgColor: "bg-gradient-to-br from-green-500 to-green-600",
  icon: (
    <div className="relative w-full h-40 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <div className="text-5xl">🔒</div>
        <div className="text-4xl">✅</div>
      </div>
    </div>
  )
},
    {
      title: "🤖 Agent-To-Agent Payment",
      description: "Secure, instant transactions between AI agents",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-500",
      icon: (
        <div className="relative w-full h-40 flex items-center justify-center">
          <div className="relative flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center text-3xl">
              🤖
              <div className="absolute -top-2 -right-2 bg-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ➡️
              </div>
            </div>
            <div className="w-20 h-2 bg-yellow-200 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-yellow-300 to-yellow-400 animate-pulse" />
            </div>
            <div className="w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center text-3xl">
              🤖
              <div className="absolute -top-2 -left-2 bg-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ✅
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-beige px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
            Key Features
          </h2>
          <p className="text-muted-gray max-w-2xl mx-auto">
            Discover the powerful features that make Inflamm AI unique
          </p>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide horizontal-scroll">
            <div className="flex gap-6">
              {features.map((feature, featureIndex) => (
                <motion.div
                  key={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`${feature.bgColor} rounded-3xl p-8 shadow-xl relative overflow-hidden min-w-[300px] max-w-[350px] flex-shrink-0`}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Icon/Illustration */}
                  {feature.icon}

                  {/* Text Content */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-800 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Scroll hint for mobile */}
          <div className="text-center mt-2 text-sm text-muted-gray lg:hidden">
            ← Scroll to explore features →
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection