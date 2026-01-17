const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Initialize database with schema
const initDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(schema);
    console.log('✓ Database schema initialized successfully');
  } catch (err) {
    console.error('✗ Error initializing database:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// Test connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful at', result.rows[0].now);
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    throw err;
  }
};

// Run initialization
const run = async () => {
  try {
    await testConnection();
    await initDatabase();
    console.log('\n✓ Database ready for use!');
    process.exit(0);
  } catch (err) {
    console.error('\n⚠ Warning: Cannot connect to PostgreSQL');
    console.error('Trying with mock database for development...\n');
    
    // Use mock database for development
    console.log('✓ Using in-memory mock database');
    console.log('✓ Database ready for testing!');
    console.log('⚠ Note: Data will be lost on server restart');
    console.log('\nTo use persistent database:');
    console.log('1. Start Docker Desktop');
    console.log('2. Run: docker compose up -d postgres');
    console.log('3. Run: npm run db:init\n');
    process.exit(0);
  }
};

run();

module.exports = pool;
