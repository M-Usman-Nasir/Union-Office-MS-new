import { query } from '../config/database.js';

// Get complaints assigned to staff member
export const getAssignedComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT c.*, u.unit_number, s.name as society_name, 
             submitter.name as submitted_by_name
      FROM complaints c
      LEFT JOIN units u ON c.unit_id = u.id
      LEFT JOIN societies s ON c.society_apartment_id = s.id
      LEFT JOIN users submitter ON c.submitted_by = submitter.id
      WHERE c.assigned_to = $1
    `;
    const params = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      sql += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      sql += ` AND c.priority = $${paramCount}`;
      params.push(priority);
    }

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM complaints WHERE assigned_to = $1';
    const countParams = [req.user.id];

    if (status) {
      countParams.push(status);
      countSql += ` AND status = $${countParams.length}`;
    }
    if (priority) {
      countParams.push(priority);
      countSql += ` AND priority = $${countParams.length}`;
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
    console.error('Get assigned complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned complaints',
      error: error.message,
    });
  }
};

// Get payments for staff member's assigned complaints
export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, status } = req.query;
    const offset = (page - 1) * limit;

    // Staff can see payments for maintenance records in societies they have access to
    // This is a simplified version - adjust based on your access control requirements
    let sql = `
      SELECT m.*, u.unit_number, u.owner_name, s.name as society_name
      FROM maintenance m
      LEFT JOIN units u ON m.unit_id = u.id
      LEFT JOIN societies s ON m.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND m.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND m.status = $${paramCount}`;
      params.push(status);
    }

    sql += ` ORDER BY m.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM maintenance WHERE 1=1';
    const countParams = [];

    if (society_id) {
      countParams.push(society_id);
      countSql += ` AND society_apartment_id = $${countParams.length}`;
    }
    if (status) {
      countParams.push(status);
      countSql += ` AND status = $${countParams.length}`;
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
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message,
    });
  }
};

// Update payment status (staff can update status and amount_paid)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount_paid } = req.body;

    // Get current payment record
    const existing = await query('SELECT * FROM maintenance WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    const maintenance = existing.rows[0];
    const newAmountPaid = amount_paid !== undefined ? parseFloat(amount_paid) : parseFloat(maintenance.amount_paid) || 0;
    const newStatus = status || maintenance.status;

    // Calculate status based on amount paid if status not provided
    let finalStatus = newStatus;
    if (!status) {
      if (newAmountPaid >= parseFloat(maintenance.total_amount)) {
        finalStatus = 'paid';
      } else if (newAmountPaid > 0) {
        finalStatus = 'partially_paid';
      } else {
        finalStatus = 'pending';
      }
    }

    const result = await query(
      `UPDATE maintenance 
       SET status = $1,
           amount_paid = $2,
           payment_date = CASE WHEN $1 = 'paid' THEN CURRENT_DATE ELSE payment_date END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [finalStatus, newAmountPaid, id]
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    });
  }
};
