import { query } from '../config/database.js';

/**
 * Recompute and update a block's total_floors and total_units from actual
 * floors and units tables. Keeps blocks table in sync when floors/units are
 * added from Floors or Units pages.
 */
export async function refreshBlockTotals(block_id) {
  if (block_id == null || block_id === '') return;
  try {
    const bid = parseInt(block_id, 10);
    if (Number.isNaN(bid)) return;

    const floorsCount = await query(
      'SELECT COUNT(*)::int AS c FROM floors WHERE block_id = $1',
      [bid]
    );
    const unitsCount = await query(
      'SELECT COUNT(*)::int AS c FROM units WHERE block_id = $1',
      [bid]
    );

    await query(
      `UPDATE blocks SET total_floors = $1, total_units = $2 WHERE id = $3`,
      [floorsCount.rows[0]?.c ?? 0, unitsCount.rows[0]?.c ?? 0, bid]
    );
  } catch (err) {
    console.error('refreshBlockTotals error:', err);
  }
}

/**
 * Recompute and update an apartment's total_blocks, total_floors, total_units
 * from actual blocks, floors, and units tables. Keeps apartments table in sync.
 */
export async function refreshApartmentTotals(society_apartment_id) {
  if (society_apartment_id == null || society_apartment_id === '') return;
  try {
    const id = parseInt(society_apartment_id, 10);
    if (Number.isNaN(id)) return;

    const blocksCount = await query(
      'SELECT COUNT(*)::int AS c FROM blocks WHERE society_apartment_id = $1',
      [id]
    );
    const floorsCount = await query(
      `SELECT COUNT(*)::int AS c FROM floors f
       INNER JOIN blocks b ON f.block_id = b.id
       WHERE b.society_apartment_id = $1`,
      [id]
    );
    const unitsCount = await query(
      'SELECT COUNT(*)::int AS c FROM units WHERE society_apartment_id = $1',
      [id]
    );

    await query(
      `UPDATE apartments
       SET total_blocks = $1, total_floors = $2, total_units = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [
        blocksCount.rows[0]?.c ?? 0,
        floorsCount.rows[0]?.c ?? 0,
        unitsCount.rows[0]?.c ?? 0,
        id,
      ]
    );
  } catch (err) {
    console.error('refreshApartmentTotals error:', err);
  }
}

// Blocks Controller
export const getBlocks = async (req, res) => {
  try {
    const { society_id, city, area } = req.query;

    let result;
    if (city && area) {
      // Blocks by city and area (for City → Area → Block selection)
      result = await query(
        `SELECT b.id, b.name, b.society_apartment_id, s.name as society_name
         FROM blocks b
         INNER JOIN apartments s ON b.society_apartment_id = s.id
         WHERE s.city = $1 AND (s.area = $2 OR (s.area IS NULL AND $2 = ''))
         ORDER BY s.name, b.name`,
        [city, area || '']
      );
    } else if (city) {
      result = await query(
        `SELECT b.id, b.name, b.society_apartment_id, s.name as society_name
         FROM blocks b
         INNER JOIN apartments s ON b.society_apartment_id = s.id
         WHERE s.city = $1
         ORDER BY s.name, b.name`,
        [city]
      );
    } else if (society_id) {
      result = await query(
        `SELECT b.*, s.name as society_name
         FROM blocks b
         LEFT JOIN apartments s ON b.society_apartment_id = s.id
         WHERE b.society_apartment_id = $1
         ORDER BY b.name`,
        [society_id]
      );
    } else {
      // If no society_id provided, return all blocks (for super admin)
      result = await query(
        `SELECT b.*, s.name as society_name
         FROM blocks b
         LEFT JOIN apartments s ON b.society_apartment_id = s.id
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

    await refreshApartmentTotals(society_apartment_id);

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

    if (result.rows[0]?.society_apartment_id) {
      await refreshApartmentTotals(result.rows[0].society_apartment_id);
    }

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

/**
 * Get the next floor number for resident floors (1, 2, 3, ...).
 * Ground floor (0) is optional; first resident floor is always 1.
 * Returns next_floor_number (1, 2, 3, ...) and can_add_ground (true if block has no floor 0 yet).
 */
export const getBlockNextFloorNumber = async (req, res) => {
  try {
    const { id: block_id } = req.params;
    if (!block_id) {
      return res.status(400).json({ success: false, message: 'Block ID is required' });
    }
    const maxResult = await query(
      'SELECT COALESCE(MAX(floor_number), 0) AS max_floor FROM floors WHERE block_id = $1',
      [block_id]
    );
    const maxFloor = parseInt(maxResult.rows[0]?.max_floor ?? '0', 10);
    const next_floor_number = maxFloor + 1;
    const groundResult = await query(
      'SELECT 1 FROM floors WHERE block_id = $1 AND floor_number = 0 LIMIT 1',
      [block_id]
    );
    const can_add_ground = groundResult.rows.length === 0;
    res.json({ success: true, data: { next_floor_number, can_add_ground } });
  } catch (error) {
    console.error('Get next floor number error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get next floor number',
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
      `SELECT f.*, b.name as block_name, b.society_apartment_id,
              (SELECT COUNT(*)::int FROM units u WHERE u.floor_id = f.id) AS units_count
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

    const hasBlockId = block_id != null && block_id !== '';
    const floorNum = Number(floor_number);
    const hasFloorNumber = !Number.isNaN(floorNum) && floorNum >= 0;

    if (!hasBlockId || !hasFloorNumber) {
      return res.status(400).json({
        success: false,
        message: 'Block ID and floor number are required (floor number 0 = Ground floor)',
      });
    }

    const existing = await query(
      'SELECT id FROM floors WHERE block_id = $1 AND floor_number = $2',
      [block_id, floorNum]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `A floor with number ${floorNum === 0 ? 'Ground (0)' : floorNum} already exists in this block.`,
      });
    }

    const maxResult = await query(
      'SELECT COALESCE(MAX(floor_number), 0) AS max_floor FROM floors WHERE block_id = $1',
      [block_id]
    );
    const maxFloor = parseInt(maxResult.rows[0]?.max_floor ?? '0', 10);
    const nextResidentFloor = maxFloor + 1;
    const groundExists = await query(
      'SELECT 1 FROM floors WHERE block_id = $1 AND floor_number = 0 LIMIT 1',
      [block_id]
    );
    const canAddGround = groundExists.rows.length === 0;

    const allowed =
      (floorNum === 0 && canAddGround) ||
      floorNum === nextResidentFloor;
    if (!allowed) {
      const msg =
        floorNum === 0
          ? 'Ground floor (0) already exists in this block, or add resident floors in order (1, 2, 3, …) first.'
          : `Resident floors must be added in order. Next floor number is ${nextResidentFloor}.${canAddGround ? ' Ground floor (0) is optional and can be added separately.' : ''}`;
      return res.status(400).json({
        success: false,
        message: msg,
      });
    }

    const result = await query(
      `INSERT INTO floors (block_id, floor_number, total_units)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [block_id, floorNum, total_units || 0]
    );

    const newFloorId = result.rows[0].id;
    const numUnits = Math.max(0, parseInt(total_units, 10) || 0);

    if (numUnits > 0) {
      const blockRow = await query('SELECT society_apartment_id FROM blocks WHERE id = $1', [block_id]);
      const society_apartment_id = blockRow.rows[0]?.society_apartment_id;
      if (society_apartment_id) {
        for (let i = 1; i <= numUnits; i++) {
          await query(
            `INSERT INTO units (
              society_apartment_id, block_id, floor_id, unit_number,
              owner_name, resident_name, contact_number, email,
              k_electric_account, gas_account, water_account, phone_tv_account,
              car_make_model, license_plate, number_of_cars, is_occupied,
              telephone_bills, other_bills
            ) VALUES ($1, $2, $3, $4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, false, '[]'::jsonb, '[]'::jsonb)`,
            [society_apartment_id, block_id, newFloorId, String(i)]
          );
        }
      }
    }

    await refreshBlockTotals(block_id);
    const blockRow = await query('SELECT society_apartment_id FROM blocks WHERE id = $1', [block_id]);
    if (blockRow.rows[0]?.society_apartment_id) {
      await refreshApartmentTotals(blockRow.rows[0].society_apartment_id);
    }

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

export const updateFloor = async (req, res) => {
  try {
    const { id } = req.params;
    const { floor_number, total_units } = req.body;

    const floorNum = floor_number != null ? Number(floor_number) : NaN;
    const hasFloorNumber = !Number.isNaN(floorNum) && floorNum >= 0;

    if (!hasFloorNumber) {
      return res.status(400).json({
        success: false,
        message: 'Floor number is required (0 = Ground floor)',
      });
    }

    const existingRow = await query('SELECT block_id FROM floors WHERE id = $1', [id]);
    if (existingRow.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Floor not found',
      });
    }
    const block_id = existingRow.rows[0].block_id;

    const duplicate = await query(
      'SELECT id FROM floors WHERE block_id = $1 AND floor_number = $2 AND id != $3',
      [block_id, floorNum, id]
    );
    if (duplicate.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `A floor with number ${floorNum === 0 ? 'Ground (0)' : floorNum} already exists in this block.`,
      });
    }

    const result = await query(
      `UPDATE floors SET floor_number = $1, total_units = $2 WHERE id = $3 RETURNING *`,
      [floorNum, total_units != null ? total_units : 0, id]
    );

    await refreshBlockTotals(block_id);
    const blockRow = await query('SELECT society_apartment_id FROM blocks WHERE id = $1', [block_id]);
    if (blockRow.rows[0]?.society_apartment_id) {
      await refreshApartmentTotals(blockRow.rows[0].society_apartment_id);
    }

    res.json({
      success: true,
      message: 'Floor updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update floor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update floor',
      error: error.message,
    });
  }
};

export const deleteFloor = async (req, res) => {
  try {
    const { id } = req.params;

    const unitsCount = await query('SELECT COUNT(*) as c FROM units WHERE floor_id = $1', [id]);
    if (parseInt(unitsCount.rows[0]?.c || '0', 10) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete floor: it has units. Remove or reassign units first.',
      });
    }

    const floorRow = await query('SELECT block_id FROM floors WHERE id = $1', [id]);
    if (floorRow.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Floor not found',
      });
    }
    const society_apartment_id = (
      await query('SELECT society_apartment_id FROM blocks WHERE id = $1', [floorRow.rows[0].block_id])
    ).rows[0]?.society_apartment_id;

    const block_id = floorRow.rows[0].block_id;
    await query('DELETE FROM floors WHERE id = $1', [id]);
    await refreshBlockTotals(block_id);
    if (society_apartment_id) {
      await refreshApartmentTotals(society_apartment_id);
    }

    res.json({
      success: true,
      message: 'Floor deleted successfully',
    });
  } catch (error) {
    console.error('Delete floor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete floor',
      error: error.message,
    });
  }
};

