-- Migration 017: Family members for residents
-- Purpose: Store family members linked to a resident (user with role resident/union_admin)
-- Usage: Resident details view and management

CREATE TABLE IF NOT EXISTS family_members (
    id SERIAL PRIMARY KEY,
    resident_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_family_members_resident ON family_members(resident_id);

COMMENT ON TABLE family_members IS 'Family members associated with a resident';
