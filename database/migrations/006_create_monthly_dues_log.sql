-- Migration 006: Create Monthly Dues Generation Log Table (OPTIONAL)
-- Purpose: Track monthly dues generation runs with success/failure counts
-- Backend Dependency: monthlyDuesGenerator.js (referenced but not critical)
-- Status: OPTIONAL (job logs to console, but table useful for monitoring)

-- Monthly Dues Generation Log Table
CREATE TABLE IF NOT EXISTS monthly_dues_generation_log (
    id SERIAL PRIMARY KEY,
    generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    total_units INTEGER NOT NULL,
    successful_generations INTEGER DEFAULT 0,
    failed_generations INTEGER DEFAULT 0,
    errors JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint to prevent duplicate logs for same month/year
CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_dues_log_unique 
ON monthly_dues_generation_log(year, month);

-- Index for querying by date
CREATE INDEX IF NOT EXISTS idx_monthly_dues_log_date 
ON monthly_dues_generation_log(year DESC, month DESC);

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_monthly_dues_log_unique;
-- DROP INDEX IF EXISTS idx_monthly_dues_log_date;
-- DROP TABLE IF EXISTS monthly_dues_generation_log;
