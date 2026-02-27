-- Migration 030: Add receipt_path to maintenance table for payment receipt uploads
-- Purpose: Store path to uploaded receipt (image/PDF) for a maintenance record

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'maintenance' AND column_name = 'receipt_path'
    ) THEN
        ALTER TABLE maintenance ADD COLUMN receipt_path VARCHAR(500) NULL;
    END IF;
END $$;
