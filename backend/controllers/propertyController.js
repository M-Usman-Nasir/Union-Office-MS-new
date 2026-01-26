import { query } from '../config/database.js';

// Blocks Controller
export const getBlocks = async (req, res) => {
  try {
    const { society_id } = req.query;

    let result;
    if (society_id) {
      result = await query(
        'SELECT * FROM blocks WHERE society_apartment_id = $1 ORDER BY name',
        [society_id]
      );
    } else {
      // If no society_id provided, return all blocks (for super admin)
      result = await query(
        'SELECT * FROM blocks ORDER BY society_apartment_id, name'
      );
    }

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get blocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blocks',
      error: error.message,
    });
  }
};

export const createBlock = async (req, res) => {
  try {
    const { society_apartment_id, name, total_floors, total_units } = req.body;

    if (!society_apartment_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'Society ID and block name are required',
      });
    }

    const result = await query(
      `INSERT INTO blocks (society_apartment_id, name, total_floors, total_units)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [society_apartment_id, name, total_floors || 0, total_units || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Block created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create block error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create block',
      error: error.message,
    });
  }
};

// Floors Controller
export const getFloors = async (req, res) => {
  try {
    const { block_id } = req.query;

    if (!block_id) {
      return res.status(400).json({
        success: false,
        message: 'Block ID is required',
      });
    }

    const result = await query(
      'SELECT * FROM floors WHERE block_id = $1 ORDER BY floor_number',
      [block_id]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get floors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch floors',
      error: error.message,
    });
  }
};

export const createFloor = async (req, res) => {
  try {
    const { block_id, floor_number, total_units } = req.body;

    if (!block_id || !floor_number) {
      return res.status(400).json({
        success: false,
        message: 'Block ID and floor number are required',
      });
    }

    const result = await query(
      `INSERT INTO floors (block_id, floor_number, total_units)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [block_id, floor_number, total_units || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Floor created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create floor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create floor',
      error: error.message,
    });
  }
};

// Units Controller
export const getUnits = async (req, res) => {
  try {
    const { society_id, block_id, floor_id, is_occupied } = req.query;

    let sql = `
      SELECT u.*, f.floor_number, b.name as block_name, s.name as society_name
      FROM units u
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN blocks b ON u.block_id = b.id
      LEFT JOIN societies s ON u.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND u.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (block_id) {
      paramCount++;
      sql += ` AND u.block_id = $${paramCount}`;
      params.push(block_id);
    }

    if (floor_id) {
      paramCount++;
      sql += ` AND u.floor_id = $${paramCount}`;
      params.push(floor_id);
    }

    if (is_occupied !== undefined) {
      paramCount++;
      sql += ` AND u.is_occupied = $${paramCount}`;
      params.push(is_occupied === 'true');
    }

    sql += ' ORDER BY u.unit_number';

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch units',
      error: error.message,
    });
  }
};

export const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT u.*, f.floor_number, b.name as block_name, s.name as society_name
       FROM units u
       LEFT JOIN floors f ON u.floor_id = f.id
       LEFT JOIN blocks b ON u.block_id = b.id
       LEFT JOIN societies s ON u.society_apartment_id = s.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unit',
      error: error.message,
    });
  }
};

export const createUnit = async (req, res) => {
  try {
    const { society_apartment_id, block_id, floor_id, unit_number, owner_name, resident_name, contact_number, email } = req.body;

    if (!society_apartment_id || !unit_number) {
      return res.status(400).json({
        success: false,
        message: 'Society ID and unit number are required',
      });
    }

    const result = await query(
      `INSERT INTO units (society_apartment_id, block_id, floor_id, unit_number, owner_name, resident_name, contact_number, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [society_apartment_id, block_id || null, floor_id || null, unit_number, owner_name || null, resident_name || null, contact_number || null, email || null]
    );

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create unit',
      error: error.message,
    });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_number, owner_name, resident_name, contact_number, email, is_occupied } = req.body;

    const existing = await query('SELECT id FROM units WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
    }

    const result = await query(
      `UPDATE units 
       SET unit_number = COALESCE($1, unit_number),
           owner_name = COALESCE($2, owner_name),
           resident_name = COALESCE($3, resident_name),
           contact_number = COALESCE($4, contact_number),
           email = COALESCE($5, email),
           is_occupied = COALESCE($6, is_occupied),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [unit_number, owner_name, resident_name, contact_number, email, is_occupied, id]
    );

    res.json({
      success: true,
      message: 'Unit updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update unit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update unit',
      error: error.message,
    });
  }
};
