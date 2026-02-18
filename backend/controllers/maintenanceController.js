import { query } from '../config/database.js';

// Get all maintenance records
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, unit_id, status, month, year } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT m.*, u.unit_number, u.owner_name, s.name as society_name
      FROM maintenance m
      LEFT JOIN units u ON m.unit_id = u.id
      LEFT JOIN apartments s ON m.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND m.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (unit_id) {
      paramCount++;
      sql += ` AND m.unit_id = $${paramCount}`;
      params.push(unit_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND m.status = $${paramCount}`;
      params.push(status);
    }

    if (month) {
      paramCount++;
      sql += ` AND m.month = $${paramCount}`;
      params.push(month);
    }

    if (year) {
      paramCount++;
      sql += ` AND m.year = $${paramCount}`;
      params.push(year);
    }

    sql += ` ORDER BY m.year DESC, m.month DESC, m.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM maintenance WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (unit_id) {
      countParamCount++;
      countSql += ` AND unit_id = $${countParamCount}`;
      countParams.push(unit_id);
    }
    if (status) {
      countParamCount++;
      countSql += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }
    if (month) {
      countParamCount++;
      countSql += ` AND month = $${countParamCount}`;
      countParams.push(month);
    }
    if (year) {
      countParamCount++;
      countSql += ` AND year = $${countParamCount}`;
      countParams.push(year);
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
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance records',
      error: error.message,
    });
  }
};

// Get maintenance by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT m.*, u.unit_number, u.owner_name, s.name as society_name
       FROM maintenance m
       LEFT JOIN units u ON m.unit_id = u.id
       LEFT JOIN apartments s ON m.society_apartment_id = s.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance record',
      error: error.message,
    });
  }
};

// Create maintenance record
export const create = async (req, res) => {
  try {
    const { unit_id, society_apartment_id, month, year, base_amount, total_amount, due_date } = req.body;

    if (!unit_id || !society_apartment_id || !month || !year || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Unit ID, society ID, month, year, and total amount are required',
      });
    }

    const result = await query(
      `INSERT INTO maintenance (unit_id, society_apartment_id, month, year, base_amount, total_amount, due_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [unit_id, society_apartment_id, month, year, base_amount || total_amount, total_amount, due_date || null]
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance record',
      error: error.message,
    });
  }
};

// Update maintenance record
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { base_amount, total_amount, status, amount_paid, due_date } = req.body;

    const existing = await query('SELECT id FROM maintenance WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    const result = await query(
      `UPDATE maintenance 
       SET base_amount = COALESCE($1, base_amount),
           total_amount = COALESCE($2, total_amount),
           status = COALESCE($3, status),
           amount_paid = COALESCE($4, amount_paid),
           due_date = COALESCE($5, due_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [base_amount, total_amount, status, amount_paid, due_date, id]
    );

    res.json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance record',
      error: error.message,
    });
  }
};

// Record payment
export const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_paid } = req.body;

    if (!amount_paid) {
      return res.status(400).json({
        success: false,
        message: 'Amount paid is required',
      });
    }

    const existing = await query('SELECT * FROM maintenance WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    const maintenance = existing.rows[0];
    const currentAmountPaid = parseFloat(maintenance.amount_paid) || 0;
    const paymentAmount = parseFloat(amount_paid);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    const newAmountPaid = currentAmountPaid + paymentAmount;
    const totalAmount = parseFloat(maintenance.total_amount) || 0;
    const newStatus = newAmountPaid >= totalAmount ? 'paid' : 
                     newAmountPaid > 0 ? 'partially_paid' : 'pending';

    // Set payment_date only if status is 'paid'
    const paymentDate = newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null;

    const result = await query(
      `UPDATE maintenance 
       SET amount_paid = $1::DECIMAL(10, 2),
           status = $2::VARCHAR,
           payment_date = COALESCE($3::DATE, payment_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4::INTEGER
       RETURNING *`,
      [newAmountPaid, newStatus, paymentDate, parseInt(id)]
    );

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message,
    });
  }
};

// Delete maintenance record
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM maintenance WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.json({
      success: true,
      message: 'Maintenance record deleted successfully',
    });
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete maintenance record',
      error: error.message,
    });
  }
};

