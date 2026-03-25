import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types: pgTypes } = pkg;

// Interpret PostgreSQL "timestamp without time zone" as UTC so API always sends correct UTC.
// OID 1114 = timestamp without time zone. Without this, node-pg uses server local timezone.
if (pgTypes && pgTypes.setTypeParser) {
  pgTypes.setTypeParser(1114, (stringValue) => {
    if (stringValue == null) return null;
    const s = String(stringValue).trim();
    if (!s) return null;
    return new Date(s.endsWith('Z') ? s : s.replace(' ', 'T') + 'Z');
  });
}

// Prefer DATABASE_URL (e.g. Render Internal URL); otherwise use individual DB_* vars
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'homeland_union',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(poolConfig);

// Use UTC for session so CURRENT_TIMESTAMP / NOW() store and compare in UTC
pool.on('connect', (client) => {
  client.query("SET timezone = 'UTC'").catch((err) => {
    console.warn('Could not set session timezone to UTC:', err.message);
  });
  console.log('✅ Database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection function
export const testConnection = async () => {
  try {
    console.log('\n📋 Connection Details:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'homeland_union'}`);
    console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
    console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : 'NOT SET'}\n`);
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection test successful');
    console.log('📅 Current database time:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('\n❌ Database connection test failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.stack) {
      console.error('\nFull Error Details:');
      console.error(error.stack);
    }
    
    // Common error messages and solutions
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solution: PostgreSQL service might not be running.');
      console.error('   - Check if PostgreSQL is running');
      console.error('   - Verify the host and port are correct');
    } else if (error.code === '28P01' || error.message.includes('password')) {
      console.error('\n💡 Solution: Authentication failed - check your password.');
      console.error('   - Verify DB_PASSWORD in .env file');
      console.error('   - Make sure password doesn\'t have special characters that need escaping');
    } else if (error.code === '3D000' || error.message.includes('does not exist')) {
      console.error('\n💡 Solution: Database does not exist.');
      console.error('   - Verify DB_NAME in .env file');
      console.error('   - Create the database: CREATE DATABASE homeland_union;');
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.error('\n💡 Solution: Connection timeout.');
      console.error('   - Check if PostgreSQL is running');
      console.error('   - Verify firewall settings');
      console.error('   - Check network connectivity');
    }
    
    console.error('');
    return false;
  }
};

/** Ensures columns required by current API code exist (idempotent). */
export const ensureSchemaPatches = async () => {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Schema patch: users.must_change_password');
  } catch (e) {
    console.warn('⚠️  Schema patch (must_change_password) skipped:', e.message);
  }
  try {
    await pool.query(`
      ALTER TABLE complaints
      ADD COLUMN IF NOT EXISTS feedback_rating INTEGER,
      ADD COLUMN IF NOT EXISTS feedback_comment TEXT,
      ADD COLUMN IF NOT EXISTS feedback_submitted_at TIMESTAMP;
    `);
    console.log('✅ Schema patch: complaints.feedback_*');
  } catch (e) {
    console.warn('⚠️  Schema patch (complaints feedback) skipped:', e.message);
  }
};

// Get all tables
export const getTables = async () => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

// Query helper function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Get a client from the pool
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;
