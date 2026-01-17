import { Pool, PoolClient } from 'pg';
import { EncryptedRecord, AccessRule, EncryptedData } from '../types/vytal-sync';

export class VytalSyncModel {
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
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_encrypted_blobs_public_key ON encrypted_blobs(public_key);
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_encrypted_blobs_timestamp ON encrypted_blobs(timestamp);
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_encrypted_blobs_created_at ON encrypted_blobs(created_at);
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS access_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        record_id UUID REFERENCES encrypted_blobs(id) ON DELETE CASCADE,
        public_key TEXT NOT NULL,
        permissions TEXT[] NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_access_rules_record_id ON access_rules(record_id);
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_access_rules_public_key ON access_rules(public_key);
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_access_rules_expires_at ON access_rules(expires_at);
    `);

    // Create trigger for updated_at
    await this.pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await this.pool.query(`
      DROP TRIGGER IF EXISTS update_encrypted_blobs_updated_at ON encrypted_blobs;
    `);

    await this.pool.query(`
      CREATE TRIGGER update_encrypted_blobs_updated_at
        BEFORE UPDATE ON encrypted_blobs
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
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

  async getEncryptedBlob(id: string): Promise<EncryptedRecord | null> {
    const result = await this.pool.query(
      `SELECT id, encrypted_data, public_key, timestamp, created_at, updated_at
       FROM encrypted_blobs
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      encryptedData: JSON.parse(row.encrypted_data),
      publicKey: row.public_key,
      timestamp: row.timestamp,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getEncryptedBlobs(
    publicKey: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<EncryptedRecord[]> {
    let query = `
      SELECT id, encrypted_data, public_key, timestamp, created_at, updated_at
      FROM encrypted_blobs
      WHERE public_key = $1
    `;
    const params: any[] = [publicKey];
    let paramIndex = 2;

    if (startDate) {
      query += ` AND timestamp >= $${paramIndex}`;
      params.push(startDate.getTime());
      paramIndex++;
    }

    if (endDate) {
      query += ` AND timestamp <= $${paramIndex}`;
      params.push(endDate.getTime());
      paramIndex++;
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await this.pool.query(query, params);

    return result.rows.map(row => ({
      id: row.id,
      encryptedData: JSON.parse(row.encrypted_data),
      publicKey: row.public_key,
      timestamp: row.timestamp,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async deleteEncryptedBlob(id: string): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM encrypted_blobs WHERE id = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async createAccessRule(
    recordId: string,
    publicKey: string,
    permissions: ('read' | 'write' | 'delete')[],
    expiresAt?: Date
  ): Promise<string> {
    const result = await this.pool.query(
      `INSERT INTO access_rules (record_id, public_key, permissions, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [recordId, publicKey, permissions, expiresAt]
    );

    return result.rows[0].id;
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

  async checkAccessPermission(
    recordId: string,
    publicKey: string,
    permission: 'read' | 'write' | 'delete'
  ): Promise<boolean> {
    const result = await this.pool.query(
      `SELECT COUNT(*) as count FROM access_rules
       WHERE record_id = $1 AND public_key = $2
       AND $3 = ANY(permissions)
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [recordId, publicKey, permission]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  async checkAnyAccessPermission(publicKey: string): Promise<boolean> {
    const result = await this.pool.query(
      `SELECT COUNT(*) as count FROM access_rules
       WHERE public_key = $1
       AND 'read' = ANY(permissions)
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [publicKey]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  async revokeAccess(recordId: string, publicKey: string): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM access_rules
       WHERE record_id = $1 AND public_key = $2`,
      [recordId, publicKey]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async cleanupExpiredAccess(): Promise<number> {
    const result = await this.pool.query(
      `DELETE FROM access_rules WHERE expires_at <= NOW()`
    );

    return result.rowCount || 0;
  }

  async getMetrics(): Promise<{
    totalRecords: number;
    totalEncryptedBlobs: number;
    totalAccessRules: number;
    expiredAccessRules: number;
  }> {
    const [recordsResult, blobsResult, rulesResult, expiredResult] = await Promise.all([
      this.pool.query(`SELECT COUNT(*) as count FROM encrypted_blobs`),
      this.pool.query(`SELECT COUNT(*) as count FROM encrypted_blobs`),
      this.pool.query(`SELECT COUNT(*) as count FROM access_rules`),
      this.pool.query(`SELECT COUNT(*) as count FROM access_rules WHERE expires_at <= NOW()`),
    ]);

    return {
      totalRecords: parseInt(recordsResult.rows[0].count),
      totalEncryptedBlobs: parseInt(blobsResult.rows[0].count),
      totalAccessRules: parseInt(rulesResult.rows[0].count),
      expiredAccessRules: parseInt(expiredResult.rows[0].count),
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
