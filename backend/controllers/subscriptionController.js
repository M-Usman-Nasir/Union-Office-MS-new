import { query } from '../config/database.js';

// Get all subscription plans (for super admin). Query ?all=true returns inactive too.
export const getPlans = async (req, res) => {
  try {
    const all = req.query.all === 'true';
    const result = await query(
      all
        ? 'SELECT * FROM subscription_plans ORDER BY interval_months, id'
        : 'SELECT * FROM subscription_plans WHERE is_active = true ORDER BY interval_months'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error.message,
    });
  }
};

// Create subscription plan (Super Admin only)
export const createPlan = async (req, res) => {
  try {
    const { name, amount, interval_months } = req.body;
    if (!name || amount == null || interval_months == null) {
      return res.status(400).json({
        success: false,
        message: 'name, amount, and interval_months are required',
      });
    }
    const result = await query(
      `INSERT INTO subscription_plans (name, amount, interval_months, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [name, Math.max(0, parseFloat(amount)), Math.max(1, parseInt(interval_months, 10))]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription plan',
      error: error.message,
    });
  }
};

// Update subscription plan (Super Admin only)
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, interval_months, is_active } = req.body;
    const result = await query(
      `UPDATE subscription_plans
       SET name = COALESCE($1, name), amount = COALESCE($2, amount), interval_months = COALESCE($3, interval_months),
           is_active = COALESCE($4, is_active), updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        name,
        amount != null ? Math.max(0, parseFloat(amount)) : null,
        interval_months != null ? Math.max(1, parseInt(interval_months, 10)) : null,
        is_active,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription plan',
      error: error.message,
    });
  }
};

// List Union Admins with subscription details (Super Admin only)
export const getAdminsWithSubscriptions = async (req, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.email, u.name, u.contact_number, u.is_active, u.created_at, u.last_login,
             u.society_apartment_id,
             a.name AS apartment_name, a.city, a.area, a.address,
             s.id AS subscription_id, s.status AS subscription_status, s.start_date, s.end_date, s.next_billing_date,
             p.name AS plan_name, p.amount AS plan_amount, p.interval_months
      FROM users u
      LEFT JOIN apartments a ON u.society_apartment_id = a.id
      LEFT JOIN subscriptions s ON s.user_id = u.id
      LEFT JOIN subscription_plans p ON s.plan_id = p.id
      WHERE u.role = 'union_admin'
      ORDER BY a.city, a.area, a.name, u.name
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get admins with subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message,
    });
  }
};

// Create subscription when assigning Union Admin to apartment (called after user create/update)
// initialStatus: 'active' (default) or 'pending' - use 'pending' when adding client from Apartments until super admin activates
export const createOrUpdateSubscription = async (userId, societyApartmentId, planId = null, initialStatus = 'active') => {
  const planIdRes = planId
    ? planId
    : (await query('SELECT id FROM subscription_plans WHERE is_active = true LIMIT 1')).rows[0]?.id;
  const startDate = new Date().toISOString().slice(0, 10);
  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  const existing = await query('SELECT id FROM subscriptions WHERE user_id = $1', [userId]);
  if (existing.rows.length > 0) {
    await query(
      `UPDATE subscriptions SET society_apartment_id = $1, plan_id = $2, status = 'active', start_date = $3, next_billing_date = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5`,
      [societyApartmentId, planIdRes, startDate, nextBilling.toISOString().slice(0, 10), userId]
    );
  } else {
    const status = initialStatus === 'pending' ? 'pending' : 'active';
    await query(
      `INSERT INTO subscriptions (user_id, society_apartment_id, plan_id, status, start_date, next_billing_date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, societyApartmentId, planIdRes, status, startDate, nextBilling.toISOString().slice(0, 10)]
    );
  }
};

// Create subscription (Super Admin) - used when adding admin
export const createSubscription = async (req, res) => {
  try {
    const { user_id, society_apartment_id, plan_id } = req.body;
    if (!user_id || !society_apartment_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id and society_apartment_id are required',
      });
    }
    const startDate = new Date().toISOString().slice(0, 10);
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);
    const planIdRes = plan_id || (await query('SELECT id FROM subscription_plans WHERE is_active = true LIMIT 1')).rows[0]?.id;

    await query(
      `INSERT INTO subscriptions (user_id, society_apartment_id, plan_id, status, start_date, next_billing_date)
       VALUES ($1, $2, $3, 'active', $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET society_apartment_id = $2, plan_id = $3, status = 'active', start_date = $4, next_billing_date = $5, updated_at = CURRENT_TIMESTAMP`,
      [user_id, society_apartment_id, planIdRes, startDate, nextBilling.toISOString().slice(0, 10)]
    );

    res.status(201).json({ success: true, message: 'Subscription created/updated' });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message,
    });
  }
};

// Update subscription status (e.g. renew, cancel)
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, end_date, next_billing_date } = req.body;

    const result = await query(
      `UPDATE subscriptions SET status = COALESCE($1, status), end_date = COALESCE($2, end_date), next_billing_date = COALESCE($3, next_billing_date), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [status, end_date, next_billing_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message,
    });
  }
};
