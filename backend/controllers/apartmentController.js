import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { createOrUpdateSubscription } from './subscriptionController.js';
import * as auditLog from '../services/auditLogService.js';

// Get distinct cities (for City → Area → Apartment cascading)
export const getCities = async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT city FROM apartments WHERE city IS NOT NULL AND TRIM(city) != '' ORDER BY city`
    );
    res.json({ success: true, data: result.rows.map(r => r.city) });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message,
    });
  }
};

// Get distinct areas (optionally by city) for cascading
export const getAreas = async (req, res) => {
  try {
    const { city } = req.query;
    let sql = `SELECT DISTINCT area FROM apartments WHERE (area IS NOT NULL AND TRIM(COALESCE(area, '')) != '')`;
    const params = [];
    if (city) {
      sql += ` AND city = $1`;
      params.push(city);
    }
    sql += ` ORDER BY area`;
    const result = await query(sql, params);
    res.json({ success: true, data: result.rows.map(r => r.area).filter(Boolean) });
  } catch (error) {
    console.error('Get areas error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch areas',
      error: error.message,
    });
  }
};

// Get all apartments (with optional city, area filter for cascading; sortBy=name|union_admin, order=asc|desc)
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, city, area, address, status, approval_status, sortBy, order } = req.query;
    const offset = (page - 1) * limit;
    const sortOrder = (order || '').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const sortByUnionAdmin = (sortBy || '').toLowerCase() === 'union_admin';

    let sql = `SELECT a.* FROM apartments a`;
    if (sortByUnionAdmin) {
      sql += ` LEFT JOIN users u ON u.society_apartment_id = a.id AND u.role = 'union_admin'`;
    }
    const params = [];
    let paramCount = 0;

    sql += ` WHERE 1=1`;
    if (city) {
      paramCount++;
      sql += ` AND a.city = $${paramCount}`;
      params.push(city);
    }
    if (area) {
      paramCount++;
      sql += ` AND (a.area = $${paramCount} OR (a.area IS NULL AND $${paramCount} = ''))`;
      params.push(area || '');
    }
    if (search) {
      paramCount++;
      sql += ` AND (a.name ILIKE $${paramCount} OR a.address ILIKE $${paramCount} OR a.city ILIKE $${paramCount} OR COALESCE(a.area, '') ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    if (address && String(address).trim()) {
      paramCount++;
      sql += ` AND a.address ILIKE $${paramCount}`;
      params.push(`%${String(address).trim()}%`);
    }
    const statusLower = (status || '').toLowerCase();
    // Status filter by subscription: active = has active subscriber, inactive = waiting for subscription
    if (statusLower === 'active') {
      sql += ` AND a.id IN (
        SELECT u.society_apartment_id FROM users u
        INNER JOIN subscriptions s ON s.user_id = u.id
        WHERE u.role = 'union_admin' AND LOWER(TRIM(s.status)) = 'active'
      )`;
    } else if (statusLower === 'inactive') {
      sql += ` AND a.id NOT IN (
        SELECT u.society_apartment_id FROM users u
        INNER JOIN subscriptions s ON s.user_id = u.id
        WHERE u.role = 'union_admin' AND LOWER(TRIM(s.status)) = 'active'
      )`;
    }
    const approvalLower = (approval_status || '').toLowerCase();
    if (approvalLower === 'pending' || approvalLower === 'approved' || approvalLower === 'rejected') {
      sql += ` AND LOWER(TRIM(a.approval_status)) = $${paramCount + 1}`;
      params.push(approvalLower);
      paramCount++;
    }

    if (sortByUnionAdmin) {
      sql += ` ORDER BY COALESCE(u.name, a.union_admin_name) ${sortOrder} NULLS LAST, a.city, a.name`;
    } else if ((sortBy || '').toLowerCase() === 'name') {
      sql += ` ORDER BY a.name ${sortOrder}, a.city, a.area`;
    } else {
      sql += ` ORDER BY a.city, a.area, a.name`;
    }
    sql += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM apartments WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;
    if (city) {
      countParamCount++;
      countSql += ` AND city = $${countParamCount}`;
      countParams.push(city);
    }
    if (area) {
      countParamCount++;
      countSql += ` AND (area = $${countParamCount} OR (area IS NULL AND $${countParamCount} = ''))`;
      countParams.push(area || '');
    }
    if (search) {
      countParamCount++;
      countSql += ` AND (name ILIKE $${countParamCount} OR address ILIKE $${countParamCount} OR city ILIKE $${countParamCount} OR COALESCE(area, '') ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }
    if (address && String(address).trim()) {
      countParamCount++;
      countSql += ` AND address ILIKE $${countParamCount}`;
      countParams.push(`%${String(address).trim()}%`);
    }
    if (statusLower === 'active') {
      countSql += ` AND id IN (
        SELECT u.society_apartment_id FROM users u
        INNER JOIN subscriptions s ON s.user_id = u.id
        WHERE u.role = 'union_admin' AND LOWER(TRIM(s.status)) = 'active'
      )`;
    } else if (statusLower === 'inactive') {
      countSql += ` AND id NOT IN (
        SELECT u.society_apartment_id FROM users u
        INNER JOIN subscriptions s ON s.user_id = u.id
        WHERE u.role = 'union_admin' AND LOWER(TRIM(s.status)) = 'active'
      )`;
    }
    if (approvalLower === 'pending' || approvalLower === 'approved' || approvalLower === 'rejected') {
      countParamCount++;
      countSql += ` AND LOWER(TRIM(approval_status)) = $${countParamCount}`;
      countParams.push(approvalLower);
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
    console.error('Get apartments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch apartments',
      error: error.message,
    });
  }
};

// Get apartment by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM apartments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get apartment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch apartment',
      error: error.message,
    });
  }
};

// Create apartment (optionally create Union Admin user with pending subscription when details provided)
export const create = async (req, res) => {
  try {
    const { name, address, city, area, total_blocks, total_floors, total_units, union_admin_name, union_admin_email, union_admin_phone, union_admin_password, lead_source, current_status, next_followup_date, last_interaction_date, priority, notes } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Apartment name is required',
      });
    }

    // If Union Admin email is provided, require name and password to auto-create client
    const wantsUnionAdmin = !!(union_admin_email && String(union_admin_email).trim());
    if (wantsUnionAdmin) {
      if (!union_admin_name || !String(union_admin_name).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Union Admin name is required when Union Admin email is provided',
        });
      }
      if (!union_admin_password || String(union_admin_password).length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Union Admin password is required (min 6 characters) when creating a client from Union Admin details',
        });
      }
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [String(union_admin_email).toLowerCase().trim()]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'A user with this Union Admin email already exists',
        });
      }
    }

    const totalBlocks = Math.max(0, parseInt(total_blocks, 10) || 0);
    const totalFloors = Math.max(0, parseInt(total_floors, 10) || 0);
    const totalUnits = Math.max(0, parseInt(total_units, 10) || 0);

    const result = await query(
      `INSERT INTO apartments (name, address, city, area, total_blocks, total_floors, total_units, union_admin_name, union_admin_email, union_admin_phone, approval_status, lead_source, current_status, next_followup_date, last_interaction_date, priority, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [name, address || null, city || null, area || null, totalBlocks, totalFloors, totalUnits, union_admin_name || null, union_admin_email || null, union_admin_phone || null, lead_source || null, current_status || null, next_followup_date || null, last_interaction_date || null, priority || null, notes || null]
    );

    const apartment = result.rows[0];
    const apartmentId = apartment.id;

    await auditLog.log(req, {
      action: 'apartment.create',
      resourceType: 'apartment',
      resourceId: String(apartmentId),
      societyId: apartmentId,
      details: { name: apartment.name },
    });

    // Auto-create Union Admin user (client) with pending subscription so they appear in Users until super admin runs Create Job
    if (wantsUnionAdmin) {
      const email = String(union_admin_email).toLowerCase().trim();
      const hashedPassword = await bcrypt.hash(union_admin_password, 10);
      const createdBy = req.user?.id || null;

      const userResult = await query(
        `INSERT INTO users (email, password, name, role, society_apartment_id, contact_number, created_by)
         VALUES ($1, $2, $3, 'union_admin', $4, $5, $6)
         RETURNING id, email, name, role, society_apartment_id, created_at`,
        [
          email,
          hashedPassword,
          String(union_admin_name).trim(),
          apartmentId,
          union_admin_phone ? String(union_admin_phone).trim() : null,
          createdBy,
        ]
      );

      const newUser = userResult.rows[0];
      try {
        await createOrUpdateSubscription(newUser.id, apartmentId, null, 'pending');
      } catch (subErr) {
        console.warn('Subscription create skipped:', subErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Apartment created successfully' + (wantsUnionAdmin ? '. Union Admin client added with pending subscription—activate from Users via Create Job.' : ''),
      data: apartment,
    });
  } catch (error) {
    console.error('Create apartment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create apartment',
      error: error.message,
    });
  }
};

