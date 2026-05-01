'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, MessageCircle, TrendingUp, Edit3, Zap } from 'react-feather'

const FeaturesSection = () => {
  const features = [
    {
      icon: Activity,
      title: "Vitalsync",
      description: "Real-time health monitoring with wearable device integration. Track your vital signs, receive alerts, and maintain a comprehensive health dashboard.",
      features: ["Heart Rate Monitoring", "Sleep Tracking", "Activity Levels", "Health Alerts"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: MessageCircle,
      title: "AI Health Chat",
      description: "Intelligent conversational health assistant powered by advanced AI. Get personalized wellness advice, symptom analysis, health guidance, and micro-transaction support for wellness.",
      features: ["24/7 Health Support", "Symptom Analysis", "Wellness Tips", "Personalized Guidance", "Micro-Transaction"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "SciCast Insights",
      description: "Scientific market predictions and health trend analysis powered by advanced algorithms. Stay ahead with data-driven insights.",
      features: ["Science Hypothesis", "Market Predictions", "Scientific Research", "Data Analytics"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Edit3,
      title: "Wellness Blog",
      description: "Comprehensive wellness education platform with expert articles, health tips, and latest research in personal health management.",
      features: ["Expert Articles", "Health Tips", "Latest Research", "Wellness Education"],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: Zap,
      title: "PeptideSync",
      description: "Advanced peptide therapy tracking and optimization. Monitor your peptide schedule, log symptoms, and see correlations between dosing and how you feel.",
      features: ["Track your peptide schedule", "Log your symptoms over time", "See correlations between dosing and how you feel", "Generate reports for your doctor"],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    }
  ]

  return (
    <section className="w-full py-20 md:py-32 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-gray mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Integrated Health
            <br />
            <span className="text-orange-500">Ecosystem</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Our comprehensive platform combines cutting-edge technology with health science to provide you with 
            tools you need for optimal wellness management.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className={`h-full p-8 rounded-2xl ${feature.bgColor} border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden`}
                whileHover={{ y: -5 }}
              >
                {/* DNA Background for all features */}
                <motion.div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id={`dnaGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ 
                          stopColor: feature.color.includes('blue') ? '#3b82f6' : 
                                   feature.color.includes('green') ? '#10b981' :
                                   feature.color.includes('purple') ? '#8b5cf6' :
                                   feature.color.includes('orange') ? '#f97316' :
                                   '#ef4444', 
                          stopOpacity: 0.8 
                        }} />
                        <stop offset="50%" style={{ 
                          stopColor: feature.color.includes('blue') ? '#2563eb' : 
                                   feature.color.includes('green') ? '#059669' :
                                   feature.color.includes('purple') ? '#7c3aed' :
                                   feature.color.includes('orange') ? '#ea580c' :
                                   '#dc2626', 
                          stopOpacity: 0.6 
                        }} />
                        <stop offset="100%" style={{ 
                          stopColor: feature.color.includes('blue') ? '#1d4ed8' : 
                                   feature.color.includes('green') ? '#047857' :
                                   feature.color.includes('purple') ? '#6d28d9' :
                                   feature.color.includes('orange') ? '#c2410c' :
                                   '#b91c1c', 
                          stopOpacity: 0.8 
                        }} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* DNA Double Helix */}
                    <g filter="url(#glow)">
                      {/* First strand */}
                      <path
                        d="M50,20 Q100,40 150,20 T150,60 Q100,80 50,60 T50,100 Q100,120 150,100 T150,140 Q100,160 50,140 T50,180"
                        stroke={`url(#dnaGradient-${index})`}
                        strokeWidth="3"
                        fill="none"
                        opacity="0.8"
                      />
                      
                      {/* Second strand */}
                      <path
                        d="M50,40 Q100,20 150,40 T150,80 Q100,60 50,80 T50,120 Q100,100 150,120 T150,160 Q100,140 50,160 T50,200"
                        stroke={`url(#dnaGradient-${index})`}
                        strokeWidth="3"
                        fill="none"
                        opacity="0.8"
                      />
                      
                      {/* Connecting rungs */}
                      {[20, 40, 60, 80, 100, 120, 140, 160].map((y, i) => (
                        <line
                          key={i}
                          x1={50 + Math.sin(y * 0.1) * 20}
                          y1={y}
                          x2={150 - Math.sin(y * 0.1) * 20}
                          y2={y}
                          stroke={`url(#dnaGradient-${index})`}
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      ))}
                    </g>
                  </svg>
                </motion.div>
                
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon size={24} className="text-white" />
                </motion.div>

                {/* Title */}
                <h3 className={`text-2xl font-bold text-dark-gray mb-4 ${feature.iconColor}`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-gray mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <motion.li
                      key={item}
                      className="flex items-center gap-2 text-sm text-dark-gray"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="https://www.inflammai.com/inflamm-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Launch App
            <Activity size={20} />
          </motion.a>
        </motion.div>

              </div>
    </section>
  )
}

export default FeaturesSection