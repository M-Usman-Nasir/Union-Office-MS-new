import { query } from '../config/database.js';

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

// Create apartment
export const create = async (req, res) => {
  try {
    const { name, address, city, area, total_blocks, total_floors, total_units } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Apartment name is required',
      });
    }

    const result = await query(
      `INSERT INTO apartments (name, address, city, area, total_blocks, total_floors, total_units)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, address || null, city || null, area || null, total_blocks || 0, total_floors || 0, total_units || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Apartment created successfully',
      data: result.rows[0],
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
    const { name, address, city, area, total_blocks, total_floors, total_units } = req.body;

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
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, address, city, area, total_blocks, total_floors, total_units, id]
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
