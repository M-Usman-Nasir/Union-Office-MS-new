-- Migration 011: Add notification preference columns to settings
-- Purpose: Email on dues generated, reminder days before due date

ALTER TABLE settings
ADD COLUMN IF NOT EXISTS email_dues_on_generate BOOLEAN DEFAULT false;

ALTER TABLE settings
ADD COLUMN IF NOT EXISTS email_reminder_days_before INTEGER DEFAULT 0;

COMMENT ON COLUMN settings.email_dues_on_generate IS 'When true, send email to residents when monthly dues are generated';
COMMENT ON COLUMN settings.email_reminder_days_before IS 'Days before due date to send reminder email (0 = disabled)';
