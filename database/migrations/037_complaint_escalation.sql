-- Migration 037: Complaint escalation to super admin (disputes & escalations)
-- Purpose: Allow complaints to be escalated to platform for structured conflict resolution

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMP;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS escalated_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS escalation_reason TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolved_by_super_at TIMESTAMP;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolved_by_super_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_complaints_escalated_at ON complaints(escalated_at) WHERE escalated_at IS NOT NULL;

COMMENT ON COLUMN complaints.escalated_at IS 'When complaint was escalated to super admin for dispute resolution';
