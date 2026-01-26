import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'homeland_union',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Increased to 10 seconds
  // PostgreSQL 18 compatibility
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.on('connect', () => {
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
