import { query } from '../config/database.js';

// Get all societies
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM societies WHERE 1=1';
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
    let countSql = 'SELECT COUNT(*) FROM societies WHERE 1=1';
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
    console.error('Get societies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch societies',
      error: error.message,
    });
  }
};

// Get society by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM societies WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get society error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch society',
      error: error.message,
    });
  }
};

// Create society
export const create = async (req, res) => {
  try {
    const { name, address, city, total_blocks, total_units } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Society name is required',
      });
    }

    const result = await query(
      `INSERT INTO societies (name, address, city, total_blocks, total_units)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, address || null, city || null, total_blocks || 0, total_units || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Society created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create society error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create society',
      error: error.message,
    });
  }
};

// Update society
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, total_blocks, total_units } = req.body;

    // Check if society exists
    const existing = await query('SELECT id FROM societies WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    const result = await query(
      `UPDATE societies 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           city = COALESCE($3, city),
           total_blocks = COALESCE($4, total_blocks),
           total_units = COALESCE($5, total_units),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, address, city, total_blocks, total_units, id]
    );

    res.json({
      success: true,
      message: 'Society updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update society error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update society',
      error: error.message,
    });
  }
};

// Delete society
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM societies WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.json({
      success: true,
      message: 'Society deleted successfully',
    });
  } catch (error) {
    console.error('Delete society error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete society',
      error: error.message,
    });
  }
};
