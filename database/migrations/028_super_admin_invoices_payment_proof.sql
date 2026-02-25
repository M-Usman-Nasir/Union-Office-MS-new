-- Migration 028: Add payment proof (screenshot/document) to super_admin_invoices
ALTER TABLE super_admin_invoices
  ADD COLUMN IF NOT EXISTS payment_proof_path TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_uploaded_at TIMESTAMP;

COMMENT ON COLUMN super_admin_invoices.payment_proof_path IS 'Path to uploaded payment proof (screenshot/document) for confirming invoice amount received';
COMMENT ON COLUMN super_admin_invoices.payment_proof_uploaded_at IS 'When the payment proof was uploaded';
