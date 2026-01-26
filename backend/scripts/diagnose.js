import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Client } = pkg;

console.log('🔍 Database Connection Diagnostics\n');
console.log('='.repeat(50));
console.log('Configuration Check:');
console.log('='.repeat(50));
console.log(`DB_HOST: ${process.env.DB_HOST || 'NOT SET (default: localhost)'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 'NOT SET (default: 5432)'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'NOT SET (default: homeland_union)'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'NOT SET (default: postgres)'}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : 'NOT SET'}`);

if (!process.env.DB_PASSWORD) {
  console.error('\n❌ ERROR: DB_PASSWORD is not set in .env file!');
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('Testing Connection...');
console.log('='.repeat(50) + '\n');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'homeland_union',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 10000, // Increased timeout
  // Try without SSL first (PostgreSQL 18 might have SSL enabled by default)
  ssl: false,
});

client.connect()
  .then(() => {
    console.log('✅ Connection successful!');
    return client.query('SELECT version(), current_database(), current_user');
  })
  .then((result) => {
    console.log('\n📊 Database Information:');
    console.log(`   PostgreSQL Version: ${result.rows[0].version.split(',')[0]}`);
    console.log(`   Current Database: ${result.rows[0].current_database}`);
    console.log(`   Current User: ${result.rows[0].current_user}`);
    
    return client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
  })
  .then((result) => {
    console.log(`\n📋 Tables Found: ${result.rows.length}`);
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    console.log('\n✅ All diagnostics passed!\n');
    client.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Connection Failed!\n');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL service is not running or not accessible.');
      console.error('   Solution: Start PostgreSQL service');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed - wrong password or user.');
      console.error('   Solution: Check DB_USER and DB_PASSWORD in .env');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist.');
      console.error(`   Solution: Create database: CREATE DATABASE ${process.env.DB_NAME || 'homeland_union'};`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Connection timeout.');
      console.error('   Solution: Check if PostgreSQL is running and accessible');
    }
    
    console.error('\n');
    client.end();
    process.exit(1);
  });
