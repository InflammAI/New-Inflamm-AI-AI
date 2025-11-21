'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface VitalData {
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  trend: 'up' | 'down' | 'stable';
}

export const VitalsyncScreen: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 hours ago');
  
  const vitals: VitalData[] = [
    { type: 'Heart Rate', value: 72, unit: 'bpm', timestamp: '10 min ago', trend: 'stable' },
    { type: 'Steps', value: 8543, unit: 'steps', timestamp: '1 min ago', trend: 'up' },
    { type: 'Sleep', value: 7.5, unit: 'hours', timestamp: 'Last night', trend: 'up' },
    { type: 'Activity', value: 45, unit: 'min', timestamp: 'Today', trend: 'stable' },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/v1/vitals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ timestamp: Date.now() }),
      // });
      
      setTimeout(() => {
        setIsSyncing(false);
        setLastSync('Just now');
      }, 2000);
    } catch (error) {
      console.error('Sync failed:', error);
      setIsSyncing(false);
    }
  };

  const getTrendIcon = (trend: VitalData['trend']) => {
    if (trend === 'up') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5M5 12L12 5L19 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12L12 19L19 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19" stroke="#98A1AD" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vitalsync</h1>
        <p className="text-[var(--muted)]">Last synced: {lastSync}</p>
      </div>

      {/* Sync button */}
      <motion.button
        onClick={handleSync}
        disabled={isSyncing}
        className="mb-8 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
        whileTap={{ scale: 0.98 }}
      >
        {isSyncing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Syncing...
          </span>
        ) : (
          'Sync Now'
        )}
      </motion.button>

      {/* Vitals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((vital, index) => (
          <motion.div
            key={vital.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[var(--muted)] text-sm font-medium">{vital.type}</h3>
              {getTrendIcon(vital.trend)}
            </div>
            
            <div className="mb-2">
              <span className="text-white text-3xl font-bold tabular-nums">{vital.value}</span>
              <span className="text-[var(--muted)] text-sm ml-2">{vital.unit}</span>
            </div>
            
            <p className="text-[var(--muted)] text-xs">{vital.timestamp}</p>
          </motion.div>
        ))}
      </div>

      {/* Setup instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-[var(--surface)] rounded-xl border border-gray-800"
      >
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--accent-orange)" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Connect Your Health Data
        </h2>
        <p className="text-[var(--muted)] text-sm">
          Connect Apple Health or Google Fit to automatically sync your vitals. Your data is encrypted and never shared without your permission.
        </p>
      </motion.div>
    </div>
  );
};
