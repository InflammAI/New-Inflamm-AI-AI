import { useState, useEffect, useCallback } from 'react';
import { VytalSyncService, VytalSyncConfig, WearableData, SyncResult } from '@/lib/vytal-sync/vytal-sync-service';

export interface UseVytalSyncReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connectedProviders: string[];
  currentData: WearableData | null;
  metrics: any;
  error: string | null;
  loading: boolean;
  connectWatch: (provider: string) => Promise<{ success: boolean; error?: string }>;
  disconnectWatch: (provider: string) => Promise<{ success: boolean; error?: string }>;
  syncData: (provider?: string) => Promise<SyncResult>;
  exportData: (provider: string, format?: 'json' | 'csv') => Promise<{ success: boolean; data?: string; error?: string }>;
  getChartData: (provider: string, metric: string, days?: number) => Promise<any[]>;
  refreshMetrics: () => Promise<void>;
}

export const useVytalSync = (config?: Partial<VytalSyncConfig>): UseVytalSyncReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [currentData, setCurrentData] = useState<WearableData | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize VytalSync service
  const [vytalSyncService] = useState(() => {
    const defaultConfig: VytalSyncConfig = {
      wearableApiEndpoint: process.env.NEXT_PUBLIC_WEARABLE_API_ENDPOINT || '',
      accessToken: '',
      serverEndpoint: process.env.NEXT_PUBLIC_VYTALSYNC_SERVER_ENDPOINT || '',
      serverPublicKey: process.env.NEXT_PUBLIC_VYTALSYNC_PUBLIC_KEY || '',
      enableRealTimeSync: true,
      syncInterval: 30000,
      retentionDays: 30,
      maxRetryAttempts: 3,
      encryptionKey: config?.encryptionKey,
      backupEnabled: config?.backupEnabled ?? true,
      autoBackup: config?.autoBackup ?? true
    };
    return new VytalSyncService(defaultConfig);
  });

  // Check connection status on mount
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const response = await fetch('/api/wearable/connections');
        if (response.ok) {
          const providers = await response.json();
          setConnectedProviders(providers);
          setIsConnected(providers.length > 0);
        }
      } catch (error) {
        console.error('Failed to check connections:', error);
        setError('Failed to check wearable connections');
      }
    };

    checkConnections();
    
    // Set up periodic connection checks
    const interval = setInterval(checkConnections, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Connect Watch button logic
  const connectWatch = useCallback(async (provider: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const result = await vytalSyncService[0].connectWatch(provider);
      
      if (result.success) {
        setConnectedProviders(prev => [...prev, provider]);
        setIsConnected(true);
      } else {
        setError(result.error || 'Connection failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [vytalSyncService]);

  // ✅ OAuth flows for Fitbit, Garmin, Google Fit
  const handleOAuthCallback = useCallback(async (provider: string, code: string, state: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await vytalSyncService[0].handleOAuthCallback(provider, code, state);
      
      if (result.success) {
        setConnectedProviders(prev => [...prev, provider]);
        setIsConnected(true);
      } else {
        setError(result.error || 'OAuth callback failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'OAuth callback failed');
    } finally {
      setLoading(false);
    }
  }, [vytalSyncService]);

  // ✅ Data retrieval functions (heart rate, steps, sleep)
  const syncData = useCallback(async (provider?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const targetProvider = provider || connectedProviders[0];
      if (!targetProvider) {
        setError('No provider available for sync');
        return;
      }

      const result = await vytalSyncService[0].syncProviderData(targetProvider);
      
      if (result.success) {
        // Refresh current data
        const updatedData = await vytalSyncService[0].getProviderData(targetProvider);
        setCurrentData(updatedData);
      } else {
        setError(result.error || 'Data sync failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Data sync failed');
    } finally {
      setLoading(false);
    }
  }, [vytalSyncService, connectedProviders]);

  // ✅ Dashboard integration with charts
  const getChartData = useCallback(async (provider: string, metric: string, days: number = 7) => {
    try {
      return await vytalSyncService[0].getChartData(provider, metric, days);
    } catch (error) {
      console.error('Failed to get chart data:', error);
      return [];
    }
  }, [vytalSyncService]);

  // Refresh metrics
  const refreshMetrics = useCallback(async () => {
    try {
      const updatedMetrics = await vytalSyncService[0].getMetrics();
      setMetrics(updatedMetrics);
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
      setError('Failed to refresh metrics');
    }
  }, [vytalSyncService]);

  // Load initial metrics
  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  // Disconnect provider
  const disconnectWatch = useCallback(async (provider: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await vytalSyncService[0].disconnectProvider(provider);
      
      if (result.success) {
        setConnectedProviders(prev => prev.filter(p => p !== provider));
        if (connectedProviders.length <= 1) {
          setIsConnected(false);
          setCurrentData(null);
        }
      } else {
        setError(result.error || 'Disconnection failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Disconnection failed');
    } finally {
      setLoading(false);
    }
  }, [vytalSyncService, connectedProviders]);

  // Export data
  const exportData = useCallback(async (provider: string, format: 'json' | 'csv' = 'json') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await vytalSyncService[0].exportData(provider, format);
      
      if (result.success && result.data) {
        // Download file
        const blob = new Blob([result.data], { 
          type: format === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vytalsync-${provider}-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        setError(result.error || 'Export failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [vytalSyncService]);

  return {
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
  };
};
