import { WEARABLE_PROVIDERS, WearableProvider, TokenStorage, WearableData } from './oauth-configs';
import * as crypto from 'crypto';

export class OAuthService {
  private static generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private static async storeState(state: string, provider: string): Promise<void> {
    // Store state in database or Redis with expiration
    // For now, we'll use a simple in-memory store
    if (!global.oauthStates) {
      global.oauthStates = new Map();
    }
    global.oauthStates.set(state, { provider, createdAt: Date.now() });
  }

  private static async verifyState(state: string): Promise<string | null> {
    if (!global.oauthStates) return null;
    
    const stored = global.oauthStates.get(state);
    if (!stored) return null;
    
    // Check if state is not expired (5 minutes)
    if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
      global.oauthStates.delete(state);
      return null;
    }
    
    global.oauthStates.delete(state);
    return stored.provider;
  }

  static getAuthorizationUrl(provider: string): { url: string; state: string } {
    const config = WEARABLE_PROVIDERS[provider]?.config;
    if (!config) {
      throw new Error(`Provider ${provider} not supported`);
    }

    const state = this.generateState();
    this.storeState(state, provider);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope.join(' '),
      state: state,
      access_type: 'offline', // For refresh tokens
      prompt: 'consent' // Force consent dialog
    });

    // Provider-specific parameters
    if (provider === 'fitbit') {
      params.set('expires_in', '31536000'); // 1 year
    } else if (provider === 'googlefit') {
      params.set('include_granted_scopes', 'true');
    }

    return {
      url: `${config.authorizationUrl}?${params.toString()}`,
      state
    };
  }

  static async exchangeCodeForToken(
    provider: string,
    code: string,
    state: string
  ): Promise<TokenStorage> {
    const verifiedProvider = await this.verifyState(state);
    if (!verifiedProvider || verifiedProvider !== provider) {
      throw new Error('Invalid state parameter');
    }

    const config = WEARABLE_PROVIDERS[provider]?.config;
    if (!config) {
      throw new Error(`Provider ${provider} not supported`);
    }

    const tokenParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri
    });

    // Provider-specific token exchange
    if (provider === 'fitbit') {
      tokenParams.set('expires_in', '31536000');
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: tokenParams.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const tokenData = await response.json();
    
    return {
      provider,
      userId: 'current-user', // Get from session/auth
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
      scope: tokenData.scope ? tokenData.scope.split(' ') : config.scope
    };
  }

  static async refreshAccessToken(provider: string, refreshToken: string): Promise<TokenStorage> {
    const config = WEARABLE_PROVIDERS[provider]?.config;
    if (!config) {
      throw new Error(`Provider ${provider} not supported`);
    }

    const refreshParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: refreshParams.toString()
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokenData = await response.json();
    
    return {
      provider,
      userId: 'current-user',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
      scope: tokenData.scope ? tokenData.scope.split(' ') : config.scope
    };
  }

  static async fetchWearableData(
    provider: string,
    accessToken: string,
    date: string
  ): Promise<WearableData> {
    const providerConfig = WEARABLE_PROVIDERS[provider];
    if (!providerConfig) {
      throw new Error(`Provider ${provider} not supported`);
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`
    };

    // Provider-specific headers
    if (provider === 'fitbit') {
      headers['Accept-Locale'] = 'en_US';
    }

    try {
      const [stepsData, heartRateData, sleepData] = await Promise.all([
        this.fetchSteps(provider, accessToken, date),
        this.fetchHeartRate(provider, accessToken, date),
        this.fetchSleep(provider, accessToken, date)
      ]);

      return {
        provider,
        date,
        steps: stepsData,
        heartRate: heartRateData,
        sleep: sleepData
      };
    } catch (error) {
      console.error(`Failed to fetch data from ${provider}:`, error);
      throw error;
    }
  }

  private static async fetchSteps(provider: string, accessToken: string, date: string): Promise<number> {
    const providerConfig = WEARABLE_PROVIDERS[provider];
    const url = `${providerConfig.config.apiUrl}${providerConfig.endpoints.steps.replace('{date}', date)}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch steps: ${response.statusText}`);
    }

    const data = await response.json();

    // Provider-specific step parsing
    switch (provider) {
      case 'fitbit':
        return data['activities-steps']?.[0]?.value ? parseInt(data['activities-steps'][0].value) : 0;
      case 'googlefit':
        return data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
      case 'garmin':
        return data.totalSteps || 0;
      case 'oura':
        return data.steps || 0;
      default:
        return 0;
    }
  }

  private static async fetchHeartRate(provider: string, accessToken: string, date: string): Promise<any> {
    const providerConfig = WEARABLE_PROVIDERS[provider];
    const url = `${providerConfig.config.apiUrl}${providerConfig.endpoints.heartRate.replace('{date}', date)}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch heart rate: ${response.statusText}`);
    }

    const data = await response.json();

    // Provider-specific heart rate parsing
    switch (provider) {
      case 'fitbit':
        const hrData = data['activities-heart-intraday']?.dataset || [];
        return {
          resting: data['activities-heart']?.[0]?.value?.restingHeartRate || 0,
          average: data['activities-heart']?.[0]?.value?.restingHeartRate || 0,
          maximum: Math.max(...hrData.map((d: any) => d.value)),
          data: hrData.map((d: any) => ({
            time: d.time,
            value: d.value
          }))
        };
      case 'oura':
        return {
          resting: data.resting_hr || 0,
          average: data.average_hr || 0,
          maximum: data.max_hr || 0,
          data: data.heart_rate?.map((d: any) => ({
            time: d.timestamp,
            value: d.bpm
          })) || []
        };
      default:
        return {
          resting: 0,
          average: 0,
          maximum: 0,
          data: []
        };
    }
  }

  private static async fetchSleep(provider: string, accessToken: string, date: string): Promise<any> {
    const providerConfig = WEARABLE_PROVIDERS[provider];
    const url = `${providerConfig.config.apiUrl}${providerConfig.endpoints.sleep.replace('{date}', date)}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sleep: ${response.statusText}`);
    }

    const data = await response.json();

    // Provider-specific sleep parsing
    switch (provider) {
      case 'fitbit':
        const sleep = data.sleep?.[0];
        return {
          totalMinutes: sleep?.totalMinutesAsleep || 0,
          efficiency: sleep?.efficiency || 0,
          stages: {
            deep: sleep?.levels?.deep?.minutes || 0,
            light: sleep?.levels?.light?.minutes || 0,
            rem: sleep?.levels?.rem?.minutes || 0,
            awake: sleep?.levels?.wake?.minutes || 0
          }
        };
      case 'oura':
        return {
          totalMinutes: data.total_sleep_duration || 0,
          efficiency: data.sleep_efficiency || 0,
          stages: {
            deep: data.deep_sleep_duration || 0,
            light: data.light_sleep_duration || 0,
            rem: data.rem_sleep_duration || 0,
            awake: data.awake_time || 0
          }
        };
      default:
        return {
          totalMinutes: 0,
          efficiency: 0,
          stages: {
            deep: 0,
            light: 0,
            rem: 0,
            awake: 0
          }
        };
    }
  }
}

// Global state storage (in production, use Redis or database)
declare global {
  var oauthStates: Map<string, { provider: string; createdAt: number }> | undefined;
}
