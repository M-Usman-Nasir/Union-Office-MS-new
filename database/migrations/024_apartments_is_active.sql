-- Add is_active to apartments for Active/Inactive filter
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
