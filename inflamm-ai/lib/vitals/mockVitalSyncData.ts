interface VitalSyncData {
  dailyWellness: {
    currentStreak: {
      days: number;
      progressPercent: number;
    };
    waterIntake: {
      consumedCups: number;
      goalCups: number;
      lastUpdateMinutesAgo: number;
    };
    activeMinutes: {
      completed: number;
      goal: number;
    };
  };
  vitalSigns: {
    heartRate: {
      value: number;
      status: 'normal' | 'slightly_elevated' | 'low' | 'critical';
      recommendation: string;
    };
    oxygenSaturation: {
      value: number;
      status: 'normal' | 'low' | 'critical';
      recommendation: string;
    };
    respiratoryRate: {
      value: number;
      status: 'normal' | 'elevated' | 'low' | 'critical';
      recommendation: string;
    };
  };
  connectedDevices: {
    fitnessBand: {
      connected: boolean;
      signalStrength: number;
      batteryPercent: number;
    };
    smartRing: {
      connected: boolean;
      batteryPercent: number;
    };
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    value?: string;
    timestamp: Date;
  }>;
  boostVitalsActions: Array<{
    id: string;
    label: string;
    iconName: string;
    duration?: number;
    amount?: string;
    affectedVitals: string[];
  }>;
  inactivityPrompt: {
    hoursInactive: number;
    message: string;
  };
  deviceSyncState: {
    wearableConnected: boolean;
    supportedDeviceTypes: string[];
  };
}

export const getVitalSyncMockData = (): VitalSyncData => {
  return {
    dailyWellness: {
      currentStreak: {
        days: 7,
        progressPercent: 85
      },
      waterIntake: {
        consumedCups: 4,
        goalCups: 8,
        lastUpdateMinutesAgo: 12
      },
      activeMinutes: {
        completed: 45,
        goal: 60
      }
    },
    vitalSigns: {
      heartRate: {
        value: 72,
        status: 'normal',
        recommendation: 'Your heart rate is within healthy range. Continue with current activity level.'
      },
      oxygenSaturation: {
        value: 98,
        status: 'normal',
        recommendation: 'Oxygen levels are optimal. Maintain regular breathing patterns.'
      },
      respiratoryRate: {
        value: 16,
        status: 'normal',
        recommendation: 'Respiratory rate is normal. Keep up the good breathing habits.'
      }
    },
    connectedDevices: {
      fitnessBand: {
        connected: true,
        signalStrength: 85,
        batteryPercent: 67
      },
      smartRing: {
        connected: true,
        batteryPercent: 42
      }
    },
    alerts: [
      {
        id: 'alert-001',
        type: 'info',
        title: 'Heart Rate Dropped',
        message: 'Heart rate dropped below normal range',
        value: '62 bpm',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 'alert-002',
        type: 'warning',
        title: 'Low Water Intake',
        message: 'You\'re behind on your daily hydration goal',
        value: '4/8 cups',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      }
    ],
    boostVitalsActions: [
      {
        id: 'action-001',
        label: 'Take a 10-minute walk',
        iconName: 'walk',
        duration: 10,
        affectedVitals: ['heartRate', 'respiratoryRate']
      },
      {
        id: 'action-002',
        label: 'Drink water',
        iconName: 'water',
        amount: '4/8 cups',
        affectedVitals: ['hydration']
      },
      {
        id: 'action-003',
        label: 'Practice deep breathing',
        iconName: 'breathing',
        duration: 5,
        affectedVitals: ['heartRate', 'oxygenSaturation']
      }
    ],
    inactivityPrompt: {
      hoursInactive: 2,
      message: 'You\'ve been inactive for 2 hours. Try a quick stretch or walk to boost circulation.'
    },
    deviceSyncState: {
      wearableConnected: true,
      supportedDeviceTypes: ['Smart Watch', 'Fitness Band', 'Smart Ring']
    }
  };
};
