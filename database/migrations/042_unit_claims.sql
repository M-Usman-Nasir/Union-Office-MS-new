-- Migration 042: Unit claims (ownership/tenancy requests)
-- Residents request to link to a unit; union_admin approves/rejects.

CREATE TABLE IF NOT EXISTS unit_claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

COMMENT ON TABLE unit_claims IS 'Resident requests to link to a unit; union_admin/super_admin approve or reject.';
