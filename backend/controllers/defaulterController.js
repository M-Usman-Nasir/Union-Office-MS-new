import { query } from '../config/database.js';

// Get all defaulters
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, status, block_id, floor_id } = req.query;
    const offset = (page - 1) * limit;

    // Check if defaulter list is visible for residents
    if (req.user.role === 'resident') {
      const societyId = society_id || req.user.society_apartment_id;
      const settings = await query(
        'SELECT defaulter_list_visible FROM settings WHERE society_apartment_id = $1',
        [societyId]
      );

      if (settings.rows.length === 0 || !settings.rows[0].defaulter_list_visible) {
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0,
          },
          message: 'Defaulter list is not visible for residents',
        });
      }
    }

    let sql = `
      SELECT d.*, u.unit_number, u.owner_name, u.contact_number as resident_contact,
             u.block_id, u.floor_id, f.floor_number,
             s.name as society_name,
             COALESCE(
               (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
               NULLIF(TRIM(u.resident_name), ''),
               NULLIF(TRIM(u.owner_name), ''),
               ''
             ) AS resident_name,
             (SELECT MAX(m.payment_date) FROM maintenance m WHERE m.unit_id = d.unit_id AND m.payment_date IS NOT NULL) AS last_payment_date
      FROM defaulters d
      LEFT JOIN units u ON d.unit_id = u.id
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN apartments s ON d.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND d.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND d.status = $${paramCount}`;
      params.push(status);
    }

    if (block_id) {
      paramCount++;
      sql += ` AND u.block_id = $${paramCount}`;
      params.push(block_id);
    }

    if (floor_id) {
      paramCount++;
      sql += ` AND u.floor_id = $${paramCount}`;
      params.push(floor_id);
    }

    sql += ` ORDER BY d.months_overdue DESC, d.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count (join units for block/floor filter)
    let countSql = `
      SELECT COUNT(*) FROM defaulters d
      LEFT JOIN units u ON d.unit_id = u.id
      WHERE 1=1
    `;
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND d.society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (status) {
      countParamCount++;
      countSql += ` AND d.status = $${countParamCount}`;
      countParams.push(status);
    }
    if (block_id) {
      countParamCount++;
      countSql += ` AND u.block_id = $${countParamCount}`;
      countParams.push(block_id);
    }
    if (floor_id) {
      countParamCount++;
      countSql += ` AND u.floor_id = $${countParamCount}`;
      countParams.push(floor_id);
    }

    const countResult = await query(countSql, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit),
      },
    });
  } catch (error) {
    console.error('Get defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch defaulters',
      error: error.message,
    });
  }
};

// Get defaulter statistics
export const getStatistics = async (req, res) => {
  try {
    const { society_id } = req.query;

    let sql = `
      SELECT 
        COUNT(*) as total_defaulters,
        SUM(amount_due) as total_amount_due,
        AVG(months_overdue) as avg_months_overdue,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
        COUNT(CASE WHEN status = 'escalated' THEN 1 END) as escalated_count
      FROM defaulters
      WHERE 1=1
    `;
    const params = [];

    if (society_id) {
      sql += ' AND society_apartment_id = $1';
      params.push(society_id);
    }

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get defaulter statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch defaulter statistics',
      error: error.message,
    });
  }
};

// Export defaulters as CSV (admin only)
export const exportDefaulters = async (req, res) => {
  try {
    const { society_id } = req.query;

    let sql = `
      SELECT d.id, d.unit_id, d.amount_due, d.months_overdue, d.remarks, d.created_at,
             u.unit_number, u.contact_number as resident_contact, u.email,
             s.name as society_name,
             COALESCE(
               (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
               NULLIF(TRIM(u.resident_name), ''),
               NULLIF(TRIM(u.owner_name), ''),
               ''
             ) AS resident_name,
             (SELECT MAX(m.payment_date) FROM maintenance m WHERE m.unit_id = d.unit_id AND m.payment_date IS NOT NULL) AS last_payment_date
      FROM defaulters d
      LEFT JOIN units u ON d.unit_id = u.id
      LEFT JOIN apartments s ON d.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (society_id) {
      sql += ' AND d.society_apartment_id = $1';
      params.push(society_id);
    }

    sql += ' ORDER BY d.months_overdue DESC, d.created_at DESC';

    const result = await query(sql, params);

    const formatDate = (val) => (val == null ? '' : new Date(val).toISOString().slice(0, 10));

    // Build CSV (aligned with table: Unit, Resident, Last Payment Date, Amount Due, Months Overdue, Remarks, Society)
    const headers = ['Unit', 'Resident', 'Last Payment Date', 'Contact', 'Email', 'Amount Due', 'Months Overdue', 'Remarks', 'Society'];
    const escapeCsv = (val) => {
      if (val == null) return '';
      const s = String(val);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = result.rows.map((r) => [
      escapeCsv(r.unit_number),
      escapeCsv(r.resident_name),
      escapeCsv(formatDate(r.last_payment_date)),
      escapeCsv(r.resident_contact),
      escapeCsv(r.email),
      escapeCsv(r.amount_due),
      escapeCsv(r.months_overdue),
      escapeCsv(r.remarks),
      escapeCsv(r.society_name),
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="defaulters-${society_id || 'all'}-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  } catch (error) {
    console.error('Export defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export defaulters',
      error: error.message,
    });
  }
};

// Update defaulter status (and optional remarks)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['active', 'resolved', 'escalated'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const result = await query(
      `UPDATE defaulters 
       SET status = $1,
           remarks = COALESCE($2, remarks),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, remarks !== undefined ? remarks : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Defaulter record not found',
      });
    }

    res.json({
      success: true,
      message: 'Defaulter status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update defaulter status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update defaulter status',
      error: error.message,
    });
  }
};
