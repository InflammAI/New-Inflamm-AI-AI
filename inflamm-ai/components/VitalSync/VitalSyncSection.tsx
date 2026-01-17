'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVitalSyncMockData, VitalSyncData } from '../../lib/vitals/vitalSyncDataService';

interface VitalSyncSectionProps {
  className?: string;
}

export const VitalSyncSection: React.FC<VitalSyncSectionProps> = ({ className = '' }) => {
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [vitalData, setVitalData] = useState<VitalSyncData | null>(null);

  const handleConnectDevice = () => {
    setDeviceConnected(true);
    setVitalData(getVitalSyncMockData());
  };

  const handleDisconnectDevice = () => {
    setDeviceConnected(false);
    setVitalData(null);
  };

  const handleAction = (actionId: string) => {
    console.log('Action clicked:', actionId);
    // Handle boost vitals actions here
  };

  const handleRegenerateActivities = () => {
    if (deviceConnected) {
      setVitalData(getVitalSyncMockData());
    }
  };

  return (
    <div className={`p-6 max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">VitalSync</h1>
          <p className="text-[var(--muted)]">Real-time health monitoring and wellness tracking</p>
        </div>
        <button
          onClick={deviceConnected ? handleDisconnectDevice : handleConnectDevice}
          className={`px-6 py-3 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 ${
            deviceConnected
              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
              : 'bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white hover:scale-[1.02] transition-transform focus:ring-orange-500'
          }`}
        >
          {deviceConnected ? 'Disconnect Device' : 'Connect Device'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!deviceConnected ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Chat Card - Always visible when device not connected */}
            <div className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Health Assistant</h2>
              </div>
              <p className="text-[var(--muted)] mb-4">
                Connect your device to start tracking your vital signs and receive personalized health insights. 
                Our AI assistant Flammy is here to help with wellness guidance and health monitoring.
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>Device not connected</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {vitalData && (
              <>
                {/* Alerts Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Health Alerts</h2>
                  {vitalData.alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-xl border ${
                        alert.type === 'critical'
                          ? 'bg-red-500/20 border-red-500/50'
                          : alert.type === 'warning'
                          ? 'bg-yellow-500/20 border-yellow-500/50'
                          : 'bg-blue-500/20 border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {alert.type === 'critical' ? (
                            <span className="text-red-400 text-xl">⚠️</span>
                          ) : alert.type === 'warning' ? (
                            <span className="text-yellow-400 text-xl">⚠️</span>
                          ) : (
                            <span className="text-blue-400 text-xl">ℹ️</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">
                            {alert.title} • {alert.value}
                          </h3>
                          <p className="text-[var(--muted)] text-sm">{alert.message}</p>
                          <p className="text-[var(--muted)] text-xs mt-2">
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Track Vital Signs Cards */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Track Vital Signs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Heart Rate Card */}
                    <div className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                            <span className="text-red-400 text-lg">❤️</span>
                          </div>
                          <span className="text-white font-medium">Heart Rate</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vitalData.vitalSigns.heartRate.status === 'normal'
                            ? 'bg-green-500/20 text-green-400'
                            : vitalData.vitalSigns.heartRate.status === 'slightly_elevated'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : vitalData.vitalSigns.heartRate.status === 'low'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {vitalData.vitalSigns.heartRate.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {vitalData.vitalSigns.heartRate.value}
                        <span className="text-lg text-[var(--muted)] ml-1">bpm</span>
                      </div>
                      <p className="text-[var(--muted)] text-sm">
                        {vitalData.vitalSigns.heartRate.recommendation}
                      </p>
                    </div>

                    {/* Oxygen Saturation Card */}
                    <div className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 text-lg">🫁</span>
                          </div>
                          <span className="text-white font-medium">Oxygen Saturation</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vitalData.vitalSigns.oxygenSaturation.status === 'normal'
                            ? 'bg-green-500/20 text-green-400'
                            : vitalData.vitalSigns.oxygenSaturation.status === 'low'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {vitalData.vitalSigns.oxygenSaturation.status}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {vitalData.vitalSigns.oxygenSaturation.value}
                        <span className="text-lg text-[var(--muted)] ml-1">%</span>
                      </div>
                      <p className="text-[var(--muted)] text-sm">
                        {vitalData.vitalSigns.oxygenSaturation.recommendation}
                      </p>
                    </div>

                    {/* Respiratory Rate Card */}
                    <div className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-green-400 text-lg">🫧</span>
                          </div>
                          <span className="text-white font-medium">Respiratory Rate</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vitalData.vitalSigns.respiratoryRate.status === 'normal'
                            ? 'bg-green-500/20 text-green-400'
                            : vitalData.vitalSigns.respiratoryRate.status === 'elevated'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : vitalData.vitalSigns.respiratoryRate.status === 'low'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {vitalData.vitalSigns.respiratoryRate.status}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {vitalData.vitalSigns.respiratoryRate.value}
                        <span className="text-lg text-[var(--muted)] ml-1">bpm</span>
                      </div>
                      <p className="text-[var(--muted)] text-sm">
                        {vitalData.vitalSigns.respiratoryRate.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boost Vitals Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Boost Vitals</h2>
                    <button
                      onClick={handleRegenerateActivities}
                      className="px-4 py-2 bg-[var(--surface)] text-white border border-gray-800 rounded-lg hover:border-[var(--accent-orange)] transition-colors text-sm"
                    >
                      Regenerate Vitals Activities
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vitalData.boostVitalsActions.map((action) => (
                      <motion.div
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[var(--surface)] rounded-xl p-6 border border-gray-800 hover:border-[var(--accent-orange)] transition-colors cursor-pointer"
                        onClick={() => handleAction(action.id)}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] rounded-full flex items-center justify-center">
                            <span className="text-white text-lg">
                              {action.iconName === 'walk' ? '🏃' : action.iconName === 'water' ? '💧' : '🧘'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{action.label.split(' ')[0]}</h3>
                            <p className="text-white text-sm">{action.label.split(' ').slice(1).join(' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--muted)] text-sm">
                            {action.duration ? `${action.duration} minutes` : action.amount}
                          </span>
                          <button className="px-3 py-1 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white text-sm rounded-lg hover:scale-105 transition-transform">
                            Do
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
