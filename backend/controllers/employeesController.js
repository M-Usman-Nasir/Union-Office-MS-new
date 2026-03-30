import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { getUiSocietyId } from '../utils/multiUiContext.js';

// List employees for the current union_admin's society only
export const getAll = async (req, res) => {
  try {
    const societyId = getUiSocietyId(req) ?? req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned. Only union admins with an assigned society can manage employees. (Multi-UI: set society in the toolbar / X-Hums-Ui-Society-Id.)',
      });
    }

    const { page = 1, limit = 10, search, work_title } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT u.id, u.name, u.contact_number, u.is_active, u.created_at,
             e.id AS employee_id, e.department, e.designation, e.salary_rupees, e.society_apartment_id
      FROM employees e
      INNER JOIN users u ON u.id = e.user_id AND u.role = 'staff'
      WHERE e.society_apartment_id = $1`;
    const params = [societyId];
    let paramCount = 1;

    if (work_title !== undefined && work_title !== '') {
      paramCount++;
      sql += ` AND (e.designation = $${paramCount} OR u.work_title = $${paramCount})`;
      params.push(work_title);
    }
    if (search && search.trim()) {
      paramCount++;
      sql += ` AND (u.name ILIKE $${paramCount} OR u.contact_number ILIKE $${paramCount})`;
      params.push(`%${search.trim()}%`);
    }

    sql += ` ORDER BY u.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    let countSql = `
      SELECT COUNT(*) FROM employees e
      INNER JOIN users u ON u.id = e.user_id AND u.role = 'staff'
      WHERE e.society_apartment_id = $1`;
    const countParams = [societyId];
    let countParamCount = 1;
    if (work_title !== undefined && work_title !== '') {
      countParamCount++;
      countSql += ` AND (e.designation = $${countParamCount} OR u.work_title = $${countParamCount})`;
      countParams.push(work_title);
    }
    if (search && search.trim()) {
      countParamCount++;
      countSql += ` AND (u.name ILIKE $${countParamCount} OR u.contact_number ILIKE $${countParamCount})`;
      countParams.push(`%${search.trim()}%`);
    }
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    const rows = result.rows.map((row) => ({
      id: row.id,
      user_id: row.id,
      employee_id: row.employee_id,
      name: row.name,
      contact_number: row.contact_number,
      is_active: row.is_active,
      created_at: row.created_at,
      department: row.department,
      designation: row.designation,
      work_title: row.designation,
      salary_rupees: row.salary_rupees,
      society_apartment_id: row.society_apartment_id,
    }));

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Employees getAll error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message,
    });
  }
};

// Get one employee by user id (union_admin society only)
export const getById = async (req, res) => {
  try {
    const societyId = getUiSocietyId(req) ?? req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned.',
      });
    }

    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid employee id' });
    }

    const result = await query(
      `SELECT u.id, u.name, u.contact_number, u.is_active, u.created_at,
              e.id AS employee_id, e.department, e.designation, e.salary_rupees, e.society_apartment_id
       FROM users u
       INNER JOIN employees e ON e.user_id = u.id AND e.society_apartment_id = $1
       WHERE u.id = $2 AND u.role = 'staff'`,
      [societyId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        user_id: row.id,
        employee_id: row.employee_id,
        name: row.name,
        contact_number: row.contact_number,
        is_active: row.is_active,
        created_at: row.created_at,
        department: row.department,
        designation: row.designation,
        work_title: row.designation,
        salary_rupees: row.salary_rupees,
        society_apartment_id: row.society_apartment_id,
      },
    });
  } catch (error) {
    console.error('Employees getById error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message,
    });
  }
};

// Create employee (user staff + employees row)
export const create = async (req, res) => {
  try {
    const societyId = getUiSocietyId(req) ?? req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned. Only union admins with an assigned society can add employees.',
      });
    }

    const { name, contact_number, designation, department, salary_rupees } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const email = `staff-${societyId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}@no-login.local`;
    const password = crypto.randomBytes(24).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await query(
      `INSERT INTO users (email, password, name, role, society_apartment_id, contact_number, created_by, work_title)
       VALUES ($1, $2, $3, 'staff', $4, $5, $6, $7)
       RETURNING id, name, role, society_apartment_id, contact_number, created_at`,
      [
        email,
        hashedPassword,
        name.trim(),
        societyId,
        contact_number || null,
        req.user.id,
        designation || null,
      ]
    );
    const newUser = insertResult.rows[0];

    await query(
      `INSERT INTO employees (user_id, society_apartment_id, created_by, department, designation, salary_rupees)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        newUser.id,
        societyId,
        req.user.id,
        department || null,
        designation || null,
        salary_rupees != null && salary_rupees !== '' ? parseFloat(salary_rupees) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        society_apartment_id: newUser.society_apartment_id,
        contact_number: newUser.contact_number,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('Employees create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// Update employee (user + employees row)
export const update = async (req, res) => {
  try {
    const societyId = getUiSocietyId(req) ?? req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned.',
      });
    }

    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid employee id' });
    }

    const { name, contact_number, designation, department, salary_rupees, is_active } = req.body;

    const existing = await query(
      `SELECT u.id, e.id AS employee_id FROM users u
       INNER JOIN employees e ON e.user_id = u.id AND e.society_apartment_id = $1
       WHERE u.id = $2 AND u.role = 'staff'`,
      [societyId, userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await query(
      `UPDATE users SET
         name = COALESCE($1, name),
         contact_number = COALESCE($2, contact_number),
         work_title = COALESCE($3, work_title),
         is_active = COALESCE($4, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [name || null, contact_number || null, designation || null, is_active !== undefined ? is_active : null, userId]
    );

    await query(
      `UPDATE employees SET
         department = COALESCE($1, department),
         designation = COALESCE($2, designation),
         salary_rupees = COALESCE($3, salary_rupees),
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $4`,
      [
        department ?? null,
        designation ?? null,
        salary_rupees != null && salary_rupees !== '' ? parseFloat(salary_rupees) : null,
        userId,
      ]
    );

    const result = await query(
      `SELECT u.id, u.name, u.contact_number, u.is_active,
              e.department, e.designation, e.salary_rupees
       FROM users u
       INNER JOIN employees e ON e.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Employees update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

// Delete employee (and user; employees row removed via CASCADE)
export const remove = async (req, res) => {
  try {
    const societyId = getUiSocietyId(req) ?? req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned.',
      });
    }

    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid employee id' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const existing = await query(
      `SELECT e.user_id FROM employees e
       WHERE e.user_id = $1 AND e.society_apartment_id = $2`,
      [userId, societyId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Employees remove error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};
