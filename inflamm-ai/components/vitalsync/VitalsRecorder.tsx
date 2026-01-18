'use client';

import React from 'react';
import { Heart, Activity, Clock, TrendingUp } from 'lucide-react';

export const VitalsRecorder: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Vitals Recorder</h3>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">72</p>
            <p className="text-sm text-gray-400">BPM</p>
          </div>
          <div className="text-center">
            <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">8,432</p>
            <p className="text-sm text-gray-400">Steps</p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">45</p>
            <p className="text-sm text-gray-400">Minutes</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Start Recording
        </button>
      </div>
    </div>
  );
};
