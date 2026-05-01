'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, Calendar, Plus, Edit, Trash2 } from 'react-feather';

const PeptideSyncScreen = () => {
  const [protocols, setProtocols] = useState([
    {
      id: 1,
      name: 'CJC-1295 + Ipamorelin',
      dosage: '100mcg',
      frequency: 'Daily',
      time: 'Bedtime',
      status: 'active',
      startDate: '2024-01-15',
      nextDose: '2024-05-01 22:00',
      symptoms: ['Improved sleep', 'Better recovery', 'Increased energy'],
      lastLogged: '2024-05-01 08:30'
    },
    {
      id: 2,
      name: 'BPC-157',
      dosage: '250mcg',
      frequency: 'Twice Daily',
      time: 'Morning & Evening',
      status: 'active',
      startDate: '2024-02-01',
      nextDose: '2024-05-01 08:00',
      symptoms: ['Reduced inflammation', 'Faster healing', 'Less joint pain'],
      lastLogged: '2024-05-01 07:45'
    },
    {
      id: 3,
      name: 'GHK-Cu',
      dosage: '50mg',
      frequency: 'Weekly',
      time: 'Monday Morning',
      status: 'completed',
      startDate: '2023-12-01',
      nextDose: 'Completed',
      symptoms: ['Skin improvement', 'Hair growth', 'Wound healing'],
      lastLogged: '2024-04-29 09:00'
    }
  ]);

  const [showAddProtocol, setShowAddProtocol] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">PeptideSync</h1>
            <p className="text-gray-400">Advanced peptide therapy tracking and optimization</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        variants={itemVariants}
      >
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-red-400" size={20} />
            <span className="text-gray-400 text-sm">Track Schedule</span>
          </div>
          <div className="text-2xl font-bold text-white">2 Active</div>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <span className="text-gray-400 text-sm">Symptoms Logged</span>
          </div>
          <div className="text-2xl font-bold text-white">47 Days</div>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-blue-400" size={20} />
            <span className="text-gray-400 text-sm">Correlations</span>
          </div>
          <div className="text-lg font-bold text-white">8 Found</div>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-purple-400" size={20} />
            <span className="text-gray-400 text-sm">Reports</span>
          </div>
          <div className="text-2xl font-bold text-white">3 Ready</div>
        </div>
      </motion.div>

      {/* Add Protocol Button */}
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <button
          onClick={() => setShowAddProtocol(!showAddProtocol)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
        >
          <Plus size={20} />
          Add New Protocol
        </button>
      </motion.div>

      {/* Protocols List */}
      <motion.div 
        className="space-y-4"
        variants={itemVariants}
      >
        {protocols.map((protocol) => (
          <motion.div
            key={protocol.id}
            className="bg-[var(--surface)] p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{protocol.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Dosage: {protocol.dosage}</span>
                  <span>•</span>
                  <span>{protocol.frequency}</span>
                  <span>•</span>
                  <span>{protocol.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  protocol.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {protocol.status === 'active' ? 'Active' : 'Completed'}
                </span>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-400">Started: </span>
                <span className="text-white">{protocol.startDate}</span>
              </div>
              <div>
                <span className="text-gray-400">Next Dose: </span>
                <span className="text-white">{protocol.nextDose}</span>
              </div>
            </div>
            
            {/* Symptoms Section */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Recent Symptoms</span>
                <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Log Symptom
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {protocol.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Last logged: {protocol.lastLogged}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {protocols.length === 0 && (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <Zap size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Peptide Protocols</h3>
          <p className="text-gray-400 mb-6">Start tracking your peptide therapy journey</p>
          <button
            onClick={() => setShowAddProtocol(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Add Your First Protocol
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PeptideSyncScreen;
