import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

// Get all users
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT id, email, name, role, society_apartment_id, unit_id, is_active, created_at, last_login FROM users WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      sql += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (search) {
      paramCount++;
      sql += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (role) {
      countParamCount++;
      countSql += ` AND role = $${countParamCount}`;
      countParams.push(role);
    }
    if (search) {
      countParamCount++;
      countSql += ` AND (name ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get user by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, email, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, is_active, created_at, last_login FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// Update user
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, is_active } = req.body;

    const existing = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           role = COALESCE($2, role),
           society_apartment_id = COALESCE($3, society_apartment_id),
           unit_id = COALESCE($4, unit_id),
           cnic = COALESCE($5, cnic),
           contact_number = COALESCE($6, contact_number),
           emergency_contact = COALESCE($7, emergency_contact),
           is_active = COALESCE($8, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, email, name, role, society_apartment_id, unit_id, is_active, updated_at`,
      [name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, is_active, id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// Update user password
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const result = await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message,
    });
  }
};

// Delete user
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};
