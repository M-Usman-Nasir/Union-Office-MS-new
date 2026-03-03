import { query } from '../config/database.js';
import * as auditLog from '../services/auditLogService.js';

/**
 * GET /api/super-admin/escalations – super admin only
 * List complaints that have been escalated (escalated_at IS NOT NULL).
 * Query: page, limit, society_id, resolved (true/false)
 */
export const list = async (req, res) => {
  try {
    const { page = 1, limit = 20, society_id, resolved } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    let sql = `
      SELECT c.id, c.title AS subject, c.description, c.status, c.priority, c.created_at,
             c.society_apartment_id, c.submitted_by, c.unit_id,
             c.escalated_at, c.escalation_reason, c.resolved_by_super_at, c.resolution_notes,
             s.name AS society_name,
             COALESCE(submitter.name, c.submitted_by_name_override) AS submitted_by_name,
             u.unit_number
      FROM complaints c
      LEFT JOIN apartments s ON s.id = c.society_apartment_id
      LEFT JOIN users submitter ON submitter.id = c.submitted_by
      LEFT JOIN units u ON u.id = c.unit_id
      WHERE c.escalated_at IS NOT NULL
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND c.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }
    if (resolved === 'true' || resolved === true) {
      sql += ` AND c.resolved_by_super_at IS NOT NULL`;
    } else if (resolved === 'false' || resolved === false) {
      sql += ` AND c.resolved_by_super_at IS NULL`;
    }

    const countParams = [];
    let c = 0;
    let countFilter = 'WHERE escalated_at IS NOT NULL';
    if (society_id) { c++; countFilter += ` AND society_apartment_id = $${c}`; countParams.push(society_id); }
    if (resolved === 'true' || resolved === true) {
      countFilter += ` AND resolved_by_super_at IS NOT NULL`;
    } else if (resolved === 'false' || resolved === false) {
      countFilter += ` AND resolved_by_super_at IS NULL`;
    }

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM complaints ${countFilter}`,
      countParams
    );
    const total = parseInt(countResult.rows[0]?.total || 0, 10);

    sql += ` ORDER BY c.resolved_by_super_at ASC NULLS FIRST, c.escalated_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limitNum, offset);

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows || [],
      pagination: {
        page: parseInt(page, 10),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('List escalations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch escalations',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/super-admin/escalations/:id/resolve – super admin only
 * Body: { resolution_notes }
 */
export const resolve = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body || {};

    const complaint = await query(
      'SELECT id, escalated_at, society_apartment_id FROM complaints WHERE id = $1',
      [id]
    );
    if (complaint.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    if (!complaint.rows[0].escalated_at) {
      return res.status(400).json({ success: false, message: 'Complaint is not escalated' });
    }

    await query(
      `UPDATE complaints
       SET resolved_by_super_at = CURRENT_TIMESTAMP, resolved_by_super_id = $1, resolution_notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [req.user?.id || null, resolution_notes || null, id]
    );

    await auditLog.log(req, {
      action: 'escalation.resolve',
      resourceType: 'complaint',
      resourceId: id,
      societyId: complaint.rows[0].society_apartment_id,
      details: { resolution_notes: resolution_notes || null },
    });

    res.json({
      success: true,
      message: 'Escalation resolved',
      data: { id: parseInt(id, 10), resolved_by_super_at: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Resolve escalation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve escalation',
      error: error.message,
    });
  }
};
