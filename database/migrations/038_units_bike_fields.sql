-- Migration 038: Add bike fields to units table
-- Purpose: Store bike count and details alongside car fields for resident/unit vehicles

ALTER TABLE units
ADD COLUMN IF NOT EXISTS number_of_bikes INTEGER DEFAULT 0;

ALTER TABLE units
ADD COLUMN IF NOT EXISTS bike_make_model VARCHAR(255);

ALTER TABLE units
ADD COLUMN IF NOT EXISTS bike_license_plate VARCHAR(50);
