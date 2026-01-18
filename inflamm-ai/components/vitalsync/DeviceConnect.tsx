'use client';

import React, { useState } from 'react';
import { Bluetooth, BluetoothOff, Plus } from 'lucide-react';

export const DeviceConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Device Connect</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isConnected ? (
            <>
              <Bluetooth className="w-4 h-4" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <BluetoothOff className="w-4 h-4" />
              <span>Disconnected</span>
            </>
          )}
        </div>
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isConnected 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      
      <div className="mt-6">
        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          Add New Device
        </button>
      </div>
    </div>
  );
};
