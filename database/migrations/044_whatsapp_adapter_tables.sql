-- Migration 044: WhatsApp adapter tables (idempotency + session) and contact number lookup index

CREATE TABLE IF NOT EXISTS whatsapp_event_logs (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(30) NOT NULL DEFAULT 'meta_cloud',
  event_id VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(50),
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_whatsapp_event_logs_provider_event
  ON whatsapp_event_logs(provider, event_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_event_logs_sender_phone
  ON whatsapp_event_logs(sender_phone);

CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(30) NOT NULL DEFAULT 'meta_cloud',
  sender_phone VARCHAR(50) NOT NULL,
  resident_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  flow_key VARCHAR(100) NOT NULL,
  flow_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_whatsapp_sessions_provider_sender_flow
  ON whatsapp_sessions(provider, sender_phone, flow_key);

CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_expires_at
  ON whatsapp_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_users_contact_number
  ON users(contact_number);
