'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Activity, Flame, Footprints, Bluetooth, BluetoothOff, AlertCircle, CheckCircle, TrendingUp, Clock, Battery } from 'lucide-react';

interface HealthMetrics {
  heartRate: number;
  steps: number;
  calories: number;
  distance: number;
  batteryLevel?: number;
  lastUpdated: Date;
}

interface DeviceInfo {
  name: string;
  isConnected: boolean;
  signalStrength: number;
}

export const HealthTrackerDashboard: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    name: 'No Device',
    isConnected: false,
    signalStrength: 0
  });
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    heartRate: 0,
    steps: 0,
    calories: 0,
    distance: 0,
    lastUpdated: new Date()
  });

  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Simulated device connection (since Bluetooth doesn't work in web)
  const simulateDeviceConnection = async () => {
    setIsScanning(true);
    setConnectionStatus('connecting');
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful connection
    setDeviceInfo({
      name: 'Smart Watch Pro',
      isConnected: true,
      signalStrength: 85
    });
    
    setConnectionStatus('connected');
    setIsScanning(false);
    
    // Start simulated data updates
    startHealthDataSimulation();
  };

  const startHealthDataSimulation = () => {
    const interval = setInterval(() => {
      setHealthMetrics(prev => ({
        heartRate: 60 + Math.floor(Math.random() * 40),
        steps: prev.steps + Math.floor(Math.random() * 10),
        calories: prev.calories + Math.floor(Math.random() * 2),
        distance: prev.distance + Math.random() * 0.01,
        batteryLevel: Math.max(0, (prev.batteryLevel || 100) - Math.random() * 0.1),
        lastUpdated: new Date()
      }));
    }, 3000);

    return () => clearInterval(interval);
  };

  const disconnectDevice = () => {
    setDeviceInfo({
      name: 'No Device',
      isConnected: false,
      signalStrength: 0
    });
    setConnectionStatus('disconnected');
    setHealthMetrics({
      heartRate: 0,
      steps: 0,
      calories: 0,
      distance: 0,
      lastUpdated: new Date()
    });
  };

  const syncWithVytalSync = async () => {
    setSyncStatus('syncing');
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSyncStatus('synced');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Bluetooth className="w-5 h-5 text-green-500" />;
      case 'connecting':
        return <Bluetooth className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <BluetoothOff className="w-5 h-5 text-red-500" />;
      default:
        return <BluetoothOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Tracker</h2>
        <p className="text-gray-600">Monitor your health metrics and sync with Vytal Sync</p>
      </div>

      {/* Device Connection Status */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getConnectionIcon()}
            <div>
              <h3 className="font-semibold text-gray-900">{deviceInfo.name}</h3>
              <p className="text-sm text-gray-600">
                {connectionStatus === 'connected' ? `Signal: ${deviceInfo.signalStrength}%` : 'No device connected'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {connectionStatus === 'disconnected' && (
              <button
                onClick={simulateDeviceConnection}
                disabled={isScanning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isScanning ? 'Scanning...' : 'Connect Device'}
              </button>
            )}
            
            {connectionStatus === 'connected' && (
              <>
                <button
                  onClick={syncWithVytalSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
                >
                  {getSyncIcon()}
                  <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync to Vytal'}</span>
                </button>
                
                <button
                  onClick={disconnectDevice}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
        
        {syncStatus !== 'idle' && (
          <div className={`p-2 rounded text-sm ${
            syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
            syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {syncStatus === 'syncing' && 'Syncing health data to Vytal Sync...'}
            {syncStatus === 'synced' && 'Health data successfully synced!'}
            {syncStatus === 'error' && 'Sync failed. Please try again.'}
          </div>
        )}
      </div>

      {/* Health Metrics */}
      {connectionStatus === 'connected' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Heart Rate */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-xs text-red-600">BPM</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{healthMetrics.heartRate}</p>
            <p className="text-sm text-red-700">Heart Rate</p>
          </div>

          {/* Steps */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Footprints className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-blue-600">steps</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{healthMetrics.steps.toLocaleString()}</p>
            <p className="text-sm text-blue-700">Steps Today</p>
          </div>

          {/* Calories */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-orange-600">kcal</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{healthMetrics.calories}</p>
            <p className="text-sm text-orange-700">Calories Burned</p>
          </div>

          {/* Distance */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-600">km</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{healthMetrics.distance.toFixed(2)}</p>
            <p className="text-sm text-green-700">Distance</p>
          </div>
        </div>
      )}

      {/* Device Info & Status */}
      {connectionStatus === 'connected' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Battery Status */}
          {healthMetrics.batteryLevel !== undefined && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Battery Level</span>
                </div>
                <span className={`text-sm font-bold ${
                  healthMetrics.batteryLevel > 50 ? 'text-green-600' :
                  healthMetrics.batteryLevel > 20 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(healthMetrics.batteryLevel)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    healthMetrics.batteryLevel > 50 ? 'bg-green-500' :
                    healthMetrics.batteryLevel > 20 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${healthMetrics.batteryLevel}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Last Updated</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {healthMetrics.lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Web Limitation Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">Web Browser Limitation</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This is a simulated connection for demonstration. In a production environment, 
              this would connect to actual Bluetooth devices using the mobile app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
