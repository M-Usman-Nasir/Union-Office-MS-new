-- Migration 000: Initial base schema (users, apartments, complaints, etc.)
-- Purpose: Run schema.sql as first migration so numbered migrations (001+) have tables to alter.
-- On Render/fresh DB only migrations/ are run; this ensures the base tables exist.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'union_admin', 'resident', 'staff')),
    society_apartment_id INTEGER,
    unit_id INTEGER,
    cnic VARCHAR(20),
    contact_number VARCHAR(20),
    emergency_contact VARCHAR(20),
    move_in_date DATE,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apartments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    total_blocks INTEGER DEFAULT 0,
    total_floors INTEGER DEFAULT 0,
    total_units INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blocks (
    id SERIAL PRIMARY KEY,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    total_floors INTEGER DEFAULT 0,
    total_units INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS floors (
    id SERIAL PRIMARY KEY,
    block_id INTEGER NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    total_units INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    block_id INTEGER REFERENCES blocks(id) ON DELETE SET NULL,
    floor_id INTEGER REFERENCES floors(id) ON DELETE SET NULL,
    unit_number VARCHAR(50) NOT NULL,
    owner_name VARCHAR(255),
    resident_name VARCHAR(255),
    contact_number VARCHAR(20),
    email VARCHAR(255),
    k_electric_account VARCHAR(100),
    gas_account VARCHAR(100),
    water_account VARCHAR(100),
    phone_tv_account VARCHAR(100),
    car_make_model VARCHAR(255),
    license_plate VARCHAR(50),
    number_of_cars INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    base_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'partially_paid', 'pending')),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_config (
    id SERIAL PRIMARY KEY,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    base_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS finance (
    id SERIAL PRIMARY KEY,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    added_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    expense_type VARCHAR(50),
    income_type VARCHAR(50),
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50),
    remarks TEXT,
    month INTEGER,
    year INTEGER,
    status VARCHAR(20) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    audience VARCHAR(100),
    language VARCHAR(20),
    visible_to_all BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    block_id INTEGER REFERENCES blocks(id) ON DELETE SET NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS defaulters (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    maintenance_id INTEGER REFERENCES maintenance(id) ON DELETE SET NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    months_overdue INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_public BOOLEAN DEFAULT false,
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    society_apartment_id INTEGER REFERENCES apartments(id) ON DELETE CASCADE,
    defaulter_list_visible BOOLEAN DEFAULT false,
    complaint_logs_visible BOOLEAN DEFAULT false,
    financial_reports_visible BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_society ON users(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_unit ON maintenance(unit_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_society ON maintenance(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_year_month ON maintenance(year, month);
CREATE INDEX IF NOT EXISTS idx_finance_society ON finance(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_finance_type ON finance(transaction_type);
CREATE INDEX IF NOT EXISTS idx_finance_date ON finance(transaction_date);
CREATE INDEX IF NOT EXISTS idx_defaulters_unit ON defaulters(unit_id);
CREATE INDEX IF NOT EXISTS idx_defaulters_society ON defaulters(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_complaints_society ON complaints(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apartments_updated_at ON apartments;
CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON apartments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blocks_updated_at ON blocks;
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_updated_at ON maintenance;
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_config_updated_at ON maintenance_config;
CREATE TRIGGER update_maintenance_config_updated_at BEFORE UPDATE ON maintenance_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_updated_at BEFORE UPDATE ON finance;
CREATE TRIGGER update_finance_updated_at BEFORE UPDATE ON finance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at BEFORE UPDATE ON announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_defaulters_updated_at ON defaulters;
CREATE TRIGGER update_defaulters_updated_at BEFORE UPDATE ON defaulters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
