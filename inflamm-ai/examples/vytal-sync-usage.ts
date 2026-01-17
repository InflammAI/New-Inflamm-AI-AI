// Example usage of the Vytal Sync system
import { DataFlowOrchestrator, DataFlowConfig } from '../lib/vytal-sync';

// Configuration for the Vytal Sync system
const vytalSyncConfig: DataFlowConfig = {
  wearableApiEndpoint: 'https://api.health-os.com/v1',
  accessToken: process.env.WEARABLE_ACCESS_TOKEN || 'your-access-token',
  serverEndpoint: 'http://localhost:3000',
  serverPublicKey: process.env.SERVER_PUBLIC_KEY || 'your-server-public-key',
  syncInterval: 5 * 60 * 1000, // 5 minutes
  enableRealTimeSync: true,
  retentionDays: 365,
  maxRetryAttempts: 3,
};

async function setupVytalSync() {
  try {
    // Create and initialize the orchestrator
    const orchestrator = await DataFlowOrchestrator.create(vytalSyncConfig);
    
    console.log('Vytal Sync system initialized successfully');
    
    // Perform initial sync for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    await orchestrator.performFullSync(startDate, endDate);
    console.log('Initial sync completed');
    
    // Get system metrics
    const metrics = await orchestrator.getMetrics();
    console.log('Current metrics:', metrics);
    
    // Get system status
    const status = await orchestrator.getSystemStatus();
    console.log('System status:', status);
    
    // Example: Grant access to a healthcare provider
    const healthcareProviderPublicKey = 'provider-public-key-here';
    const recordId = 'some-record-id';
    
    await orchestrator.grantDataAccess(
      recordId,
      healthcareProviderPublicKey,
      ['read'],
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    );
    
    console.log('Access granted to healthcare provider');
    
    // Export data for analysis
    const userPublicKey = orchestrator['syncApp']['encryption'].getPublicKey();
    const exportedData = await orchestrator.exportData(userPublicKey);
    console.log(`Exported ${exportedData.length} records`);
    
    // Cleanup when done
    await orchestrator.destroy();
    console.log('Vytal Sync system shut down');
    
  } catch (error) {
    console.error('Vytal Sync setup failed:', error);
  }
}

// Example of client-side usage
async function clientSideSync() {
  const { VytalSyncApp, ClientSideEncryption } = await import('../lib/vytal-sync');
  
  // Create encryption instance
  const encryption = new ClientSideEncryption();
  console.log('Client public key:', encryption.getPublicKey());
  
  // Create sync app
  const syncApp = new VytalSyncApp(vytalSyncConfig);
  await syncApp.initialize();
  
  // Manual sync
  const status = await syncApp.syncData();
  console.log('Sync status:', status);
  
  // Enable real-time sync
  await syncApp.enableRealTimeSync();
  console.log('Real-time sync enabled');
}

// Example of server-side API usage
async function serverSideAPI() {
  const { EncryptedDatabase, ServerSideEncryption } = await import('../lib/vytal-sync');
  
  // Initialize database
  const db = new EncryptedDatabase();
  await db.initialize();
  
  // Initialize server encryption
  const serverEncryption = new ServerSideEncryption();
  console.log('Server public key:', serverEncryption.getPublicKey());
  
  // Example: Query user data
  const userPublicKey = 'user-public-key';
  const records = await db.getEncryptedBlobs(userPublicKey);
  console.log(`Found ${records.length} encrypted records`);
  
  // Cleanup
  await db.close();
}

// Run examples if this file is executed directly
if (require.main === module) {
  setupVytalSync().catch(console.error);
}

export { setupVytalSync, clientSideSync, serverSideAPI };
