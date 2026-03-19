import { query } from '../config/database.js';

// Get all finance records
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, transaction_type, month, year } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT f.*, s.name as society_name, u.name as added_by_name,
             emp_u.name as employee_name
      FROM finance f
      LEFT JOIN apartments s ON f.society_apartment_id = s.id
      LEFT JOIN users u ON f.added_by = u.id
      LEFT JOIN employees emp ON f.employee_id = emp.id
      LEFT JOIN users emp_u ON emp.user_id = emp_u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND f.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (transaction_type) {
      paramCount++;
      sql += ` AND f.transaction_type = $${paramCount}`;
      params.push(transaction_type);
    }

    if (month) {
      paramCount++;
      sql += ` AND f.month = $${paramCount}`;
      params.push(month);
    }

    if (year) {
      paramCount++;
      sql += ` AND f.year = $${paramCount}`;
      params.push(year);
    }

    sql += ` ORDER BY f.transaction_date DESC, f.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM finance WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (transaction_type) {
      countParamCount++;
      countSql += ` AND transaction_type = $${countParamCount}`;
      countParams.push(transaction_type);
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
    console.error('Get finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch finance records',
      error: error.message,
    });
  }
};

// Get finance summary
export const getSummary = async (req, res) => {
  try {
    const { society_id, month, year } = req.query;

    let sql = `
      SELECT 
        transaction_type,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM finance
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (month) {
      paramCount++;
      sql += ` AND month = $${paramCount}`;
      params.push(month);
    }

    if (year) {
      paramCount++;
      sql += ` AND year = $${paramCount}`;
      params.push(year);
    }

    sql += ' GROUP BY transaction_type';

    const result = await query(sql, params);

    const summary = {
      income: 0,
      expense: 0,
      balance: 0,
      income_count: 0,
      expense_count: 0,
    };

    result.rows.forEach(row => {
      if (row.transaction_type === 'income') {
        summary.income = parseFloat(row.total_amount);
        summary.income_count = parseInt(row.count);
      } else if (row.transaction_type === 'expense') {
        summary.expense = parseFloat(row.total_amount);
        summary.expense_count = parseInt(row.count);
      }
    });

    summary.balance = summary.income - summary.expense;

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get finance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch finance summary',
      error: error.message,
    });
  }
};

// Get finance by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT f.*, s.name as society_name, u.name as added_by_name,
              emp_u.name as employee_name
       FROM finance f
       LEFT JOIN apartments s ON f.society_apartment_id = s.id
       LEFT JOIN users u ON f.added_by = u.id
       LEFT JOIN employees emp ON f.employee_id = emp.id
       LEFT JOIN users emp_u ON emp.user_id = emp_u.id
       WHERE f.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Finance record not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch finance record',
      error: error.message,
    });
  }
};

// Create finance record
export const create = async (req, res) => {
  try {
    const { society_apartment_id, transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, employee_id } = req.body;

    if (!society_apartment_id || !transaction_date || !transaction_type || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Society ID, transaction date, type, and amount are required',
      });
    }

    const result = await query(
      `INSERT INTO finance (society_apartment_id, added_by, transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, employee_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        society_apartment_id,
        req.user.id,
        transaction_date,
        transaction_type,
        expense_type || null,
        income_type || null,
        description || null,
        amount,
        payment_mode || null,
        remarks || null,
        month || new Date(transaction_date).getMonth() + 1,
        year || new Date(transaction_date).getFullYear(),
        status || 'paid',
        employee_id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Finance record created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create finance record',
      error: error.message,
    });
  }
};

// Update finance record
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, employee_id } = req.body;

    const existing = await query('SELECT id FROM finance WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Finance record not found',
      });
    }

    const result = await query(
      `UPDATE finance 
       SET transaction_date = COALESCE($1, transaction_date),
           transaction_type = COALESCE($2, transaction_type),
           expense_type = COALESCE($3, expense_type),
           income_type = COALESCE($4, income_type),
           description = COALESCE($5, description),
           amount = COALESCE($6, amount),
           payment_mode = COALESCE($7, payment_mode),
           remarks = COALESCE($8, remarks),
           month = COALESCE($9, month),
           year = COALESCE($10, year),
           status = COALESCE($11, status),
           employee_id = $12,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, employee_id ?? null, id]
    );

    res.json({
      success: true,
      message: 'Finance record updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update finance record',
      error: error.message,
    });
  }
};

// Delete finance record
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM finance WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Finance record not found',
      });
    }

    res.json({
      success: true,
      message: 'Finance record deleted successfully',
    });
  } catch (error) {
    console.error('Delete finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete finance record',
      error: error.message,
    });
  }
};

