import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { testConnection, getTables } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import societyRoutes from './routes/societies.js';
import residentRoutes from './routes/residents.js';
import maintenanceRoutes from './routes/maintenance.js';
import financeRoutes from './routes/finance.js';
import complaintRoutes from './routes/complaints.js';
import defaulterRoutes from './routes/defaulters.js';
import announcementRoutes from './routes/announcements.js';
import propertyRoutes from './routes/properties.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/defaulters', defaulterRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

// Database connection test endpoint
app.get('/api/test/db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      const tables = await getTables();
      res.json({
        success: true,
        message: 'Database connection successful',
        tables: tables.map(t => t.table_name),
        tableCount: tables.length,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection on startup
    console.log('🔄 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Get and display tables
    const tables = await getTables();
    console.log(`✅ Found ${tables.length} tables in database:`);
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    // Start listening
    app.listen(PORT, () => {
      console.log('\n🚀 Server is running!');
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log(`🧪 DB Test: http://localhost:${PORT}/api/test/db`);
      console.log(`\n📝 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
