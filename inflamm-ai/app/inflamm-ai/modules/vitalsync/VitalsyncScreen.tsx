'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Zap, Watch, MessageCircle, Flame, Droplets, Clock, ChevronRight, X, Check } from 'lucide-react';
import { getVitalSyncMockData, VitalSyncData } from '../../lib/vitals/vitalSyncDataService';

export const VitalsyncScreen: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'assistant', timestamp: Date}>>([]);
  const [showToast, setShowToast] = useState(true);
  const [waterIntake, setWaterIntake] = useState(4);
  const [currentStreak, setCurrentStreak] = useState(2);
  const [activeMinutes, setActiveMinutes] = useState(60);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [vitalData, setVitalData] = useState<VitalSyncData | null>(null);

  const handleConnectDevice = () => {
    setDeviceConnected(true);
    setVitalData(getVitalSyncMockData());
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: chatMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    let assistantMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'assistant' as const,
      timestamp: new Date()
    };

    // Handle specific mini-offer responses
    const lowerMessage = chatMessage.toLowerCase().trim();
    
    if (lowerMessage === 'view mini-offers') {
      assistantMessage.text = "Here is today's mini-offer:\n\nRelax Pack – $0.99\n\nWant to purchase?";
    } else if (lowerMessage === 'yes' || lowerMessage === 'purchase' || lowerMessage === 'pls do') {
      assistantMessage.text = "Transaction Successful!";
    } else if (lowerMessage === 'no' || lowerMessage === "don't purchase" || lowerMessage === "don't") {
      assistantMessage.text = "Transaction Terminated!";
    } else if (lowerMessage === 'check your wellness') {
      assistantMessage.text = "Your wellness score: 85/100\n\nKeep up the great work! 💪";
    } else if (lowerMessage === 'get a quick stress tip') {
      assistantMessage.text = "Quick stress tip: Take 3 deep breaths\n\nBreathe in for 4 counts, hold for 4, breathe out for 6. Repeat 3 times. 🧘";
    } else {
      assistantMessage.text = "Happy to help";
    }

    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
    setChatMessage('');
  };

  const handleDisconnectDevice = () => {
    setDeviceConnected(false);
    setVitalData(null);
  };

  const handleActionComplete = (actionId: number) => {
    if (actionId === 2 && waterIntake < 8) {
      setWaterIntake(prev => prev + 1);
    }
  };

  const handleRegenerateActivities = () => {
    if (deviceConnected) {
      setVitalData(getVitalSyncMockData());
    }
  };

  const wellnessTasks = [
    { 
      label: 'Daily Wellness Tasks',
      tasks: [
        { name: 'Current Streak', icon: Flame, value: currentStreak, suffix: '+2 days', progress: 66, color: 'from-orange-500 to-yellow-500' },
        { name: 'Water Intake', icon: Droplets, value: waterIntake, suffix: '4/8 cups', progress: 50, color: 'from-cyan-500 to-blue-500', detail: '+10 min' },
        { name: 'Active Minutes', icon: Clock, value: activeMinutes, suffix: 'min', progress: 80, color: 'from-red-500 via-orange-500 to-yellow-500', badge: 'min' }
      ]
    }
  ];

  const vitals = [
    { 
      label: 'Heart Rate', 
      value: '72', 
      unit: 'bpm', 
      icon: Heart, 
      status: 'normal',
      lastSync: 'Just now',
      recommendation: 'Heart rate slightly elevated — Try a 5-minute breathing exercise',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      label: 'Fitness', 
      value: '98', 
      unit: '%', 
      icon: Activity, 
      status: 'normal',
      lastSync: 'Just now',
      subtitle: 'Band',
      recommendation: 'Oxygen levels optimal',
      color: 'from-cyan-500 to-blue-500'
    },
    { 
      label: 'Smart Ring', 
      value: '16', 
      unit: 'bpm', 
      icon: Zap, 
      status: 'normal',
      lastSync: 'Just now',
      recommendation: 'Respiratory rate normal',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const boostActions = [
    { icon: '🏃', text: 'Take a', detail: '10 minute walk', id: 1 },
    { icon: '💧', text: 'Drink a glass', detail: '4/8 cups', id: 2 },
    { icon: '🧘', text: 'Practice deep breathing', detail: '', id: 3 }
  ];

  return (
    <div className="min-h-screen text-white font-sans relative">
      {/* Header */}
      <header className="relative px-6 py-6 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Vital Sync
            </h1>
            <p className="text-gray-400 text-base">Monitor your health metrics in real-time</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
          
          {/* Daily Wellness Tasks - Top Horizontal Scroll */}
          {deviceConnected && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
            >
              <h3 className="text-lg font-semibold mb-4">Daily Wellness Tasks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wellnessTasks[0].tasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <task.icon className={`w-5 h-5 bg-gradient-to-r ${task.color} bg-clip-text text-transparent`} />
                        <span className="text-sm font-medium text-gray-300">{task.name}</span>
                      </div>
                      {task.detail && (
                        <span className="text-xs text-cyan-400">{task.detail}</span>
                      )}
                      {task.badge && (
                        <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.value}
                        </span>
                      )}
                    </div>
                    <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`absolute h-full bg-gradient-to-r ${task.color} rounded-full`}
                        style={{ boxShadow: `0 0 10px rgba(59, 130, 246, 0.5)` }}
                      />
                    </div>
                    {task.suffix && !task.badge && (
                      <p className="text-xs text-gray-400 mt-2">{task.suffix}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          )}

          {/* Device Connection Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Connect Wearables or Health Trackers</h2>
                <p className="text-gray-400 text-sm">Sync your tital your vital signs in real-time</p>
              </div>
              <button 
                onClick={deviceConnected ? handleDisconnectDevice : handleConnectDevice}
                className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                  deviceConnected
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30 hover:shadow-red-500/50'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50'
                }`}
              >
                {deviceConnected ? 'Disconnect Device' : 'Connect Device'}
              </button>
            </div>
          </motion.div>

          {/* Grid Layout for Main Panels */}
          <div className="grid lg:grid-cols-3 gap-5">
            
            {/* Vitals Tracking Panel - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Track Vital Signs - Only show when device is connected */}
              <AnimatePresence mode="wait">
                {deviceConnected && vitalData ? (
                  <motion.div 
                    key="connected-vitals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">Track Vital Signs</h2>
                        <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 font-mono text-sm">
                          VITxx-001
                        </span>
                      </div>
                      <div className="px-4 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 font-semibold text-sm">
                        Connected
                      </div>
                    </div>

                    {/* Vitals Grid using mock data */}
                    <div className="grid md:grid-cols-3 gap-3">
                      {/* Heart Rate */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs">Heart Rate</span>
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
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold">{vitalData.vitalSigns.heartRate.value}</span>
                          <span className="text-gray-400 text-sm">bpm</span>
                        </div>
                        <div className="relative h-1 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                          <div className="absolute h-full w-2/3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" 
                               style={{ boxShadow: `0 0 8px rgba(250, 204, 21, 0.5)` }} />
                        </div>
                        <p className="text-xs text-gray-300">{vitalData.vitalSigns.heartRate.recommendation}</p>
                      </motion.div>

                      {/* Oxygen Saturation */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs">Oxygen Saturation</span>
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
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold">{vitalData.vitalSigns.oxygenSaturation.value}</span>
                          <span className="text-gray-400 text-sm">%</span>
                        </div>
                        <div className="relative h-1 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                          <div className="absolute h-full w-5/6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                               style={{ boxShadow: `0 0 8px rgba(6, 182, 212, 0.5)` }} />
                        </div>
                        <p className="text-xs text-gray-300">{vitalData.vitalSigns.oxygenSaturation.recommendation}</p>
                      </motion.div>

                      {/* Respiratory Rate */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs">Respiratory Rate</span>
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
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold">{vitalData.vitalSigns.respiratoryRate.value}</span>
                          <span className="text-gray-400 text-sm">bpm</span>
                        </div>
                        <div className="relative h-1 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                          <div className="absolute h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" 
                               style={{ boxShadow: `0 0 8px rgba(16, 185, 129, 0.5)` }} />
                        </div>
                        <p className="text-xs text-gray-300">{vitalData.vitalSigns.respiratoryRate.recommendation}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="no-vitals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
                  >
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Watch className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Device Connected</h3>
                      <p className="text-gray-400">Connect a device to start tracking your vital signs</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Assistant Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-lg">
                    😊
                  </div>
                  <h2 className="text-lg font-semibold">Need Help?</h2>
                  <div className="ml-auto w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center relative">
                    <MessageCircle className="w-4 h-4 text-yellow-500" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
                  </div>
                  
                  {/* Toggle Button for Chat */}
                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-xs">{isChatOpen ? 'Open' : 'Closed'}</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isChatOpen ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-lg transition-transform duration-300 ${isChatOpen ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                </div>

                {/* Chat Content - Collapsible */}
                <AnimatePresence>
                  {isChatOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Chat Messages */}
                      <div className="bg-gray-800/60 rounded-2xl p-3 mb-3 border border-gray-700/50 max-h-80 overflow-y-auto">
                        {chatMessages.length === 0 ? (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                              🤖
                            </div>
                            <p className="text-gray-300 text-sm pt-1">How can I assist you today?</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {chatMessages.map((message) => (
                              <div key={message.id} className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {message.sender === 'assistant' && (
                                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                                    🤖
                                  </div>
                                )}
                                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                                  message.sender === 'user' 
                                    ? 'bg-yellow-500 text-gray-900' 
                                    : 'bg-gray-700 text-gray-300'
                                }`}>
                                  {message.text}
                                </div>
                                {message.sender === 'user' && (
                                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                                    👤
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask a question..."
                            className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={handleSendMessage}
                          className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 rounded-xl font-semibold text-gray-900 text-sm shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                        >
                          Send
                        </button>
                      </div>

                      {/* Online Status */}
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-400">Our health assistant is online</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right Column - Alerts and Actions */}
            <div className="space-y-5">
              
              {/* Alerts and Boost Vitals - Only show when device is connected */}
              <AnimatePresence mode="wait">
                {deviceConnected && vitalData ? (
                  <>
                    {/* Health Alerts */}
                    <motion.div 
                      key="alerts"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-semibold">Health Alerts</h2>
                        <div className="w-5 h-5 bg-gray-700/50 rounded-full flex items-center justify-center text-xs">
                          ℹ️
                        </div>
                      </div>

                      {vitalData.alerts.map((alert) => (
                        <div key={alert.id} className={`rounded-xl p-4 border mb-3 ${
                          alert.type === 'critical'
                            ? 'bg-red-900/20 border-red-500/30'
                            : alert.type === 'warning'
                            ? 'bg-yellow-900/20 border-yellow-500/30'
                            : 'bg-blue-900/20 border-blue-500/30'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 relative flex-shrink-0">
                              <div className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs">
                                  {alert.type === 'critical' ? '⚠️' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                                </span>
                              </div>
                              {alert.type === 'info' && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">1</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white text-sm mb-1">
                                {alert.title} • <span className={alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}>{alert.value}</span>
                              </h3>
                              <p className="text-xs text-gray-300 leading-relaxed">{alert.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    {/* Boost Vitals Actions */}
                    <motion.div 
                      key="boost-actions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-semibold">Boost Vitals</h2>
                        <div className="w-5 h-5 bg-gray-700/50 rounded-full flex items-center justify-center text-xs">
                          ℹ️
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {vitalData.boostVitalsActions.map((action, index) => (
                          <motion.div 
                            key={action.id} 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group"
                          >
                            <span className="text-xl">
                              {action.iconName === 'walk' ? '🏃' : action.iconName === 'water' ? '💧' : '🧘'}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                {action.label.split(' ')[0]} 
                                {action.label.split(' ').slice(1).join(' ') && (
                                  <>
                                    <br />
                                    <span className="text-xs text-cyan-400">{action.label.split(' ').slice(1).join(' ')}</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <button 
                              onClick={() => handleActionComplete(parseInt(action.id))}
                              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20"
                            >
                              Do
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Regenerate Button */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={handleRegenerateActivities}
                        className="w-full px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-semibold text-gray-900 text-sm shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                      >
                        Regenerate Vitals Activities
                      </motion.button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div 
                    key="no-actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
                  >
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="w-6 h-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Connect to Track</h3>
                      <p className="text-gray-400 text-sm">Connect a device to see health alerts and boost activities</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Smart Notification Toast - Bottom Right */}
      <AnimatePresence>
        {showToast && deviceConnected && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-24 right-6 max-w-sm bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 z-50"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium mb-1">
                  You've been inactive for 2 hours —
                </p>
                <p className="text-xs text-gray-300">
                  Take a quick stretch to improve circulation.
                </p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="w-7 h-7 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
              >
                <Check className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="absolute top-2 right-2 w-5 h-5 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};
