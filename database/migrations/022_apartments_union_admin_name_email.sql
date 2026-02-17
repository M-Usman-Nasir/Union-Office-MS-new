-- Optional lead/union admin contact fields on apartments (for pre-fill when creating user from lead)
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS union_admin_name VARCHAR(255);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS union_admin_email VARCHAR(255);
