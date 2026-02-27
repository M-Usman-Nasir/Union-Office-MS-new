-- Migration 031: Maintenance payment requests (resident submits proof → admin approves/rejects)
-- Purpose: Store resident-submitted payment proofs for verification before marking maintenance as paid

CREATE TABLE IF NOT EXISTS maintenance_payment_requests (
  id SERIAL PRIMARY KEY,
  maintenance_id INTEGER NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
  submitted_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proof_path VARCHAR(500) NOT NULL,
  note TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMPTZ,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  rejection_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_maintenance_payment_requests_maintenance_id ON maintenance_payment_requests(maintenance_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_payment_requests_submitted_by ON maintenance_payment_requests(submitted_by);
CREATE INDEX IF NOT EXISTS idx_maintenance_payment_requests_status ON maintenance_payment_requests(status);

COMMENT ON TABLE maintenance_payment_requests IS 'Resident-submitted payment proofs for maintenance; admin approves or rejects';
