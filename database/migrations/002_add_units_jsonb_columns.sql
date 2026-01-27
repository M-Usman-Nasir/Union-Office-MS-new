-- Migration 002: Add JSONB Columns to Units Table
-- Purpose: Store multiple telephone bills and other bills as JSONB arrays
-- Backend Dependency: residentController.update()
-- Status: REQUIRED (for residents management with dynamic bill inputs)

-- Add telephone_bills column (JSONB array)
-- Structure: [{"provider": "string", "account_number": "string", "amount": number}, ...]
ALTER TABLE units 
ADD COLUMN IF NOT EXISTS telephone_bills JSONB DEFAULT '[]'::jsonb;

-- Add other_bills column (JSONB array)
-- Structure: [{"type": "string", "provider": "string", "amount": number}, ...]
ALTER TABLE units 
ADD COLUMN IF NOT EXISTS other_bills JSONB DEFAULT '[]'::jsonb;

-- Add GIN indexes for JSONB queries (optional but recommended for performance)
CREATE INDEX IF NOT EXISTS idx_units_telephone_bills ON units USING GIN (telephone_bills);
CREATE INDEX IF NOT EXISTS idx_units_other_bills ON units USING GIN (other_bills);

-- Example data structure:
-- telephone_bills: [{"provider": "PTCL", "account_number": "123456789", "amount": 1500}, ...]
-- other_bills: [{"type": "Internet", "provider": "PTCL", "amount": 2000}, ...]

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_units_telephone_bills;
-- DROP INDEX IF EXISTS idx_units_other_bills;
-- ALTER TABLE units DROP COLUMN IF EXISTS telephone_bills;
-- ALTER TABLE units DROP COLUMN IF EXISTS other_bills;
