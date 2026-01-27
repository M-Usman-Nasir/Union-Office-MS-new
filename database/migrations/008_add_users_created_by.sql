-- Migration 008: Add created_by Column to Users Table
-- Purpose: Track which user (admin/union_admin) created a resident/user record
-- Backend Dependency: residentController.create() uses req.user.id for created_by
-- Status: REQUIRED (current INSERT into users includes created_by)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'created_by'
    ) THEN
        ALTER TABLE users
        ADD COLUMN created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Optional index for audit queries
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by);

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_users_created_by;
-- ALTER TABLE users DROP COLUMN IF EXISTS created_by;