// Update apartment
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, area, total_blocks, total_floors, total_units, union_admin_name, union_admin_email, union_admin_phone, is_active, lead_source, current_status, next_followup_date, last_interaction_date, priority, notes } = req.body;

    // Check if apartment exists
    const existing = await query('SELECT id FROM apartments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found',
      });
    }

    const isActiveValue = typeof is_active === 'boolean' ? is_active : (is_active === 'true' || is_active === true);
    const includeIsActive = req.body.hasOwnProperty('is_active');
    const result = includeIsActive
      ? await query(
          `UPDATE apartments 
           SET name = COALESCE($1, name),
               address = COALESCE($2, address),
               city = COALESCE($3, city),
               area = COALESCE($4, area),
               total_blocks = COALESCE($5, total_blocks),
               total_floors = COALESCE($6, total_floors),
               total_units = COALESCE($7, total_units),
               union_admin_name = $8,
               union_admin_email = $9,
               union_admin_phone = $10,
               is_active = $11,
               lead_source = $12,
               current_status = $13,
               next_followup_date = $14,
               last_interaction_date = $15,
               priority = $16,
               notes = $17,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $18
           RETURNING *`,
          [name, address, city, area, total_blocks, total_floors, total_units, union_admin_name || null, union_admin_email || null, union_admin_phone || null, isActiveValue, lead_source || null, current_status || null, next_followup_date || null, last_interaction_date || null, priority || null, notes || null, id]
        )
      : await query(
          `UPDATE apartments 
           SET name = COALESCE($1, name),
               address = COALESCE($2, address),
               city = COALESCE($3, city),
               area = COALESCE($4, area),
               total_blocks = COALESCE($5, total_blocks),
               total_floors = COALESCE($6, total_floors),
               total_units = COALESCE($7, total_units),
               union_admin_name = $8,
               union_admin_email = $9,
               union_admin_phone = $10,
               lead_source = $11,
               current_status = $12,
               next_followup_date = $13,
               last_interaction_date = $14,
               priority = $15,
               notes = $16,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $17
           RETURNING *`,
          [name, address, city, area, total_blocks, total_floors, total_units, union_admin_name || null, union_admin_email || null, union_admin_phone || null, lead_source || null, current_status || null, next_followup_date || null, last_interaction_date || null, priority || null, notes || null, id]
        );

    await auditLog.log(req, {
      action: 'apartment.update',
      resourceType: 'apartment',
      resourceId: id,
      societyId: parseInt(id, 10),
      details: { name },
    });

    res.json({
      success: true,
      message: 'Apartment updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update apartment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update apartment',
      error: error.message,
    });
  }
};

