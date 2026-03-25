-- Migration 045: System essentials foundation (P1/P2/P3)

-- P2: Soft-delete foundation (initial critical tables)
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

ALTER TABLE finance ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE finance ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_finance_deleted_at ON finance(deleted_at);

-- P2/P3: Activity timeline storage for non-audit events (optional use)
CREATE TABLE IF NOT EXISTS activity_timeline (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  actor_role VARCHAR(50),
  event_type VARCHAR(80) NOT NULL,
  resource_type VARCHAR(80) NOT NULL,
  resource_id VARCHAR(100),
  society_apartment_id INTEGER REFERENCES apartments(id) ON DELETE SET NULL,
  details JSONB
);
CREATE INDEX IF NOT EXISTS idx_activity_timeline_created_at ON activity_timeline(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_timeline_resource ON activity_timeline(resource_type, resource_id);

-- P3: Role permission matrix
CREATE TABLE IF NOT EXISTS role_permissions (
  role VARCHAR(50) NOT NULL,
  permission_key VARCHAR(120) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role, permission_key)
);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);

-- P3: Global feature flags
CREATE TABLE IF NOT EXISTS global_feature_flags (
  feature_key VARCHAR(80) PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

COMMENT ON TABLE role_permissions IS 'Granular permissions by role (resource.action).';
COMMENT ON TABLE global_feature_flags IS 'Global feature toggles. Missing row means enabled.';
