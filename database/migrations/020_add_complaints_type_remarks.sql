-- Migration 020: Add type and remarks columns to complaints table
-- Purpose: Complaints Management table columns Type and Remarks

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS remarks TEXT;
