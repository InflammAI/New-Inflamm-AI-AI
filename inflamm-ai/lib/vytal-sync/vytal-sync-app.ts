import { WearableData, WearableInterface } from './wearable-interface';
import { ClientSideEncryption, SignedRequest } from './encryption';

export interface SyncConfig {
  wearableApiEndpoint: string;
  accessToken: string;
  serverEndpoint: string;
  serverPublicKey: string;
  syncInterval?: number; // in milliseconds
}

export interface SyncStatus {
  lastSync: number;
  totalRecords: number;
  syncedRecords: number;
  failedRecords: number;
  isSyncing: boolean;
  error?: string;
}

export class VytalSyncApp {
  private wearable: WearableInterface;
  private encryption: ClientSideEncryption;
  private config: SyncConfig;
  private syncTimer?: NodeJS.Timeout;
  private status: SyncStatus;

  constructor(config: SyncConfig) {
    this.config = config;
    this.wearable = new WearableInterface(config.wearableApiEndpoint, config.accessToken);
    this.encryption = new ClientSideEncryption();
    this.encryption.setServerPublicKey(config.serverPublicKey);
    
    this.status = {
      lastSync: 0,
      totalRecords: 0,
      syncedRecords: 0,
      failedRecords: 0,
      isSyncing: false,
    };
  }

  async initialize(): Promise<void> {
    // Test connection to wearable API
    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      await this.wearable.fetchHealthData(yesterday, now);
      console.log('Wearable API connection successful');
    } catch (error) {
      throw new Error(`Failed to connect to wearable API: ${error}`);
    }

    // Start automatic sync if interval is configured
    if (this.config.syncInterval && this.config.syncInterval > 0) {
      this.startAutoSync();
    }
  }

  async syncData(startDate?: Date, endDate?: Date): Promise<SyncStatus> {
    this.status.isSyncing = true;
    this.status.error = undefined;

    try {
      const syncStart = new Date();
      const syncEnd = endDate || new Date();
      const syncStartDate = startDate || new Date(this.status.lastSync || 0);

      let cursor: string | undefined;
      let totalRecords = 0;
      let syncedRecords = 0;
      let failedRecords = 0;

      do {
        const response = await this.wearable.fetchHealthData(syncStartDate, syncEnd, cursor);
        totalRecords += response.data.length;

        // Process each record
        for (const record of response.data) {
          try {
            await this.uploadRecord(record);
            syncedRecords++;
          } catch (error) {
            console.error(`Failed to sync record ${record.id}:`, error);
            failedRecords++;
          }
        }

        cursor = response.cursor;
      } while (cursor);

      this.status.lastSync = syncStart.getTime();
      this.status.totalRecords = totalRecords;
      this.status.syncedRecords = syncedRecords;
      this.status.failedRecords = failedRecords;

    } catch (error) {
      this.status.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      this.status.isSyncing = false;
    }

    return this.status;
  }

  private async uploadRecord(record: WearableData): Promise<void> {
    // Encrypt the data
    const encryptedData = this.encryption.encrypt(record);
    
    // Sign the request
    const signedRequest = this.encryption.signRequest(encryptedData);

    // Upload to zero-knowledge API
    const response = await fetch(`${this.config.serverEndpoint}/api/health-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signedRequest),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(async () => {
      try {
        await this.syncData();
        console.log('Auto-sync completed successfully');
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, this.config.syncInterval);
  }

  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  async enableRealTimeSync(): Promise<void> {
    await this.wearable.subscribeToRealTimeData(async (data) => {
      try {
        await this.uploadRecord(data);
        console.log(`Real-time sync successful for record ${data.id}`);
      } catch (error) {
        console.error(`Real-time sync failed for record ${data.id}:`, error);
      }
    });
  }

  getPublicKey(): string {
    return this.encryption.getPublicKey();
  }

  getPrivateKey(): string {
    return this.encryption.getPrivateKey();
  }

  destroy(): void {
    this.stopAutoSync();
  }
}
