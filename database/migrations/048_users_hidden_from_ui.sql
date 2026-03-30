-- Hidden-from-UI users: omitted from list/detail APIs for everyone except the same user (see userController, audit logs, messages, governance activity timeline).

ALTER TABLE users ADD COLUMN IF NOT EXISTS hidden_from_ui BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN users.hidden_from_ui IS 'When true, user is hidden from user lists and related UI surfaces unless the viewer is this user.';

-- One-time seed: private super_admin (Usman). Skipped if email already exists.
-- Initial password (change after first login): ChangeMe!HumsHidden2026
INSERT INTO users (name, email, password, role, hidden_from_ui, is_active, must_change_password, created_at, updated_at)
SELECT
  'Usman',
  'usmannasir98@gmail.com',
  '$2a$10$J6CI7zXUK/Ff7d.tWd86lufAugyhf7OEnSggSG3dScYbijdM.VItq',
  'super_admin',
  true,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER('usmannasir98@gmail.com'));
