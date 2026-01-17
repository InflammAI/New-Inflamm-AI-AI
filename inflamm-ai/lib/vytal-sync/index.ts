// Main entry point for Vytal Sync system
export * from './wearable-interface';
export * from './encryption';
export * from './vytal-sync-app';
export * from './encrypted-database';
export * from './data-flow-orchestrator';

// Re-export commonly used types and classes
export { WearableInterface } from './wearable-interface';
export { ClientSideEncryption, ServerSideEncryption } from './encryption';
export { VytalSyncApp } from './vytal-sync-app';
export { EncryptedDatabase } from './encrypted-database';
export { DataFlowOrchestrator } from './data-flow-orchestrator';

// Type exports for easier importing
export type {
  WearableData,
  SleepData,
  ActivityData,
  OSHealthAPIResponse,
} from './wearable-interface';

export type {
  EncryptedData,
  SignedRequest,
} from './encryption';

export type {
  SyncConfig,
  SyncStatus,
} from './vytal-sync-app';

export type {
  EncryptedRecord,
  AccessRule,
} from './encrypted-database';

export type {
  DataFlowConfig,
  DataFlowMetrics,
} from './data-flow-orchestrator';
