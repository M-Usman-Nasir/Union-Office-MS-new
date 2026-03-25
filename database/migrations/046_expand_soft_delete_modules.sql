-- Migration 046: Expand soft-delete coverage to additional modules

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_complaints_deleted_at ON complaints(deleted_at);

ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_maintenance_deleted_at ON maintenance(deleted_at);

ALTER TABLE announcements ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_announcements_deleted_at ON announcements(deleted_at);

ALTER TABLE units ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE units ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_units_deleted_at ON units(deleted_at);
