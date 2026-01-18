'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export const VitalsChart: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Vitals Chart</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-green-400">
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="text-sm">+5%</span>
          </div>
          <div className="flex items-center text-red-400">
            <TrendingDown className="w-5 h-5 mr-2" />
            <span className="text-sm">-2%</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
        <BarChart3 className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );
};
