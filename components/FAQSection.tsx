'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is InflammAI?",
      answer: "InflammAI is a predictive health platform that uses AI to monitor your vitals and provide personalized health insights. Our advanced algorithms analyze your health data to predict potential issues and recommend proactive wellness strategies."
    },
    {
      question: "How does the AI health prediction work?",
      answer: "Our AI analyzes your vitals, health patterns, and historical data to identify trends and predict potential health concerns. The system learns from your unique health profile to provide increasingly accurate predictions and personalized recommendations over time."
    },
    {
      question: "Is my health data secure?",
      answer: "Yes, absolutely. We use bank-level encryption to protect your health data. All information is encrypted in transit and at rest, and we're HIPAA compliant. You maintain full control over your data and can export or delete it at any time."
    },
    {
      question: "What devices are compatible?",
      answer: "InflammAI integrates with most modern health tracking devices including smartwatches, fitness trackers, blood pressure monitors, glucose meters, and more. We support Apple Health, Google Fit, and major wearable brands."
    },
    {
      question: "How can I contribute a scientific hypothesis?",
      answer: "You can create an approved scientific hypothesis or contribute by voting on approved hypotheses."
    },
    {
      question: "Do you have a free plan?",
      answer: "Yes, you can get health assistant access and wellness guide."
    },
    {
      question: "What's included in the Family Plan?",
      answer: "The Pro/Family Plan includes everything in Premium plus shared access for up to 6 family members, a centralized dashboard to monitor all linked profiles, priority support, and extended analytics for family health trends."
    },
    {
      question: "How do micro-transactions work?",
      answer: "Premium members can buy supplements and wellness kits from approved stores using the Chat AI agent."
    }
  ]

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="w-full py-20 md:py-32 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg 
                    className="w-5 h-5 text-gray-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </motion.div>
              </button>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: activeIndex === index ? 'auto' : 0,
                  opacity: activeIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
