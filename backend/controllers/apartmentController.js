import { query } from '../config/database.js';

// Get all apartments
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM apartments WHERE 1=1`;
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      sql += ` AND (name ILIKE $${paramCount} OR address ILIKE $${paramCount} OR city ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM apartments WHERE 1=1';
    const countParams = [];
    if (search) {
      countParams.push(`%${search}%`);
      countSql += ` AND (name ILIKE $1 OR address ILIKE $1 OR city ILIKE $1)`;
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
    const { name, address, city, total_blocks, total_floors, total_units } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Apartment name is required',
      });
    }

    const result = await query(
      `INSERT INTO apartments (name, address, city, total_blocks, total_floors, total_units)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, address || null, city || null, total_blocks || 0, total_floors || 0, total_units || 0]
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
    const { name, address, city, total_blocks, total_floors, total_units } = req.body;

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
           total_blocks = COALESCE($4, total_blocks),
           total_floors = COALESCE($5, total_floors),
           total_units = COALESCE($6, total_units),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, address, city, total_blocks, total_floors, total_units, id]
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
