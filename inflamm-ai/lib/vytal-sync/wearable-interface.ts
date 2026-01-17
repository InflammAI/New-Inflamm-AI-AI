export interface WearableData {
  id: string;
  timestamp: number;
  heartRate?: number;
  steps?: number;
  calories?: number;
  sleepData?: SleepData;
  activityData?: ActivityData;
  bloodOxygen?: number;
  stressLevel?: number;
}

export interface SleepData {
  duration: number;
  quality: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
}

export interface ActivityData {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
}

export interface OSHealthAPIResponse {
  data: WearableData[];
  hasNext: boolean;
  cursor?: string;
}

export class WearableInterface {
  private apiEndpoint: string;
  private accessToken: string;

  constructor(apiEndpoint: string, accessToken: string) {
    this.apiEndpoint = apiEndpoint;
    this.accessToken = accessToken;
  }

  async fetchHealthData(startDate: Date, endDate: Date, cursor?: string): Promise<OSHealthAPIResponse> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`${this.apiEndpoint}/health-data?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch health data: ${response.statusText}`);
    }

    return response.json();
  }

  async subscribeToRealTimeData(callback: (data: WearableData) => void): Promise<void> {
    const eventSource = new EventSource(`${this.apiEndpoint}/health-data/stream?token=${this.accessToken}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    eventSource.onerror = (error) => {
      console.error('Real-time data stream error:', error);
      eventSource.close();
    };
  }
}
