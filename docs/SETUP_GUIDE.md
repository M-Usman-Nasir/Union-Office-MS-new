# Homeland Union - Complete Setup Guide

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [Frontend Setup](#frontend-setup)
3. [Backend API Setup](#backend-api-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)

---

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL installed and running
- Database "homeland union" already created
- psql command-line tool or pgAdmin installed

### Method 1: Using psql Command Line (Recommended)

#### Step 1: Connect to PostgreSQL
Open your terminal/command prompt and connect to PostgreSQL:

```bash
# On Windows (if PostgreSQL is in PATH)
psql -U postgres

# Or specify the host and port
psql -U postgres -h localhost -p 5432
```

#### Step 2: Connect to Your Database
Once connected, connect to your "homeland union" database:

```sql
-- Note: Database name has a space, so use quotes
\c "homeland union"
```

#### Step 3: Run the Schema File
Execute the schema.sql file:

```bash
# From your project directory in a new terminal
psql -U postgres -d "homeland union" -f schema.sql
```

**OR** if you're already in psql:

```sql
-- Make sure you're in the database
\c "homeland union"

-- Then run the file
\i C:/Users/kk/Documents/GitHub/Union-Office-MS-new/schema.sql
```

**Note:** Adjust the file path according to your actual file location.

### Method 2: Using pgAdmin (GUI)

1. **Open pgAdmin** and connect to your PostgreSQL server

2. **Navigate to your database:**
   - Expand "Servers" → Your server → "Databases"
   - Right-click on "homeland union" → Select "Query Tool"

3. **Open the schema file:**
   - Click "Open File" button (folder icon) in the Query Tool
   - Navigate to: `C:\Users\kk\Documents\GitHub\Union-Office-MS-new\schema.sql`
   - Select and open the file

4. **Execute the schema:**
   - Click the "Execute" button (play icon) or press `F5`
   - Wait for "Query returned successfully" message

5. **Verify tables were created:**
   - Right-click on "homeland union" database → Refresh
   - Expand "Schemas" → "public" → "Tables"
   - You should see all tables: users, societies, blocks, floors, units, maintenance, etc.

### Method 3: Using SQL Script in psql

If the above methods don't work, you can copy and paste the entire schema.sql content directly into psql:

```sql
-- Connect to database
\c "homeland union"

-- Then paste the entire content of schema.sql and press Enter
```

### Verify Database Setup

Run these queries to verify everything was created correctly:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if triggers were created
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Check if indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```

You should see:
- **Tables:** users, societies, blocks, floors, units, maintenance, maintenance_config, finance, announcements, defaulters, complaints, settings
- **Triggers:** Multiple update triggers for updated_at columns
- **Indexes:** Multiple indexes for performance

---

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
cd C:\Users\kk\Documents\GitHub\Union-Office-MS-new
npm install
```

### Step 2: Create Required Files

Create the following directory structure and files:

```
src/
├── api/
│   ├── axios.js
│   ├── userApi.js
│   ├── societyApi.js
│   ├── maintenanceApi.js
│   ├── financeApi.js
│   ├── defaulterApi.js
│   ├── complaintApi.js
│   ├── announcementApi.js
│   ├── blockApi.js
│   ├── floorApi.js
│   ├── unitApi.js
│   └── propertiesApi.js
├── routes/
│   ├── index.jsx
│   └── ProtectedRoute.jsx
├── utils/
│   └── constants.js
└── hooks/
    ├── useAuth.js
    └── useApi.js
```

### Step 3: Configure Environment Variables

Update your `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Homeland Union
VITE_APP_VERSION=0.1.0
```

---

## 🔧 Backend API Setup

### Option 1: Node.js/Express Backend (Recommended)

#### Step 1: Create Backend Directory

```bash
# Create backend folder (outside or inside project)
mkdir homeland-union-backend
cd homeland-union-backend
npm init -y
```

#### Step 2: Install Backend Dependencies

```bash
npm install express cors dotenv bcryptjs jsonwebtoken pg
npm install -D nodemon
```

#### Step 3: Basic Backend Structure

```
backend/
├── config/
│   └── database.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── societies.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── models/
│   └── User.js
└── server.js
```

#### Step 4: Database Connection

Create `config/database.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'homeland union',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
```

#### Step 5: Environment Variables for Backend

Create `.env` in backend folder:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=homeland union
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
```

---

## ⚙️ Environment Configuration

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Homeland Union
VITE_APP_VERSION=0.1.0
```

### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=homeland union
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Running the Application

### Frontend Development Server

```bash
# From project root
npm run dev
```

The app will be available at: `http://localhost:5173`

### Backend Server (if using Node.js/Express)

```bash
# From backend directory
npm run dev
# or
node server.js
```

The API will be available at: `http://localhost:3000/api`

---

## ✅ Verification Checklist

### Database
- [ ] PostgreSQL is running
- [ ] Database "homeland union" exists
- [ ] Schema.sql executed successfully
- [ ] All tables created (12 tables)
- [ ] Triggers created
- [ ] Indexes created

### Frontend
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Development server starts without errors
- [ ] Can access `http://localhost:5173`

### Backend (if applicable)
- [ ] Backend dependencies installed
- [ ] Database connection working
- [ ] API server starts successfully
- [ ] Can access `http://localhost:3000/api`

---

## 🔍 Troubleshooting

### Database Connection Issues

**Error: "database does not exist"**
```sql
-- Create the database first
CREATE DATABASE "homeland union";
```

**Error: "permission denied"**
- Make sure your PostgreSQL user has proper permissions
- Try connecting as superuser: `psql -U postgres`

**Error: "relation already exists"**
- Drop existing tables if needed:
```sql
DROP TABLE IF EXISTS users, societies, blocks, floors, units, maintenance, maintenance_config, finance, announcements, defaulters, complaints, settings CASCADE;
```
Then run schema.sql again.

### Frontend Issues

**Error: "Cannot find module"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

**Error: "Port already in use"**
- Change port in `vite.config.js` or kill the process using the port

### Backend Issues

**Error: "Cannot connect to database"**
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Test connection: `psql -U postgres -d "homeland union"`

---

## 📝 Next Steps

1. **Create API endpoints** in your backend
2. **Implement authentication** (JWT)
3. **Set up protected routes** in frontend
4. **Create page components** for each module
5. **Test the full flow**: Login → Dashboard → CRUD operations

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the error messages carefully
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running
4. Check database connection credentials
5. Review the console logs for detailed error information
