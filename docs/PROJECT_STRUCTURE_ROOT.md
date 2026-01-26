# 📁 Project Structure

This document describes the organized structure of the Homeland Union project.

## 🗂️ Directory Structure

```
Union-Office-MS-new/
│
├── 📄 Root Configuration Files
│   ├── .env.example          # Frontend environment template
│   ├── .eslintrc.cjs         # ESLint configuration
│   ├── .gitattributes        # Git attributes
│   ├── .gitignore            # Git ignore rules
│   ├── index.html            # HTML entry point
│   ├── jsconfig.json         # JavaScript path aliases
│   ├── package.json          # Frontend dependencies
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vite.config.js        # Vite build configuration
│   └── README.md             # Main project README
│
├── 📁 backend/               # Node.js/Express Backend
│   ├── .env.example          # Backend environment template
│   ├── .gitignore           # Backend git ignore
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Express server entry point
│   │
│   ├── 📁 config/           # Configuration files
│   │   └── database.js     # PostgreSQL connection pool
│   │
│   ├── 📁 controllers/      # Route controllers
│   │   ├── announcementController.js
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── defaulterController.js
│   │   ├── financeController.js
│   │   ├── maintenanceController.js
│   │   ├── propertyController.js
│   │   ├── residentController.js
│   │   ├── societyController.js
│   │   └── userController.js
│   │
│   ├── 📁 middleware/       # Express middleware
│   │   └── auth.js         # JWT authentication & RBAC
│   │
│   ├── 📁 routes/           # API route definitions
│   │   ├── announcements.js
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   ├── defaulters.js
│   │   ├── finance.js
│   │   ├── maintenance.js
│   │   ├── properties.js
│   │   ├── residents.js
│   │   ├── societies.js
│   │   ├── test.js
│   │   └── users.js
│   │
│   └── 📁 scripts/          # Utility scripts
│       ├── addLastLoginColumn.js
│       ├── checkPort.js
│       ├── diagnose.js
│       ├── findPostgresPort.js
│       ├── hashPassword.js
│       ├── seedDatabase.js
│       └── testConnection.js
│
├── 📁 database/             # Database Files
│   ├── schema.sql           # Complete database schema
│   └── 📁 migrations/       # Database migrations
│       └── add_last_login.sql
│
├── 📁 docs/                 # All Documentation
│   ├── README.md            # Documentation index
│   │
│   ├── 📁 frontend/         # Frontend documentation
│   │   └── PWA_SETUP_GUIDE.md
│   │
│   ├── 📁 backend/          # Backend documentation
│   │   ├── API_DOCUMENTATION.md
│   │   ├── FIX_CONNECTION.md
│   │   ├── README.md
│   │   ├── SETUP.md
│   │   └── START_POSTGRES.md
│   │
│   ├── 📁 database/         # Database documentation
│   │   └── DATABASE_SETUP.md
│   │
│   └── 📄 General Docs      # General documentation
│       ├── COMPLETE_FEATURES_SUMMARY.md
│       ├── FEATURES_COMPLETED.md
│       ├── FEATURES_IMPLEMENTED.md
│       ├── IMPLEMENTATION_SUMMARY.md
│       ├── QUICK_START.md
│       ├── SETUP_GUIDE.md
│       ├── SETUP.md
│       └── TESTING_GUIDE.md
│
├── 📁 public/               # Static Assets (to be created)
│   ├── favicon.ico
│   ├── pwa-*.png           # PWA icons
│   └── apple-touch-icon-*.png  # Apple icons
│
└── 📁 src/                  # React Frontend Source
    │
    ├── 📁 api/              # API Service Modules
    │   ├── announcementApi.js
    │   ├── authApi.js
    │   ├── axios.js         # Axios instance with interceptors
    │   ├── communicationApi.js
    │   ├── complaintApi.js
    │   ├── dashboardApi.js
    │   ├── defaulterApi.js
    │   ├── financeApi.js
    │   ├── maintenanceApi.js
    │   ├── propertyApi.js
    │   ├── residentApi.js
    │   ├── societyApi.js
    │   └── userApi.js
    │
    ├── 📁 components/       # React Components
    │   │
    │   ├── 📁 charts/       # Chart Components
    │   │   ├── BarChart.jsx
    │   │   ├── FinanceChart.jsx
    │   │   └── PieChart.jsx
    │   │
    │   ├── 📁 common/       # Common/Reusable Components
    │   │   └── DataTable.jsx
    │   │
    │   ├── 📁 error/        # Error Handling Components
    │   │   └── ErrorBoundary.jsx
    │   │
    │   ├── 📁 layout/       # Layout Components
    │   │   └── MainLayout.jsx
    │   │
    │   └── 📁 pwa/          # PWA Components
    │       └── PWAInstallPrompt.jsx
    │
    ├── 📁 contexts/         # React Contexts
    │   ├── AuthContext.jsx      # Authentication context
    │   ├── ConfigContext.jsx    # App configuration context
    │   └── ThemeContext.jsx     # Dark/light mode context
    │
    ├── 📁 pages/            # Page Components
    │   │
    │   ├── 📁 admin/        # Admin Pages
    │   │   ├── Announcements.jsx
    │   │   ├── Complaints.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Defaulters.jsx
    │   │   ├── Finance.jsx
    │   │   ├── Maintenance.jsx
    │   │   ├── Residents.jsx
    │   │   ├── Settings.jsx
    │   │   └── Users.jsx
    │   │
    │   ├── 📁 auth/         # Authentication Pages
    │   │   └── LoginPage.jsx
    │   │
    │   ├── 📁 error/        # Error Pages
    │   │   └── Offline.jsx
    │   │
    │   ├── 📁 resident/     # Resident Pages
    │   │   ├── Complaints.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Maintenance.jsx
    │   │   ├── Profile.jsx
    │   │   └── UnionInfo.jsx
    │   │
    │   └── 📁 super-admin/  # Super Admin Pages
    │       ├── Blocks.jsx
    │       ├── Dashboard.jsx
    │       ├── Floors.jsx
    │       ├── Societies.jsx
    │       └── Units.jsx
    │
    ├── 📁 routes/           # Route Configuration
    │   ├── index.jsx        # Main route definitions
    │   └── ProtectedRoute.jsx  # Route protection component
    │
    ├── 📁 styles/           # SCSS Styles
    │   ├── _variables.scss  # SCSS variables
    │   └── main.scss        # Main stylesheet
    │
    ├── 📁 theme/            # MUI Theme (legacy - now using ThemeContext)
    │   └── theme.js
    │
    ├── 📁 utils/            # Utility Functions
    │   ├── constants.js     # App constants
    │   └── fileUpload.js    # File upload utilities
    │
    ├── App.css              # App-specific styles
    ├── App.jsx              # Root App component
    ├── index.css            # Global CSS (Tailwind)
    └── main.jsx             # Application entry point
```

