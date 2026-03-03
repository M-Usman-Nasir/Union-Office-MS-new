import { query } from '../config/database.js';

// Get all residents
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, society_id, unit_id, block_id, floor_id } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT r.*, u.unit_number, u.owner_name, u.block_id, u.floor_id, f.floor_number, s.name as society_name,
             EXISTS (SELECT 1 FROM defaulters d WHERE d.unit_id = r.unit_id AND (d.status IS NULL OR d.status = 'active')) AS is_defaulter
      FROM users r
      LEFT JOIN units u ON r.unit_id = u.id
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN apartments s ON r.society_apartment_id = s.id
      WHERE r.role IN ('resident', 'union_admin')
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND r.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (unit_id) {
      paramCount++;
      sql += ` AND r.unit_id = $${paramCount}`;
      params.push(unit_id);
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

    if (search) {
      paramCount++;
      sql += ` AND (r.name ILIKE $${paramCount} OR r.email ILIKE $${paramCount} OR r.contact_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY r.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count (join units when filtering by block_id / floor_id)
    let countSql = `
      SELECT COUNT(*) FROM users r
      LEFT JOIN units u ON r.unit_id = u.id
      WHERE r.role IN ('resident', 'union_admin')
    `;
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND r.society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }

    if (unit_id) {
      countParamCount++;
      countSql += ` AND r.unit_id = $${countParamCount}`;
      countParams.push(unit_id);
    }

    if (block_id) {
      countParamCount++;
      countSql += ` AND u.block_id = $${countParamCount}`;
      countParams.push(block_id);
    }

    if (floor_id) {
      countParamCount++;
      countSql += ` AND u.floor_id = $${countParamCount}`;
      countParams.push(floor_id);
    }

    if (search) {
      countParamCount++;
      countSql += ` AND (r.name ILIKE $${countParamCount} OR r.email ILIKE $${countParamCount} OR r.contact_number ILIKE $${countParamCount})`;
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
    console.error('Get residents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch residents',
      error: error.message,
    });
  }
};

// Get resident by ID (with unit utility/car fields and defaulter status)
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT r.*,
         u.unit_number, u.owner_name,
         u.k_electric_account, u.gas_account, u.water_account, u.phone_tv_account,
         u.telephone_bills, u.other_bills,
         u.car_make_model, u.license_plate, u.number_of_cars,
         u.bike_make_model, u.bike_license_plate, u.number_of_bikes,
         s.name as society_name,
         d.status as defaulter_status,
         d.amount_due as defaulter_amount_due,
         d.months_overdue as defaulter_months_overdue
       FROM users r
       LEFT JOIN units u ON r.unit_id = u.id
       LEFT JOIN apartments s ON r.society_apartment_id = s.id
       LEFT JOIN LATERAL (
         SELECT status, amount_due, months_overdue
         FROM defaulters
         WHERE unit_id = r.unit_id
         ORDER BY created_at DESC
         LIMIT 1
       ) d ON true
       WHERE r.id = $1 AND r.role IN ('resident', 'union_admin')`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resident',
      error: error.message,
    });
  }
};

// Create resident
export const create = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      society_apartment_id,
      unit_id,
      cnic,
      contact_number,
      emergency_contact,
      move_in_date,
      number_of_cars,
      number_of_bikes,
      car_make_model,
      license_plate,
      bike_make_model,
      bike_license_plate,
    } = req.body;

    if (!email || !name || !society_apartment_id) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, and society_apartment_id are required',
      });
    }

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password if provided
    const bcrypt = await import('bcryptjs');
    const hashedPassword = password ? await bcrypt.default.hash(password, 10) : null;

    const result = await query(
      `INSERT INTO users (email, password, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, created_by)
       VALUES ($1, $2, $3, 'resident', $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, email, name, role, society_apartment_id, unit_id, created_at`,
      [
        email.toLowerCase(),
        hashedPassword,
        name,
        society_apartment_id,
        unit_id || null,
        cnic || null,
        contact_number || null,
        emergency_contact || null,
        move_in_date || null,
        req.user.id,
      ]
    );

    // If unit_id is set and vehicle fields provided, update the unit
    const unitId = result.rows[0]?.unit_id;
    if (unitId && (
      number_of_cars !== undefined ||
      number_of_bikes !== undefined ||
      car_make_model !== undefined ||
      license_plate !== undefined ||
      bike_make_model !== undefined ||
      bike_license_plate !== undefined
    )) {
      const unitUpdates = [];
      const unitParams = [];
      let paramCount = 0;
      if (number_of_cars !== undefined) {
        paramCount++;
        unitUpdates.push(`number_of_cars = $${paramCount}::integer`);
        unitParams.push(number_of_cars ?? 0);
      }
      if (number_of_bikes !== undefined) {
        paramCount++;
        unitUpdates.push(`number_of_bikes = $${paramCount}::integer`);
        unitParams.push(number_of_bikes ?? 0);
      }
      if (car_make_model !== undefined) {
        paramCount++;
        unitUpdates.push(`car_make_model = $${paramCount}::varchar`);
        unitParams.push(car_make_model || null);
      }
      if (license_plate !== undefined) {
        paramCount++;
        unitUpdates.push(`license_plate = $${paramCount}::varchar`);
        unitParams.push(license_plate || null);
      }
      if (bike_make_model !== undefined) {
        paramCount++;
        unitUpdates.push(`bike_make_model = $${paramCount}::varchar`);
        unitParams.push(bike_make_model || null);
      }
      if (bike_license_plate !== undefined) {
        paramCount++;
        unitUpdates.push(`bike_license_plate = $${paramCount}::varchar`);
        unitParams.push(bike_license_plate || null);
      }
      if (unitUpdates.length > 0) {
        paramCount++;
        unitUpdates.push('updated_at = CURRENT_TIMESTAMP');
        unitParams.push(unitId);
        await query(
          `UPDATE units SET ${unitUpdates.join(', ')} WHERE id = $${paramCount}`,
          unitParams
        ).catch((err) => console.warn('Unit vehicle update after create:', err.message));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Resident created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resident',
      error: error.message,
    });
  }
};