// Get monthly financial report
export const getMonthlyReport = async (req, res) => {
  try {
    const { month, year, society_id } = req.query;
    const societyId = society_id || req.user.society_apartment_id;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required',
      });
    }

    // Get summary
    const report = await query(`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income,
        COUNT(CASE WHEN transaction_type = 'income' THEN 1 END) as income_count,
        COUNT(CASE WHEN transaction_type = 'expense' THEN 1 END) as expense_count
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3
    `, [month, year, societyId]);

    // Get breakdown by income type
    const incomeBreakdown = await query(`
      SELECT 
        income_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3 AND transaction_type = 'income'
      GROUP BY income_type
      ORDER BY total DESC
    `, [month, year, societyId]);

    // Get breakdown by expense type
    const expenseBreakdown = await query(`
      SELECT 
        expense_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3 AND transaction_type = 'expense'
      GROUP BY expense_type
      ORDER BY total DESC
    `, [month, year, societyId]);

    res.json({
      success: true,
      data: {
        summary: report.rows[0] || {
          total_income: '0',
          total_expenses: '0',
          net_income: '0',
          income_count: '0',
          expense_count: '0'
        },
        incomeBreakdown: incomeBreakdown.rows,
        expenseBreakdown: expenseBreakdown.rows
      }
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly report',
      error: error.message,
    });
  }
};

// Get yearly financial report
export const getYearlyReport = async (req, res) => {
  try {
    const { year, society_id } = req.query;
    const societyId = society_id || req.user.society_apartment_id;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Year is required',
      });
    }

    if (req.user?.role === 'resident') {
      const settings = await query(
        'SELECT financial_reports_visible FROM settings WHERE society_apartment_id = $1',
        [societyId],
      );
      if (settings.rows.length === 0 || !settings.rows[0].financial_reports_visible) {
        return res.status(403).json({
          success: false,
          message: 'Financial reports are not visible for this society',
        });
      }
    }

    // Get monthly breakdown
    const monthlyBreakdown = await query(`
      SELECT 
        month,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income
      FROM finance
      WHERE year = $1 AND society_apartment_id = $2
      GROUP BY month
      ORDER BY month
    `, [year, societyId]);

    // Get yearly totals
    const yearlyTotal = await query(`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income,
        COUNT(CASE WHEN transaction_type = 'income' THEN 1 END) as income_count,
        COUNT(CASE WHEN transaction_type = 'expense' THEN 1 END) as expense_count
      FROM finance
      WHERE year = $1 AND society_apartment_id = $2
    `, [year, societyId]);

    // Get breakdown by income type
    const incomeBreakdown = await query(`
      SELECT 
        income_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance
      WHERE year = $1 AND society_apartment_id = $2 AND transaction_type = 'income'
      GROUP BY income_type
      ORDER BY total DESC
    `, [year, societyId]);

    // Get breakdown by expense type
    const expenseBreakdown = await query(`
      SELECT 
        expense_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance
      WHERE year = $1 AND society_apartment_id = $2 AND transaction_type = 'expense'
      GROUP BY expense_type
      ORDER BY total DESC
    `, [year, societyId]);

    res.json({
      success: true,
      data: {
        yearly: yearlyTotal.rows[0] || {
          total_income: '0',
          total_expenses: '0',
          net_income: '0',
          income_count: '0',
          expense_count: '0'
        },
        monthly: monthlyBreakdown.rows,
        incomeBreakdown: incomeBreakdown.rows,
        expenseBreakdown: expenseBreakdown.rows
      }
    });
  } catch (error) {
    console.error('Get yearly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yearly report',
      error: error.message,
    });
  }
};

// Get public financial summary (for residents)
export const getPublicSummary = async (req, res) => {
  try {
    const { month, year, society_id } = req.query;
    const societyId = society_id || req.user.society_apartment_id;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required',
      });
    }

    // Check if financial reports are visible for this society
    const settings = await query(
      'SELECT financial_reports_visible FROM settings WHERE society_apartment_id = $1',
      [societyId]
    );

    if (settings.rows.length === 0 || !settings.rows[0].financial_reports_visible) {
      return res.status(403).json({
        success: false,
        message: 'Financial reports are not visible for this society',
      });
    }

    // Get summary
    const report = await query(`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3
    `, [month, year, societyId]);

    const incomeBreakdown = await query(
      `
      SELECT 
        income_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3 AND transaction_type = 'income'
      GROUP BY income_type
      ORDER BY total DESC
    `,
      [month, year, societyId],
    );

    const expenseBreakdown = await query(
      `
      SELECT 
        expense_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3 AND transaction_type = 'expense'
      GROUP BY expense_type
      ORDER BY total DESC
    `,
      [month, year, societyId],
    );

    res.json({
      success: true,
      data: {
        summary: report.rows[0] || {
          total_income: '0',
          total_expenses: '0',
          net_income: '0',
        },
        incomeBreakdown: incomeBreakdown.rows,
        expenseBreakdown: expenseBreakdown.rows,
      },
    });
  } catch (error) {
    console.error('Get public summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public summary',
      error: error.message,
    });
  }
};
