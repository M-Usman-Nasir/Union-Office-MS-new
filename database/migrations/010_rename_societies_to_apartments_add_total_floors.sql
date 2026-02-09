-- Rename societies table to apartments and add total_floors column
-- Run this migration on existing databases. New installs should use updated schema.sql.

-- 1. Rename table
ALTER TABLE IF EXISTS societies RENAME TO apartments;

-- 2. Add total_floors column (stores floors per apartment for display)
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS total_floors INTEGER DEFAULT 0;

-- 3. Rename trigger for clarity (trigger stays on the renamed table)
ALTER TRIGGER update_societies_updated_at ON apartments RENAME TO update_apartments_updated_at;
