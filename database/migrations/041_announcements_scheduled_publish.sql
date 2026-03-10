-- Migration 041: Scheduled publishing for announcements
-- Purpose: Allow announcements to be posted automatically at a future date/time

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'announcements' AND column_name = 'scheduled_publish_at'
    ) THEN
        ALTER TABLE announcements
        ADD COLUMN scheduled_publish_at TIMESTAMP NULL;
        COMMENT ON COLUMN announcements.scheduled_publish_at IS 'When set, announcement is visible to residents/staff only after this time (UTC). NULL = publish immediately.';
    END IF;
END $$;
