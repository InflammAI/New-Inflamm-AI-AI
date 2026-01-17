import { Request, Response } from 'express';
import { RealTimeTrackingService } from '../services/real-time-tracking';
import { VytalSyncService } from '../services/vytal-sync';

export class RealTimeTrackingController {
  private realTimeService: RealTimeTrackingService;
  private service: VytalSyncService;

  constructor(server: any, service: VytalSyncService) {
    this.service = service;
    this.realTimeService = new RealTimeTrackingService(server, service);
  }

  // GET /api/vytal-sync/real-time/token
  async getAuthToken(req: Request, res: Response): Promise<void> {
    try {
      const publicKey = req.headers['x-public-key'] as string;
      
      if (!publicKey) {
        res.status(400).json({
          success: false,
          error: 'Public key is required in X-Public-Key header',
          timestamp: Date.now(),
        });
        return;
      }

      // Verify the public key exists in your system
      // You might want to check if this user has access to real-time tracking
      const token = this.realTimeService.generateAuthToken(publicKey);

      res.status(200).json({
        success: true,
        data: { 
          token,
          wsUrl: `ws://localhost:3001/ws/vytal-sync?token=${token}`,
          expiresIn: '24h'
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Get auth token error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // GET /api/vytal-sync/real-time/metrics
  async getRealTimeMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = this.realTimeService.getConnectionMetrics();

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Get real-time metrics error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // POST /api/vytal-sync/real-time/trigger-event
  async triggerRealTimeEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventType, publicKey, data } = req.body;

      if (!eventType || !publicKey) {
        res.status(400).json({
          success: false,
          error: 'Event type and public key are required',
          timestamp: Date.now(),
        });
        return;
      }

      // This would trigger real-time events to subscribed clients
      // You can extend this to handle different event types
      
      res.status(200).json({
        success: true,
        message: 'Event triggered successfully',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Trigger real-time event error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  async close(): Promise<void> {
    this.realTimeService.close();
  }
}
