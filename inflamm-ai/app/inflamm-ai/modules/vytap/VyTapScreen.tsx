'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

export const VyTapScreen: React.FC = () => {
  const { publicKey, connected, signMessage } = useWallet();
  const [tapCount, setTapCount] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [timerStatus, setTimerStatus] = useState<'ready' | 'cooldown'>('ready');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [pointsLimit] = useState(300);
  const [pointsUntilCooldown, setPointsUntilCooldown] = useState(300);
  
  const [sessionSignature, setSessionSignature] = useState<string | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);

  useEffect(() => {
    if (publicKey && !mounted) {
      const walletKey = publicKey.toString();
      const savedState = localStorage.getItem(`vytap_state_${walletKey}`);
      
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setPointsUntilCooldown(parsed.pointsUntilCooldown ?? 300);
          setSessionPoints(parsed.sessionPoints ?? 0);
          
          if (parsed.timerStatus === 'cooldown' && parsed.cooldownEndTime) {
            const now = Date.now();
            const remainingTime = Math.max(0, Math.floor((parsed.cooldownEndTime - now) / 1000));
            
            if (remainingTime > 0) {
              setTimerStatus('cooldown');
              setTimeRemaining(remainingTime);
            } else {
              setTimerStatus('ready');
              setPointsUntilCooldown(300);
              setSessionPoints(0);
            }
          }
          
          if (parsed.sessionSignature && parsed.sessionMessage) {
            setSessionSignature(parsed.sessionSignature);
            setSessionMessage(parsed.sessionMessage);
          }
        } catch (error) {
          console.error('Failed to load saved state:', error);
        }
      }
      
      setMounted(true);
    }
  }, [publicKey, mounted]);

  useEffect(() => {
    if (publicKey && mounted) {
      const walletKey = publicKey.toString();
      const stateToSave = {
        pointsUntilCooldown,
        sessionPoints,
        timerStatus,
        cooldownEndTime: timerStatus === 'cooldown' ? Date.now() + (timeRemaining * 1000) : null,
        sessionSignature,
        sessionMessage,
        lastUpdated: Date.now()
      };
      
      localStorage.setItem(`vytap_state_${walletKey}`, JSON.stringify(stateToSave));
    }
  }, [publicKey, mounted, pointsUntilCooldown, sessionPoints, timerStatus, timeRemaining, sessionSignature, sessionMessage]);

  useEffect(() => {
    if (!connected || !publicKey) {
      if (publicKey) {
        localStorage.removeItem(`vytap_state_${publicKey.toString()}`);
      }
      setSessionSignature(null);
      setSessionMessage(null);
      setSessionPoints(0);
      setPointsUntilCooldown(pointsLimit);
      setTimerStatus('ready');
      setTimeRemaining(0);
    }
  }, [connected, publicKey, pointsLimit]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerStatus === 'cooldown') {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerStatus('ready');
            setSessionPoints(0);
            setPointsUntilCooldown(pointsLimit);
            
            if (publicKey) {
              const walletKey = publicKey.toString();
              const stateToSave = {
                pointsUntilCooldown: pointsLimit,
                sessionPoints: 0,
                timerStatus: 'ready',
                cooldownEndTime: null,
                sessionSignature,
                sessionMessage,
                lastUpdated: Date.now()
              };
              localStorage.setItem(`vytap_state_${walletKey}`, JSON.stringify(stateToSave));
            }
            
            setToastMessage('✅ Ready to tap again!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus, pointsLimit, publicKey, sessionSignature, sessionMessage]);

  const handleTap = async () => {
    if (!connected || !publicKey || !signMessage) {
      setToastMessage('⚠️ Please connect your wallet first');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    if (timerStatus === 'cooldown') {
      setToastMessage(`⏸️ Cooldown: ${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')} remaining`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    if (pointsUntilCooldown <= 0) {
      setTimerStatus('cooldown');
      setTimeRemaining(300);
      setToastMessage('⏸️ 300 points reached! 5-minute cooldown');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    setIsAnimating(true);
    
    // Optimistic UI update - use functional updates to handle rapid taps correctly
    setTapCount(prev => prev + 1);
    setSessionPoints(prev => prev + 1);
    setPointsUntilCooldown(prev => {
      const newValue = Math.max(0, prev - 1);
      // Show toast with updated value - faster dismissal for rapid tapping
      setToastMessage(`+1 Point! ${newValue} left`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 400);
      return newValue;
    });
    
    // Optimistically update global points counter
    if (typeof window !== 'undefined' && (window as any).__incrementVitalPoints) {
      (window as any).__incrementVitalPoints(1);
    }
    
    try {
      let signatureToUse = sessionSignature;
      let messageToUse = sessionMessage;
      
      // Prevent multiple simultaneous sign requests (race condition fix)
      if (!signatureToUse || !messageToUse) {
        // If already signing, wait for it to complete
        if (isSigningInProgress) {
          // Rollback optimistic update - another tap is already getting signature
          setTapCount(prev => Math.max(0, prev - 1));
          setSessionPoints(prev => Math.max(0, prev - 1));
          setPointsUntilCooldown(prev => Math.min(pointsLimit, prev + 1));
          // Rollback global counter
          if (typeof window !== 'undefined' && (window as any).__incrementVitalPoints) {
            (window as any).__incrementVitalPoints(-1);
          }
          setToastMessage('⏳ Signing in progress...');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 1500);
          setIsAnimating(false);
          return;
        }
        
        try {
          setIsSigningInProgress(true);
          
          const sessionId = `session_${Date.now()}_${publicKey.toString()}`;
          const message = JSON.stringify({
            action: 'tap_session',
            walletAddress: publicKey.toString(),
            sessionId: sessionId
          });
          
          const messageBytes = new TextEncoder().encode(message);
          const signature = await signMessage(messageBytes);
          const signatureBase58 = bs58.encode(signature);
          
          setSessionSignature(signatureBase58);
          setSessionMessage(message);
          signatureToUse = signatureBase58;
          messageToUse = message;
          setIsSigningInProgress(false);
        } catch (signError) {
          console.error('Signature failed:', signError);
          setIsSigningInProgress(false);
          
          // Rollback optimistic update using functional updates
          setTapCount(prev => Math.max(0, prev - 1));
          setSessionPoints(prev => Math.max(0, prev - 1));
          setPointsUntilCooldown(prev => Math.min(pointsLimit, prev + 1));
          // Rollback global counter
          if (typeof window !== 'undefined' && (window as any).__incrementVitalPoints) {
            (window as any).__incrementVitalPoints(-1);
          }
          setToastMessage('❌ Signature cancelled');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
          setIsAnimating(false);
          return;
        }
      }
      
      // Prepare headers - include Telegram initData if in Telegram context
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (typeof window !== 'undefined') {
        const webApp = (window as any).Telegram?.WebApp;
        if (webApp?.initData) {
          headers['X-Telegram-Init-Data'] = webApp.initData;
        }
      }

      const response = await fetch('/api/vytap/tap', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          sessionSignature: signatureToUse,
          sessionMessage: messageToUse,
          tapTimestamp: Date.now()
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Sync global points counter to exact total from backend
        if (typeof window !== 'undefined' && (window as any).__updateVitalPoints) {
          (window as any).__updateVitalPoints(data.data.totalPoints);
        }
      } else {
        // Rollback optimistic update using functional updates
        setTapCount(prev => Math.max(0, prev - 1));
        setSessionPoints(prev => Math.max(0, prev - 1));
        setPointsUntilCooldown(prev => Math.min(pointsLimit, prev + 1));
        // Rollback global counter
        if (typeof window !== 'undefined' && (window as any).__incrementVitalPoints) {
          (window as any).__incrementVitalPoints(-1);
        }
        setToastMessage(data.error || '❌ Tap failed');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
      
      setTimeout(() => setIsAnimating(false), 400);
    } catch (error) {
      console.error('Tap failed:', error);
      // Rollback optimistic update using functional updates
      setTapCount(prev => Math.max(0, prev - 1));
      setSessionPoints(prev => Math.max(0, prev - 1));
      setPointsUntilCooldown(prev => Math.min(pointsLimit, prev + 1));
      // Rollback global counter
      if (typeof window !== 'undefined' && (window as any).__incrementVitalPoints) {
        (window as any).__incrementVitalPoints(-1);
      }
      setToastMessage('❌ Tap failed. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      setIsAnimating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">
        {timerStatus === 'ready' ? (
          <div className="mb-6 text-center border-2 border-[var(--accent-orange)] rounded-lg p-4 bg-gradient-to-br from-[var(--surface)]/90 to-[var(--surface)]/60 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <svg className="w-5 h-5 text-[var(--accent-yellow)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h2 className="text-lg font-bold bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] bg-clip-text text-transparent">
                Vital Points Remaining
              </h2>
            </div>
            <p className="text-4xl font-black text-[var(--accent-orange)] tabular-nums">
              {pointsUntilCooldown} / {pointsLimit}
            </p>
          </div>
        ) : (
          <div className="mb-6 text-center border-2 border-gray-600 rounded-lg p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/60 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-bold text-gray-300">
                Cooldown Period
              </h2>
            </div>
            <p className="text-4xl font-black text-gray-400 tabular-nums">
              {formatTime(timeRemaining)}
            </p>
            <p className="mt-1.5 text-sm text-gray-500">
              Rest and recharge your vital energy
            </p>
          </div>
        )}

        <motion.button
          onClick={handleTap}
          disabled={timerStatus === 'cooldown'}
          className="relative focus:outline-none focus:ring-0 border-0 bg-transparent p-0 m-0"
          style={{ outline: 'none', border: 'none' }}
          whileHover={timerStatus !== 'cooldown' ? { scale: 1.08 } : {}}
          whileTap={timerStatus !== 'cooldown' ? { scale: 0.92 } : {}}
          animate={isAnimating ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.05 }}
        >
          <div className={`absolute inset-0 blur-3xl opacity-60 pointer-events-none ${
            timerStatus === 'cooldown' ? 'bg-gray-500' : ''
          }`} style={{
            background: timerStatus === 'cooldown' 
              ? 'rgb(107 114 128)' 
              : 'linear-gradient(135deg, var(--accent-orange), var(--accent-yellow))'
          }} />
          
          <div className="relative z-10">
            <svg
              width="280"
              height="280"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all ${
                timerStatus === 'cooldown' ? 'opacity-50' : ''
              }`}
            >
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'var(--accent-orange)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--accent-yellow)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill={timerStatus === 'cooldown' ? '#6B7280' : 'url(#heartGradient)'}
                stroke={timerStatus === 'cooldown' ? '#4B5563' : '#F97316'}
                strokeWidth="0.5"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-bold text-4xl ${
                timerStatus === 'cooldown' ? 'text-gray-300' : 'text-white'
              }`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                TAP
              </span>
            </div>
          </div>

          {isAnimating && (
            <>
              {/* Heartbeat Wave Animation - positioned across the center of the heart */}
              <motion.svg
                className="absolute inset-0 pointer-events-none"
                width="280"
                height="280"
                viewBox="0 0 24 24"
                preserveAspectRatio="xMidYMid meet"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* ECG-style heartbeat wave - first pulse */}
                <motion.path
                  d="M 3 12 L 7 12 L 8 10 L 9 14 L 10 8 L 11 12 L 13 12"
                  stroke="var(--accent-orange)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0.5, 0] }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
                {/* ECG-style heartbeat wave - second pulse */}
                <motion.path
                  d="M 11 12 L 13 12 L 14 10 L 15 14 L 16 8 L 17 12 L 21 12"
                  stroke="var(--accent-yellow)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0.5, 0] }}
                  transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                />
              </motion.svg>
            </>
          )}
        </motion.button>

        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <p className="text-sm text-[var(--muted)] mb-1">Session Points</p>
            <p className="text-3xl font-bold text-white tabular-nums">{sessionPoints}</p>
          </div>
          <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <p className="text-sm text-[var(--muted)] mb-1">Total Taps</p>
            <p className="text-3xl font-bold text-white tabular-nums">{tapCount}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl border border-gray-700 z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
