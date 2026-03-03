-- Lead/CRM-style columns for apartments (super-admin leads view)
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS current_status VARCHAR(50);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS next_followup_date DATE;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS last_interaction_date DATE;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS priority VARCHAR(20);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS notes TEXT;
