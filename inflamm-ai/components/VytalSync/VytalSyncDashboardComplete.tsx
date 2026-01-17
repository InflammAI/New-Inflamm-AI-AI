'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Shield, 
  Upload, 
  Download, 
  Clock, 
  Activity, 
  Users, 
  Key,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Server,
  Wifi,
  WifiOff,
  FileText,
  Settings,
  Eye,
  EyeOff,
  Watch,
  Heart,
  Footprints,
  Moon,
  Brain,
  Zap,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useVytalSync } from '@/hooks/useVytalSync';

interface VytalSyncDashboardProps {
  initialProvider?: string;
}

export const VytalSyncDashboardComplete: React.FC<VytalSyncDashboardProps> = ({ initialProvider }) => {
  const {
    isConnected,
    isConnecting,
    connectedProviders,
    currentData,
    metrics,
    error,
    loading,
    connectWatch,
    disconnectWatch,
    syncData,
    exportData,
    getChartData,
    refreshMetrics
  } = useVytalSync();

  const [activeTab, setActiveTab] = useState<'overview' | 'realtime' | 'providers' | 'analytics' | 'settings'>('overview');
  const [selectedProvider, setSelectedProvider] = useState<string>(initialProvider || '');
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'steps' | 'sleep' | 'calories'>('heartRate');
  const [chartData, setChartData] = useState<any[]>([]);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Load chart data when provider or metric changes
  useEffect(() => {
    if (selectedProvider && selectedMetric) {
      const loadChartData = async () => {
        const data = await getChartData(selectedProvider, selectedMetric, 30);
        setChartData(data);
      };
      loadChartData();
    }
  }, [selectedProvider, selectedMetric, getChartData]);

  // ✅ Connect Watch button logic
  const handleConnectWatch = async (provider: string) => {
    const result = await connectWatch(provider);
    if (result.success) {
      setSelectedProvider(provider);
    }
  };

  const handleDisconnectWatch = async (provider: string) => {
    const result = await disconnectWatch(provider);
    if (result.success) {
      if (selectedProvider === provider) {
        setSelectedProvider('');
        setChartData([]);
      }
    }
  };

  const handleSyncData = async () => {
    if (selectedProvider) {
      await syncData(selectedProvider);
      await refreshMetrics();
    }
  };

  const handleExportData = async (format: 'json' | 'csv' = 'json') => {
    if (selectedProvider) {
      await exportData(selectedProvider, format);
    }
  };

  const getMetricColor = (metric: string) => {
    const colors = {
      heartRate: '#EF4444',
      steps: '#3B82F6',
      sleep: '#8B5CF6',
      calories: '#F59E0B'
    };
    return colors[metric as keyof typeof colors] || '#6B7280';
  };

  const getProviderIcon = (provider: string) => {
    const icons = {
      fitbit: Watch,
      garmin: Activity,
      googlefit: Footprints
    };
    return icons[provider as keyof typeof icons] || Watch;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedProviders.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Devices Connected</h4>
              <p className="text-gray-600 mb-4">Connect your wearable devices to start syncing health data</p>
            </div>
          ) : (
            connectedProviders.map(provider => (
              <div key={provider} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {React.createElement(getProviderIcon(provider), { className: "w-6 h-6 text-blue-500" })}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{provider}</p>
                    <p className="text-sm text-gray-600">Connected and syncing</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnectWatch(provider)}
                  className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <Database className="w-8 h-8 text-blue-500" />
                <span className="text-sm text-blue-600 font-medium">Total</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{metrics.totalDataPoints?.toLocaleString() || 0}</p>
              <p className="text-sm text-blue-700 mt-1">Data Points</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Encrypted</span>
              </div>
              <p className="text-3xl font-bold text-green-900">{metrics.encryptedDataPoints?.toLocaleString() || 0}</p>
              <p className="text-sm text-green-700 mt-1">Secure Records</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <Upload className="w-8 h-8 text-purple-500" />
                <span className="text-sm text-purple-600 font-medium">Success</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">{metrics.successfulUploads?.toLocaleString() || 0}</p>
              <p className="text-sm text-purple-700 mt-1">Uploads</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-orange-500" />
                <span className="text-sm text-orange-600 font-medium">Latency</span>
              </div>
              <p className="text-3xl font-bold text-orange-900">{Math.round(metrics.averageLatency || 0)}ms</p>
              <p className="text-sm text-orange-700 mt-1">Avg Response</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
    </div>
  );

  const renderRealTime = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Health Data</h3>
        
        {currentData ? (
          <div className="space-y-4">
            {/* Current Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-xs text-gray-500">BPM</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentData.heartRate?.current || '--'}</p>
                <p className="text-sm text-gray-600">Heart Rate</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Footprints className="w-6 h-6 text-blue-500" />
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentData.steps?.toLocaleString() || '--'}</p>
                <p className="text-sm text-gray-600">Steps</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Moon className="w-6 h-6 text-indigo-500" />
                  <span className="text-xs text-gray-500">Hours</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.sleep ? Math.floor((currentData.sleep.totalMinutes || 0) / 60) : '--'}
                </p>
                <p className="text-sm text-gray-600">Sleep</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className="text-xs text-gray-500">Level</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {currentData.activities?.[0]?.type || '--'}
                </p>
                <p className="text-sm text-gray-600">Activity</p>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Health Trends</h4>
                
                <div className="flex space-x-2">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="heartRate">Heart Rate</option>
                    <option value="steps">Steps</option>
                    <option value="sleep">Sleep</option>
                    <option value="calories">Calories</option>
                  </select>
                  
                  <button
                    onClick={handleSyncData}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getMetricColor(selectedMetric)}
                      fill={getMetricColor(selectedMetric)}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading real-time data...</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Wearable Devices</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['fitbit', 'garmin', 'googlefit'].map(provider => (
            <div key={provider} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col items-center space-y-4">
                {React.createElement(getProviderIcon(provider), { className: "w-12 h-12 text-gray-400" })}
                <h4 className="text-lg font-medium text-gray-900 capitalize">{provider}</h4>
                
                {connectedProviders.includes(provider) ? (
                  <div className="text-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Connected</p>
                    <button
                      onClick={() => handleDisconnectWatch(provider)}
                      disabled={isConnecting}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isConnecting ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => handleConnectWatch(provider)}
                      disabled={isConnecting}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isConnecting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <Watch className="w-4 h-4" />
                          <span>Connect {provider}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Analytics</h3>
        
        {selectedProvider ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Provider</option>
                {connectedProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportData('json')}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </button>
                <button
                  onClick={() => handleExportData('csv')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Heart Rate Analysis</h4>
                {currentData?.heartRate && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current:</span>
                      <span className="font-medium">{currentData.heartRate.current} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average:</span>
                      <span className="font-medium">{currentData.heartRate.average} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resting:</span>
                      <span className="font-medium">{currentData.heartRate.resting} BPM</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Activity Summary</h4>
                {currentData?.activities && (
                  <div className="space-y-2">
                    {currentData.activities.map((activity, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-gray-600">{activity.type}:</span>
                        <span className="font-medium">{activity.duration} min</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Connect a device to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">VytalSync Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Encryption Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Zero-Knowledge Encryption</label>
                <div className="relative">
                  <input
                    type={showPrivateKey ? 'text' : 'password'}
                    value={showPrivateKey ? 'Encryption key stored securely' : '••••••••••••••••••••'}
                    readOnly
                    className="flex-1 p-2 bg-gray-50 rounded text-xs font-mono text-gray-700"
                  />
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sync Configuration</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Auto-sync</label>
                <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Enabled</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Sync Interval</label>
                <span className="text-sm text-gray-600">30 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Data Retention</label>
                <span className="text-sm text-gray-600">30 days</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={refreshMetrics}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh All Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">VytalSync Dashboard</h1>
        <p className="text-gray-600">Complete health data synchronization with zero-knowledge encryption</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Database },
            { id: 'realtime', label: 'Real-time', icon: Heart },
            { id: 'providers', label: 'Providers', icon: Watch },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {React.createElement(tab.icon, { className: "w-4 h-4 mr-2" })}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'realtime' && renderRealTime()}
        {activeTab === 'providers' && renderProviders()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};
