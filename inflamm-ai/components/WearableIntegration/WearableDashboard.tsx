'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WearableData {
  provider: string;
  date: string;
  steps?: number;
  heartRate?: {
    resting: number;
    average: number;
    maximum: number;
    data: Array<{
      time: string;
      value: number;
    }>;
  };
  sleep?: {
    totalMinutes: number;
    efficiency: number;
    stages: {
      deep: number;
      light: number;
      rem: number;
      awake: number;
    };
  };
}

interface WearableDashboardProps {
  connectedProviders: string[];
}

export const WearableDashboard: React.FC<WearableDashboardProps> = ({
  connectedProviders
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState<string>(connectedProviders[0] || '');
  const [data, setData] = useState<WearableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProvider && connectedProviders.includes(selectedProvider)) {
      fetchWearableData();
    }
  }, [selectedProvider, selectedDate]);

  const fetchWearableData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/wearable/data/${selectedProvider}?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch wearable data');
      }

      const wearableData = await response.json();
      setData(wearableData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!data) return;

    const exportData = {
      provider: data.provider,
      date: data.date,
      steps: data.steps,
      heartRate: data.heartRate,
      sleep: data.sleep,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.provider}-data-${data.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getHeartRateChartData = () => {
    if (!data?.heartRate?.data) return [];
    
    return data.heartRate.data
      .filter((_, index) => index % 10 === 0) // Sample every 10th point for readability
      .map(point => ({
        time: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: point.value
      }));
  };

  const getSleepChartData = () => {
    if (!data?.sleep) return [];
    
    return [
      { stage: 'Deep', minutes: data.sleep.stages.deep, color: '#4F46E5' },
      { stage: 'Light', minutes: data.sleep.stages.light, color: '#7C3AED' },
      { stage: 'REM', minutes: data.sleep.stages.rem, color: '#EC4899' },
      { stage: 'Awake', minutes: data.sleep.stages.awake, color: '#F59E0B' }
    ];
  };

  if (connectedProviders.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Devices</h3>
        <p className="text-gray-600">Connect a wearable device to see your health data here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {connectedProviders.map(provider => (
              <option key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={fetchWearableData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {data && (
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Fetching data...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Data Display */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-blue-500" />
                <span className="text-sm text-blue-600">Steps</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{data.steps?.toLocaleString() || 0}</p>
              <p className="text-sm text-blue-700">Daily Steps</p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-red-500" />
                <span className="text-sm text-red-600">Heart Rate</span>
              </div>
              <p className="text-3xl font-bold text-red-900">{data.heartRate?.average || 0}</p>
              <p className="text-sm text-red-700">Average BPM</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-8 h-8 text-purple-500" />
                <span className="text-sm text-purple-600">Sleep</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                {formatDuration(data.sleep?.totalMinutes || 0)}
              </p>
              <p className="text-sm text-purple-700">Total Sleep</p>
            </div>
          </div>

          {/* Heart Rate Chart */}
          {data.heartRate?.data && data.heartRate.data.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Throughout Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getHeartRateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sleep Stages Chart */}
          {data.sleep && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Stages</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getSleepChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value} minutes`, 'Duration']} />
                  <Bar dataKey="minutes" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{data.sleep.stages.deep}</p>
                  <p className="text-sm text-gray-600">Deep Sleep</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{data.sleep.stages.light}</p>
                  <p className="text-sm text-gray-600">Light Sleep</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">{data.sleep.stages.rem}</p>
                  <p className="text-sm text-gray-600">REM Sleep</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{data.sleep.stages.awake}</p>
                  <p className="text-sm text-gray-600">Awake Time</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Stats */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.heartRate && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Heart Rate Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resting Heart Rate</span>
                      <span className="text-sm font-medium text-gray-900">{data.heartRate.resting} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Heart Rate</span>
                      <span className="text-sm font-medium text-gray-900">{data.heartRate.average} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maximum Heart Rate</span>
                      <span className="text-sm font-medium text-gray-900">{data.heartRate.maximum} BPM</span>
                    </div>
                  </div>
                </div>
              )}

              {data.sleep && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sleep Quality</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sleep Efficiency</span>
                      <span className="text-sm font-medium text-gray-900">{data.sleep.efficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Sleep Time</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDuration(data.sleep.totalMinutes)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sleep Quality</span>
                      <span className={`text-sm font-medium ${
                        data.sleep.efficiency >= 85 ? 'text-green-600' :
                        data.sleep.efficiency >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {data.sleep.efficiency >= 85 ? 'Excellent' :
                         data.sleep.efficiency >= 70 ? 'Good' :
                         'Poor'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
