import { VytalSyncApp, SyncConfig } from './vytal-sync-app';
import { WearableData } from './wearable-interface';
import { EncryptedDatabase } from './encrypted-database';

export interface DataFlowConfig extends SyncConfig {
  enableRealTimeSync?: boolean;
  retentionDays?: number;
  maxRetryAttempts?: number;
}

export interface DataFlowMetrics {
  totalDataPoints: number;
  encryptedDataPoints: number;
  successfulUploads: number;
  failedUploads: number;
  averageLatency: number;
  lastActivity: number;
}

export class DataFlowOrchestrator {
  private syncApp: VytalSyncApp;
  private database: EncryptedDatabase;
  private config: DataFlowConfig;
  private metrics: DataFlowMetrics;
  private isInitialized: boolean = false;

  constructor(config: DataFlowConfig) {
    this.config = config;
    this.syncApp = new VytalSyncApp(config);
    this.database = new EncryptedDatabase();
    
    this.metrics = {
      totalDataPoints: 0,
      encryptedDataPoints: 0,
      successfulUploads: 0,
      failedUploads: 0,
      averageLatency: 0,
      lastActivity: 0,
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize database
      await this.database.initialize();
      
      // Initialize sync app
      await this.syncApp.initialize();
      
      // Enable real-time sync if configured
      if (this.config.enableRealTimeSync) {
        await this.syncApp.enableRealTimeSync();
      }
      
      // Start cleanup job for expired access rules
      this.startCleanupJob();
      
      this.isInitialized = true;
      console.log('Data flow orchestrator initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize data flow orchestrator:', error);
      throw error;
    }
  }

  async performFullSync(startDate?: Date, endDate?: Date): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Orchestrator not initialized');
    }

    const startTime = Date.now();
    
    try {
      const status = await this.syncApp.syncData(startDate, endDate);
      
      // Update metrics
      this.metrics.totalDataPoints += status.totalRecords;
      this.metrics.encryptedDataPoints += status.syncedRecords;
      this.metrics.successfulUploads += status.syncedRecords;
      this.metrics.failedUploads += status.failedRecords;
      this.metrics.lastActivity = Date.now();
      
      // Calculate average latency
      const latency = Date.now() - startTime;
      this.metrics.averageLatency = 
        (this.metrics.averageLatency + latency) / 2;
      
      console.log(`Full sync completed: ${status.syncedRecords} synced, ${status.failedRecords} failed`);
      
    } catch (error) {
      this.metrics.failedUploads++;
      this.metrics.lastActivity = Date.now();
      throw error;
    }
  }

  async grantDataAccess(
    recordId: string,
    granteePublicKey: string,
    permissions: ('read' | 'write' | 'delete')[],
    expiresAt?: Date
  ): Promise<void> {
    await this.database.grantAccess(recordId, granteePublicKey, permissions, expiresAt);
  }

  async revokeDataAccess(recordId: string, granteePublicKey: string): Promise<void> {
    await this.database.revokeAccess(recordId, granteePublicKey);
  }

  async getMetrics(): Promise<DataFlowMetrics> {
    return { ...this.metrics };
  }

  async getSystemStatus(): Promise<{
    isInitialized: boolean;
    syncStatus: any;
    databaseStatus: 'connected' | 'disconnected' | 'error';
    lastActivity: number;
  }> {
    return {
      isInitialized: this.isInitialized,
      syncStatus: this.syncApp.getStatus(),
      databaseStatus: 'connected', // Would implement actual health check
      lastActivity: this.metrics.lastActivity,
    };
  }

  async cleanupOldData(): Promise<void> {
    if (!this.config.retentionDays) {
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    // This would implement cleanup logic for old encrypted blobs
    console.log(`Cleaning up data older than ${cutoffDate.toISOString()}`);
  }

  private startCleanupJob(): void {
    // Run cleanup every 24 hours
    setInterval(async () => {
      try {
        await this.database.cleanupExpiredAccess();
        await this.cleanupOldData();
      } catch (error) {
        console.error('Cleanup job failed:', error);
      }
    }, 24 * 60 * 60 * 1000);
  }

  async exportData(
    publicKey: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    const records = await this.database.getEncryptedBlobs(publicKey, startDate, endDate);
    return records;
  }

  async destroy(): Promise<void> {
    this.syncApp.destroy();
    await this.database.close();
    this.isInitialized = false;
  }

  // Utility method to create a complete data flow instance
  static async create(config: DataFlowConfig): Promise<DataFlowOrchestrator> {
    const orchestrator = new DataFlowOrchestrator(config);
    await orchestrator.initialize();
    return orchestrator;
  }
}