// Delete apartment
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM apartments WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found',
      });
    }

    await auditLog.log(req, { action: 'apartment.delete', resourceType: 'apartment', resourceId: id, details: {} });

    res.json({
      success: true,
      message: 'Apartment deleted successfully',
    });
  } catch (error) {
    console.error('Delete apartment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete apartment',
      error: error.message,
    });
  }
};

// Approve union (super admin only) – formal approve workflow
export const approve = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body || {};

    const existing = await query('SELECT id, approval_status, name FROM apartments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }
    const row = existing.rows[0];
    if ((row.approval_status || '').toLowerCase() === 'approved') {
      return res.status(400).json({ success: false, message: 'Union is already approved' });
    }

    await query(
      `UPDATE apartments SET approval_status = 'approved', approval_notes = $1, approved_at = CURRENT_TIMESTAMP, approved_by = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [notes || null, req.user?.id || null, id]
    );

    await auditLog.log(req, {
      action: 'apartment.approve',
      resourceType: 'apartment',
      resourceId: id,
      societyId: parseInt(id, 10),
      details: { notes: notes || null, name: row.name },
    });

    res.json({
      success: true,
      message: 'Union approved successfully',
      data: { id: parseInt(id, 10), approval_status: 'approved' },
    });
  } catch (error) {
    console.error('Approve apartment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve union',
      error: error.message,
    });
  }
};

// Reject union (super admin only)
export const reject = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body || {};

    const existing = await query('SELECT id, approval_status, name FROM apartments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }
    const row = existing.rows[0];

    await query(
      `UPDATE apartments SET approval_status = 'rejected', approval_notes = $1, approved_at = NULL, approved_by = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [notes || null, req.user?.id || null, id]
    );

    await auditLog.log(req, {
      action: 'apartment.reject',
      resourceType: 'apartment',
      resourceId: id,
      societyId: parseInt(id, 10),
      details: { notes: notes || null, name: row.name },
    });

    res.json({
      success: true,
      message: 'Union rejected',
      data: { id: parseInt(id, 10), approval_status: 'rejected' },
    });
  } catch (error) {
    console.error('Reject apartment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject union',
      error: error.message,
    });
  }
};

