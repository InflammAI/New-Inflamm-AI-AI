'use client';

import React, { useState } from 'react';
import { Shield, User, Lock, Key } from 'lucide-react';

export const AuthSection: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Authentication Status</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isAuthenticated 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isAuthenticated ? (
            <>
              <Shield className="w-4 h-4" />
              <span>Authenticated</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Not Authenticated</span>
            </>
          )}
        </div>
        <button
          onClick={() => setIsAuthenticated(!isAuthenticated)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isAuthenticated ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};
