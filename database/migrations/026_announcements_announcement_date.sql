-- Migration 026: Add announcement_date to announcements (date of the announcement, default current date)
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS announcement_date DATE DEFAULT CURRENT_DATE;

COMMENT ON COLUMN announcements.announcement_date IS 'Date of the announcement; defaults to current date when creating';
