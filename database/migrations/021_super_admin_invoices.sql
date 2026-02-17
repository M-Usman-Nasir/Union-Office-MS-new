-- Migration 021: Super Admin invoices for union admins (subscription billing)
CREATE TABLE IF NOT EXISTS super_admin_invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
    due_date DATE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_super_admin_invoices_user ON super_admin_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_invoices_society ON super_admin_invoices(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_invoices_status ON super_admin_invoices(status);
CREATE INDEX IF NOT EXISTS idx_super_admin_invoices_due_date ON super_admin_invoices(due_date);

DROP TRIGGER IF EXISTS update_super_admin_invoices_updated_at ON super_admin_invoices;
CREATE TRIGGER update_super_admin_invoices_updated_at
    BEFORE UPDATE ON super_admin_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
