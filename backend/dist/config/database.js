"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.getClient = exports.query = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
// Load environment variables early
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool = pool;
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
// Simple query helper
const query = async (text, params) => {
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
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
exports.query = query;
const getClient = async () => {
    const client = (await pool.connect());
    // Keep references to original methods
    const originalQuery = client.query.bind(client);
    const originalRelease = client.release.bind(client);
    // 5 second timeout warning
    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!', client.lastQuery);
    }, 5000);
    // Override query safely and keep typing
    client.query = (async (text, params) => {
        client.lastQuery = [text, params];
        return originalQuery(text, params);
    });
    // Override release safely
    client.release = (() => {
        clearTimeout(timeout);
        // Restore original functions
        client.query = originalQuery;
        client.release = originalRelease;
        // Call original release
        originalRelease();
    });
    return client;
};
exports.getClient = getClient;
