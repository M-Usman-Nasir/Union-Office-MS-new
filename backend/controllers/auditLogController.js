import { query } from '../config/database.js';

/**
 * GET /api/super-admin/audit-logs – super admin only
 * Query: page, limit, user_id, resource_type, action, from_date, to_date
 */
export const list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user_id,
      resource_type,
      action,
      from_date,
      to_date,
    } = req.query;

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    let sql = `
      SELECT al.id, al.created_at, al.user_id, al.role, al.action, al.resource_type, al.resource_id,
             al.society_apartment_id, al.details, al.ip,
             u.name AS user_name, u.email AS user_email,
             a.name AS society_name
      FROM audit_log al
      LEFT JOIN users u ON u.id = al.user_id
      LEFT JOIN apartments a ON a.id = al.society_apartment_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (user_id) {
      paramCount++;
      sql += ` AND al.user_id = $${paramCount}`;
      params.push(user_id);
    }
    if (resource_type) {
      paramCount++;
      sql += ` AND al.resource_type = $${paramCount}`;
      params.push(resource_type);
    }
    if (action) {
      paramCount++;
      sql += ` AND al.action = $${paramCount}`;
      params.push(action);
    }
    if (from_date) {
      paramCount++;
      sql += ` AND al.created_at >= $${paramCount}::timestamp`;
      params.push(from_date);
    }
    if (to_date) {
      paramCount++;
      sql += ` AND al.created_at <= $${paramCount}::timestamp`;
      params.push(to_date);
    }

    const countParams = [];
    let c = 0;
    let countFilter = '';
    if (user_id) { c++; countFilter += ` AND user_id = $${c}`; countParams.push(user_id); }
    if (resource_type) { c++; countFilter += ` AND resource_type = $${c}`; countParams.push(resource_type); }
    if (action) { c++; countFilter += ` AND action = $${c}`; countParams.push(action); }
    if (from_date) { c++; countFilter += ` AND created_at >= $${c}::timestamp`; countParams.push(from_date); }
    if (to_date) { c++; countFilter += ` AND created_at <= $${c}::timestamp`; countParams.push(to_date); }

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM audit_log WHERE 1=1${countFilter}`,
      countParams
    );
    const total = parseInt(countResult.rows[0]?.total || 0, 10);

    sql += ` ORDER BY al.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limitNum, offset);

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows || [],
      pagination: {
        page: parseInt(page, 10),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('List audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
  }
};
