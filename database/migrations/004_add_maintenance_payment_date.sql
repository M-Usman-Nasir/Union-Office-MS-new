-- Migration 004: Add Payment Date Column to Maintenance Table
-- Purpose: Track when payment was actually made
-- Backend Dependency: maintenanceController.recordPayment(), staffController.updatePaymentStatus()
-- Status: REQUIRED (backend code references payment_date column in maintenanceController and staffController)

-- Add payment_date column to maintenance table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'maintenance' AND column_name = 'payment_date'
    ) THEN
        ALTER TABLE maintenance ADD COLUMN payment_date DATE;
        
        -- Update existing paid records with payment_date from updated_at
        UPDATE maintenance 
        SET payment_date = updated_at::DATE 
        WHERE status = 'paid' AND payment_date IS NULL;
    END IF;
END $$;

-- Add index for payment_date queries
CREATE INDEX IF NOT EXISTS idx_maintenance_payment_date ON maintenance(payment_date);

-- Rollback script (uncomment to rollback):
-- DROP INDEX IF EXISTS idx_maintenance_payment_date;
-- ALTER TABLE maintenance DROP COLUMN IF EXISTS payment_date;
