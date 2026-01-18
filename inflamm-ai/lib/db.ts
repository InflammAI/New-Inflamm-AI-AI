import { Pool } from 'pg';

// Singleton pool for serverless
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err: Error) => {
      console.error('Unexpected database error:', err);
    });
  }
  return pool;
}

export const query = async (text: string, params?: any[]) => {
  const pool = getPool();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  const pool = getPool();
  return await pool.connect();
};

const dbExports = { query, getClient };

export default dbExports;
