export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authorizationUrl: string;
  tokenUrl: string;
  apiUrl: string;
}

export interface WearableProvider {
  name: string;
  config: OAuthConfig;
  endpoints: {
    steps: string;
    heartRate: string;
    sleep: string;
    profile: string;
  };
}

export const WEARABLE_PROVIDERS: Record<string, WearableProvider> = {
  fitbit: {
    name: 'Fitbit',
    config: {
      clientId: process.env.FITBIT_CLIENT_ID || '',
      clientSecret: process.env.FITBIT_CLIENT_SECRET || '',
      redirectUri: process.env.FITBIT_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/callback/fitbit`,
      scope: ['activity', 'heartrate', 'sleep', 'profile'],
      authorizationUrl: 'https://www.fitbit.com/oauth2/authorize',
      tokenUrl: 'https://api.fitbit.com/oauth2/token',
      apiUrl: 'https://api.fitbit.com/1/user'
    },
    endpoints: {
      steps: '/-/activities/date/{date}.json',
      heartRate: '/-/activities/heart/date/{date}/1d/1sec.json',
      sleep: '/-/sleep/date/{date}.json',
      profile: '/-/profile.json'
    }
  },

  googlefit: {
    name: 'Google Fit',
    config: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/callback/googlefit`,
      scope: [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.sleep.read'
      ],
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      apiUrl: 'https://www.googleapis.com/fitness/v1/users'
    },
    endpoints: {
      steps: '/me/aggregates/datasource/data',
      heartRate: '/me/aggregates/datasource/data',
      sleep: '/me/aggregates/datasource/data',
      profile: '/me'
    }
  },

  garmin: {
    name: 'Garmin Connect',
    config: {
      clientId: process.env.GARMIN_CLIENT_ID || '',
      clientSecret: process.env.GARMIN_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/callback/garmin`,
      scope: ['read'],
      authorizationUrl: 'https://connect.garmin.com/oauthConfirm',
      tokenUrl: 'https://connect.garmin.com/oauthService/oauth/access_token',
      apiUrl: 'https://connect.garmin.com/modern/proxy'
    },
    endpoints: {
      steps: '/usersummary-service/usersummary/date/{date}',
      heartRate: '/usersummary-service/usersummary/date/{date}',
      sleep: '/wellness-service/wellness/dailySleepData/{date}',
      profile: '/user-service/user/profile'
    }
  },

  applehealth: {
    name: 'Apple Health',
    config: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/callback/applehealth`,
      scope: ['health.read'],
      authorizationUrl: 'https://appleid.apple.com/auth/authorize',
      tokenUrl: 'https://appleid.apple.com/auth/token',
      apiUrl: 'https://api.healthkit.apple.com/v1'
    },
    endpoints: {
      steps: '/records/stepCount',
      heartRate: '/records/heartRate',
      sleep: '/records/sleepAnalysis',
      profile: '/profile'
    }
  },

  oura: {
    name: 'Oura Ring',
    config: {
      clientId: process.env.OURA_CLIENT_ID || '',
      clientSecret: process.env.OURA_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/wearable/callback/oura`,
      scope: ['email', 'personal', 'daily', 'heartrate', 'sleep'],
      authorizationUrl: 'https://cloud.ouraring.com/oauth/authorize',
      tokenUrl: 'https://cloud.ouraring.com/oauth/token',
      apiUrl: 'https://api.ouraring.com/v2'
    },
    endpoints: {
      steps: '/daily/activity',
      heartRate: '/heartrate',
      sleep: '/daily/sleep',
      profile: '/usercollection/personal_info'
    }
  }
};

export interface TokenStorage {
  provider: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scope: string[];
}

export interface WearableData {
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
