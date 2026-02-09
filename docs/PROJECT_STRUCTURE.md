# 📁 Project Structure - Homeland Union

## 🗂️ Complete Directory Tree

```
Union-Office-MS-new/
│
├── 📄 Configuration Files (Root)
│   ├── .env.example              # Frontend environment template
│   ├── .eslintrc.cjs             # ESLint configuration
│   ├── .gitattributes            # Git attributes
│   ├── .gitignore               # Git ignore rules
│   ├── index.html               # HTML entry point
│   ├── jsconfig.json            # JavaScript path aliases (@/)
│   ├── package.json             # Frontend dependencies
│   ├── package-lock.json        # Dependency lock file
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── vite.config.js           # Vite build configuration
│   └── README.md                # Main project README
│
├── 📁 backend/                  # Node.js/Express Backend
│   ├── .env.example             # Backend environment template
│   ├── .gitignore              # Backend git ignore
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express server entry point
│   │
│   ├── 📁 config/              # Configuration
│   │   └── database.js         # PostgreSQL connection pool
│   │
│   ├── 📁 controllers/         # Route Controllers (10 files)
│   │   ├── announcementController.js
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── defaulterController.js
│   │   ├── financeController.js
│   │   ├── maintenanceController.js
│   │   ├── propertyController.js
│   │   ├── residentController.js
│   │   ├── apartmentController.js
│   │   └── userController.js
│   │
│   ├── 📁 middleware/          # Express Middleware
│   │   └── auth.js             # JWT authentication & RBAC
│   │
│   ├── 📁 routes/              # API Routes (11 files)
│   │   ├── announcements.js
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   ├── defaulters.js
│   │   ├── finance.js
│   │   ├── maintenance.js
│   │   ├── properties.js
│   │   ├── residents.js
│   │   ├── apartments.js
│   │   ├── test.js
│   │   └── users.js
│   │
│   └── 📁 scripts/             # Utility Scripts (7 files)
│       ├── addLastLoginColumn.js
│       ├── checkPort.js
│       ├── diagnose.js
│       ├── findPostgresPort.js
│       ├── hashPassword.js
│       ├── seedDatabase.js
│       └── testConnection.js
│
├── 📁 database/                 # Database Files
│   ├── schema.sql              # Complete database schema
│   └── 📁 migrations/          # Database Migrations
│       └── add_last_login.sql
│
├── 📁 docs/                    # All Documentation
│   ├── README.md               # Documentation index
│   │
│   ├── 📁 frontend/            # Frontend Documentation
│   │   └── PWA_SETUP_GUIDE.md
│   │
│   ├── 📁 backend/             # Backend Documentation
│   │   ├── API_DOCUMENTATION.md
│   │   ├── FIX_CONNECTION.md
│   │   ├── README.md
│   │   ├── SETUP.md
│   │   └── START_POSTGRES.md
│   │
│   ├── 📁 database/            # Database Documentation
│   │   └── DATABASE_SETUP.md
│   │
│   └── 📄 General Docs         # General Documentation (8 files)
│       ├── COMPLETE_FEATURES_SUMMARY.md
│       ├── FEATURES_COMPLETED.md
│       ├── FEATURES_IMPLEMENTED.md
│       ├── IMPLEMENTATION_SUMMARY.md
│       ├── ORGANIZATION_SUMMARY.md
│       ├── QUICK_START.md
│       ├── SETUP_GUIDE.md
│       ├── SETUP.md
│       └── TESTING_GUIDE.md
│
├── 📁 public/                   # Static Assets (to be created)
│   └── [PWA icons and favicons]
│
└── 📁 src/                      # React Frontend Source
    │
    ├── 📁 api/                  # API Service Modules (13 files)
    │   ├── announcementApi.js
    │   ├── authApi.js
    │   ├── axios.js             # Axios instance with interceptors
    │   ├── communicationApi.js
    │   ├── complaintApi.js
    │   ├── dashboardApi.js
    │   ├── defaulterApi.js
    │   ├── financeApi.js
    │   ├── maintenanceApi.js
    │   ├── propertyApi.js
    │   ├── residentApi.js
    │   ├── apartmentApi.js
    │   └── userApi.js
    │
    ├── 📁 components/           # React Components
    │   │
    │   ├── 📁 charts/           # Chart Components (3 files)
    │   │   ├── BarChart.jsx
    │   │   ├── FinanceChart.jsx
    │   │   └── PieChart.jsx
    │   │
    │   ├── 📁 common/           # Common Components (1 file)
    │   │   └── DataTable.jsx
    │   │
    │   ├── 📁 error/            # Error Components (1 file)
    │   │   └── ErrorBoundary.jsx
    │   │
    │   ├── 📁 layout/           # Layout Components (1 file)
    │   │   └── MainLayout.jsx
    │   │
    │   └── 📁 pwa/              # PWA Components (1 file)
    │       └── PWAInstallPrompt.jsx
    │
    ├── 📁 contexts/            # React Contexts (3 files)
    │   ├── AuthContext.jsx      # Authentication context
    │   ├── ConfigContext.jsx    # App configuration context
    │   └── ThemeContext.jsx     # Dark/light mode context
    │
    ├── 📁 pages/               # Page Components
    │   │
    │   ├── 📁 admin/            # Admin Pages (8 files)
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
    │   ├── 📁 auth/             # Authentication Pages (1 file)
    │   │   └── LoginPage.jsx
    │   │
    │   ├── 📁 error/            # Error Pages (1 file)
    │   │   └── Offline.jsx
    │   │
    │   ├── 📁 resident/         # Resident Pages (5 files)
    │   │   ├── Complaints.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Maintenance.jsx
    │   │   ├── Profile.jsx
    │   │   └── UnionInfo.jsx
    │   │
    │   └── 📁 super-admin/      # Super Admin Pages (5 files)
    │       ├── Blocks.jsx
    │       ├── Dashboard.jsx
    │       ├── Floors.jsx
    │       ├── Apartments.jsx
    │       └── Units.jsx
    │
    ├── 📁 routes/               # Route Configuration (2 files)
    │   ├── index.jsx            # Main route definitions
    │   └── ProtectedRoute.jsx   # Route protection component
    │
    ├── 📁 styles/               # SCSS Styles (2 files)
    │   ├── _variables.scss      # SCSS variables
    │   └── main.scss            # Main stylesheet
    │
    ├── 📁 theme/                # MUI Theme (1 file)
    │   └── theme.js             # Legacy theme (now using ThemeContext)
    │
    ├── 📁 utils/                # Utility Functions (2 files)
    │   ├── constants.js         # App constants
    │   └── fileUpload.js        # File upload utilities
    │
    ├── App.css                  # App-specific styles
    ├── App.jsx                   # Root App component
    ├── index.css                 # Global CSS (Tailwind)
    └── main.jsx                  # Application entry point
```

## 📊 File Count Summary

- **Backend Controllers:** 10 files
- **Backend Routes:** 11 files
- **Backend Scripts:** 7 files
- **API Services:** 13 files
- **Components:** 7 files (organized in 5 subdirectories)
- **Contexts:** 3 files
- **Pages:** 20 files (organized in 5 subdirectories)
- **Documentation:** 15+ files (organized in docs/)

## 🎯 Organization Principles

### 1. **Separation of Concerns**
- Frontend (`src/`) and Backend (`backend/`) clearly separated
- Database files in dedicated `database/` directory
- Documentation in `docs/` directory

### 2. **Component Organization**
- Components grouped by functionality
- Charts, common, error, layout, and PWA components separated
- Easy to find and maintain

### 3. **Page Organization**
- Pages grouped by user role/feature
- Admin, auth, error, resident, and super-admin pages separated
- Clear navigation structure

### 4. **Documentation Organization**
- All docs in `docs/` directory
- Categorized by frontend, backend, database
- Easy to find relevant documentation

### 5. **Clean Root Directory**
- Only essential configuration files in root
- All documentation moved to `docs/`
- All database files in `database/`
- Build artifacts excluded

## ✅ Organization Complete

The project is now well-organized following industry best practices!
