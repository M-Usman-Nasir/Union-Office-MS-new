# Database Setup - Quick Reference

## Your Database Name
**Database:** `homeland union` (note the space - must be quoted in SQL)

## Quick Setup Commands

### Option 1: Command Line (Fastest)

```bash
# Navigate to your project directory
cd C:\Users\kk\Documents\GitHub\Union-Office-MS-new

# Run the schema file directly
psql -U postgres -d "homeland union" -f schema.sql
```

**If prompted for password:** Enter your PostgreSQL password

### Option 2: Interactive psql

```bash
# 1. Connect to PostgreSQL
psql -U postgres

# 2. Connect to your database
\c "homeland union"

# 3. Run the schema file
\i C:/Users/kk/Documents/GitHub/Union-Office-MS-new/schema.sql

# Or if you're in the project directory:
\i schema.sql
```

### Option 3: Copy-Paste Method

1. Open `schema.sql` in a text editor
2. Copy all content (Ctrl+A, Ctrl+C)
3. Open pgAdmin → Connect to server → Right-click "homeland union" → Query Tool
4. Paste the content (Ctrl+V)
5. Click Execute (F5)

## Verify Installation

After running the schema, verify with:

```sql
-- Connect to database
\c "homeland union"

-- List all tables
\dt

-- Count tables (should be 12)
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check specific table structure
\d users
\d societies
```

## Expected Output

You should see these **12 tables**:
1. users
2. societies
3. blocks
4. floors
5. units
6. maintenance
7. maintenance_config
8. finance
9. announcements
10. defaulters
11. complaints
12. settings

## Common Issues

### Issue: "database does not exist"
**Solution:**
```sql
CREATE DATABASE "homeland union";
```

### Issue: "permission denied"
**Solution:** Connect as superuser:
```bash
psql -U postgres
```

### Issue: "relation already exists"
**Solution:** Drop and recreate:
```sql
-- Drop all tables
DROP TABLE IF EXISTS 
  users, societies, blocks, floors, units, 
  maintenance, maintenance_config, finance, 
  announcements, defaulters, complaints, settings CASCADE;

-- Then run schema.sql again
```

### Issue: "syntax error" or "unexpected token"
**Solution:** 
- Make sure you're using PostgreSQL (not MySQL)
- Check that the schema.sql file is complete
- Ensure you're connected to the correct database

## Test Database Connection

Test if everything works:

```sql
-- Insert a test society
INSERT INTO societies (name, address, city) 
VALUES ('Test Society', '123 Test St', 'Test City');

-- Query it back
SELECT * FROM societies;

-- Clean up
DELETE FROM societies WHERE name = 'Test Society';
```

If this works, your database is set up correctly! ✅
