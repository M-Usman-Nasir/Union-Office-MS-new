-- Migration 007: Add is_occupied Column to Units Table
-- Purpose: Track whether a unit is currently occupied and support filtering
-- Backend Dependency: propertyController.getUnits(), propertyController.updateUnit()
-- Status: REQUIRED (backend code already uses this column)

-- Add is_occupied column to units table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'units'
          AND column_name = 'is_occupied'
    ) THEN
        ALTER TABLE units
        ADD COLUMN is_occupied BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Optional index to speed up filtering by occupancy
CREATE INDEX IF NOT EXISTS idx_units_is_occupied ON units(is_occupied);

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_units_is_occupied;
-- ALTER TABLE units DROP COLUMN IF EXISTS is_occupied;

