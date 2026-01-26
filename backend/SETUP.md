# Backend Setup - Quick Start Guide

## ✅ Step 1: Install Dependencies

```bash
cd backend
npm install
```

## ✅ Step 2: Create Environment File

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homeland_union
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration (for later)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password!

## ✅ Step 3: Test Database Connection

### Option A: Using the test script
```bash
npm run test:db
```

### Option B: Start the server and test via API
```bash
npm run dev
```

Then open in browser or use curl:
- Browser: `http://localhost:3000/api/test/db`
- curl: `curl http://localhost:3000/api/test/db`

## ✅ Step 4: Start Development Server

```bash
npm run dev
```

The server will:
- Test database connection on startup
- Display all tables found
- Start on `http://localhost:3000`

## 🧪 Test Endpoints

Once the server is running, test these endpoints:

1. **Health Check:**
   ```
   http://localhost:3000/health
   ```

2. **Database Connection Test:**
   ```
   http://localhost:3000/api/test/db
   ```

3. **Get All Tables:**
   ```
   http://localhost:3000/api/test/tables
   ```

4. **Test Societies Query:**
   ```
   http://localhost:3000/api/test/societies
   ```

5. **Test Users Query:**
   ```
   http://localhost:3000/api/test/users
   ```

## ✅ Expected Output

When you run `npm run dev`, you should see:

```
🔄 Testing database connection...
✅ Database connection established
✅ Found 12 tables in database:
   - announcements
   - blocks
   - complaints
   - defaulters
   - finance
   - floors
   - maintenance
   - maintenance_config
   - settings
   - societies
   - units
   - users

🚀 Server is running!
📍 Server URL: http://localhost:3000
🔗 API Base URL: http://localhost:3000/api
💚 Health Check: http://localhost:3000/health
🧪 DB Test: http://localhost:3000/api/test/db

📝 Environment: development
```

## ❌ Troubleshooting

### Error: "Cannot find module"
- Make sure you ran `npm install` in the backend folder
- Check that you're in the `backend` directory

### Error: "password authentication failed"
- Check your `.env` file - verify `DB_PASSWORD` is correct
- Make sure PostgreSQL is running

### Error: "database does not exist"
- Verify database name is `homeland_union` (with underscore)
- Check your `.env` file `DB_NAME` setting

### Error: "connection refused"
- Make sure PostgreSQL is running
- Check `DB_HOST` and `DB_PORT` in `.env`

### Port 3000 already in use
- Change `PORT` in `.env` to a different port (e.g., 3001)
- Or stop the process using port 3000

## 🎯 Next Steps

After successful database connection:

1. ✅ Database connection working
2. ⏳ Implement JWT authentication
3. ⏳ Create API routes for all modules
4. ⏳ Add input validation
5. ⏳ Implement error handling
