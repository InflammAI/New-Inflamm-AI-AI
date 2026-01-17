'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, ArrowRight, Check, Shield, Sparkles, Flame } from 'lucide-react';
import { useInviteCode } from '../../providers/InviteCodeProvider';

interface InviteCodeGateProps {
  children: React.ReactNode;
}

export const InviteCodeGate: React.FC<InviteCodeGateProps> = ({ children }) => {
  const { hasAccess, isChecking, validateAndGrantAccess, error } = useInviteCode();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    const success = await validateAndGrantAccess(code);
    
    if (success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }
    
    setIsSubmitting(false);
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-500/20 border-t-transparent rounded-full animate-spin mx-auto animation-delay-150"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Access</h2>
          <p className="text-gray-400">Checking your invitation...</p>
        </motion.div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md relative z-10 px-4"
      >
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
          {/* Header with Branding */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative mx-auto mb-6"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-3">
              Inflamm-AI
            </h1>
            <h2 className="text-xl font-semibold text-white mb-2">
              Exclusive Access
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your invitation code to unlock personalized health monitoring
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <motion.div
                animate={{ scale: focusedInput ? 1.02 : 1 }}
                className="relative"
              >
                <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedInput ? 'text-orange-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="ENTER INVITATION CODE"
                  className={`w-full pl-14 pr-4 py-4 bg-gray-800/60 border rounded-2xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 text-center font-mono text-xl tracking-widest ${
                    focusedInput 
                      ? 'border-orange-500/50 shadow-lg shadow-orange-500/20 ring-2 ring-orange-500/20' 
                      : 'border-gray-700/50'
                  }`}
                  disabled={isSubmitting}
                  maxLength={20}
                />
              </motion.div>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-red-400" />
                  </div>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <p className="text-green-400 text-sm font-medium">Access granted! Welcome to Inflamm-AI</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 rounded-2xl font-bold text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
              whileHover={{ scale: code.trim() && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <span>Unlock Access</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <p className="text-xs text-gray-400">Premium health monitoring awaits</p>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-xs text-gray-500">
              Invitation codes are case-insensitive • Valid for 30 days after entry
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