// Get yearly maintenance ledger (one row per unit with monthly columns + total/paid/due)
export const getYearlyLedger = async (req, res) => {
  try {
    const { society_id, year } = req.query;
    const ledgerYear = year ? parseInt(year, 10) : new Date().getFullYear();

    if (!society_id) {
      return res.status(400).json({
        success: false,
        message: 'society_id is required',
      });
    }

    const sql = `
      SELECT
        u.id AS unit_id,
        u.unit_number AS flat_no,
        u.unit_number AS unit_number,
        COALESCE(
          (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
          NULLIF(TRIM(u.resident_name), ''),
          NULLIF(TRIM(u.owner_name), ''),
          ''
        ) AS resident_name,
        f.floor_number,
        u.floor_id,
        u.block_id,
        b.name AS block_name,
        SUM(CASE WHEN m.month = 1 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS jan,
        SUM(CASE WHEN m.month = 2 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS feb,
        SUM(CASE WHEN m.month = 3 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS mar,
        SUM(CASE WHEN m.month = 4 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS apr,
        SUM(CASE WHEN m.month = 5 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS may,
        SUM(CASE WHEN m.month = 6 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS jun,
        SUM(CASE WHEN m.month = 7 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS jul,
        SUM(CASE WHEN m.month = 8 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS aug,
        SUM(CASE WHEN m.month = 9 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS sep,
        SUM(CASE WHEN m.month = 10 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS oct,
        SUM(CASE WHEN m.month = 11 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS nov,
        SUM(CASE WHEN m.month = 12 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS dec,
        COALESCE(SUM(m.total_amount), 0) AS total_payment,
        COALESCE(SUM(m.amount_paid), 0) AS paid_payment,
        COALESCE(SUM(m.total_amount), 0) - COALESCE(SUM(m.amount_paid), 0) AS due
      FROM units u
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN blocks b ON u.block_id = b.id
      LEFT JOIN maintenance m ON m.unit_id = u.id AND m.year = $1
      WHERE u.society_apartment_id = $2
      GROUP BY u.id, u.unit_number, u.resident_name, u.owner_name, f.floor_number, u.floor_id, u.block_id, b.name
      ORDER BY b.name NULLS LAST, f.floor_number NULLS LAST, u.unit_number
    `;

    const result = await query(sql, [ledgerYear, society_id]);

    res.json({
      success: true,
      data: result.rows,
      year: ledgerYear,
    });
  } catch (error) {
    console.error('Get yearly ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yearly maintenance ledger',
      error: error.message,
    });
  }
};

// Generate monthly dues manually (union_admin: only their society; super_admin: all societies)
export const generateMonthlyDues = async (req, res) => {
  try {
    const { month, year } = req.body;

    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const societyId = req.user?.role === 'union_admin' ? req.user.society_apartment_id : null;

    const { generateMonthlyDues: generateDues } = await import('../jobs/monthlyDuesGenerator.js');
    const result = await generateDues(targetMonth, targetYear, societyId);

    res.json({
      success: true,
      message: 'Monthly dues generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Generate monthly dues error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly dues',
      error: error.message,
    });
  }
};

// Generate monthly dues for a block or floor (union_admin only, for their society)
export const generateForScope = async (req, res) => {
  try {
    const societyId = req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: 'Society (apartment) is required. Only union admins can generate for a block or floor.',
      });
    }

    const { month, year, scope, block_id, floor_id } = req.body;
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    let blockId = null;
    let floorId = null;
    if (scope === 'block' && block_id != null && block_id !== '') {
      blockId = block_id;
    } else if (scope === 'floor' && floor_id != null && floor_id !== '') {
      floorId = floor_id;
      if (block_id != null && block_id !== '') blockId = block_id;
    } else {
      return res.status(400).json({
        success: false,
        message: scope === 'block' ? 'block_id is required' : 'floor_id is required for floor scope',
      });
    }

    const { generateMonthlyDuesForScope } = await import('../jobs/monthlyDuesGenerator.js');
    const result = await generateMonthlyDuesForScope(targetMonth, targetYear, societyId, { blockId, floorId });

    res.json({
      success: true,
      message: `Dues generated for ${scope}: ${result.successful} created, ${result.failed} failed`,
      data: result
    });
  } catch (error) {
    console.error('Generate for scope error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dues for scope',
      error: error.message,
    });
  }
};