## 📋 File Organization Principles

### 1. **Documentation** (`docs/`)
- All `.md` files organized by category
- Frontend, backend, and database docs separated
- General docs in root of `docs/`

### 2. **Components** (`src/components/`)
- **charts/** - Chart visualization components
- **common/** - Reusable components (DataTable, etc.)
- **error/** - Error handling components
- **layout/** - Layout components (MainLayout)
- **pwa/** - PWA-specific components

### 3. **Pages** (`src/pages/`)
- Organized by user role/feature
- **admin/** - Admin-only pages
- **auth/** - Authentication pages
- **error/** - Error pages (Offline, etc.)
- **resident/** - Resident pages
- **super-admin/** - Super Admin pages

### 4. **API Services** (`src/api/`)
- One file per domain/module
- All use centralized `axios.js` instance
- Consistent naming: `*Api.js`

### 5. **Database** (`database/`)
- `schema.sql` - Main schema
- `migrations/` - Migration scripts

### 6. **Backend** (`backend/`)
- Standard Express.js structure
- Controllers, routes, middleware separated
- Scripts for utilities and migrations

## 🧹 Cleanup Notes

### Removed/Organized
- ✅ All documentation moved to `docs/`
- ✅ Database files moved to `database/`
- ✅ Components organized into subdirectories
- ✅ Build artifacts excluded (dev-dist)
- ✅ Duplicate setup guides consolidated

### Files to Create
- `public/` directory with PWA icons (see PWA_SETUP_GUIDE.md)

## 📝 Import Paths

All imports use path aliases configured in `jsconfig.json`:
- `@/` → `src/`
- Example: `import { useAuth } from '@/contexts/AuthContext'`

## 🎯 Best Practices

1. **Components:** Group by functionality (charts, common, error, layout, pwa)
2. **Pages:** Group by user role or feature area
3. **API:** One service file per domain
4. **Documentation:** All in `docs/` organized by category
5. **Database:** Schema and migrations in `database/`
6. **Backend:** Standard Express structure

This structure follows React and Node.js best practices for maintainability and scalability.
