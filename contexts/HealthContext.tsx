'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface HealthData {
  steps?: number;
  sleep?: number;
  calories?: number;
  water?: number;
  heartRate?: number;
  dailyGoal?: number;
  lastSync?: string;
  points?: number;
}

interface HealthContextType {
  healthData: HealthData | null;
  isConnected: boolean;
  connectHealth: () => Promise<void>;
  syncHealthData: () => Promise<{ success: boolean; message: string }>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [healthData, setHealthData] = useState<HealthData | null>({
    steps: 8452,
    sleep: 7.5,
    calories: 2100,
    water: 6,
    heartRate: 72,
    dailyGoal: 10000,
    lastSync: new Date().toLocaleString(),
    points: 15000,
  });
  const [isConnected, setIsConnected] = useState(true);

  const connectHealth = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsConnected(true);
  };

  const syncHealthData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHealthData(prev => ({
      ...prev,
      lastSync: new Date().toLocaleString(),
    }));
    return { success: true, message: 'Data synced successfully' };
  };

  return (
    <HealthContext.Provider
      value={{
        healthData,
        isConnected,
        connectHealth,
        syncHealthData,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
