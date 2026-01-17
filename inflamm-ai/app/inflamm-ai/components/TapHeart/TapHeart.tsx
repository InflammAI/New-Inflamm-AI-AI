'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface TapHeartProps {
  className?: string;
  isConnected?: boolean;
}

export const TapHeart: React.FC<TapHeartProps> = ({ className = "", isConnected = false }) => {
  const [showPulseAnimation, setShowPulseAnimation] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleHeartClick = () => {
    // Show pulse animation
    setShowPulseAnimation(true);
    setTimeout(() => setShowPulseAnimation(false), 1500);

    // Create floating hearts
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50, // Random spread
      y: Math.random() * 50 + 20    // Random height
    }));

    setHearts(prev => [...prev, ...newHearts]);

    // Clean up hearts after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 2000);
  };

  return (
    <>
      {isConnected && (
        <>
          {/* Tap Heart Button - Bottom Right */}
          <motion.button
        onClick={handleHeartClick}
        className={`fixed bottom-20 right-6 w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 group ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </motion.button>

      {/* Pulse Animation Overlay */}
      <AnimatePresence>
        {showPulseAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPulseAnimation(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {/* Central Heart */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Heart className="w-16 h-16 text-white" fill="white" />
              </motion.div>

              {/* Pulse Rings */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: [1, 3, 4], opacity: [0.6, 0.3, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 border-4 border-orange-400 rounded-full"
                />
              ))}

              {/* Floating Hearts */}
              {hearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: heart.x,
                    y: -heart.y,
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut"
                  }}
                  className="absolute w-6 h-6"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Heart className="w-6 h-6 text-orange-300" fill="currentColor" />
                </motion.div>
              ))}

              {/* Sparkles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -40, 0],
                    x: [0, Math.random() * 60 - 30, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                />
              ))}

                          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </>
  );
};
