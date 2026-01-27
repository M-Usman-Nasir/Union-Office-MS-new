-- Migration 005: Create Payment History Table (FUTURE ENHANCEMENT)
-- Purpose: Track payment history with audit trail
-- Backend Dependency: Not yet implemented
-- Status: FUTURE ENHANCEMENT (optional for audit capabilities)

-- Payment History Table
-- Tracks all payment status and amount changes with audit trail
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    maintenance_id INTEGER NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    previous_amount_paid DECIMAL(10, 2),
    new_amount_paid DECIMAL(10, 2),
    amount_change DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_history_maintenance ON payment_history(maintenance_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_updated_by ON payment_history(updated_by);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_payment_history_maintenance;
-- DROP INDEX IF EXISTS idx_payment_history_updated_by;
-- DROP INDEX IF EXISTS idx_payment_history_created_at;
-- DROP TABLE IF EXISTS payment_history;
