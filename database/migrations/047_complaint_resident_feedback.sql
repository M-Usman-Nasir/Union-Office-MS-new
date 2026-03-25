-- Migration 047: Resident feedback on resolved complaints
-- Purpose: Allow residents to rate and comment after complaint resolution.

ALTER TABLE complaints
  ADD COLUMN IF NOT EXISTS feedback_rating INTEGER,
  ADD COLUMN IF NOT EXISTS feedback_comment TEXT,
  ADD COLUMN IF NOT EXISTS feedback_submitted_at TIMESTAMP;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'complaints_feedback_rating_range'
  ) THEN
    ALTER TABLE complaints
      ADD CONSTRAINT complaints_feedback_rating_range
      CHECK (feedback_rating IS NULL OR (feedback_rating BETWEEN 1 AND 5));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_complaints_feedback_submitted_at
  ON complaints(feedback_submitted_at)
  WHERE feedback_submitted_at IS NOT NULL;
