import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { createOrUpdateSubscription } from './subscriptionController.js';

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

// Get all apartments (with optional city, area filter for cascading)
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, city, area } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM apartments WHERE 1=1`;
    const params = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      sql += ` AND city = $${paramCount}`;
      params.push(city);
    }
    if (area) {
      paramCount++;
      sql += ` AND (area = $${paramCount} OR (area IS NULL AND $${paramCount} = ''))`;
      params.push(area || '');
    }
    if (search) {
      paramCount++;
      sql += ` AND (name ILIKE $${paramCount} OR address ILIKE $${paramCount} OR city ILIKE $${paramCount} OR COALESCE(area, '') ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY city, area, name LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
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
    const { name, address, city, area, total_blocks, total_floors, total_units, union_admin_name, union_admin_email, union_admin_phone, union_admin_password } = req.body;

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

    const result = await query(
      `INSERT INTO apartments (name, address, city, area, total_blocks, total_floors, total_units, union_admin_name, union_admin_email, union_admin_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, address || null, city || null, area || null, total_blocks || 0, total_floors || 0, total_units || 0, union_admin_name || null, union_admin_email || null, union_admin_phone || null]
    );

    const apartment = result.rows[0];
    const apartmentId = apartment.id;

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
    const { name, address, city, area, total_blocks, total_floors, total_units, union_admin_name, union_admin_email, union_admin_phone } = req.body;

    // Check if apartment exists
    const existing = await query('SELECT id FROM apartments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found',
      });
    }

    const result = await query(
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
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [name, address, city, area, total_blocks, total_floors, total_units, union_admin_name || null, union_admin_email || null, union_admin_phone || null, id]
    );

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
