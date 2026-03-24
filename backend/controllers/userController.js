import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { createOrUpdateSubscription } from './subscriptionController.js';

// Get all users (Super Admin: all users; Union Admin: only users in their society)
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, unassigned_only, work_title } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT u.id, u.email, u.name, u.role, u.society_apartment_id, u.unit_id, u.is_active, u.created_at, u.last_login, u.cnic, u.contact_number, u.emergency_contact, u.address, u.city, u.postal_code, u.work_employer, u.work_title, u.work_phone,
       e.department, e.designation, e.salary_rupees
       FROM users u
       LEFT JOIN employees e ON e.user_id = u.id
       WHERE 1=1`;
    const params = [];
    let paramCount = 0;

    // Union Admin can only see users in their assigned society
    if (req.user.role === 'union_admin' && req.user.society_apartment_id) {
      paramCount++;
      sql += ` AND u.society_apartment_id = $${paramCount}`;
      params.push(req.user.society_apartment_id);
    }

    if (role) {
      paramCount++;
      sql += ` AND u.role = $${paramCount}`;
      params.push(role);
    }

    if (work_title !== undefined && work_title !== '') {
      paramCount++;
      sql += ` AND u.work_title = $${paramCount}`;
      params.push(work_title);
    }

    // Super Admin: list only union admins not assigned to any apartment
    if (req.user.role === 'super_admin' && unassigned_only === 'true') {
      sql += ' AND u.society_apartment_id IS NULL';
    }

    if (search) {
      paramCount++;
      sql += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY u.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
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
    if (work_title !== undefined && work_title !== '') {
      countParamCount++;
      countSql += ` AND work_title = $${countParamCount}`;
      countParams.push(work_title);
    }
    if (req.user.role === 'super_admin' && unassigned_only === 'true') {
      countSql += ' AND society_apartment_id IS NULL';
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
      `SELECT u.id, u.email, u.name, u.role, u.society_apartment_id, u.unit_id, u.cnic, u.contact_number, u.emergency_contact, u.move_in_date, u.is_active, u.created_at, u.last_login, u.address, u.city, u.postal_code, u.work_employer, u.work_title, u.work_phone,
       e.department, e.designation, e.salary_rupees
       FROM users u
       LEFT JOIN employees e ON e.user_id = u.id
       WHERE u.id = $1`,
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

// Check if email is already used (users table only). exclude_id = current user when editing.
export const checkEmail = async (req, res) => {
  try {
    const email = (req.query.email || '').trim().toLowerCase();
    const excludeId = req.query.exclude_id ? parseInt(req.query.exclude_id, 10) : null;

    if (!email) {
      return res.status(400).json({
        success: true,
        data: { available: true },
        message: 'No email provided',
      });
    }

    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmailRegex.test(email)) {
      return res.json({
        success: true,
        data: { available: true },
        message: 'Invalid format; not checking',
      });
    }

    let sql = 'SELECT id FROM users WHERE LOWER(email) = $1';
    const params = [email];
    if (excludeId && !Number.isNaN(excludeId)) {
      sql += ' AND id != $2';
      params.push(excludeId);
    }
    sql += ' LIMIT 1';

    const result = await query(sql, params);
    const available = result.rows.length === 0;

    res.json({
      success: true,
      data: { available },
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email',
      error: error.message,
    });
  }
};

// Update user (Union Admin can only update users in their society or themselves; one union_admin per apartment enforced)
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, is_active, address, city, postal_code, work_employer, work_title, work_phone, department, designation, salary_rupees } = req.body;

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
    // Assigning the Super Admin role is not allowed (only one fixed Super Admin in the system)
    if (role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Assigning the Super Admin role is not allowed. There is only one Super Admin in the system.',
      });
    }
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
           address = COALESCE($9, address),
           city = COALESCE($10, city),
           postal_code = COALESCE($11, postal_code),
           work_employer = COALESCE($12, work_employer),
           work_title = COALESCE($13, work_title),
           work_phone = COALESCE($14, work_phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING id, email, name, role, society_apartment_id, unit_id, is_active, updated_at`,
      [name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, is_active, address, city, postal_code, work_employer, work_title, work_phone, id]
    );

    const updatedUser = result.rows[0];
    if (updatedUser.role === 'union_admin' && updatedUser.society_apartment_id) {
      try {
        await createOrUpdateSubscription(updatedUser.id, updatedUser.society_apartment_id);
      } catch (subErr) {
        console.warn('Subscription update skipped:', subErr.message);
      }
    }

    // When updating a staff user, upsert employees row (department, designation, salary_rupees)
    if (updatedUser.role === 'staff' && updatedUser.society_apartment_id) {
      const createdBy = req.user?.role === 'union_admin' ? req.user.id : null;
      await query(
        `INSERT INTO employees (user_id, society_apartment_id, created_by, department, designation, salary_rupees)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO UPDATE SET
           department = COALESCE(EXCLUDED.department, employees.department),
           designation = COALESCE(EXCLUDED.designation, employees.designation),
           salary_rupees = COALESCE(EXCLUDED.salary_rupees, employees.salary_rupees),
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          updatedUser.society_apartment_id,
          createdBy,
          department ?? null,
          designation ?? work_title ?? null,
          salary_rupees != null && salary_rupees !== '' ? parseFloat(salary_rupees) : null,
        ]
      );
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
    const { new_password, force_change_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const shouldForceChange = force_change_password === true || force_change_password === 'true';
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const result = await query(
      `UPDATE users
       SET password = $1,
           must_change_password = CASE WHEN role = 'resident' AND $2::boolean = true THEN true ELSE false END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, role, must_change_password`,
      [hashedPassword, shouldForceChange, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message:
        result.rows[0].role === 'resident' && result.rows[0].must_change_password
          ? 'Password reset successfully. Resident must change password on next login.'
          : 'Password updated successfully',
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

// Delete user (super_admin: any user; union_admin: only staff in their society)
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
    const target = existing.rows[0];
    if (req.user.role === 'union_admin') {
      if (target.role !== 'staff' || target.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete employees in your society.',
        });
      }
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
