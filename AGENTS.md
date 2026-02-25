# AGENTS.md

## Cursor Cloud specific instructions

### Architecture overview

Homeland Union is an apartment/residential complex management system with three components:
- **Frontend (PWA)**: React 18 + Vite + MUI + Tailwind at repo root (port 5173)
- **Backend API**: Node.js/Express at `backend/` (port 3000)
- **Mobile App** (optional): Expo/React Native at `mobile-app-resident/`

All share a PostgreSQL database (`homeland_union`).

### Starting services

1. **PostgreSQL**: `sudo pg_ctlcluster 16 main start` (must be running first)
2. **Backend**: `cd backend && npm run dev` (nodemon, port 3000)
3. **Frontend**: `npm run dev` (Vite, port 5173; add `--host 0.0.0.0` for external access)

### Database setup (first time only)

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE homeland_union;"
sudo -u postgres psql -d homeland_union -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
sudo -u postgres psql -d homeland_union -f database/schema.sql
cd backend && npm run migrate
cd backend && npm run seed
```

The `backend/.env` must exist with DB credentials (`DB_USER=postgres`, `DB_PASSWORD=postgres`). Copy from `backend/.env.example` and adjust.

### Test credentials (from seed)

- Super Admin: `hasanshkh17@gmail.com` / `admin123`
- Union Admin: `unionadmin@homelandunion.com` / `admin123`
- Resident: `resident@homelandunion.com` / `resident123`

### Lint / Build / Dev commands

See `package.json` scripts. Key commands:
- `npm run lint` — ESLint (has ~180 pre-existing errors, mostly `react/prop-types` and backend `no-undef` for `process`)
- `npm run build` — Vite production build
- `npm run dev` — Vite dev server (frontend)
- `cd backend && npm run dev` — backend dev server

### Gotchas

- The backend has no `package-lock.json`; `npm install` generates one fresh each time. The frontend root has a `package-lock.json`.
- The ESLint config at root covers `backend/` and `mobile-app-resident/` too, producing many `no-undef` errors for Node.js globals (`process`). These are pre-existing and not regressions.
- The "Apartments" feature in the Super Admin sidebar is labeled "Leads" and routes to `/super-admin/societies`.
- SMTP/email and VAPID push notification env vars are optional; the app works without them.
