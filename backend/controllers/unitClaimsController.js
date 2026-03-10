import { query } from '../config/database.js';

const PENDING = 'pending';
const APPROVED = 'approved';
const REJECTED = 'rejected';

/**
 * Resident: create or replace own claim (one claim per user; must be resident; unit must be in resident's society if they have one).
 */
export const createClaim = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can submit unit claims',
      });
    }

    const { unit_id } = req.body;
    if (!unit_id) {
      return res.status(400).json({
        success: false,
        message: 'unit_id is required',
      });
    }

    const unitId = parseInt(unit_id, 10);
    if (Number.isNaN(unitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unit_id',
      });
    }

    const unitRow = await query(
      'SELECT id, society_apartment_id FROM units WHERE id = $1',
      [unitId]
    );
    if (unitRow.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
    }
    const societyId = unitRow.rows[0].society_apartment_id;

    const userRow = await query(
      'SELECT id, society_apartment_id, unit_id FROM users WHERE id = $1',
      [userId]
    );
    const userSocietyId = userRow.rows[0]?.society_apartment_id;
    if (userSocietyId != null && userSocietyId !== societyId) {
      return res.status(400).json({
        success: false,
        message: 'You can only request a unit in your assigned society',
      });
    }

    if (userRow.rows[0]?.unit_id != null) {
      return res.status(400).json({
        success: false,
        message: 'You are already linked to a unit. Contact admin to change.',
      });
    }

    const existing = await query(
      'SELECT id, status FROM unit_claims WHERE user_id = $1',
      [userId]
    );
    if (existing.rows.length > 0) {
      if (existing.rows[0].status === PENDING) {
        return res.status(400).json({
          success: false,
          message: 'You already have a pending claim. Wait for admin review.',
        });
      }
      await query(
        `UPDATE unit_claims SET unit_id = $1, society_apartment_id = $2, status = $3, notes = NULL, reviewed_at = NULL, reviewed_by = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = $4`,
        [unitId, societyId, PENDING, userId]
      );
    } else {
      await query(
        `INSERT INTO unit_claims (user_id, unit_id, society_apartment_id, status) VALUES ($1, $2, $3, $4)`,
        [userId, unitId, societyId, PENDING]
      );
    }

    const result = await query(
      `SELECT c.*, u.unit_number, b.name AS block_name, s.name AS society_name
       FROM unit_claims c
       JOIN units u ON u.id = c.unit_id
       LEFT JOIN blocks b ON b.id = u.block_id
       LEFT JOIN apartments s ON s.id = c.society_apartment_id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'Unit claim submitted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create unit claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit claim',
      error: error.message,
    });
  }
};

/**
 * Resident: get my claim (if any).
 */
export const getMyClaim = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (req.user?.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can view their unit claim',
      });
    }

    const result = await query(
      `SELECT c.*, u.unit_number, u.block_id, b.name AS block_name, s.name AS society_name
       FROM unit_claims c
       JOIN units u ON u.id = c.unit_id
       LEFT JOIN blocks b ON b.id = u.block_id
       LEFT JOIN apartments s ON s.id = c.society_apartment_id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error('Get my unit claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim',
      error: error.message,
    });
  }
};

/**
 * Union Admin / Super Admin: list claims (union_admin scoped to their society).
 */
export const getAllClaims = async (req, res) => {
  try {
    const role = req.user?.role;
    const societyId = req.user?.society_apartment_id;
    const status = req.query.status; // optional filter: pending, approved, rejected

    let sql = `
      SELECT c.id, c.user_id, c.unit_id, c.society_apartment_id, c.status, c.notes, c.created_at, c.reviewed_at,
             u.unit_number, b.name AS block_name, s.name AS society_name,
             usr.name AS requester_name, usr.email AS requester_email
      FROM unit_claims c
      JOIN units u ON u.id = c.unit_id
      LEFT JOIN blocks b ON b.id = u.block_id
      LEFT JOIN apartments s ON s.id = c.society_apartment_id
      JOIN users usr ON usr.id = c.user_id
      WHERE 1=1
    `;
    const params = [];
    let n = 0;

    if (role === 'union_admin') {
      if (societyId == null) {
        return res.json({ success: true, data: [] });
      }
      n++;
      sql += ` AND c.society_apartment_id = $${n}`;
      params.push(societyId);
    }

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      n++;
      sql += ` AND c.status = $${n}`;
      params.push(status);
    }

    sql += ' ORDER BY c.created_at DESC';

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get unit claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claims',
      error: error.message,
    });
  }
};

/**
 * Union Admin / Super Admin: approve claim → set user's unit_id and society_apartment_id, mark claim approved.
 */
export const approveClaim = async (req, res) => {
  try {
    const claimId = parseInt(req.params.id, 10);
    const reviewerId = req.user?.id;
    const role = req.user?.role;
    const societyId = req.user?.society_apartment_id;

    const claimRow = await query(
      `SELECT c.id, c.user_id, c.unit_id, c.society_apartment_id, c.status
       FROM unit_claims c WHERE c.id = $1`,
      [claimId]
    );
    if (claimRow.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }
    const claim = claimRow.rows[0];
    if (claim.status !== PENDING) {
      return res.status(400).json({
        success: false,
        message: 'This claim has already been processed',
      });
    }
    if (role === 'union_admin' && claim.society_apartment_id !== societyId) {
      return res.status(403).json({
        success: false,
        message: 'You can only approve claims for your society',
      });
    }

    await query(
      `UPDATE users SET unit_id = $1, society_apartment_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [claim.unit_id, claim.society_apartment_id, claim.user_id]
    );
    await query(
      `UPDATE unit_claims SET status = $1, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [APPROVED, reviewerId, claimId]
    );

    res.json({
      success: true,
      message: 'Claim approved; resident has been linked to the unit',
      data: { user_id: claim.user_id, unit_id: claim.unit_id },
    });
  } catch (error) {
    console.error('Approve unit claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve claim',
      error: error.message,
    });
  }
};

/**
 * Union Admin / Super Admin: reject claim (optional notes).
 */
export const rejectClaim = async (req, res) => {
  try {
    const claimId = parseInt(req.params.id, 10);
    const reviewerId = req.user?.id;
    const role = req.user?.role;
    const societyId = req.user?.society_apartment_id;
    const notes = req.body?.notes ? String(req.body.notes).trim() : null;

    const claimRow = await query(
      'SELECT id, society_apartment_id, status FROM unit_claims WHERE id = $1',
      [claimId]
    );
    if (claimRow.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }
    const claim = claimRow.rows[0];
    if (claim.status !== PENDING) {
      return res.status(400).json({
        success: false,
        message: 'This claim has already been processed',
      });
    }
    if (role === 'union_admin' && claim.society_apartment_id !== societyId) {
      return res.status(403).json({
        success: false,
        message: 'You can only reject claims for your society',
      });
    }

    await query(
      `UPDATE unit_claims SET status = $1, notes = $2, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
      [REJECTED, notes, reviewerId, claimId]
    );

    res.json({
      success: true,
      message: 'Claim rejected',
      data: { id: claimId },
    });
  } catch (error) {
    console.error('Reject unit claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject claim',
      error: error.message,
    });
  }
};
