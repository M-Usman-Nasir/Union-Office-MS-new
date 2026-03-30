import { query } from '../config/database.js';
import { getScopedSocietyId } from '../utils/multiUiContext.js';

// List union members for the current union_admin's society only
export const getAll = async (req, res) => {
  try {
    const societyId = await getScopedSocietyId(req);
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned. Only union admins with an assigned society can manage union members.',
      });
    }

    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT m.id, m.member_name, m.designation, m.phone, m.email, m.joining_date,
             m.unit_id, m.society_apartment_id, m.created_by, m.created_at, m.updated_at,
             u.unit_number
      FROM union_members m
      LEFT JOIN units u ON u.id = m.unit_id
      WHERE m.society_apartment_id = $1
    `;
    const params = [societyId];
    let paramCount = 1;

    if (search && search.trim()) {
      paramCount++;
      sql += ` AND (
        m.member_name ILIKE $${paramCount} OR
        m.designation ILIKE $${paramCount} OR
        m.phone ILIKE $${paramCount} OR
        m.email ILIKE $${paramCount} OR
        u.unit_number::text ILIKE $${paramCount}
      )`;
      params.push(`%${search.trim()}%`);
    }

    sql += ` ORDER BY m.member_name ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    let countSql = `
      SELECT COUNT(*) FROM union_members m
      LEFT JOIN units u ON u.id = m.unit_id
      WHERE m.society_apartment_id = $1
    `;
    const countParams = [societyId];
    let countParamCount = 1;
    if (search && search.trim()) {
      countParamCount++;
      countSql += ` AND (
        m.member_name ILIKE $${countParamCount} OR
        m.designation ILIKE $${countParamCount} OR
        m.phone ILIKE $${countParamCount} OR
        m.email ILIKE $${countParamCount} OR
        u.unit_number::text ILIKE $${countParamCount}
      )`;
      countParams.push(`%${search.trim()}%`);
    }
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    const rows = result.rows.map((row) => ({
      id: row.id,
      member_name: row.member_name,
      designation: row.designation,
      phone: row.phone,
      email: row.email,
      joining_date: row.joining_date,
      unit_id: row.unit_id,
      unit_number: row.unit_number,
      society_apartment_id: row.society_apartment_id,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Union members getAll error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch union members',
      error: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const societyId = await getScopedSocietyId(req);
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned.',
      });
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid union member id' });
    }

    const result = await query(
      `SELECT m.id, m.member_name, m.designation, m.phone, m.email, m.joining_date,
              m.unit_id, m.society_apartment_id, m.created_by, m.created_at, m.updated_at,
              u.unit_number
       FROM union_members m
       LEFT JOIN units u ON u.id = m.unit_id
       WHERE m.id = $1 AND m.society_apartment_id = $2`,
      [id, societyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Union member not found',
      });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        member_name: row.member_name,
        designation: row.designation,
        phone: row.phone,
        email: row.email,
        joining_date: row.joining_date,
        unit_id: row.unit_id,
        unit_number: row.unit_number,
        society_apartment_id: row.society_apartment_id,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    });
  } catch (error) {
    console.error('Union members getById error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch union member',
      error: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const societyId = await getScopedSocietyId(req);
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned. Only union admins with an assigned society can add union members.',
      });
    }

    const { member_name, designation, phone, email, joining_date, unit_id } = req.body;
    if (!member_name || !member_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Member name is required',
      });
    }

    const result = await query(
      `INSERT INTO union_members (member_name, designation, phone, email, joining_date, unit_id, society_apartment_id, created_by)
       VALUES ($1, $2, $3, $4, $5::DATE, $6, $7, $8)
       RETURNING id, member_name, designation, phone, email, joining_date, unit_id, society_apartment_id, created_by, created_at`,
      [
        member_name.trim(),
        designation || null,
        phone || null,
        email || null,
        joining_date || null,
        unit_id || null,
        societyId,
        req.user.id,
      ]
    );

    const row = result.rows[0];
    res.status(201).json({
      success: true,
      message: 'Union member created successfully',
      data: row,
    });
  } catch (error) {
    console.error('Union members create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create union member',
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const societyId = await getScopedSocietyId(req);
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned.',
      });
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid union member id' });
    }

    const { member_name, designation, phone, email, joining_date, unit_id } = req.body;

    const existing = await query(
      'SELECT id FROM union_members WHERE id = $1 AND society_apartment_id = $2',
      [id, societyId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Union member not found',
      });
    }

    const result = await query(
      `UPDATE union_members SET
         member_name = COALESCE($1, member_name),
         designation = COALESCE($2, designation),
         phone = COALESCE($3, phone),
         email = COALESCE($4, email),
         joining_date = COALESCE($5::DATE, joining_date),
         unit_id = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND society_apartment_id = $8
       RETURNING id, member_name, designation, phone, email, joining_date, unit_id, society_apartment_id, updated_at`,
      [
        member_name !== undefined && member_name !== '' ? member_name : null,
        designation !== undefined ? designation : null,
        phone !== undefined ? phone : null,
        email !== undefined ? email : null,
        joining_date || null,
        unit_id === '' || unit_id === undefined ? null : unit_id,
        id,
        societyId,
      ]
    );

    res.json({
      success: true,
      message: 'Union member updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Union members update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update union member',
      error: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const societyId = await getScopedSocietyId(req);
    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: 'No society assigned.',
      });
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid union member id' });
    }

    const result = await query(
      'DELETE FROM union_members WHERE id = $1 AND society_apartment_id = $2 RETURNING id',
      [id, societyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Union member not found',
      });
    }

    res.json({
      success: true,
      message: 'Union member deleted successfully',
    });
  } catch (error) {
    console.error('Union members remove error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete union member',
      error: error.message,
    });
  }
};
