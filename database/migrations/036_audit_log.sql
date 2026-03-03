-- Migration 036: System audit logs for accountability and legal protection
-- Purpose: Track who did what, when, on which resource

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  role VARCHAR(30),
  action VARCHAR(80) NOT NULL,
  resource_type VARCHAR(80) NOT NULL,
  resource_id VARCHAR(100),
  society_apartment_id INTEGER REFERENCES apartments(id) ON DELETE SET NULL,
  details JSONB,
  ip VARCHAR(45),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_society ON audit_log(society_apartment_id);

COMMENT ON TABLE audit_log IS 'System-wide audit trail for admin and super admin actions';
