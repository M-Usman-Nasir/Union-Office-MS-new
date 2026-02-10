-- Migration 014: Ensure finance table has all columns for saving transaction details
-- Safe to run multiple times: adds only missing columns (payment_mode, remarks, month, year, status).

DO $$
BEGIN
    -- payment_mode (e.g. Cash, Online, Bank Transfer, Check)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'payment_mode'
    ) THEN
        ALTER TABLE finance ADD COLUMN payment_mode VARCHAR(50);
    END IF;

    -- remarks / extra notes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'remarks'
    ) THEN
        ALTER TABLE finance ADD COLUMN remarks TEXT;
    END IF;

    -- month (1-12) for reporting
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'month'
    ) THEN
        ALTER TABLE finance ADD COLUMN month INTEGER;
    END IF;

    -- year for reporting
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'year'
    ) THEN
        ALTER TABLE finance ADD COLUMN year INTEGER;
    END IF;

    -- status (e.g. paid, pending, cancelled)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'status'
    ) THEN
        ALTER TABLE finance ADD COLUMN status VARCHAR(20) DEFAULT 'paid';
    END IF;
END $$;
