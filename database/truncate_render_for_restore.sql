-- Run this on Render DB *before* restore_render.sql so the data-only dump
-- does not hit duplicate keys or FK violations. Render does not allow
-- session_replication_role, so we must clear tables first.
TRUNCATE TABLE users, apartments, global_settings, subscription_plans CASCADE;
