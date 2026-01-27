-- Migration 009: Add profile_image Column to Users Table
-- Purpose: Store user profile pictures (as file paths stored in backend/uploads/profiles/)
-- Status: REQUIRED (for profile image upload functionality)

-- Add profile_image column to users table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'profile_image'
    ) THEN
        ALTER TABLE users
        ADD COLUMN profile_image TEXT;
    END IF;
END $$;

-- Add comment to column
COMMENT ON COLUMN users.profile_image IS 'Profile image file path (e.g., /uploads/profiles/user_123_1234567890.jpg). Legacy base64 format also supported for backward compatibility.';

-- Rollback script (uncomment to rollback):
-- ALTER TABLE users DROP COLUMN IF EXISTS profile_image;
