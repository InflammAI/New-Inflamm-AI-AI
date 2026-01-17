'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Settings,
  Trash2
} from 'lucide-react';

interface WearableProvider {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isConnected: boolean;
  lastSync?: string;
}

interface WearableConnectProps {
  onConnect?: (provider: string) => void;
  onDisconnect?: (provider: string) => void;
}

export const WearableConnect: React.FC<WearableConnectProps> = ({
  onConnect,
  onDisconnect
}) => {
  const [providers, setProviders] = useState<WearableProvider[]>([
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Connect your Fitbit tracker or smartwatch',
      icon: <Activity className="w-6 h-6" />,
      color: 'blue',
      isConnected: false
    },
    {
      id: 'googlefit',
      name: 'Google Fit',
      description: 'Sync with Google Health and Fitness apps',
      icon: <Heart className="w-6 h-6" />,
      color: 'green',
      isConnected: false
    },
    {
      id: 'garmin',
      name: 'Garmin Connect',
      description: 'Connect Garmin devices and services',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'purple',
      isConnected: false
    },
    {
      id: 'applehealth',
      name: 'Apple Health',
      description: 'Sync with Apple Health and HealthKit',
      icon: <Heart className="w-6 h-6" />,
      color: 'gray',
      isConnected: false
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      description: 'Connect your Oura Ring for advanced sleep tracking',
      icon: <Moon className="w-6 h-6" />,
      color: 'indigo',
      isConnected: false
    }
  ]);

  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    const successParam = urlParams.get('success');
    const errorParam = urlParams.get('error');

    if (provider && successParam === 'true') {
      handleConnectionSuccess(provider);
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    // Check existing connections
    checkExistingConnections();
  }, []);

  const checkExistingConnections = async () => {
    try {
      const response = await fetch('/api/wearable/connections');
      if (response.ok) {
        const connections = await response.json();
        updateProviderConnections(connections);
      }
    } catch (error) {
      console.error('Failed to check connections:', error);
    }
  };

  const updateProviderConnections = (connections: string[]) => {
    setProviders(prev => prev.map(provider => ({
      ...provider,
      isConnected: connections.includes(provider.id),
      lastSync: connections.includes(provider.id) ? new Date().toISOString() : undefined
    })));
  };

  const handleConnectionSuccess = (providerId: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, isConnected: true, lastSync: new Date().toISOString() }
        : provider
    ));
    
    setSuccess(`${providers.find(p => p.id === providerId)?.name} connected successfully!`);
    setConnectingProvider(null);
    onConnect?.(providerId);

    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleConnect = async (providerId: string) => {
    setConnectingProvider(providerId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/wearable/connect/${providerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate connection');
      }

      // Redirect to OAuth provider
      window.location.href = data.url;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      const response = await fetch(`/api/wearable/data/${providerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, isConnected: false, lastSync: undefined }
          : provider
      ));

      onDisconnect?.(providerId);
      setSuccess('Provider disconnected successfully');
    } catch (error) {
      setError('Failed to disconnect provider');
    }
  };

  const getColorClasses = (color: string, isConnected: boolean) => {
    const colorMap = {
      blue: isConnected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200',
      green: isConnected ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200',
      purple: isConnected ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200',
      gray: isConnected ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200',
      indigo: isConnected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'
    };

    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getIconColor = (color: string, isConnected: boolean) => {
    const colorMap = {
      blue: isConnected ? 'text-blue-600' : 'text-gray-400',
      green: isConnected ? 'text-green-600' : 'text-gray-400',
      purple: isConnected ? 'text-purple-600' : 'text-gray-400',
      gray: isConnected ? 'text-gray-600' : 'text-gray-400',
      indigo: isConnected ? 'text-indigo-600' : 'text-gray-400'
    };

    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`p-6 rounded-lg border-2 transition-all duration-200 ${getColorClasses(
              provider.color,
              provider.isConnected
            )}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${getIconColor(provider.color, provider.isConnected)}`}>
                {provider.icon}
              </div>
              
              {provider.isConnected && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">Connected</span>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{provider.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

            {provider.isConnected && provider.lastSync && (
              <div className="mb-4 text-xs text-gray-500">
                Last sync: {new Date(provider.lastSync).toLocaleString()}
              </div>
            )}

            <div className="flex space-x-2">
              {provider.isConnected ? (
                <>
                  <button
                    onClick={() => handleDisconnect(provider.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                  
                  <button
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(provider.id)}
                  disabled={connectingProvider === provider.id}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  {connectingProvider === provider.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">How it works</h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li>1. Click "Connect" on your preferred wearable provider</li>
          <li>2. You'll be redirected to the provider's authorization page</li>
          <li>3. Grant permission to access your health data</li>
          <li>4. We'll automatically sync your steps, heart rate, and sleep data</li>
          <li>5. Your data is encrypted and stored securely using zero-knowledge encryption</li>
        </ol>
      </div>
    </div>
  );
};
