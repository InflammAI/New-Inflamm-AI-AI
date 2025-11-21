import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

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

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// ✅ Properly extend PoolClient
export interface ExtendedClient extends PoolClient {
  lastQuery?: [string, any[]?];
}

export const getClient = async (): Promise<ExtendedClient> => {
  const client = (await pool.connect()) as ExtendedClient;
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  client.query = ((text: string, params?: any[]) => {
    client.lastQuery = [text, params];
    return originalQuery(text, params);
  }) as typeof client.query;

  client.release = () => {
    clearTimeout(timeout);
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease();
  };

  return client;
};

export default { query, getClient, pool };

