-- Migration 033: Formal approve workflow for unions
-- Purpose: Add approval_status to apartments so new unions are verified before going live

ALTER TABLE apartments ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) NOT NULL DEFAULT 'pending'
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS approval_notes TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Backfill existing apartments as approved so current behavior is unchanged
UPDATE apartments SET approval_status = 'approved', approved_at = COALESCE(updated_at, created_at) WHERE approval_status = 'pending';

COMMENT ON COLUMN apartments.approval_status IS 'pending = awaiting super admin approval; approved = live; rejected = not accepted';
