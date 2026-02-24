-- Migration 027: Union members table (scoped by society_apartment_id and created_by union_admin)
-- Stores member name, designation, phone, email, joining_date, unit_id (optional)

CREATE TABLE IF NOT EXISTS union_members (
    id SERIAL PRIMARY KEY,
    member_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    joining_date DATE,
    unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_union_members_society_apartment_id ON union_members(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_union_members_created_by ON union_members(created_by);
CREATE INDEX IF NOT EXISTS idx_union_members_unit_id ON union_members(unit_id);

COMMENT ON TABLE union_members IS 'Union committee members; scoped by society_apartment_id and created_by (union_admin)';
