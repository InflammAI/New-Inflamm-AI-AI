import { VytalSyncConfig, WearableData, EncryptedData } from './vytal-sync-service';
import { OAuthService } from '../wearable-integrations/oauth-service';

export class ApiService {
  private baseUrl: string;
  private config: VytalSyncConfig;
  private oauthService: OAuthService;

  constructor(config: VytalSyncConfig) {
    this.baseUrl = config.serverEndpoint;
    this.config = config;
    this.oauthService = new OAuthService();
  }

  // ✅ Backend functions for token exchange, refresh, secure storage
  async storeEncryptedData(encryptedData: EncryptedData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/data/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify(encryptedData)
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to store encrypted data' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async retrieveEncryptedData(provider: string, dataType: string, dateRange?: { start: Date; end: Date }): Promise<{ success: boolean; data?: EncryptedData[]; error?: string }> {
    try {
      const params = new URLSearchParams({
        provider,
        dataType,
        ...(dateRange && {
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString()
        })
      });

      const response = await fetch(`${this.baseUrl}/api/vytalsync/data/retrieve?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to retrieve encrypted data' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async deleteEncryptedData(provider: string, dataType: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/data/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({ provider, dataType })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to delete encrypted data' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Sync status and metrics
  async getSyncStatus(): Promise<{ success: boolean; status?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (response.ok) {
        const status = await response.json();
        return { success: true, status };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to get sync status' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async updateSyncConfig(config: Partial<VytalSyncConfig>): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to update config' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Data sharing and access control
  async grantAccess(granteeEmail: string, permissions: string[], expiryDays?: number): Promise<{ success: boolean; shareId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/access/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({
          granteeEmail,
          permissions,
          expiryDays: expiryDays || 30
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, shareId: result.shareId };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to grant access' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async revokeAccess(shareId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/access/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({ shareId })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to revoke access' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async getSharedAccess(): Promise<{ success: boolean; access?: any[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/access/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (response.ok) {
        const access = await response.json();
        return { success: true, access };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to get shared access' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Backup and restore
  async createBackup(): Promise<{ success: boolean; backupId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/backup/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, backupId: result.backupId };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to create backup' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async restoreBackup(backupId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/backup/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({ backupId })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to restore backup' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Data analytics and insights
  async getHealthInsights(provider: string, timeframe: 'week' | 'month' | 'year' = 'week'): Promise<{ success: boolean; insights?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/insights/${provider}?timeframe=${timeframe}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (response.ok) {
        const insights = await response.json();
        return { success: true, insights };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to get health insights' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Real-time data streaming
  async subscribeToRealTimeData(provider: string, callback: (data: any) => void): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      // In a real implementation, this would set up WebSocket or Server-Sent Events
      // For now, simulate with polling
      const response = await fetch(`${this.baseUrl}/api/vytalsync/realtime/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({ provider })
      });

      if (response.ok) {
        const result = await response.json();
        const subscriptionId = result.subscriptionId;
        
        // Set up polling for real-time data
        const pollInterval = setInterval(async () => {
          try {
            const dataResponse = await fetch(`${this.baseUrl}/api/vytalsync/realtime/data/${subscriptionId}`, {
              headers: {
                'Authorization': `Bearer ${this.config.accessToken}`
              }
            });

            if (dataResponse.ok) {
              const realTimeData = await dataResponse.json();
              callback(realTimeData);
            }
          } catch (error) {
            console.error('Real-time data polling error:', error);
          }
        }, 5000); // Poll every 5 seconds

        return { success: true, subscriptionId };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to subscribe to real-time data' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async unsubscribeFromRealTimeData(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/realtime/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({ subscriptionId })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || 'Failed to unsubscribe from real-time data' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Utility methods
  async healthCheck(): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vytalsync/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, status: result.status };
      } else {
        return { 
          success: false, 
          error: 'Health check failed' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}
