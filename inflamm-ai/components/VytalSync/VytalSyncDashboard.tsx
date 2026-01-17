'use client';

import React, { useState, useEffect } from 'react';
import { DataFlowOrchestrator, DataFlowConfig, DataFlowMetrics } from '@/lib/vytal-sync/data-flow-orchestrator';

interface VytalSyncDashboardProps {
  config: DataFlowConfig;
}

export const VytalSyncDashboard: React.FC<VytalSyncDashboardProps> = ({ config }) => {
  const [orchestrator, setOrchestrator] = useState<DataFlowOrchestrator | null>(null);
  const [metrics, setMetrics] = useState<DataFlowMetrics | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOrchestrator = async () => {
      try {
        const newOrchestrator = await DataFlowOrchestrator.create(config);
        setOrchestrator(newOrchestrator);
        setIsInitialized(true);
        
        const initialMetrics = await newOrchestrator.getMetrics();
        setMetrics(initialMetrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
      }
    };

    initializeOrchestrator();

    return () => {
      if (orchestrator) {
        orchestrator.destroy();
      }
    };
  }, []);

  const handleFullSync = async () => {
    if (!orchestrator) return;

    setIsSyncing(true);
    setError(null);

    try {
      await orchestrator.performFullSync();
      const updatedMetrics = await orchestrator.getMetrics();
      setMetrics(updatedMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshMetrics = async () => {
    if (!orchestrator) return;

    try {
      const updatedMetrics = await orchestrator.getMetrics();
      setMetrics(updatedMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh metrics');
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-blue-800">Initializing Vytal Sync...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vytal Sync Dashboard</h2>
        <p className="text-gray-600">Monitor and manage your health data synchronization</p>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Total Data Points</h3>
            <p className="text-2xl font-bold text-blue-900">{metrics.totalDataPoints}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-1">Successful Uploads</h3>
            <p className="text-2xl font-bold text-green-900">{metrics.successfulUploads}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Average Latency</h3>
            <p className="text-2xl font-bold text-purple-900">{Math.round(metrics.averageLatency)}ms</p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleFullSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSyncing ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Syncing...</span>
            </span>
          ) : (
            'Perform Full Sync'
          )}
        </button>
        
        <button
          onClick={refreshMetrics}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Refresh Metrics
        </button>
      </div>

      {/* Data Flow Visualization */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Flow Status</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Wearable Device</span>
            <span className="text-xs text-gray-500">→</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">OS Health API</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 ml-6">↓</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Vytal Sync App (Encrypted)</span>
            <span className="text-xs text-gray-500">→</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Zero-Knowledge API</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 ml-6">↓</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Encrypted Database</span>
          </div>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Configuration</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>Real-time Sync: {config.enableRealTimeSync ? 'Enabled' : 'Disabled'}</p>
          <p>Sync Interval: {config.syncInterval ? `${config.syncInterval / 1000}s` : 'Manual'}</p>
          <p>Retention: {config.retentionDays ? `${config.retentionDays} days` : 'Forever'}</p>
        </div>
      </div>
    </div>
  );
};
