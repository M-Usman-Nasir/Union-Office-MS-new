-- Migration 035: Enable/disable features per union (subscription tiers, controlled rollout)
-- Purpose: Allow super admin to turn features on/off per society

CREATE TABLE IF NOT EXISTS union_features (
  society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  feature_key VARCHAR(80) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (society_apartment_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_union_features_society ON union_features(society_apartment_id);

COMMENT ON TABLE union_features IS 'Per-union feature flags; missing row means enabled (default)';
