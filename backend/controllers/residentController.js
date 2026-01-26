import { query } from '../config/database.js';

// Get all residents
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, society_id, unit_id } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT r.*, u.unit_number, u.owner_name, s.name as society_name
      FROM users r
      LEFT JOIN units u ON r.unit_id = u.id
      LEFT JOIN societies s ON r.society_apartment_id = s.id
      WHERE r.role IN ('resident', 'union_admin')
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND r.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (unit_id) {
      paramCount++;
      sql += ` AND r.unit_id = $${paramCount}`;
      params.push(unit_id);
    }

    if (search) {
      paramCount++;
      sql += ` AND (r.name ILIKE $${paramCount} OR r.email ILIKE $${paramCount} OR r.contact_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY r.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = `
      SELECT COUNT(*) FROM users r
      WHERE r.role IN ('resident', 'union_admin')
    `;
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND r.society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }

    if (unit_id) {
      countParamCount++;
      countSql += ` AND r.unit_id = $${countParamCount}`;
      countParams.push(unit_id);
    }

    if (search) {
      countParamCount++;
      countSql += ` AND (r.name ILIKE $${countParamCount} OR r.email ILIKE $${countParamCount} OR r.contact_number ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
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
    console.error('Get residents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch residents',
      error: error.message,
    });
  }
};

// Get resident by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT r.*, u.unit_number, u.owner_name, s.name as society_name
       FROM users r
       LEFT JOIN units u ON r.unit_id = u.id
       LEFT JOIN societies s ON r.society_apartment_id = s.id
       WHERE r.id = $1 AND r.role IN ('resident', 'union_admin')`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resident',
      error: error.message,
    });
  }
};

// Create resident
export const create = async (req, res) => {
  try {
    const { email, password, name, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date } = req.body;

    if (!email || !name || !society_apartment_id) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, and society_apartment_id are required',
      });
    }

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password if provided
    const bcrypt = await import('bcryptjs');
    const hashedPassword = password ? await bcrypt.default.hash(password, 10) : null;

    const result = await query(
      `INSERT INTO users (email, password, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, created_by)
       VALUES ($1, $2, $3, 'resident', $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, email, name, role, society_apartment_id, unit_id, created_at`,
      [
        email.toLowerCase(),
        hashedPassword,
        name,
        society_apartment_id,
        unit_id || null,
        cnic || null,
        contact_number || null,
        emergency_contact || null,
        move_in_date || null,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Resident created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resident',
      error: error.message,
    });
  }
};

// Update resident
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date } = req.body;

    const existing = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found',
      });
    }

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           society_apartment_id = COALESCE($2, society_apartment_id),
           unit_id = COALESCE($3, unit_id),
           cnic = COALESCE($4, cnic),
           contact_number = COALESCE($5, contact_number),
           emergency_contact = COALESCE($6, emergency_contact),
           move_in_date = COALESCE($7, move_in_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, email, name, role, society_apartment_id, unit_id, updated_at`,
      [name, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, id]
    );

    res.json({
      success: true,
      message: 'Resident updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resident',
      error: error.message,
    });
  }
};

// Delete resident
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 AND role IN (\'resident\', \'union_admin\') RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found',
      });
    }

    res.json({
      success: true,
      message: 'Resident deleted successfully',
    });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resident',
      error: error.message,
    });
  }
};
