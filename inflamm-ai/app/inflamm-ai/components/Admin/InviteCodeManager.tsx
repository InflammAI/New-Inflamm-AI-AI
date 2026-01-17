'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Plus, Trash2, Users, Clock } from 'lucide-react';
import { createInviteCode, generateInviteCode } from '../../../../lib/inviteCodes';

interface InviteCodeData {
  code: string;
  maxUses?: number;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
  uses: number;
}

export const InviteCodeManager: React.FC = () => {
  const [codes, setCodes] = useState<InviteCodeData[]>([
    {
      code: 'INFLAMM2026',
      maxUses: 100,
      expiresAt: new Date('2026-12-31'),
      createdBy: 'Admin',
      createdAt: new Date('2026-01-01'),
      uses: 0
    },
    {
      code: 'BETA2026',
      maxUses: 25,
      expiresAt: new Date('2026-12-31'),
      createdBy: 'Admin',
      createdAt: new Date('2026-01-01'),
      uses: 0
    },
    {
      code: 'EARLYACCESS',
      maxUses: 50,
      expiresAt: new Date('2026-12-31'),
      createdBy: 'Admin',
      createdAt: new Date('2026-01-01'),
      uses: 0
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCodeOptions, setNewCodeOptions] = useState({
    maxUses: 10,
    expiresIn: '30' // days
  });

  const handleCreateCode = () => {
    const newCode = createInviteCode({
      maxUses: newCodeOptions.maxUses,
      expiresAt: new Date(Date.now() + parseInt(newCodeOptions.expiresIn) * 24 * 60 * 60 * 1000),
      createdBy: 'Admin'
    });
    
    setCodes([...codes, { ...newCode, uses: 0 }]);
    setShowCreateForm(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDeleteCode = (codeToDelete: string) => {
    setCodes(codes.filter(code => code.code !== codeToDelete));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Invite Code Management</h1>
          <p className="text-gray-400">Manage access codes for Inflamm-AI</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 rounded-lg font-semibold text-gray-900 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Generate Code
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Create New Invite Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Uses</label>
              <input
                type="number"
                value={newCodeOptions.maxUses}
                onChange={(e) => setNewCodeOptions({ ...newCodeOptions, maxUses: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Expires In (Days)</label>
              <input
                type="number"
                value={newCodeOptions.expiresIn}
                onChange={(e) => setNewCodeOptions({ ...newCodeOptions, expiresIn: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                min="1"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreateCode}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white transition-all duration-300"
              >
                Generate
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Codes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map((codeData, index) => (
          <motion.div
            key={codeData.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-orange-400" />
                <span className="font-mono text-lg text-white">{codeData.code}</span>
              </div>
              <button
                onClick={() => handleDeleteCode(codeData.code)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  {codeData.uses} / {codeData.maxUses || '∞'} uses
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  Expires {formatDate(codeData.expiresAt!)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopyCode(codeData.code)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </button>
            </div>

            {/* Progress Bar */}
            {codeData.maxUses && (
              <div className="mt-3">
                <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${(codeData.uses / codeData.maxUses) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Codes</p>
              <p className="text-white text-xl font-bold">{codes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Uses</p>
              <p className="text-white text-xl font-bold">
                {codes.reduce((sum, code) => sum + code.uses, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Codes</p>
              <p className="text-white text-xl font-bold">
                {codes.filter(code => !code.expiresAt || code.expiresAt > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
