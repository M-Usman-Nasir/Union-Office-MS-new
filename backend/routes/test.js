import express from 'express';
import { testConnection, getTables, query } from '../config/database.js';

const router = express.Router();

// Test database connection
router.get('/db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    const tables = await getTables();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      database: process.env.DB_NAME,
      tables: tables.map(t => t.table_name),
      tableCount: tables.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Test query - Get all societies
router.get('/societies', async (req, res) => {
  try {
    const result = await query('SELECT * FROM societies LIMIT 10');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Query failed',
      error: error.message,
    });
  }
});

// Test query - Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role FROM users LIMIT 10');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Query failed',
      error: error.message,
    });
  }
});

// Test query - Get table structure
router.get('/tables', async (req, res) => {
  try {
    const tables = await getTables();
    res.json({
      success: true,
      tables: tables.map(t => t.table_name),
      count: tables.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tables',
      error: error.message,
    });
  }
});

export default router;
