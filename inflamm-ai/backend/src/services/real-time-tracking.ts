import { Server } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { VytalSyncService } from '../services/vytal-sync';

export interface RealTimeHealthData {
  id: string;
  publicKey: string;
  timestamp: number;
  heartRate?: number;
  steps?: number;
  calories?: number;
  bloodOxygen?: number;
  stressLevel?: number;
  activityType?: string;
}

export interface WebSocketClient {
  ws: any;
  publicKey: string;
  subscriptions: string[];
  lastPing: number;
}

export class RealTimeTrackingService {
  private wss: Server;
  private clients: Map<string, WebSocketClient> = new Map();
  private service: VytalSyncService;
  private healthDataBuffer: Map<string, RealTimeHealthData[]> = new Map();

  constructor(server: any, service: VytalSyncService) {
    this.service = service;
    this.wss = new Server({ 
      server,
      path: '/ws/vytal-sync'
    });
    
    this.initializeWebSocketServer();
    this.startHealthDataProcessing();
  }

  private initializeWebSocketServer(): void {
    this.wss.on('connection', (ws: any, req: IncomingMessage) => {
      this.handleConnection(ws, req);
    });

    // Cleanup inactive connections every 30 seconds
    setInterval(() => {
      this.cleanupInactiveConnections();
    }, 30000);

    console.log('WebSocket server initialized for Vytal Sync real-time tracking');
  }

  private async handleConnection(ws: any, req: IncomingMessage): Promise<void> {
    try {
      // Extract token from query parameters or headers
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const token = url.searchParams.get('token') || 
                   req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        ws.close(1008, 'Authentication token required');
        return;
      }

      // Verify JWT token and extract public key
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const publicKey = decoded.publicKey;

      if (!publicKey) {
        ws.close(1008, 'Invalid token: public key missing');
        return;
      }

      const clientId = this.generateClientId();
      const client: WebSocketClient = {
        ws,
        publicKey,
        subscriptions: [],
        lastPing: Date.now()
      };

      this.clients.set(clientId, client);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        clientId,
        message: 'Connected to Vytal Sync real-time tracking',
        timestamp: Date.now()
      }));

      // Setup message handlers
      ws.on('message', (message: string) => {
        this.handleMessage(clientId, message);
      });

      ws.on('close', () => {
        this.handleDisconnection(clientId);
      });

      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = Date.now();
        }
      });

      console.log(`Client connected: ${clientId} for user: ${publicKey}`);

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1008, 'Authentication failed');
    }
  }

  private handleMessage(clientId: string, message: string): void {
    try {
      const client = this.clients.get(clientId);
      if (!client) return;

      const data = JSON.parse(message);

      switch (data.type) {
        case 'subscribe':
          this.handleSubscription(clientId, data);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(clientId, data);
          break;
        case 'health_data':
          this.handleHealthData(clientId, data);
          break;
        case 'ping':
          client.ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        default:
          client.ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
            timestamp: Date.now()
          }));
      }
    } catch (error) {
      console.error('Message handling error:', error);
      const client = this.clients.get(clientId);
      if (client) {
        client.ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: Date.now()
        }));
      }
    }
  }

  private handleSubscription(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { dataType, publicKey } = data;
    
    if (dataType === 'health_data') {
      // Subscribe to health data updates for specific public key
      const subscriptionKey = publicKey || client.publicKey;
      
      if (!client.subscriptions.includes(subscriptionKey)) {
        client.subscriptions.push(subscriptionKey);
        
        client.ws.send(JSON.stringify({
          type: 'subscription_confirmed',
          dataType: 'health_data',
          publicKey: subscriptionKey,
          timestamp: Date.now()
        }));

        console.log(`Client ${clientId} subscribed to health data for ${subscriptionKey}`);
      }
    }
  }

  private handleUnsubscription(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { dataType, publicKey } = data;
    const subscriptionKey = publicKey || client.publicKey;
    
    client.subscriptions = client.subscriptions.filter(sub => sub !== subscriptionKey);
    
    client.ws.send(JSON.stringify({
      type: 'unsubscription_confirmed',
      dataType,
      publicKey: subscriptionKey,
      timestamp: Date.now()
    }));

    console.log(`Client ${clientId} unsubscribed from ${subscriptionKey}`);
  }

  private handleHealthData(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    const healthData: RealTimeHealthData = {
      id: this.generateId(),
      publicKey: client.publicKey,
      timestamp: Date.now(),
      ...data.data
    };

    // Buffer the health data for processing
    if (!this.healthDataBuffer.has(client.publicKey)) {
      this.healthDataBuffer.set(client.publicKey, []);
    }
    
    const buffer = this.healthDataBuffer.get(client.publicKey)!;
    buffer.push(healthData);

    // Broadcast to subscribed clients
    this.broadcastHealthData(healthData);

    // Send confirmation
    client.ws.send(JSON.stringify({
      type: 'health_data_received',
      dataId: healthData.id,
      timestamp: Date.now()
    }));
  }

  private broadcastHealthData(healthData: RealTimeHealthData): void {
    const message = JSON.stringify({
      type: 'health_data_update',
      data: healthData,
      timestamp: Date.now()
    });

    this.clients.forEach((client) => {
      if (client.subscriptions.includes(healthData.publicKey)) {
        client.ws.send(message);
      }
    });
  }

  private startHealthDataProcessing(): void {
    // Process buffered health data every 5 seconds
    setInterval(() => {
      this.processHealthDataBuffer();
    }, 5000);
  }

  private async processHealthDataBuffer(): Promise<void> {
    for (const [publicKey, buffer] of this.healthDataBuffer.entries()) {
      if (buffer.length === 0) continue;

      try {
        // Process batch of health data
        const batch = buffer.splice(0, 10); // Process max 10 records at a time
        
        // Store in database (implement based on your existing service)
        for (const data of batch) {
          // This would integrate with your existing health data storage
          console.log(`Processing health data for ${publicKey}:`, data);
        }

      } catch (error) {
        console.error('Error processing health data buffer:', error);
      }
    }
  }

  private cleanupInactiveConnections(): void {
    const now = Date.now();
    const inactiveClients: string[] = [];

    this.clients.forEach((client, clientId) => {
      if (now - client.lastPing > 60000) { // 60 seconds timeout
        inactiveClients.push(clientId);
        client.ws.terminate();
      }
    });

    inactiveClients.forEach(clientId => {
      this.clients.delete(clientId);
      console.log(`Cleaned up inactive client: ${clientId}`);
    });
  }

  private handleDisconnection(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      console.log(`Client disconnected: ${clientId} for user: ${client.publicKey}`);
      this.clients.delete(clientId);
    }
  }

  private generateClientId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public method to generate JWT tokens for WebSocket authentication
  public generateAuthToken(publicKey: string): string {
    return jwt.sign(
      { publicKey, timestamp: Date.now() },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  // Public method to get connection metrics
  public getConnectionMetrics(): any {
    return {
      totalConnections: this.clients.size,
      subscriptions: Array.from(this.clients.values()).reduce((acc, client) => {
        return acc + client.subscriptions.length;
      }, 0),
      bufferedData: Array.from(this.healthDataBuffer.values()).reduce((acc, buffer) => {
        return acc + buffer.length;
      }, 0)
    };
  }

  public close(): void {
    this.wss.close();
    this.clients.clear();
    this.healthDataBuffer.clear();
  }
}
