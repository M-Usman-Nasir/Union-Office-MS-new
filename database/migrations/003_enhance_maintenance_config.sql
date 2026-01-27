-- Migration 003: Enhance Maintenance Config Table
-- Purpose: Support per-block and per-unit configuration in addition to per-society
-- Backend Dependency: settingsController.getMaintenanceConfig(), monthlyDuesGenerator.js
-- Status: REQUIRED (for per-block/per-unit maintenance configuration)

-- Add block_id column (nullable - for block-level config)
ALTER TABLE maintenance_config 
ADD COLUMN IF NOT EXISTS block_id INTEGER REFERENCES blocks(id) ON DELETE CASCADE;

-- Add unit_id column (nullable - for unit-level config)
ALTER TABLE maintenance_config 
ADD COLUMN IF NOT EXISTS unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE;

-- Add constraint to ensure at least one of society/block/unit is specified
-- This ensures data integrity
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_maintenance_config_scope'
    ) THEN
        ALTER TABLE maintenance_config
        ADD CONSTRAINT check_maintenance_config_scope 
        CHECK (
            (society_apartment_id IS NOT NULL) AND
            (
                (unit_id IS NOT NULL AND block_id IS NULL) OR
                (block_id IS NOT NULL AND unit_id IS NULL) OR
                (block_id IS NULL AND unit_id IS NULL)
            )
        );
    END IF;
END $$;

-- Add unique constraints to prevent duplicate configs
-- Priority: unit > block > society

-- Unique constraint for unit-level configs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_maintenance_config_unique_unit'
    ) THEN
        CREATE UNIQUE INDEX idx_maintenance_config_unique_unit 
        ON maintenance_config(unit_id) WHERE unit_id IS NOT NULL;
    END IF;
END $$;

-- Unique constraint for block-level configs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_maintenance_config_unique_block'
    ) THEN
        CREATE UNIQUE INDEX idx_maintenance_config_unique_block 
        ON maintenance_config(block_id, society_apartment_id) 
        WHERE block_id IS NOT NULL AND unit_id IS NULL;
    END IF;
END $$;

-- Unique constraint for society-level configs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_maintenance_config_unique_society'
    ) THEN
        CREATE UNIQUE INDEX idx_maintenance_config_unique_society 
        ON maintenance_config(society_apartment_id) 
        WHERE block_id IS NULL AND unit_id IS NULL;
    END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_maintenance_config_block ON maintenance_config(block_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_config_unit ON maintenance_config(unit_id);

-- Configuration Priority Logic:
-- 1. Unit-level config (highest priority) - if unit_id matches
-- 2. Block-level config (medium priority) - if block_id matches and no unit config
-- 3. Society-level config (lowest priority) - if no unit or block config

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_maintenance_config_unique_unit;
-- DROP INDEX IF EXISTS idx_maintenance_config_unique_block;
-- DROP INDEX IF EXISTS idx_maintenance_config_unique_society;
-- DROP INDEX IF EXISTS idx_maintenance_config_block;
-- DROP INDEX IF EXISTS idx_maintenance_config_unit;
-- ALTER TABLE maintenance_config DROP CONSTRAINT IF EXISTS check_maintenance_config_scope;
-- ALTER TABLE maintenance_config DROP COLUMN IF EXISTS block_id;
-- ALTER TABLE maintenance_config DROP COLUMN IF EXISTS unit_id;
