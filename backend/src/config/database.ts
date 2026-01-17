import dotenv from 'dotenv';
import { Pool } from 'pg';
import type { Pool as PoolType } from 'pg';

interface QueryResult<T = any> {
  rows: T[];
  rowCount: number | null;
  command: string;
  fields: any[];
}

interface PoolClient {
  query: (text: string, params?: any[]) => Promise<QueryResult>;
  release: () => void;
}

// Load environment variables early
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

// Simple query helper
export const query = async (
  text: string,
  params?: any[]
): Promise<QueryResult<any>> => {
  const start = Date.now();

  try {
    const res = await pool.query(text, params);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', {
        duration: Date.now() - start,
        rows: res.rowCount,
      });
    }

    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Properly extend PoolClient so TS knows query and release exist and have proper types.
 */
export interface ExtendedClient extends PoolClient {
  lastQuery?: [string, any[]?];
  query: (text: string, params?: any[]) => Promise<QueryResult<any>>;
  release: () => void;
}

export const getClient = async (): Promise<ExtendedClient> => {
  const client = (await pool.connect()) as ExtendedClient;

  // Keep references to original methods
  const originalQuery = client.query.bind(client) as ExtendedClient['query'];
  const originalRelease = client.release.bind(client) as ExtendedClient['release'];

  // 5 second timeout warning
  const timeout = setTimeout(() => {
    console.error(
      'A client has been checked out for more than 5 seconds!',
      client.lastQuery
    );
  }, 5000);

  // Override query safely and keep typing
  client.query = (async (text: string, params?: any[]) => {
    client.lastQuery = [text, params];
    return originalQuery(text, params);
  }) as ExtendedClient['query'];

  // Override release safely
  client.release = (() => {
    clearTimeout(timeout);

    // Restore original functions
    client.query = originalQuery;
    client.release = originalRelease;

    // Call original release
    originalRelease();
  }) as ExtendedClient['release'];

  return client;
};

export { pool };
