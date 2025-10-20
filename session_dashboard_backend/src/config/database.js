// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-DB-001
// User Story: PostgreSQL database connection and configuration
// GxP Impact: YES - Database operations for GxP data
// Risk Level: HIGH
// ============================================================================

const { Pool } = require('pg');

let pool;

// PUBLIC_INTERFACE
/**
 * Initialize PostgreSQL connection pool
 * @returns {Promise<Pool>} Database pool instance
 */
const connectDatabase = async () => {
  try {
    if (pool) {
      return pool;
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected at:', result.rows[0].now);
    client.release();

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });

    return pool;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Get database pool instance
 * @returns {Pool} Database pool
 */
const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return pool;
};

// PUBLIC_INTERFACE
/**
 * Execute a database query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Close database connection
 */
const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
};

module.exports = {
  connectDatabase,
  getPool,
  query,
  closeDatabase
};
