-- Migration 032: Link finance to maintenance and backfill previously paid maintenance as income
-- Purpose: Allow seeing previously paid maintenance on Finance page; prevent duplicate finance rows per maintenance

-- Add maintenance_id to finance (nullable; set when income comes from a maintenance payment)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'maintenance_id'
    ) THEN
        ALTER TABLE finance
        ADD COLUMN maintenance_id INTEGER REFERENCES maintenance(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_finance_maintenance_id ON finance(maintenance_id);
    END IF;
END $$;

-- Backfill: insert one income row per maintenance record that has amount_paid > 0
-- and does not already have a finance row linked to it (so we don't duplicate after our feature added rows)
INSERT INTO finance (
    society_apartment_id,
    added_by,
    transaction_date,
    transaction_type,
    expense_type,
    income_type,
    description,
    amount,
    payment_mode,
    remarks,
    month,
    year,
    status,
    maintenance_id
)
SELECT
    m.society_apartment_id,
    NULL,
    COALESCE(m.payment_date, (m.updated_at AT TIME ZONE 'UTC')::date, CURRENT_DATE),
    'income',
    NULL,
    'maintenance',
    'Maintenance payment – Unit ' || COALESCE(u.unit_number, '') || ', ' ||
    (ARRAY['January','February','March','April','May','June','July','August','September','October','November','December'])[m.month] ||
    ' ' || m.year || ' (historical)',
    m.amount_paid,
    NULL,
    NULL,
    m.month,
    m.year,
    'paid',
    m.id
FROM maintenance m
LEFT JOIN units u ON u.id = m.unit_id
WHERE m.amount_paid > 0
  AND NOT EXISTS (SELECT 1 FROM finance f WHERE f.maintenance_id = m.id);
