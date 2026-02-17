-- Migration 019: Add remarks column to defaulters table
-- Purpose: Store admin remarks per defaulter (aligns with Defaulters table matching Residents)

ALTER TABLE defaulters ADD COLUMN IF NOT EXISTS remarks TEXT;
