# How to Start PostgreSQL on Windows

## Method 1: Using Services (Easiest)

1. **Open Services:**
   - Press `Windows + R`
   - Type `services.msc` and press Enter
   - Or search "Services" in Start Menu

2. **Find PostgreSQL Service:**
   - Look for service named:
     - `postgresql-x64-XX` (where XX is version number)
     - Or `PostgreSQL`
     - Or `postgresql-x64-16`, `postgresql-x64-15`, etc.

3. **Start the Service:**
   - Right-click on the PostgreSQL service
   - Click "Start"
   - Wait for status to change to "Running"

4. **Set to Auto-Start (Optional):**
   - Right-click → Properties
   - Set "Startup type" to "Automatic"
   - Click OK

## Method 2: Using Command Prompt (Run as Administrator)

```bash
# Find the service name first
sc query | findstr postgresql

# Then start it (replace SERVICE_NAME with actual name)
net start postgresql-x64-16
# Or
net start postgresql-x64-15
# Or
net start postgresql-x64-14
```

## Method 3: Using PowerShell (Run as Administrator)

```powershell
# List PostgreSQL services
Get-Service | Where-Object {$_.Name -like "*postgresql*"}

# Start the service (replace with actual service name)
Start-Service postgresql-x64-16
```

## Method 4: Using pg_ctl (If installed)

```bash
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\16\bin"

# Start PostgreSQL
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
```

## Verify PostgreSQL is Running

After starting, verify with:

```bash
# Test connection
psql -U postgres -d homeland_union

# Or check if port 5432 is listening
netstat -an | findstr 5432
```

## Common Service Names

- `postgresql-x64-16`
- `postgresql-x64-15`
- `postgresql-x64-14`
- `postgresql-x64-13`
- `PostgreSQL`

## Troubleshooting

### Service won't start
- Check PostgreSQL logs in: `C:\Program Files\PostgreSQL\XX\data\log\`
- Verify data directory exists
- Check if another PostgreSQL instance is running

### Port 5432 already in use
- Another PostgreSQL instance might be running
- Check with: `netstat -ano | findstr 5432`
- Stop the conflicting service

### Permission denied
- Run Command Prompt/PowerShell as Administrator
- Check service account permissions
