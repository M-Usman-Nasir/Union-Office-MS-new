import { query } from '../config/database.js';

// List all invoices (Super Admin only). Query: status, user_id, society_id, limit, offset
export const listInvoices = async (req, res) => {
  try {
    const { status, user_id, society_id, limit = 50, offset = 0 } = req.query;
    const filters = [];
    const params = [];
    let n = 1;
    if (status) {
      params.push(status);
      filters.push(`i.status = $${n++}`);
    }
    if (user_id) {
      params.push(user_id);
      filters.push(`i.user_id = $${n++}`);
    }
    if (society_id) {
      params.push(society_id);
      filters.push(`i.society_apartment_id = $${n++}`);
    }
    const whereClause = filters.length ? ` AND ${filters.join(' AND ')}` : '';

    const listSql = `
      SELECT i.*, u.name AS user_name, u.email AS user_email,
             a.name AS apartment_name, a.city, a.area
      FROM super_admin_invoices i
      JOIN users u ON i.user_id = u.id
      JOIN apartments a ON i.society_apartment_id = a.id
      WHERE 1=1 ${whereClause}
      ORDER BY i.created_at DESC LIMIT $${n} OFFSET $${n + 1}
    `;
    params.push(parseInt(limit, 10) || 50, parseInt(offset, 10) || 0);
    const result = await query(listSql, params);

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM super_admin_invoices i WHERE 1=1 ${whereClause}`,
      params.slice(0, -2)
    );
    const total = parseInt(countResult.rows[0]?.total || 0, 10);

    res.json({ success: true, data: result.rows, total });
  } catch (error) {
    console.error('List invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list invoices',
      error: error.message,
    });
  }
};

// Create invoice (Super Admin only)
export const createInvoice = async (req, res) => {
  try {
    const { user_id, society_apartment_id, amount, due_date, period_start, period_end, notes, subscription_id } = req.body;
    if (!user_id || !society_apartment_id || amount == null) {
      return res.status(400).json({
        success: false,
        message: 'user_id, society_apartment_id, and amount are required',
      });
    }
    const due = due_date || new Date().toISOString().slice(0, 10);
    const start = period_start || new Date().toISOString().slice(0, 10);
    const end = period_end || start;

    const result = await query(
      `INSERT INTO super_admin_invoices (user_id, society_apartment_id, subscription_id, amount, currency, status, due_date, period_start, period_end, notes)
       VALUES ($1, $2, $3, $4, 'PKR', 'draft', $5, $6, $7, $8)
       RETURNING *`,
      [user_id, society_apartment_id, subscription_id || null, Math.max(0, parseFloat(amount)), due, start, end, notes || null]
    );
    const row = result.rows[0];
    const withJoin = await query(
      `SELECT i.*, u.name AS user_name, u.email AS user_email, a.name AS apartment_name, a.city, a.area
       FROM super_admin_invoices i
       JOIN users u ON i.user_id = u.id
       JOIN apartments a ON i.society_apartment_id = a.id
       WHERE i.id = $1`,
      [row.id]
    );
    res.status(201).json({ success: true, data: withJoin.rows[0] || row });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message,
    });
  }
};

// Update invoice status (e.g. mark paid)
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['draft', 'sent', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status required' });
    }
    const result = await query(
      `UPDATE super_admin_invoices SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: error.message,
    });
  }
};

/**
 * Run auto-generation of invoices for union admins whose next_billing_date is due.
 * Used by: (1) POST /super-admin/invoices/auto-generate, (2) in-process cron job, (3) external cron via POST /api/cron/auto-generate-invoices.
 * @returns {{ success: boolean, message: string, created: Array }}
 */
export const runAutoGenerateInvoices = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const result = await query(
    `SELECT s.id AS subscription_id, s.user_id, s.society_apartment_id, s.next_billing_date, p.amount
     FROM subscriptions s
     LEFT JOIN subscription_plans p ON s.plan_id = p.id
     WHERE s.status = 'active'
       AND s.next_billing_date IS NOT NULL
       AND s.next_billing_date <= $1
       AND p.amount > 0`,
    [today]
  );
  const created = [];
  for (const row of result.rows) {
    const nextBilling = row.next_billing_date;
    const periodStart = nextBilling;
    const periodEnd = new Date(nextBilling);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    periodEnd.setDate(periodEnd.getDate() - 1);
    const dueDate = new Date(periodEnd);
    dueDate.setDate(dueDate.getDate() + 7);

    const existing = await query(
      `SELECT id FROM super_admin_invoices
       WHERE user_id = $1 AND period_start = $2`,
      [row.user_id, periodStart]
    );
    if (existing.rows.length > 0) continue;

    await query(
      `INSERT INTO super_admin_invoices (user_id, society_apartment_id, subscription_id, amount, currency, status, due_date, period_start, period_end)
       VALUES ($1, $2, $3, $4, 'PKR', 'draft', $5, $6, $7)`,
      [
        row.user_id,
        row.society_apartment_id,
        row.subscription_id,
        row.amount,
        dueDate.toISOString().slice(0, 10),
        periodStart,
        periodEnd.toISOString().slice(0, 10),
      ]
    );
    const nextNext = new Date(nextBilling);
    nextNext.setMonth(nextNext.getMonth() + 1);
    await query(
      `UPDATE subscriptions SET next_billing_date = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [nextNext.toISOString().slice(0, 10), row.subscription_id]
    );
    created.push({ user_id: row.user_id, period_start: periodStart, amount: row.amount });
  }
  return {
    success: true,
    message: `Created ${created.length} invoice(s)`,
    created,
  };
};

// HTTP handler: auto-generate invoices (Super Admin only or cron secret)
export const autoGenerateInvoices = async (req, res) => {
  try {
    const result = await runAutoGenerateInvoices();
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Auto-generate invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to auto-generate invoices',
      error: error.message,
    });
  }
};
