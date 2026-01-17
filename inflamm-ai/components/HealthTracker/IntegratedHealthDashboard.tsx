'use client';

import React, { useState, useEffect } from 'react';
import { AuthSection } from '@/components/VytalSync/AuthSection';
import { VitalsRecorder } from '@/components/VytalSync/VitalsRecorder';
import { VitalsChart } from '@/components/VytalSync/VitalsChart';
import { DeviceConnect } from '@/components/VytalSync/DeviceConnect';
import { RecommendationCard } from '@/components/VytalSync/RecommendationCard';
import { Heart, Activity, Database, Shield, TrendingUp, Users, Clock, BarChart3, Bell, Zap } from 'lucide-react';

export const IntegratedHealthDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tracker' | 'devices' | 'recommendations'>('overview');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [healthData, setHealthData] = useState({
    totalDataPoints: 0,
    lastSync: new Date(),
    connectedDevices: 0,
    avgHeartRate: 0,
    totalSteps: 0,
    caloriesBurned: 0
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      fetchRecommendations(storedToken);
      fetchHealthData(storedToken);
    }
  }, []);

  const handleLogin = (accessToken: string, userData: any) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchRecommendations(accessToken);
    fetchHealthData(accessToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setRecommendations([]);
  };

  const fetchRecommendations = async (accessToken: string) => {
    try {
      const response = await fetch(`${API_URL}/recommendations`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const fetchHealthData = async (accessToken: string) => {
    try {
      // Fetch latest vitals
      const vitalsResponse = await fetch(`${API_URL}/vitals/latest`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      
      // Fetch devices
      const devicesResponse = await fetch(`${API_URL}/devices`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (vitalsResponse.ok && devicesResponse.ok) {
        const vitals = await vitalsResponse.json();
        const devices = await devicesResponse.json();
        
        setHealthData({
          totalDataPoints: vitals.vitals?.length || 0,
          lastSync: new Date(),
          connectedDevices: devices.devices?.length || 0,
          avgHeartRate: vitals.vitals?.find((v: any) => v.heart_rate)?.heart_rate || 72,
          totalSteps: vitals.vitals?.find((v: any) => v.steps)?.steps || 0,
          caloriesBurned: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    }
  };

  const refreshData = () => {
    if (token) {
      fetchRecommendations(token);
      fetchHealthData(token);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="w-12 h-12 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">Vital Sync</h1>
            </div>
            <p className="text-gray-600">Health Tracking & Device Management</p>
          </div>
          <AuthSection onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Vital Sync</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.first_name || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tracker', label: 'Vitals', icon: Heart },
              { id: 'devices', label: 'Devices', icon: Activity },
              { id: 'recommendations', label: 'Recommendations', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <Database className="h-8 w-8 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Data Points</p>
                      <p className="text-2xl font-semibold text-gray-900">{healthData.totalDataPoints}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Connected Devices</p>
                      <p className="text-2xl font-semibold text-gray-900">{healthData.connectedDevices}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Heart Rate</p>
                      <p className="text-2xl font-semibold text-gray-900">{healthData.avgHeartRate} bpm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Steps</p>
                      <p className="text-2xl font-semibold text-gray-900">{healthData.totalSteps.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Recommendations</h2>
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        apiUrl={API_URL}
                        accessToken={token}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <VitalsRecorder
                  apiUrl={API_URL}
                  accessToken={token}
                  onSuccess={refreshData}
                />
              </div>
              <div>
                <VitalsChart
                  apiUrl={API_URL}
                  accessToken={token}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div>
            <DeviceConnect
              apiUrl={API_URL}
              accessToken={token}
              onSuccess={refreshData}
            />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">AI Recommendations</h2>
                  <button
                    onClick={() => fetchRecommendations(token)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Refresh
                  </button>
                </div>
                {recommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600">Start recording vitals to get personalized AI recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        apiUrl={API_URL}
                        accessToken={token}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
