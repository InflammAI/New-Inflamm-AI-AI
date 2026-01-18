'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, MessageCircle, TrendingUp, Edit3, Shield, Zap, Users, Award } from 'react-feather'

const NewWhatIsSection = () => {
  const benefits = [
    { icon: Shield, title: "Secure & Private", description: "Your health data is encrypted and protected with enterprise-grade security" },
    { icon: Zap, title: "Real-Time Insights", description: "Get instant health analysis and recommendations powered by AI" },
    { icon: Users, title: "Expert-Backed", description: "Built with medical professionals and health science experts" },
    { icon: Award, title: "Proven Results", description: "Trusted by thousands of users for their health management needs" }
  ]

  return (
    <section className="w-full py-20 md:py-32 bg-beige px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Title */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-gray mb-6 leading-tight">
                What is
                <br />
                <span className="text-orange-500">Inflamm AI?</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6" />
            </motion.div>

            {/* Main Description */}
            <motion.p 
              className="text-xl text-muted-gray mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Inflamm AI is an intelligent health management platform that combines cutting-edge AI technology 
              with comprehensive health monitoring to provide personalized wellness insights and real-time health tracking.
            </motion.p>

            {/* Feature Pills */}
            <motion.div 
              className="flex flex-wrap gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { icon: Activity, label: "Vitalsync" },
                { icon: MessageCircle, label: "AI Chat" },
                { icon: TrendingUp, label: "SciCast" },
                { icon: Edit3, label: "Wellness Blog" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-dark-gray">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.a
              href="https://www.inflammai.com/inflamm-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Launch App
              <Zap size={16} />
            </motion.a>
          </motion.div>

          {/* Right Content - Benefits Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <benefit.icon size={20} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-gray leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "24/7", label: "AI Support" },
            { number: "99.9%", label: "Uptime" },
            { number: "4.8★", label: "User Rating" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-gray font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default NewWhatIsSection
