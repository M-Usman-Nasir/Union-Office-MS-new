-- Migration 018: Add optional Work & Address fields to users table
-- Address column may already exist from 015; add city, postal_code, work fields.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address') THEN
        ALTER TABLE users ADD COLUMN address TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'city') THEN
        ALTER TABLE users ADD COLUMN city VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'postal_code') THEN
        ALTER TABLE users ADD COLUMN postal_code VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'work_employer') THEN
        ALTER TABLE users ADD COLUMN work_employer VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'work_title') THEN
        ALTER TABLE users ADD COLUMN work_title VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'work_phone') THEN
        ALTER TABLE users ADD COLUMN work_phone VARCHAR(50);
    END IF;
END $$;
