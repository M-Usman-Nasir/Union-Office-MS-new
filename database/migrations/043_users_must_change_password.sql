-- Residents created per-unit use initial password until they change it.
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN users.must_change_password IS 'When true (resident), API access is limited until first password change; initial login password is shared.';
