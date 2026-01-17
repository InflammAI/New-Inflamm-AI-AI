'use client'

import React from 'react'
import { motion } from 'framer-motion'

const PartnersSection = () => {
  const partners = [
    {
      name: "Circular Protocol",
      logo: <img src="/images/circular-protocol-logo.png" alt="Circular Protocol" className="w-24 h-24 object-contain" />,
      website: "#",
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600"
    },
    {
      name: "IQ Labs",
      logo: <img src="/images/iq-labs-logo.png" alt="IQ Labs" className="w-24 h-24 object-contain" />,
      website: "#",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      name: "Episteme",
      logo: <img src="/images/episteme-logo.png" alt="Episteme" className="w-24 h-24 object-contain" />,
      website: "#",
      bgColor: "bg-gradient-to-br from-amber-500 to-amber-600"
    }
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-white px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
            Trusted Partners
          </h2>
          <p className="text-muted-gray max-w-2xl mx-auto">
            We collaborate with industry leaders to bring you the best health AI experience
          </p>
        </div>

        {/* Horizontal Scrolling Partners */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          
          {/* Scrolling Container */}
          <div className="flex animate-scroll-x">
            {/* Only the three partners - no duplicates */}
            {partners.map((partner, index) => (
              <motion.div
                key={`partner-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`${partner.bgColor} rounded-2xl p-8 shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-w-[200px] max-w-[250px] h-[200px] mx-4 flex-shrink-0`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                  }} />
                </div>

                {/* Partner Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Logo */}
                  <div className="mb-4">
                    {partner.logo}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-white text-center">
                    {partner.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-dark-gray mb-4">
              Want to Partner With Us?
            </h3>
            <p className="text-muted-gray mb-6 max-w-2xl mx-auto">
              Join our mission to revolutionize health data management and AI-powered wellness
            </p>
            <motion.a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdlyvckoSjgNgDaE1tvlGvuN3nfuW-65HG1PImI7841GgPGGg/viewform?usp=sharing&ouid=112460930523248112174"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Become a Partner
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
