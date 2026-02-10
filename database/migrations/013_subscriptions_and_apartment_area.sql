-- Migration 013: Subscriptions, apartment area, and one Union Admin per apartment
-- 1. Add area to apartments (for City → Area → Apartment selection)
-- 2. Unique constraint: one union_admin per society_apartment_id
-- 3. Subscription plans and subscriptions tables

-- 1. Add area column to apartments (optional, for cascading filters)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'apartments' AND column_name = 'area'
    ) THEN
        ALTER TABLE apartments ADD COLUMN area VARCHAR(150);
    END IF;
END $$;

-- 2. One Union Admin per apartment: unique partial index
-- (Only one user with role 'union_admin' per society_apartment_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_union_admin_per_society
ON users(society_apartment_id)
WHERE role = 'union_admin' AND society_apartment_id IS NOT NULL;

-- 3. Subscription plans (e.g. monthly plan)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    interval_months INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subscriptions: links Union Admin (user) to apartment and plan
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    society_apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'expired', 'cancelled', 'trial', 'pending')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    next_billing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id),
    UNIQUE(society_apartment_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_society ON subscriptions(society_apartment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- Trigger for subscription_plans updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default monthly plan if none exists
INSERT INTO subscription_plans (name, amount, interval_months, is_active)
SELECT 'Monthly', 0, 1, true
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans LIMIT 1);
