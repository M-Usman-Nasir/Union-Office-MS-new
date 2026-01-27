import { query } from '../config/database.js';

// Blocks Controller
export const getBlocks = async (req, res) => {
  try {
    const { society_id } = req.query;

    let result;
    if (society_id) {
      result = await query(
        `SELECT b.*, s.name as society_name
         FROM blocks b
         LEFT JOIN societies s ON b.society_apartment_id = s.id
         WHERE b.society_apartment_id = $1
         ORDER BY b.name`,
        [society_id]
      );
    } else {
      // If no society_id provided, return all blocks (for super admin)
      result = await query(
        `SELECT b.*, s.name as society_name
         FROM blocks b
         LEFT JOIN societies s ON b.society_apartment_id = s.id
         ORDER BY b.society_apartment_id, b.name`
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

export const updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, total_floors, total_units } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Block name is required',
      });
    }

    const existing = await query('SELECT id FROM blocks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Block not found',
      });
    }

    const result = await query(
      `UPDATE blocks 
       SET name = $1,
           total_floors = COALESCE($2, total_floors),
           total_units = COALESCE($3, total_units),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, total_floors, total_units, id]
    );

    res.json({
      success: true,
      message: 'Block updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update block error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update block',
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
      `SELECT f.*, b.name as block_name, b.society_apartment_id
       FROM floors f
       LEFT JOIN blocks b ON f.block_id = b.id
       WHERE f.block_id = $1
       ORDER BY f.floor_number`,
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
    const {
      society_apartment_id,
      block_id,
      floor_id,
      unit_number,
      owner_name,
      resident_name,
      contact_number,
      email,
      k_electric_account,
      gas_account,
      water_account,
      phone_tv_account,
      car_make_model,
      license_plate,
      number_of_cars,
      is_occupied,
      telephone_bills,
      other_bills,
    } = req.body;

    if (!society_apartment_id || !unit_number) {
      return res.status(400).json({
        success: false,
        message: 'Society ID and unit number are required',
      });
    }

    const result = await query(
      `INSERT INTO units (
        society_apartment_id, block_id, floor_id, unit_number, 
        owner_name, resident_name, contact_number, email,
        k_electric_account, gas_account, water_account, phone_tv_account,
        car_make_model, license_plate, number_of_cars, is_occupied,
        telephone_bills, other_bills
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [
        society_apartment_id,
        block_id || null,
        floor_id || null,
        unit_number,
        owner_name || null,
        resident_name || null,
        contact_number || null,
        email || null,
        k_electric_account || null,
        gas_account || null,
        water_account || null,
        phone_tv_account || null,
        car_make_model || null,
        license_plate || null,
        number_of_cars || 0,
        is_occupied !== undefined ? is_occupied : false,
        // PostgreSQL pg library handles arrays/objects directly for JSONB
        Array.isArray(telephone_bills) ? telephone_bills : (telephone_bills || []),
        Array.isArray(other_bills) ? other_bills : (other_bills || []),
      ]
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
    const {
      unit_number,
      owner_name,
      resident_name,
      contact_number,
      email,
      k_electric_account,
      gas_account,
      water_account,
      phone_tv_account,
      car_make_model,
      license_plate,
      number_of_cars,
      is_occupied,
      telephone_bills,
      other_bills,
    } = req.body;

    const existing = await query('SELECT id FROM units WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
    }

    // Prepare JSONB values first
    const telBillsJson = telephone_bills !== undefined 
      ? JSON.stringify(Array.isArray(telephone_bills) ? telephone_bills : (telephone_bills || []))
      : null;
    const otherBillsJson = other_bills !== undefined
      ? JSON.stringify(Array.isArray(other_bills) ? other_bills : (other_bills || []))
      : null;

    // Build dynamic update query with explicit type handling
    const updates = []
    const values = []
    let paramCount = 0

    if (unit_number !== undefined) {
      paramCount++
      updates.push(`unit_number = $${paramCount}::varchar`)
      values.push(unit_number)
    }
    if (owner_name !== undefined) {
      paramCount++
      updates.push(`owner_name = $${paramCount}::varchar`)
      values.push(owner_name || null)
    }
    if (resident_name !== undefined) {
      paramCount++
      updates.push(`resident_name = $${paramCount}::varchar`)
      values.push(resident_name || null)
    }
    if (contact_number !== undefined) {
      paramCount++
      updates.push(`contact_number = $${paramCount}::varchar`)
      values.push(contact_number || null)
    }
    if (email !== undefined) {
      paramCount++
      updates.push(`email = $${paramCount}::varchar`)
      values.push(email || null)
    }
    if (k_electric_account !== undefined) {
      paramCount++
      updates.push(`k_electric_account = $${paramCount}::varchar`)
      values.push(k_electric_account || null)
    }
    if (gas_account !== undefined) {
      paramCount++
      updates.push(`gas_account = $${paramCount}::varchar`)
      values.push(gas_account || null)
    }
    if (water_account !== undefined) {
      paramCount++
      updates.push(`water_account = $${paramCount}::varchar`)
      values.push(water_account || null)
    }
    if (phone_tv_account !== undefined) {
      paramCount++
      updates.push(`phone_tv_account = $${paramCount}::varchar`)
      values.push(phone_tv_account || null)
    }
    if (car_make_model !== undefined) {
      paramCount++
      updates.push(`car_make_model = $${paramCount}::varchar`)
      values.push(car_make_model || null)
    }
    if (license_plate !== undefined) {
      paramCount++
      updates.push(`license_plate = $${paramCount}::varchar`)
      values.push(license_plate || null)
    }
    if (number_of_cars !== undefined) {
      paramCount++
      updates.push(`number_of_cars = $${paramCount}::integer`)
      values.push(number_of_cars || 0)
    }
    if (is_occupied !== undefined) {
      paramCount++
      updates.push(`is_occupied = $${paramCount}::boolean`)
      values.push(is_occupied)
    }
    if (telephone_bills !== undefined) {
      paramCount++
      updates.push(`telephone_bills = $${paramCount}::jsonb`)
      values.push(telBillsJson)
    }
    if (other_bills !== undefined) {
      paramCount++
      updates.push(`other_bills = $${paramCount}::jsonb`)
      values.push(otherBillsJson)
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      })
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    paramCount++
    values.push(parseInt(id))

    const sql = `UPDATE units SET ${updates.join(', ')} WHERE id = $${paramCount}::integer RETURNING *`

    const result = await query(sql, values)

    res.json({
      success: true,
      message: 'Unit updated successfully',
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Update unit error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update unit',
      error: error.message,
    })
  }
}
