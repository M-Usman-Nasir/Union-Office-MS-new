import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { createOrUpdateSubscription } from './subscriptionController.js';

// Get all users (Super Admin: all users; Union Admin: only users in their society)
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT id, email, name, role, society_apartment_id, unit_id, is_active, created_at, last_login FROM users WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Union Admin can only see users in their assigned society
    if (req.user.role === 'union_admin' && req.user.society_apartment_id) {
      paramCount++;
      sql += ` AND society_apartment_id = $${paramCount}`;
      params.push(req.user.society_apartment_id);
    }

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

    if (req.user.role === 'union_admin' && req.user.society_apartment_id) {
      countParamCount++;
      countSql += ` AND society_apartment_id = $${countParamCount}`;
      countParams.push(req.user.society_apartment_id);
    }
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

// Get user by ID (Union Admin can only get users in their society or themselves)
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

    const userRow = result.rows[0];
    // Union Admin can only view users in their society (or themselves)
    if (req.user.role === 'union_admin' && req.user.society_apartment_id) {
      if (parseInt(id) !== req.user.id && userRow.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view users in your apartment.',
        });
      }
    }

    res.json({
      success: true,
      data: userRow,
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

// Update user (Union Admin can only update users in their society or themselves; one union_admin per apartment enforced)
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, is_active } = req.body;

    const existing = await query(
      'SELECT id, role, society_apartment_id FROM users WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const targetUser = existing.rows[0];
    // Union Admin can only update users in their society (or themselves)
    if (req.user.role === 'union_admin' && req.user.society_apartment_id) {
      if (parseInt(id) !== req.user.id && targetUser.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update users in your apartment.',
        });
      }
      // Union Admin cannot change role or society_apartment_id (only super_admin can assign apartments)
      if (role !== undefined && role !== targetUser.role) {
        return res.status(403).json({ success: false, message: 'Only Super Admin can change user role.' });
      }
      if (society_apartment_id !== undefined && society_apartment_id !== targetUser.society_apartment_id) {
        return res.status(403).json({ success: false, message: 'Only Super Admin can assign apartment.' });
      }
    }

    // Enforce one union_admin per apartment (when super_admin assigns role or society)
    const effectiveRole = role !== undefined ? role : targetUser.role;
    const effectiveSocietyId = society_apartment_id !== undefined ? society_apartment_id : targetUser.society_apartment_id;
    if (effectiveRole === 'union_admin' && effectiveSocietyId) {
      const existingAdmin = await query(
        'SELECT id FROM users WHERE role = $1 AND society_apartment_id = $2 AND id != $3',
        ['union_admin', effectiveSocietyId, id]
      );
      if (existingAdmin.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'This apartment already has an admin. Each apartment can have only one Union Admin.',
        });
      }
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

    const updatedUser = result.rows[0];
    if (updatedUser.role === 'union_admin' && updatedUser.society_apartment_id) {
      try {
        await createOrUpdateSubscription(updatedUser.id, updatedUser.society_apartment_id);
      } catch (subErr) {
        console.warn('Subscription update skipped:', subErr.message);
      }
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
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
