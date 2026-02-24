import { query } from '../config/database.js';

// Get all announcements
export const getAll = async (req, res) => {
  try {
    let { page = 1, limit = 10, society_id, type, is_active } = req.query;
    // Union admin: default to their society when society_id not provided
    if (req.user?.role === 'union_admin' && (society_id == null || society_id === '' || String(society_id) === 'undefined')) {
      society_id = req.user.society_apartment_id;
    }
    society_id = society_id != null && society_id !== '' && String(society_id) !== 'undefined' ? Number(society_id) : null;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT a.*, s.name as society_name, b.name as block_name, u.name as created_by_name
      FROM announcements a
      LEFT JOIN apartments s ON a.society_apartment_id = s.id
      LEFT JOIN blocks b ON a.block_id = b.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id != null && Number.isFinite(society_id)) {
      paramCount++;
      sql += ` AND a.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (type) {
      paramCount++;
      sql += ` AND a.type = $${paramCount}`;
      params.push(type);
    }

    if (is_active !== undefined) {
      paramCount++;
      sql += ` AND a.is_active = $${paramCount}`;
      params.push(is_active === 'true');
    }

    sql += ` ORDER BY a.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM announcements WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (society_id != null && Number.isFinite(society_id)) {
      countParamCount++;
      countSql += ` AND society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (type) {
      countParamCount++;
      countSql += ` AND type = $${countParamCount}`;
      countParams.push(type);
    }
    if (is_active !== undefined) {
      countParamCount++;
      countSql += ` AND is_active = $${countParamCount}`;
      countParams.push(is_active === 'true');
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
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message,
    });
  }
};

// Get announcement by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT a.*, s.name as society_name, b.name as block_name, u.name as created_by_name
       FROM announcements a
       LEFT JOIN apartments s ON a.society_apartment_id = s.id
       LEFT JOIN blocks b ON a.block_id = b.id
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement',
      error: error.message,
    });
  }
};

// Create announcement
export const create = async (req, res) => {
  try {
    const { title, description, type, audience, language, visible_to_all, society_apartment_id, block_id, announcement_date } = req.body;

    if (!title || !description || !society_apartment_id) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and society ID are required',
      });
    }

    const result = await query(
      `INSERT INTO announcements (title, description, type, audience, language, visible_to_all, society_apartment_id, block_id, created_by, is_active, announcement_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10::DATE)
       RETURNING *`,
      [
        title,
        description,
        type || null,
        audience || null,
        language || 'en',
        visible_to_all !== undefined ? visible_to_all : true,
        society_apartment_id,
        block_id || null,
        req.user.id,
        announcement_date || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message,
    });
  }
};

// Update announcement
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, audience, language, visible_to_all, is_active, announcement_date } = req.body;

    const existing = await query('SELECT id FROM announcements WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const result = await query(
      `UPDATE announcements 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           type = COALESCE($3, type),
           audience = COALESCE($4, audience),
           language = COALESCE($5, language),
           visible_to_all = COALESCE($6, visible_to_all),
           is_active = COALESCE($7, is_active),
           announcement_date = COALESCE($8::DATE, announcement_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, description, type, audience, language, visible_to_all, is_active, announcement_date || null, id]
    );

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement',
      error: error.message,
    });
  }
};

// Delete announcement
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM announcements WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message,
    });
  }
};