// Get feature flags for a union (super admin only)
const FEATURE_KEYS = ['complaints', 'maintenance', 'announcements', 'finance_reports', 'defaulters_visible', 'messaging'];

export const getFeatures = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await query('SELECT id FROM apartments WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    const result = await query(
      'SELECT feature_key, enabled FROM union_features WHERE society_apartment_id = $1',
      [id]
    );
    const map = Object.fromEntries((result.rows || []).map((r) => [r.feature_key, r.enabled]));
    const data = {};
    FEATURE_KEYS.forEach((k) => {
      data[k] = map[k] !== false;
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get union features error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch union features',
      error: error.message,
    });
  }
};

// Update feature flags for a union (super admin only)
export const updateFeatures = async (req, res) => {
  try {
    const { id } = req.params;
    const { features } = req.body || {};

    const exists = await query('SELECT id FROM apartments WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    if (!features || typeof features !== 'object') {
      return res.status(400).json({ success: false, message: 'Body must include features object' });
    }

    for (const key of FEATURE_KEYS) {
      if (typeof features[key] !== 'boolean') continue;
      await query(
        `INSERT INTO union_features (society_apartment_id, feature_key, enabled, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (society_apartment_id, feature_key) DO UPDATE SET enabled = $3, updated_at = CURRENT_TIMESTAMP`,
        [id, key, features[key]]
      );
    }

    await auditLog.log(req, {
      action: 'apartment.features.update',
      resourceType: 'apartment',
      resourceId: id,
      societyId: parseInt(id, 10),
      details: features,
    });

    const result = await query('SELECT feature_key, enabled FROM union_features WHERE society_apartment_id = $1', [id]);
    const map = Object.fromEntries((result.rows || []).map((r) => [r.feature_key, r.enabled]));
    const data = {};
    FEATURE_KEYS.forEach((k) => {
      data[k] = map[k] !== false;
    });

    res.json({ success: true, message: 'Features updated', data });
  } catch (error) {
    console.error('Update union features error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update union features',
      error: error.message,
    });
  }
};
