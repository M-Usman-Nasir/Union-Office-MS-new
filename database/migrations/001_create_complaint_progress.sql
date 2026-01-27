-- Migration 001: Create Complaint Progress Table
-- Purpose: Track complaint progress history with status changes and notes
-- Backend Dependency: complaintController.addProgress(), complaintController.getProgress()
-- Status: RECOMMENDED (backend handles missing table gracefully)

-- Complaint Progress Table
CREATE TABLE IF NOT EXISTS complaint_progress (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_complaint_progress_complaint_id ON complaint_progress(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaint_progress_updated_by ON complaint_progress(updated_by);
CREATE INDEX IF NOT EXISTS idx_complaint_progress_created_at ON complaint_progress(created_at DESC);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_complaint_progress_updated_at BEFORE UPDATE ON complaint_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback script (uncomment to rollback):
-- DROP TRIGGER IF EXISTS update_complaint_progress_updated_at ON complaint_progress;
-- DROP INDEX IF EXISTS idx_complaint_progress_complaint_id;
-- DROP INDEX IF EXISTS idx_complaint_progress_updated_by;
-- DROP INDEX IF EXISTS idx_complaint_progress_created_at;
-- DROP TABLE IF EXISTS complaint_progress;
