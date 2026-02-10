# Union Resident (Mobile App)

Expo (React Native) app for **residents only**. Uses the same backend and database as the main Union Office web app.

## Features

- **Login** – Email/password; only users with role `resident` can use this app.
- **Dashboard** – Recent complaints, maintenance for your unit, announcements, dues status.
- **Complaints** – List, detail, and submit new complaints.
- **Maintenance** – View maintenance/dues for your unit.
- **Financial summary** – Public finance summary for your society (when enabled).
- **Union info** – Society details, blocks, units.
- **Profile** – View profile, link to Union Info, sign out.

## Prerequisites

- Node.js 18+
- Backend running (see repo root and `backend/`). Same API and DB as the web app.
- For device testing: backend reachable from your network (e.g. same WiFi).

## Setup

1. **Install dependencies**

   ```bash
   cd mobile-app-resident
   npm install
   ```

2. **Configure API URL**

   Copy `.env.example` to `.env` and set your backend API base URL:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   - **Local / Emulator**
     - Android emulator: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api`
     - iOS simulator: `EXPO_PUBLIC_API_URL=http://localhost:3000/api`
   - **Physical device (same WiFi)**  
     Use your machine’s LAN IP, e.g. `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api`

3. **Backend CORS (if needed)**

   For web-based Expo (or custom origins), add your Expo dev URL to backend `CORS_ORIGIN` in `backend/.env`. For native builds, CORS is not required.

## Run

```bash
npm start
```

Then:

- Press **a** for Android emulator  
- Press **i** for iOS simulator  
- Scan QR code with **Expo Go** on a physical device (ensure API URL in `.env` is reachable from the device)

## Test resident account

Use a resident user from your seeded data, e.g.:

- Email: `resident@homelandunion.com`  
- Password: `resident123`  

(Or any user with role `resident` in the same database.)

## Project structure

- `App.js` – Root: `AuthProvider`, `NavigationContainer`, auth vs main navigator.
- `src/context/AuthContext.js` – Auth state, login/logout, resident-only check, secure storage.
- `src/api/client.js` – Axios instance, Bearer token, refresh token (body) on 401.
- `src/api/*.js` – API helpers (auth, complaints, maintenance, finance, announcements, settings, property, apartment, defaulters).
- `src/constants.js` – Roles, storage keys, API paths.
- `src/navigation/` – Auth stack (Login), main tabs (Dashboard, Complaints, Maintenance, Finance, Profile/More).
- `src/screens/*.js` – All screens.

## Backend change for mobile

The backend login response now includes **refreshToken** in the JSON so the mobile app can store it and call `POST /api/auth/refresh` with `{ refreshToken }` in the body (cookies are not used for refresh in the app). The web app can ignore this field and continue using the cookie.

## Icons

Replace `assets/icon.png`, `assets/splash-icon.png`, and `assets/adaptive-icon.png` with your own app icons when publishing.
