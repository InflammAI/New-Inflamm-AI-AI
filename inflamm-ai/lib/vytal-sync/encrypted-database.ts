import { Pool } from 'pg';
import { EncryptedData } from './encryption';

export interface EncryptedRecord {
  id: string;
  encryptedData: EncryptedData;
  publicKey: string;
  timestamp: number;
  createdAt: Date;
  accessRules: AccessRule[];
}

export interface AccessRule {
  id: string;
  recordId: string;
  publicKey: string;
  permissions: ('read' | 'write' | 'delete')[];
  expiresAt?: Date;
  createdAt: Date;
}

export class EncryptedDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async initialize(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS encrypted_blobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        encrypted_data JSONB NOT NULL,
        public_key TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        INDEX (public_key),
        INDEX (timestamp),
        INDEX (created_at)
      );
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS access_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        record_id UUID REFERENCES encrypted_blobs(id) ON DELETE CASCADE,
        public_key TEXT NOT NULL,
        permissions TEXT[] NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        INDEX (record_id),
        INDEX (public_key),
        INDEX (expires_at)
      );
    `);
  }

  async storeEncryptedBlob(
    encryptedData: EncryptedData,
    publicKey: string,
    timestamp: number
  ): Promise<string> {
    const result = await this.pool.query(
      `INSERT INTO encrypted_blobs (encrypted_data, public_key, timestamp)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [JSON.stringify(encryptedData), publicKey, timestamp]
    );

    return result.rows[0].id;
  }

  async enforceAccessRules(recordId: string, ownerPublicKey: string): Promise<void> {
    // Grant owner full access
    await this.pool.query(
      `INSERT INTO access_rules (record_id, public_key, permissions)
       VALUES ($1, $2, $3)
       ON CONFLICT (record_id, public_key) DO UPDATE SET
         permissions = EXCLUDED.permissions,
         created_at = NOW()`,
      [recordId, ownerPublicKey, ['read', 'write', 'delete']]
    );

    // Apply any default access policies here
    // For example: grant read access to healthcare providers after verification
    await this.applyDefaultAccessPolicies(recordId, ownerPublicKey);
  }

  private async applyDefaultAccessPolicies(recordId: string, ownerPublicKey: string): Promise<void> {
    // Example: Grant temporary read access to verified healthcare providers
    // This would integrate with a healthcare provider verification system
    
    // For now, we'll just log that policies would be applied
    console.log(`Applying default access policies for record ${recordId}`);
  }

  async checkAccessPermissions(publicKey: string): Promise<boolean> {
    const result = await this.pool.query(
      `SELECT COUNT(*) as count FROM access_rules
       WHERE public_key = $1
       AND 'read' = ANY(permissions)
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [publicKey]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  async getEncryptedBlobs(
    publicKey: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<EncryptedRecord[]> {
    let query = `
      SELECT id, encrypted_data, public_key, timestamp, created_at
      FROM encrypted_blobs
      WHERE public_key = $1
    `;
    const params: any[] = [publicKey];

    if (startDate) {
      query += ` AND timestamp >= $${params.length + 1}`;
      params.push(startDate.getTime());
    }

    if (endDate) {
      query += ` AND timestamp <= $${params.length + 1}`;
      params.push(endDate.getTime());
    }

    query += ` ORDER BY timestamp DESC`;

    const result = await this.pool.query(query, params);

    return result.rows.map(row => ({
      id: row.id,
      encryptedData: JSON.parse(row.encrypted_data),
      publicKey: row.public_key,
      timestamp: row.timestamp,
      createdAt: row.created_at,
      accessRules: [], // Would need separate query to populate
    }));
  }

  async grantAccess(
    recordId: string,
    granteePublicKey: string,
    permissions: ('read' | 'write' | 'delete')[],
    expiresAt?: Date
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO access_rules (record_id, public_key, permissions, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (record_id, public_key) DO UPDATE SET
         permissions = EXCLUDED.permissions,
         expires_at = EXCLUDED.expires_at`,
      [recordId, granteePublicKey, permissions, expiresAt]
    );
  }

  async revokeAccess(recordId: string, granteePublicKey: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM access_rules
       WHERE record_id = $1 AND public_key = $2`,
      [recordId, granteePublicKey]
    );
  }

  async deleteRecord(recordId: string, publicKey: string): Promise<boolean> {
    // Check if user has delete permission
    const permissionCheck = await this.pool.query(
      `SELECT COUNT(*) as count FROM access_rules
       WHERE record_id = $1 AND public_key = $2
       AND 'delete' = ANY(permissions)`,
      [recordId, publicKey]
    );

    if (parseInt(permissionCheck.rows[0].count) === 0) {
      return false;
    }

    // Delete the record (cascade will handle access rules)
    await this.pool.query(
      `DELETE FROM encrypted_blobs WHERE id = $1`,
      [recordId]
    );

    return true;
  }

  async getAccessRules(recordId: string): Promise<AccessRule[]> {
    const result = await this.pool.query(
      `SELECT id, record_id, public_key, permissions, expires_at, created_at
       FROM access_rules
       WHERE record_id = $1
       ORDER BY created_at DESC`,
      [recordId]
    );

    return result.rows.map(row => ({
      id: row.id,
      recordId: row.record_id,
      publicKey: row.public_key,
      permissions: row.permissions,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
    }));
  }

  async cleanupExpiredAccess(): Promise<void> {
    await this.pool.query(
      `DELETE FROM access_rules WHERE expires_at <= NOW()`
    );
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
