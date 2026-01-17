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

export interface EncryptedData {
  data: string; // Base64 encoded encrypted data
  nonce: string; // Base64 encoded nonce
  keyId?: string;
}

export interface SignedRequest {
  data: EncryptedData;
  signature: string; // Base64 encoded signature
  publicKey: string; // Base64 encoded public key
  timestamp: number;
}

export interface EncryptedRecord {
  id: string;
  encryptedData: EncryptedData;
  publicKey: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessRule {
  id: string;
  recordId: string;
  publicKey: string;
  permissions: ('read' | 'write' | 'delete')[];
  expiresAt?: Date;
  createdAt: Date;
}

export interface SyncStatus {
  lastSync: number;
  totalRecords: number;
  syncedRecords: number;
  failedRecords: number;
  isSyncing: boolean;
  error?: string;
}

export interface DataFlowMetrics {
  totalDataPoints: number;
  encryptedDataPoints: number;
  successfulUploads: number;
  failedUploads: number;
  averageLatency: number;
  lastActivity: number;
}

export interface HealthDataQuery {
  publicKey: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface AccessGrantRequest {
  recordId: string;
  granteePublicKey: string;
  permissions: ('read' | 'write' | 'delete')[];
  expiresAt?: Date;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}
