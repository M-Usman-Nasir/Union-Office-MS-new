# 🏠 Homeland Union - Apartment Management System

A comprehensive Progressive Web Application (PWA) for managing apartment/residential complexes with role-based access control.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
cd backend && npm install

# Setup database (see docs/database/DATABASE_SETUP.md)
# Run schema: psql -U your_user -d homeland_union -f database/schema.sql

# Seed database with test data
cd backend && npm run seed

# Start backend server
cd backend && npm run dev

# Start frontend (in root directory)
npm run dev
```

**Test Users (from seed):**
- Super Admin: `admin@homelandunion.com` / `admin123`
- Union Admin: `unionadmin@homelandunion.com` / `admin123`
- Resident: `resident@homelandunion.com` / `resident123`

Staff users can be created via **Admin → Users Management**.

## 📁 Project Structure

```
Union-Office-MS-new/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express server
├── database/            # Database files
│   ├── schema.sql       # Database schema
│   └── migrations/     # Database migrations
├── docs/                # All documentation
│   ├── backend/         # Backend docs
│   ├── database/        # Database docs
│   ├── frontend/        # Frontend docs
│   ├── features/        # Feature reference
│   ├── guides/          # User guides (Super Admin, Union Admin)
│   ├── planning/        # Planning / future work
│   └── srs/             # SRS & implementation docs
├── public/              # Static assets (icons, etc.)
├── src/                 # React frontend
│   ├── api/             # API service modules
│   ├── components/      # React components
│   │   ├── charts/      # Chart components
│   │   ├── common/      # Common components
│   │   ├── complaints/  # Complaint-related components
│   │   ├── error/       # Error components
│   │   ├── finance/     # Finance components
│   │   ├── layout/      # Layout components
│   │   ├── pwa/         # PWA components
│   │   └── residents/   # Resident-related components
│   ├── contexts/        # React contexts
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   ├── auth/        # Authentication pages
│   │   ├── error/       # Error pages
│   │   ├── resident/    # Resident pages
│   │   ├── staff/       # Staff pages
│   │   └── super-admin/ # Super Admin pages
│   ├── routes/          # Route configuration
│   ├── styles/          # SCSS styles
│   ├── theme/           # MUI theme (legacy)
│   └── utils/           # Utility functions
└── README.md            # This file
```

## 🎯 Features

### ✅ Admin Features
- Residents Management
- Maintenance Management
- Finance Management
- Complaints Management
- Defaulters Management
- Announcements
- Users Management
- Settings

### ✅ Super Admin Features
- Apartments Management
- Blocks Management
- Floors Management
- Units Management
- System-wide Dashboard

### ✅ Resident Features
- Personal Dashboard
- Complaint Submission
- Maintenance Records
- Union Information
- Profile Management

### ✅ Staff Features
- Staff Dashboard
- Complaints Management
- Payments Management

### ✅ PWA Features
- Offline support
- Install prompt
- Dark/light mode
- Error boundaries
- Mobile optimization
- Apple PWA support

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- Material-UI (MUI)
- Tailwind CSS
- SCSS
- React Router
- SWR
- ApexCharts
- Formik & Yup
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcryptjs

## 📚 Documentation

All documentation is in the `docs/` directory. Start at **[docs/README.md](./docs/README.md)** for the full index.

- **Quick Start:** [docs/QUICK_START.md](./docs/QUICK_START.md)
- **Setup Guide:** [docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)
- **Project Structure:** [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- **Backend:** [API](./docs/backend/API_DOCUMENTATION.md) · [Setup](./docs/backend/SETUP.md)
- **Frontend:** [PWA Setup](./docs/frontend/PWA_SETUP_GUIDE.md)
- **Database:** [Database Setup](./docs/database/DATABASE_SETUP.md)
- **Guides:** [Super Admin](./docs/guides/SUPER_ADMIN_GUIDE.md) · [Union Admin](./docs/guides/UNION_ADMIN_GUIDE.md)

## 🔧 Development

```bash
# Frontend development
npm run dev

# Backend development
cd backend && npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Homeland Union
VITE_APP_VERSION=0.1.0
```

### Backend (backend/.env)
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homeland_union
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:5173
```

## 🎨 Features Overview

- ✅ Role-based access control (Super Admin, Union Admin, Admin, Staff, Resident)
- ✅ JWT authentication with refresh tokens
- ✅ Progressive Web App (PWA)
- ✅ Dark/light mode
- ✅ Responsive design
- ✅ Real-time data with SWR
- ✅ Charts and visualizations
- ✅ File upload support
- ✅ Error boundaries
- ✅ Offline support

## 📄 License

Private project - All rights reserved

## 👥 Contributing

This is a private project. For questions or issues, please contact the project maintainer.
