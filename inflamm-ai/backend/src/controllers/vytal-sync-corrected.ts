import { Request, Response } from 'express';
import { VytalSyncService } from '../services/vytal-sync';
import { SignedRequest, HealthDataQuery, AccessGrantRequest } from '../types/vytal-sync';

export class VytalSyncController {
  private service: VytalSyncService;

  constructor() {
    this.service = new VytalSyncService();
  }

  async initialize(): Promise<void> {
    await this.service.initialize();
  }

  // POST /api/vytal-sync/health-data
  async storeHealthData(req: Request, res: Response): Promise<void> {
    try {
      const signedRequest: SignedRequest = req.body as SignedRequest;
      const result = await this.service.storeHealthData(signedRequest);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Store health data error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // GET /api/vytal-sync/health-data
  async getHealthData(req: Request, res: Response): Promise<void> {
    try {
      const query: HealthDataQuery = {
        publicKey: req.query.publicKey as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      };

      if (!query.publicKey) {
        res.status(400).json({
          success: false,
          error: 'Public key is required',
          timestamp: Date.now(),
        });
        return;
      }

      const result = await this.service.getHealthData(query);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(403).json(result);
      }
    } catch (error) {
      console.error('Get health data error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // GET /api/vytal-sync/server-public-key
  async getServerPublicKey(req: Request, res: Response): Promise<void> {
    try {
      const publicKey = await this.service.getServerPublicKey();
      
      res.status(200).json({
        success: true,
        data: { publicKey },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Get server public key error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // POST /api/vytal-sync/grant-access
  async grantAccess(req: Request, res: Response): Promise<void> {
    try {
      const requestorPublicKey = req.headers['x-public-key'] as string;
      
      if (!requestorPublicKey) {
        res.status(400).json({
          success: false,
          error: 'Requestor public key is required in X-Public-Key header',
          timestamp: Date.now(),
        });
        return;
      }

      const accessRequest: AccessGrantRequest = req.body as AccessGrantRequest;
      const result = await this.service.grantAccess(accessRequest, requestorPublicKey);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Grant access error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // DELETE /api/vytal-sync/revoke-access/:recordId/:granteePublicKey
  async revokeAccess(req: Request, res: Response): Promise<void> {
    try {
      const requestorPublicKey = req.headers['x-public-key'] as string;
      
      if (!requestorPublicKey) {
        res.status(400).json({
          success: false,
          error: 'Requestor public key is required in X-Public-Key header',
          timestamp: Date.now(),
        });
        return;
      }

      const { recordId, granteePublicKey } = req.params;
      const result = await this.service.revokeAccess(recordId, granteePublicKey, requestorPublicKey);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Revoke access error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // GET /api/vytal-sync/access-rules/:recordId
  async getAccessRules(req: Request, res: Response): Promise<void> {
    try {
      const requestorPublicKey = req.headers['x-public-key'] as string;
      
      if (!requestorPublicKey) {
        res.status(400).json({
          success: false,
          error: 'Requestor public key is required in X-Public-Key header',
          timestamp: Date.now(),
        });
        return;
      }

      const { recordId } = req.params;
      const result = await this.service.getAccessRules(recordId, requestorPublicKey);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(403).json(result);
      }
    } catch (error) {
      console.error('Get access rules error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // DELETE /api/vytal-sync/health-data/:recordId
  async deleteHealthData(req: Request, res: Response): Promise<void> {
    try {
      const requestorPublicKey = req.headers['x-public-key'] as string;
      
      if (!requestorPublicKey) {
        res.status(400).json({
          success: false,
          error: 'Requestor public key is required in X-Public-Key header',
          timestamp: Date.now(),
        });
        return;
      }

      const { recordId } = req.params;
      const result = await this.service.deleteHealthData(recordId, requestorPublicKey);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Delete health data error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // GET /api/vytal-sync/metrics
  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getMetrics();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Get metrics error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  // POST /api/vytal-sync/cleanup
  async cleanupExpiredAccess(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.cleanupExpiredAccess();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
      });
    }
  }

  async close(): Promise<void> {
    await this.service.close();
  }
}
