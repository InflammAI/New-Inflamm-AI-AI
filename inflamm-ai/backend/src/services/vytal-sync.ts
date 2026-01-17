import { VytalSyncModel } from '../models/vytal-sync';
import { ServerSideEncryption } from './encryption';
import { 
  SignedRequest, 
  EncryptedRecord, 
  AccessRule, 
  HealthDataQuery, 
  AccessGrantRequest,
  APIResponse 
} from '../types/vytal-sync';

export class VytalSyncService {
  private model: VytalSyncModel;
  private encryption: ServerSideEncryption;

  constructor() {
    this.model = new VytalSyncModel();
    this.encryption = new ServerSideEncryption();
  }

  async initialize(): Promise<void> {
    await this.model.initialize();
  }

  async getServerPublicKey(): Promise<string> {
    return this.encryption.getPublicKey();
  }

  async storeHealthData(signedRequest: SignedRequest): Promise<APIResponse<{ recordId: string }>> {
    try {
      // Verify the signature
      const isValidSignature = ServerSideEncryption.verifySignature(signedRequest);
      if (!isValidSignature) {
        return {
          success: false,
          error: 'Invalid signature',
          timestamp: Date.now(),
        };
      }

      // Validate timestamp to prevent replay attacks
      const isValidTimestamp = ServerSideEncryption.validateTimestamp(signedRequest.timestamp);
      if (!isValidTimestamp) {
        return {
          success: false,
          error: 'Request timestamp too old',
          timestamp: Date.now(),
        };
      }

      // Decrypt the data to validate structure (but don't store decrypted data)
      let decryptedData;
      try {
        decryptedData = this.encryption.decrypt(signedRequest.data, signedRequest.publicKey);
      } catch (error) {
        return {
          success: false,
          error: 'Decryption failed',
          timestamp: Date.now(),
        };
      }

      // Validate data structure
      if (!this.validateHealthData(decryptedData)) {
        return {
          success: false,
          error: 'Invalid health data structure',
          timestamp: Date.now(),
        };
      }

      // Store encrypted blob
      const recordId = await this.model.storeEncryptedBlob(
        signedRequest.data,
        signedRequest.publicKey,
        decryptedData.timestamp || Date.now()
      );

      // Grant owner full access
      await this.model.createAccessRule(
        recordId,
        signedRequest.publicKey,
        ['read', 'write', 'delete']
      );

      return {
        success: true,
        data: { recordId },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async getHealthData(query: HealthDataQuery): Promise<APIResponse<{ records: EncryptedRecord[] }>> {
    try {
      // Check if user has any read permissions
      const hasAccess = await this.model.checkAnyAccessPermission(query.publicKey);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Access denied',
          timestamp: Date.now(),
        };
      }

      const records = await this.model.getEncryptedBlobs(
        query.publicKey,
        query.startDate,
        query.endDate,
        query.limit || 100,
        query.offset || 0
      );

      return {
        success: true,
        data: { records },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async grantAccess(request: AccessGrantRequest, requestorPublicKey: string): Promise<APIResponse<{ ruleId: string }>> {
    try {
      // Check if requestor has write permission on the record
      const hasWritePermission = await this.model.checkAccessPermission(
        request.recordId,
        requestorPublicKey,
        'write'
      );

      if (!hasWritePermission) {
        return {
          success: false,
          error: 'Insufficient permissions to grant access',
          timestamp: Date.now(),
        };
      }

      const ruleId = await this.model.createAccessRule(
        request.recordId,
        request.granteePublicKey,
        request.permissions,
        request.expiresAt
      );

      return {
        success: true,
        data: { ruleId },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async revokeAccess(recordId: string, granteePublicKey: string, requestorPublicKey: string): Promise<APIResponse> {
    try {
      // Check if requestor has write permission on the record
      const hasWritePermission = await this.model.checkAccessPermission(
        recordId,
        requestorPublicKey,
        'write'
      );

      if (!hasWritePermission) {
        return {
          success: false,
          error: 'Insufficient permissions to revoke access',
          timestamp: Date.now(),
        };
      }

      const success = await this.model.revokeAccess(recordId, granteePublicKey);

      return {
        success,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async getAccessRules(recordId: string, requestorPublicKey: string): Promise<APIResponse<{ rules: AccessRule[] }>> {
    try {
      // Check if requestor has read permission on the record
      const hasReadPermission = await this.model.checkAccessPermission(
        recordId,
        requestorPublicKey,
        'read'
      );

      if (!hasReadPermission) {
        return {
          success: false,
          error: 'Access denied',
          timestamp: Date.now(),
        };
      }

      const rules = await this.model.getAccessRules(recordId);

      return {
        success: true,
        data: { rules },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async deleteHealthData(recordId: string, requestorPublicKey: string): Promise<APIResponse> {
    try {
      // Check if requestor has delete permission on the record
      const hasDeletePermission = await this.model.checkAccessPermission(
        recordId,
        requestorPublicKey,
        'delete'
      );

      if (!hasDeletePermission) {
        return {
          success: false,
          error: 'Insufficient permissions to delete record',
          timestamp: Date.now(),
        };
      }

      const success = await this.model.deleteEncryptedBlob(recordId);

      return {
        success,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async getMetrics(): Promise<APIResponse<{
    totalRecords: number;
    totalEncryptedBlobs: number;
    totalAccessRules: number;
    expiredAccessRules: number;
  }>> {
    try {
      const metrics = await this.model.getMetrics();

      return {
        success: true,
        data: metrics,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  async cleanupExpiredAccess(): Promise<APIResponse<{ cleanedRules: number }>> {
    try {
      const cleanedRules = await this.model.cleanupExpiredAccess();

      return {
        success: true,
        data: { cleanedRules },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  private validateHealthData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check for required fields
    if (!data.id || !data.timestamp) {
      return false;
    }

    // Validate timestamp is a number
    if (typeof data.timestamp !== 'number') {
      return false;
    }

    // Optional: Validate specific health data fields
    if (data.heartRate && typeof data.heartRate !== 'number') {
      return false;
    }

    if (data.steps && typeof data.steps !== 'number') {
      return false;
    }

    if (data.calories && typeof data.calories !== 'number') {
      return false;
    }

    if (data.bloodOxygen && (typeof data.bloodOxygen !== 'number' || data.bloodOxygen < 0 || data.bloodOxygen > 100)) {
      return false;
    }

    if (data.stressLevel && (typeof data.stressLevel !== 'number' || data.stressLevel < 0 || data.stressLevel > 10)) {
      return false;
    }

    return true;
  }

  async close(): Promise<void> {
    await this.model.close();
  }
}
