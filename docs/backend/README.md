# Homeland Union Backend API

Node.js/Express backend API for the Homeland Union Management System.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homeland_union
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 3. Test Database Connection

```bash
npm run test:db
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health check

### Database Test
- `GET /api/test/db` - Test database connection
- `GET /api/test/tables` - Get all tables
- `GET /api/test/societies` - Test societies query
- `GET /api/test/users` - Test users query

### Authentication (Placeholder)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js       # Database connection and queries
├── routes/
│   ├── auth.js          # Authentication routes
│   └── test.js          # Test routes
├── middleware/
│   └── (to be created)
├── controllers/
│   └── (to be created)
├── models/
│   └── (to be created)
├── scripts/
│   └── testConnection.js # Database connection test script
├── server.js             # Main server file
├── package.json
└── .env                  # Environment variables
```

## 🧪 Testing Database Connection

### Method 1: Using the test script
```bash
npm run test:db
```

### Method 2: Using API endpoint
```bash
curl http://localhost:3000/api/test/db
```

### Method 3: Using browser
Open: `http://localhost:3000/api/test/db`

## 📝 Next Steps

1. ✅ Database connection setup
2. ⏳ Implement JWT authentication
3. ⏳ Create API routes for all modules
4. ⏳ Add validation middleware
5. ⏳ Implement error handling
6. ⏳ Add logging
7. ⏳ Write API documentation

## 🔧 Development

- **Development mode**: `npm run dev` (uses nodemon for auto-reload)
- **Production mode**: `npm start`

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **cookie-parser** - Cookie parsing
- **express-validator** - Input validation