/**
 * Add N unit rows to an existing floor. Units appear on Units page with empty content
 * so union admin can add residents later.
 */
export const addUnitsToFloor = async (req, res) => {
  try {
    const { id: floor_id } = req.params;
    const { count } = req.body;

    const numToAdd = Math.max(0, parseInt(count, 10) || 0);
    if (numToAdd === 0) {
      return res.status(400).json({
        success: false,
        message: 'Count must be a positive number',
      });
    }

    const floorRow = await query(
      'SELECT f.id, f.block_id, f.floor_number, b.society_apartment_id FROM floors f INNER JOIN blocks b ON f.block_id = b.id WHERE f.id = $1',
      [floor_id]
    );
    if (floorRow.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Floor not found',
      });
    }

    const { block_id, society_apartment_id } = floorRow.rows[0];

    const existingUnits = await query(
      'SELECT unit_number FROM units WHERE floor_id = $1 ORDER BY unit_number',
      [floor_id]
    );
    const existingNumbers = new Set((existingUnits.rows || []).map((r) => r.unit_number));
    let nextNum = 1;
    const unitNumbers = [];
    while (unitNumbers.length < numToAdd) {
      const candidate = String(nextNum);
      if (!existingNumbers.has(candidate)) {
        unitNumbers.push(candidate);
        existingNumbers.add(candidate);
      }
      nextNum++;
    }

    for (const unit_number of unitNumbers) {
      await query(
        `INSERT INTO units (
          society_apartment_id, block_id, floor_id, unit_number,
          owner_name, resident_name, contact_number, email,
          k_electric_account, gas_account, water_account, phone_tv_account,
          car_make_model, license_plate, number_of_cars, is_occupied,
          telephone_bills, other_bills
        ) VALUES ($1, $2, $3, $4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, false, '[]'::jsonb, '[]'::jsonb)`,
        [society_apartment_id, block_id, floor_id, unit_number]
      );
    }

    const newTotal = existingUnits.rows.length + unitNumbers.length;
    await query('UPDATE floors SET total_units = $1 WHERE id = $2', [newTotal, floor_id]);

    await refreshBlockTotals(block_id);
    await refreshApartmentTotals(society_apartment_id);

    res.status(201).json({
      success: true,
      message: `${numToAdd} unit(s) added to floor`,
      data: { added: numToAdd },
    });
  } catch (error) {
    console.error('Add units to floor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add units to floor',
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
      LEFT JOIN apartments s ON u.society_apartment_id = s.id
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
       LEFT JOIN apartments s ON u.society_apartment_id = s.id
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

    if (block_id) await refreshBlockTotals(block_id);
    await refreshApartmentTotals(society_apartment_id);

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

    if (result.rows[0]?.block_id) await refreshBlockTotals(result.rows[0].block_id);
    if (result.rows[0]?.society_apartment_id) {
      await refreshApartmentTotals(result.rows[0].society_apartment_id);
    }

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
