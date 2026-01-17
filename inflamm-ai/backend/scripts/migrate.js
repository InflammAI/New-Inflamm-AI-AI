// migrate.js
require('dotenv').config(); // ensure this runs before we touch process.env

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function preview(value) {
  if (value == null) return String(value);
  const s = String(value);
  if (s.length <= 6) return s.replace(/./g, '*');
  return s.slice(0, 3) + '...' + s.slice(-3);
}

function ensureStringEnv(name) {
  const v = process.env[name];
  if (v === undefined) return undefined;
  if (typeof v === 'string') return v;
  // Buffer or object? try to coerce sensibly
  try {
    if (Buffer.isBuffer(v)) return v.toString('utf8');
    return String(v);
  } catch (e) {
    return undefined;
  }
}

async function migrate() {
  // Prefer using full connection URL
  let connectionString = ensureStringEnv('DATABASE_URL');

  // If no DATABASE_URL, attempt to build from DB_* vars
  if (!connectionString) {
    const host = ensureStringEnv('DB_HOST') || ensureStringEnv('PGHOST');
    const port = ensureStringEnv('DB_PORT') || ensureStringEnv('PGPORT') || '5432';
    const user = ensureStringEnv('DB_USER') || ensureStringEnv('PGUSER') || 'postgres';
    const password = ensureStringEnv('DB_PASSWORD') || ensureStringEnv('PGPASSWORD');
    const db = ensureStringEnv('DB_NAME') || ensureStringEnv('PGDATABASE') || 'postgres';

    if (host && password !== undefined) {
      // encode password to be safe with special characters
      const encoded = encodeURIComponent(password);
      connectionString = `postgresql://${encodeURIComponent(user)}:${encoded}@${host}:${port}/${encodeURIComponent(db)}`;
    } else {
      console.error('❌ Missing DATABASE_URL and insufficient DB_* variables.');
      console.error('Expected either DATABASE_URL or DB_HOST + DB_PASSWORD (and optionally DB_USER/DB_NAME/DB_PORT).');
      process.exit(1);
    }
  }

  // Basic debug info (safe)
  console.log('DATABASE_URL type:', typeof process.env.DATABASE_URL, 'preview:', preview(process.env.DATABASE_URL));
  console.log('Constructed connection string preview:', preview(connectionString));

  // Final guard: ensure connectionString is a string
  if (typeof connectionString !== 'string') {
    console.error('❌ connectionString is not a string. Value:', connectionString);
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('🔄 Running database migration...');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await pool.query(schema);

    console.log('✅ Database migration completed successfully!');

    // Verify tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📊 Created tables:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

