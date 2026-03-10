-- Migration 040: Add employee_id to finance for salary-to-employee expense tracking
-- Purpose: When expense_type is Salary, link the transaction to a specific employee

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'finance' AND column_name = 'employee_id'
    ) THEN
        ALTER TABLE finance
        ADD COLUMN employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_finance_employee_id ON finance(employee_id);
    END IF;
END $$;

COMMENT ON COLUMN finance.employee_id IS 'When expense_type is Salary, the employee this salary payment is for';