// Update resident
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      society_apartment_id,
      unit_id,
      cnic,
      contact_number,
      emergency_contact,
      move_in_date,
      owner_name,
      license_plate,
      number_of_cars,
      number_of_bikes,
      car_make_model,
      bike_make_model,
      bike_license_plate,
      telephone_bills,
      other_bills
    } = req.body;

    const existing = await query('SELECT id, unit_id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found',
      });
    }

    // Update user record
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           society_apartment_id = COALESCE($2, society_apartment_id),
           unit_id = COALESCE($3, unit_id),
           cnic = COALESCE($4, cnic),
           contact_number = COALESCE($5, contact_number),
           emergency_contact = COALESCE($6, emergency_contact),
           move_in_date = COALESCE($7, move_in_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, email, name, role, society_apartment_id, unit_id, updated_at`,
      [name, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, id]
    );

    // Update unit record if unit_id exists and additional fields are provided
    const finalUnitId = unit_id || existing.rows[0].unit_id;
    if (finalUnitId && (
      owner_name !== undefined ||
      license_plate !== undefined ||
      number_of_cars !== undefined ||
      number_of_bikes !== undefined ||
      car_make_model !== undefined ||
      bike_make_model !== undefined ||
      bike_license_plate !== undefined ||
      telephone_bills !== undefined ||
      other_bills !== undefined
    )) {
      try {
        // Build dynamic update query for unit
        const unitUpdates = [];
        const unitParams = [];
        let paramCount = 0;

        if (owner_name !== undefined) {
          paramCount++;
          unitUpdates.push(`owner_name = $${paramCount}`);
          unitParams.push(owner_name);
        }

        if (license_plate !== undefined) {
          paramCount++;
          unitUpdates.push(`license_plate = $${paramCount}`);
          unitParams.push(license_plate);
        }

        if (number_of_cars !== undefined) {
          paramCount++;
          unitUpdates.push(`number_of_cars = $${paramCount}::integer`);
          unitParams.push(number_of_cars ?? 0);
        }
        if (number_of_bikes !== undefined) {
          paramCount++;
          unitUpdates.push(`number_of_bikes = $${paramCount}::integer`);
          unitParams.push(number_of_bikes ?? 0);
        }
        if (car_make_model !== undefined) {
          paramCount++;
          unitUpdates.push(`car_make_model = $${paramCount}::varchar`);
          unitParams.push(car_make_model || null);
        }
        if (bike_make_model !== undefined) {
          paramCount++;
          unitUpdates.push(`bike_make_model = $${paramCount}::varchar`);
          unitParams.push(bike_make_model || null);
        }
        if (bike_license_plate !== undefined) {
          paramCount++;
          unitUpdates.push(`bike_license_plate = $${paramCount}::varchar`);
          unitParams.push(bike_license_plate || null);
        }

        // Handle JSONB fields
        if (telephone_bills !== undefined) {
          paramCount++;
          unitUpdates.push(`telephone_bills = $${paramCount}::jsonb`);
          unitParams.push(JSON.stringify(telephone_bills));
        }

        if (other_bills !== undefined) {
          paramCount++;
          unitUpdates.push(`other_bills = $${paramCount}::jsonb`);
          unitParams.push(JSON.stringify(other_bills));
        }

        if (unitUpdates.length > 0) {
          paramCount++;
          unitUpdates.push(`updated_at = CURRENT_TIMESTAMP`);
          unitParams.push(finalUnitId);

          await query(
            `UPDATE units 
             SET ${unitUpdates.join(', ')}
             WHERE id = $${paramCount}`,
            unitParams
          ).catch(err => {
            // If columns don't exist, log warning but don't fail
            console.warn('Failed to update unit fields (columns may not exist):', err.message);
          });
        }
      } catch (error) {
        // Log but don't fail the request if unit update fails
        console.warn('Unit update error (columns may not exist):', error.message);
      }
    }

    res.json({
      success: true,
      message: 'Resident updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resident',
      error: error.message,
    });
  }
};

// Delete resident
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 AND role IN (\'resident\', \'union_admin\') RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found',
      });
    }

    res.json({
      success: true,
      message: 'Resident deleted successfully',
    });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resident',
      error: error.message,
    });
  }
};
