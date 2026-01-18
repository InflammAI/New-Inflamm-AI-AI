'use client';

import React from 'react';
import { Lightbulb, Target, TrendingUp } from 'lucide-react';

export const RecommendationCard: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
        <Lightbulb className="w-6 h-6 text-yellow-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-gray-700/30 rounded-lg">
          <Target className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-medium mb-1">Increase Daily Activity</h4>
            <p className="text-gray-300 text-sm">Your step count has decreased by 15% this week. Try to reach 8,000 steps daily for optimal health.</p>
            <div className="flex items-center mt-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% improvement potential</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 bg-gray-700/30 rounded-lg">
          <Target className="w-8 h-8 text-green-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-medium mb-1">Optimize Sleep Schedule</h4>
            <p className="text-gray-300 text-sm">Based on your vitals, we recommend adjusting your sleep schedule to get 7-8 hours of quality sleep.</p>
            <div className="flex items-center mt-2 text-blue-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% sleep quality improvement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
