-- Migration 034: Global settings for platform-wide configuration
-- Purpose: Store platform-wide settings (payment defaults, system rules) for super admin

CREATE TABLE IF NOT EXISTS global_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  value_json JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_global_settings_key ON global_settings(key);

-- Insert defaults (single row per key)
INSERT INTO global_settings (key, value) VALUES
  ('default_currency', 'PKR'),
  ('default_due_day', '1'),
  ('maintenance_reminder_days_default', '3'),
  ('max_upload_size_mb', '5')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE global_settings IS 'Platform-wide configuration editable by super admin only';
