-- Migration 029: Allow admin-recorded complaints with walk-in resident name
-- When union admin records a complaint on behalf of a resident who is not in the system,
-- store the resident name here so it displays in the list/details.

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS submitted_by_name_override VARCHAR(255);

COMMENT ON COLUMN complaints.submitted_by_name_override IS 'Resident name when complaint is recorded by admin on behalf of a walk-in (submitted_by is null)';
