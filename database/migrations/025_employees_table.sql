-- Migration 025: Create employees table (1:1 with staff users, scoped by society + created by union_admin)
-- Employees store: user_id (staff), society_apartment_id, created_by (union_admin), department, designation, salary_rupees

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    department VARCHAR(255),
    designation VARCHAR(255),
    salary_rupees DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_society_apartment_id ON employees(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_employees_created_by ON employees(created_by);

COMMENT ON TABLE employees IS 'Employment details for staff users; one row per staff, scoped by society_apartment_id and created_by union_admin';
