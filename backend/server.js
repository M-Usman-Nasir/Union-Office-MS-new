/* eslint-env node */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { testConnection, getTables } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import apartmentRoutes from './routes/apartments.js';
import residentRoutes from './routes/residents.js';
import maintenanceRoutes from './routes/maintenance.js';
import financeRoutes from './routes/finance.js';
import complaintRoutes from './routes/complaints.js';
import defaulterRoutes from './routes/defaulters.js';
import announcementRoutes from './routes/announcements.js';
import propertyRoutes from './routes/properties.js';
import userRoutes from './routes/users.js';
import employeesRoutes from './routes/employees.js';
import unionMembersRoutes from './routes/unionMembers.js';
import superAdminRoutes from './routes/superAdmin.js';
import settingsRoutes from './routes/settings.js';
import staffRoutes from './routes/staff.js';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';
import cronRoutes from './routes/cron.js';
import bootstrapRoutes from './routes/bootstrap.js';

// Load environment variables
dotenv.config();

const app = express();
// Guard against environments where `process` is not defined (e.g., browser-based tooling)
const PORT = (typeof process !== 'undefined' && process.env && process.env.PORT) || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
// Body parser for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files (profile images)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Set CORS headers for image files
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Cache images for 1 year
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

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
app.use('/api/bootstrap', bootstrapRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/societies', apartmentRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/defaulters', defaulterRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/union-members', unionMembersRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/cron', cronRoutes);

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

// 404 handler – include path in response to debug wrong URLs
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle payload too large error specifically
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Image size must be less than 2MB.',
      error: 'Payload size limit exceeded',
    });
  }
  
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

    // Initialize scheduled jobs
    try {
      const { scheduleMonthlyDues } = await import('./jobs/monthlyDuesGenerator.js');
      scheduleMonthlyDues();
      console.log('✅ Monthly dues scheduler initialized');
    } catch (error) {
      console.warn('⚠️  Could not initialize monthly dues scheduler:', error.message);
    }
    try {
      const { scheduleReminderDues } = await import('./jobs/reminderDuesJob.js');
      scheduleReminderDues();
      console.log('✅ Reminder dues scheduler initialized');
    } catch (error) {
      console.warn('⚠️  Could not initialize reminder dues scheduler:', error.message);
    }
    try {
      const { scheduleAutoGenerateInvoices } = await import('./jobs/autoGenerateInvoicesJob.js');
      scheduleAutoGenerateInvoices();
      console.log('✅ Invoice auto-generate scheduler initialized');
    } catch (error) {
      console.warn('⚠️  Could not initialize invoice auto-generate scheduler:', error.message);
    }

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
