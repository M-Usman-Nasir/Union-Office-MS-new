# Fix PostgreSQL Connection Issue

## Problem
PostgreSQL service is running but Node.js can't connect (ECONNREFUSED).

## Quick Fixes to Try

### Fix 1: Check PostgreSQL Port
```bash
npm run find:port
```

This will show you what port PostgreSQL is actually using.

### Fix 2: Check PostgreSQL Configuration

1. **Find postgresql.conf:**
   - Usually at: `C:\Program Files\PostgreSQL\18\data\postgresql.conf`
   - Or: `C:\Program Files (x86)\PostgreSQL\18\data\postgresql.conf`

2. **Edit postgresql.conf:**
   - Find: `listen_addresses = 'localhost'`
   - Change to: `listen_addresses = '*'` (or keep 'localhost' if only local access needed)
   - Find: `port = 5432`
   - Verify it's set to 5432 (or note the actual port)

3. **Restart PostgreSQL service:**
   - Services → postgresql-x64-18 → Restart

### Fix 3: Check pg_hba.conf

1. **Find pg_hba.conf:**
   - Same directory as postgresql.conf

2. **Add/verify these lines:**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   host    all             all             ::1/128                 scram-sha-256
   ```

3. **Restart PostgreSQL service**

### Fix 4: Check Windows Firewall

1. Open Windows Defender Firewall
2. Check if PostgreSQL is blocked
3. Add exception if needed

### Fix 5: Try Different Port

If PostgreSQL is using a different port (like 5433), update `.env`:
```env
DB_PORT=5433
```

### Fix 6: Restart PostgreSQL Service

1. Services → postgresql-x64-18
2. Right-click → Restart
3. Wait for status to be "Running"
4. Try connection again

## Verify Connection

After making changes:

```bash
npm run diagnose
```

## Check PostgreSQL Logs

If still not working, check logs:
- Location: `C:\Program Files\PostgreSQL\18\data\log\`
- Look for connection errors or warnings

## Manual Test

Try connecting with psql (if available):
```bash
psql -U postgres -d homeland_union -h 127.0.0.1 -p 5432
```

If this works, the issue is in Node.js code.
If this doesn't work, the issue is PostgreSQL configuration.
