import { query } from '../config/database.js';
import { sendNewComplaintNotificationToAdmin } from '../services/emailService.js';
import * as activity from '../services/activityService.js';

// Get all complaints
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, status, priority, assigned_to, has_feedback } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT c.*,
             COALESCE(u.unit_number, (SELECT u2.unit_number FROM users u0 JOIN units u2 ON u2.id = u0.unit_id WHERE u0.id = c.submitted_by LIMIT 1)) AS unit_number,
             s.name as society_name,
             COALESCE(submitter.name, c.submitted_by_name_override) as submitted_by_name, assignee.name as assigned_to_name
      FROM complaints c
      LEFT JOIN units u ON c.unit_id = u.id
      LEFT JOIN apartments s ON c.society_apartment_id = s.id
      LEFT JOIN users submitter ON c.submitted_by = submitter.id
      LEFT JOIN users assignee ON c.assigned_to = assignee.id
      WHERE 1=1 AND c.deleted_at IS NULL
    `;
    const params = [];
    let paramCount = 0;

    // Residents can see their own complaints and public complaints only when assigned to a society
    if (req.user.role === 'resident') {
      if (!req.user.society_apartment_id) {
        const limitNum = Number(limit) || 10;
        return res.json({
          success: true,
          data: [],
          pagination: { page: 1, limit: limitNum, total: 0, pages: 0 },
        });
      }
      paramCount++;
      sql += ` AND (c.submitted_by = $${paramCount} OR c.is_public = true)`;
      params.push(req.user.id);
    }

    if (society_id) {
      paramCount++;
      sql += ` AND c.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      sql += ` AND c.priority = $${paramCount}`;
      params.push(priority);
    }

    if (assigned_to) {
      paramCount++;
      sql += ` AND c.assigned_to = $${paramCount}`;
      params.push(assigned_to);
    }

    if (has_feedback === 'yes' || has_feedback === 'true' || has_feedback === '1') {
      sql += ' AND c.feedback_rating IS NOT NULL';
    } else if (has_feedback === 'no' || has_feedback === 'false' || has_feedback === '0') {
      sql += ' AND c.feedback_rating IS NULL';
    }

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM complaints WHERE deleted_at IS NULL';
    const countParams = [];
    let countParamCount = 0;

    if (req.user.role === 'resident') {
      countParamCount++;
      countSql += ` AND (submitted_by = $${countParamCount} OR is_public = true)`;
      countParams.push(req.user.id);
    }
    if (society_id) {
      countParamCount++;
      countSql += ` AND society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (status) {
      countParamCount++;
      countSql += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }
    if (priority) {
      countParamCount++;
      countSql += ` AND priority = $${countParamCount}`;
      countParams.push(priority);
    }
    if (assigned_to) {
      countParamCount++;
      countSql += ` AND assigned_to = $${countParamCount}`;
      countParams.push(assigned_to);
    }
    if (has_feedback === 'yes' || has_feedback === 'true' || has_feedback === '1') {
      countSql += ' AND feedback_rating IS NOT NULL';
    } else if (has_feedback === 'no' || has_feedback === 'false' || has_feedback === '0') {
      countSql += ' AND feedback_rating IS NULL';
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
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
};

// Get complaint statistics (pending, resolved, total) for admin dashboard cards
export const getStatistics = async (req, res) => {
  try {
    const { society_id } = req.query;

    let whereClause = 'WHERE deleted_at IS NULL';
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      whereClause += ` AND society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    const [pendingResult, resolvedResult, totalResult] = await Promise.all([
      query(
        `SELECT COUNT(*) AS count FROM complaints ${whereClause} AND status IN ('pending', 'in_progress')`,
        params
      ),
      query(
        `SELECT COUNT(*) AS count FROM complaints ${whereClause} AND status IN ('resolved', 'closed')`,
        params
      ),
      query(`SELECT COUNT(*) AS count FROM complaints ${whereClause}`, params),
    ]);

    res.json({
      success: true,
      data: {
        pending: parseInt(pendingResult.rows[0]?.count || 0, 10),
        resolved: parseInt(resolvedResult.rows[0]?.count || 0, 10),
        total: parseInt(totalResult.rows[0]?.count || 0, 10),
      },
    });
  } catch (error) {
    console.error('Get complaint statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint statistics',
      error: error.message,
    });
  }
};

// Get complaint by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT c.*,
              COALESCE(u.unit_number, (SELECT u2.unit_number FROM users u0 JOIN units u2 ON u2.id = u0.unit_id WHERE u0.id = c.submitted_by LIMIT 1)) AS unit_number,
              s.name as society_name,
              COALESCE(submitter.name, c.submitted_by_name_override) as submitted_by_name, assignee.name as assigned_to_name
       FROM complaints c
       LEFT JOIN units u ON c.unit_id = u.id
       LEFT JOIN apartments s ON c.society_apartment_id = s.id
       LEFT JOIN users submitter ON c.submitted_by = submitter.id
       LEFT JOIN users assignee ON c.assigned_to = assignee.id
       WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if resident is trying to access someone else's complaint
    if (req.user.role === 'resident' && result.rows[0].submitted_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message,
    });
  }
};

// Create complaint
export const create = async (req, res) => {
  try {
    if (req.user.role === 'resident' && !req.user.society_apartment_id) {
      return res.status(403).json({
        success: false,
        message: 'You must be added to a society by an administrator before you can submit a complaint.',
      });
    }

    const { unit_id, society_apartment_id, title, subject, description, priority, is_public, type, remarks, submitted_by, submitted_by_name_override } = req.body;
    const complaintTitle = title || subject;

    if (!society_apartment_id || !complaintTitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Society ID, title (or subject), and description are required',
      });
    }

    let effectiveSubmittedBy = req.user.id;
    let effectiveUnitId = unit_id != null && unit_id !== '' ? unit_id : (req.user.role === 'resident' ? req.user.unit_id : null);
    let effectiveSubmittedByNameOverride = null;

    // Union admin (or super_admin) can record a complaint on behalf of a resident or walk-in
    if (req.user.role === 'union_admin' || req.user.role === 'super_admin') {
      const overrideName = (submitted_by_name_override || '').trim();
      if (submitted_by != null && submitted_by !== '') {
        const residentRow = await query(
          'SELECT id, unit_id FROM users WHERE id = $1 AND role IN (\'resident\', \'union_admin\') AND society_apartment_id = $2',
          [submitted_by, society_apartment_id]
        );
        if (residentRow.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid resident or resident does not belong to this society',
          });
        }
        effectiveSubmittedBy = parseInt(submitted_by, 10);
        if (effectiveUnitId == null || effectiveUnitId === '') {
          effectiveUnitId = residentRow.rows[0].unit_id || null;
        }
      } else if (overrideName) {
        effectiveSubmittedBy = null;
        effectiveSubmittedByNameOverride = overrideName;
        effectiveUnitId = effectiveUnitId || null;
      }
    }

    const result = await query(
      `INSERT INTO complaints (unit_id, society_apartment_id, submitted_by, submitted_by_name_override, title, description, priority, is_public, status, type, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10)
       RETURNING *`,
      [
        effectiveUnitId || null,
        society_apartment_id,
        effectiveSubmittedBy,
        effectiveSubmittedByNameOverride,
        complaintTitle,
        description,
        priority || 'medium',
        is_public || false,
        type || null,
        remarks || null,
      ]
    );

    // Notify union admin(s) by email (do not block response) — only when resident submits (not when admin records)
    const residentNameForEmail = effectiveSubmittedBy === req.user.id
      ? (req.user.name || req.user.email)
      : (effectiveSubmittedByNameOverride || (effectiveSubmittedBy ? 'Resident' : 'Walk-in'));
    (async () => {
      try {
        const admins = await query(
          'SELECT email FROM users WHERE society_apartment_id = $1 AND role = $2 AND is_active = true',
          [society_apartment_id, 'union_admin']
        );
        const society = await query('SELECT name FROM apartments WHERE id = $1', [society_apartment_id]);
        const toEmails = admins.rows.map((r) => r.email).filter(Boolean);
        if (toEmails.length > 0 && effectiveSubmittedBy !== null) {
          await sendNewComplaintNotificationToAdmin({
            toEmails,
            residentName: residentNameForEmail,
            complaintTitle,
            complaintId: result.rows[0].id,
            societyName: society.rows[0]?.name,
          });
        }
      } catch (e) {
        console.warn('Complaint notification email failed:', e.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'complaint.create',
      resourceType: 'complaint',
      resourceId: result.rows[0]?.id,
      societyId: society_apartment_id,
      details: { priority: priority || 'medium' },
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: error.message,
    });
  }
};

// Create complaint with file attachments (multipart/form-data)
export const createWithAttachments = async (req, res) => {
  try {
    if (req.user.role === 'resident' && !req.user.society_apartment_id) {
      return res.status(403).json({
        success: false,
        message: 'You must be added to a society by an administrator before you can submit a complaint.',
      });
    }

    const { unit_id, society_apartment_id, title, subject, description, priority, is_public, type, remarks, submitted_by, submitted_by_name_override } = req.body;
    const complaintTitle = title || subject;

    if (!society_apartment_id || !complaintTitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Society ID, title (or subject), and description are required',
      });
    }

    let effectiveSubmittedBy = req.user.id;
    let effectiveUnitId = unit_id != null && unit_id !== '' ? unit_id : (req.user.role === 'resident' ? req.user.unit_id : null);
    let effectiveSubmittedByNameOverride = null;

    if (req.user.role === 'union_admin' || req.user.role === 'super_admin') {
      const overrideName = (submitted_by_name_override || '').trim();
      if (submitted_by != null && submitted_by !== '') {
        const residentRow = await query(
          'SELECT id, unit_id FROM users WHERE id = $1 AND role IN (\'resident\', \'union_admin\') AND society_apartment_id = $2',
          [submitted_by, society_apartment_id]
        );
        if (residentRow.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid resident or resident does not belong to this society',
          });
        }
        effectiveSubmittedBy = parseInt(submitted_by, 10);
        if (effectiveUnitId == null || effectiveUnitId === '') {
          effectiveUnitId = residentRow.rows[0].unit_id || null;
        }
      } else if (overrideName) {
        effectiveSubmittedBy = null;
        effectiveSubmittedByNameOverride = overrideName;
        effectiveUnitId = effectiveUnitId || null;
      }
    }

    const attachmentPaths = (req.files || []).map((f) => `/uploads/complaints/${f.filename}`);

    const result = await query(
      `INSERT INTO complaints (unit_id, society_apartment_id, submitted_by, submitted_by_name_override, title, description, priority, is_public, status, attachments, type, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10, $11)
       RETURNING *`,
      [
        effectiveUnitId || null,
        society_apartment_id,
        effectiveSubmittedBy,
        effectiveSubmittedByNameOverride,
        complaintTitle,
        description,
        priority || 'medium',
        is_public === 'true' || is_public === true,
        attachmentPaths.length > 0 ? attachmentPaths : null,
        type || null,
        remarks || null,
      ]
    );

    // Notify union admin(s) by email — only when resident submits
    const residentNameForEmail = effectiveSubmittedBy === req.user.id
      ? (req.user.name || req.user.email)
      : (effectiveSubmittedByNameOverride || (effectiveSubmittedBy ? 'Resident' : 'Walk-in'));
    (async () => {
      try {
        const admins = await query(
          'SELECT email FROM users WHERE society_apartment_id = $1 AND role = $2 AND is_active = true',
          [society_apartment_id, 'union_admin']
        );
        const society = await query('SELECT name FROM apartments WHERE id = $1', [society_apartment_id]);
        const toEmails = admins.rows.map((r) => r.email).filter(Boolean);
        if (toEmails.length > 0 && effectiveSubmittedBy !== null) {
          await sendNewComplaintNotificationToAdmin({
            toEmails,
            residentName: residentNameForEmail,
            complaintTitle,
            complaintId: result.rows[0].id,
            societyName: society.rows[0]?.name,
          });
        }
      } catch (e) {
        console.warn('Complaint notification email failed:', e.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'complaint.create',
      resourceType: 'complaint',
      resourceId: result.rows[0]?.id,
      societyId: society_apartment_id,
      details: { with_attachments: true },
    });
  } catch (error) {
    console.error('Create complaint with attachments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: error.message,
    });
  }
};

// Update complaint
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, assigned_to, is_public } = req.body;

    const existing = await query('SELECT * FROM complaints WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Residents can only update their own complaints (limited fields)
    if (req.user.role === 'resident') {
      if (existing.rows[0].submitted_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own complaints',
        });
      }
      // Residents can only update title, description, priority
      const result = await query(
        `UPDATE complaints 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             priority = COALESCE($3, priority),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [title, description, priority, id]
      );

      return res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: result.rows[0],
      });
    }

    // Admins can update all fields
    const result = await query(
      `UPDATE complaints 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           status = COALESCE($4, status),
           assigned_to = COALESCE($5, assigned_to),
           is_public = COALESCE($6, is_public),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, priority, status, assigned_to, is_public, id]
    );

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'complaint.update',
      resourceType: 'complaint',
      resourceId: id,
      societyId: result.rows[0]?.society_apartment_id,
      details: { fields: Object.keys(req.body || {}) },
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: error.message,
    });
  }
};

// Update complaint status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, in_progress, resolved, or closed',
      });
    }

    const result = await query(
      `UPDATE complaints 
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'complaint.status_update',
      resourceType: 'complaint',
      resourceId: id,
      societyId: result.rows[0]?.society_apartment_id,
      details: { status },
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message,
    });
  }
};

// Resident feedback after complaint resolution/closure
export const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const rawRating = req.body?.feedback_rating;
    const feedbackCommentRaw = req.body?.feedback_comment;
    const feedbackRating = Number(rawRating);
    const feedbackComment = typeof feedbackCommentRaw === 'string' ? feedbackCommentRaw.trim() : null;

    if (!Number.isInteger(feedbackRating) || feedbackRating < 1 || feedbackRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'feedback_rating is required and must be an integer between 1 and 5',
      });
    }

    if (feedbackComment && feedbackComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'feedback_comment must be 1000 characters or fewer',
      });
    }

    const complaintResult = await query(
      `SELECT id, submitted_by, status, society_apartment_id
       FROM complaints
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (complaintResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const complaint = complaintResult.rows[0];
    if (complaint.submitted_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit feedback for your own complaint',
      });
    }

    if (!['resolved', 'closed'].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted after complaint is resolved or closed',
      });
    }

    const updated = await query(
      `UPDATE complaints
       SET feedback_rating = $1,
           feedback_comment = $2,
           feedback_submitted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND deleted_at IS NULL
       RETURNING *`,
      [feedbackRating, feedbackComment || null, id]
    );

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: updated.rows[0],
    });

    await activity.track(req, {
      eventType: 'complaint.feedback_submit',
      resourceType: 'complaint',
      resourceId: id,
      societyId: complaint.society_apartment_id,
      details: { feedback_rating: feedbackRating },
    });
  } catch (error) {
    console.error('Submit complaint feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint feedback',
      error: error.message,
    });
  }
};

// Delete complaint
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await query(
      'SELECT submitted_by, society_apartment_id FROM complaints WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Residents can only delete their own complaints
    if (req.user.role === 'resident' && existing.rows[0].submitted_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own complaints',
      });
    }

    const result = await query(
      `UPDATE complaints
       SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id, req.user?.id || null]
    );

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
    await activity.track(req, {
      eventType: 'complaint.delete',
      resourceType: 'complaint',
      resourceId: id,
      societyId: existing.rows[0]?.society_apartment_id,
      details: {},
    });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message,
    });
  }
};

// Assign staff to complaint
export const assignStaff = async (req, res) => {
  try {
    const { staff_id } = req.body;
    const { id } = req.params;

    // Verify staff_id is a staff user
    const staff = await query(
      `SELECT id, role FROM users WHERE id = $1 AND role = 'staff'`,
      [staff_id]
    );

    if (staff.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff user',
      });
    }

    // Check if complaint exists
    const complaint = await query('SELECT id FROM complaints WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Update complaint
    const result = await query(
      `UPDATE complaints 
       SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [staff_id, id]
    );

    res.json({
      success: true,
      message: 'Staff assigned successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'complaint.assign',
      resourceType: 'complaint',
      resourceId: id,
      societyId: result.rows[0]?.society_apartment_id,
      details: { staff_id },
    });
  } catch (error) {
    console.error('Assign staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign staff',
      error: error.message,
    });
  }
};

// Add progress update
export const addProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if complaint exists
    const complaint = await query('SELECT id FROM complaints WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Try to insert progress entry (if complaint_progress table exists)
    try {
      await query(
        `INSERT INTO complaint_progress (complaint_id, updated_by, status, notes)
         VALUES ($1, $2, $3, $4)`,
        [id, req.user.id, status || null, notes || null]
      );
    } catch (error) {
      // If table doesn't exist, log but continue
      console.warn('complaint_progress table may not exist:', error.message);
    }

    // Update complaint status if provided
    if (status) {
      await query(
        `UPDATE complaints 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [status, id]
      );
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
    });
    await activity.track(req, {
      eventType: 'complaint.progress_add',
      resourceType: 'complaint',
      resourceId: id,
      details: { status: status || null },
    });
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add progress',
      error: error.message,
    });
  }
};

// Escalate complaint to super admin (union_admin or resident)
export const escalate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    const complaint = await query(
      'SELECT id, society_apartment_id, submitted_by, escalated_at FROM complaints WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (complaint.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    const row = complaint.rows[0];
    if (row.escalated_at) {
      return res.status(400).json({ success: false, message: 'Complaint is already escalated' });
    }

    if (req.user.role === 'resident') {
      if (row.submitted_by !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only escalate your own complaint' });
      }
    } else if (req.user.role === 'union_admin') {
      if (row.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({ success: false, message: 'You can only escalate complaints from your union' });
      }
    } else if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only resident, union admin, or super admin can escalate' });
    }

    await query(
      `UPDATE complaints SET escalated_at = CURRENT_TIMESTAMP, escalated_by = $1, escalation_reason = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [req.user.id, reason || null, id]
    );

    res.json({
      success: true,
      message: 'Complaint escalated to platform. Super admin will review.',
      data: { id: parseInt(id, 10), escalated_at: new Date().toISOString() },
    });
    await activity.track(req, {
      eventType: 'complaint.escalate',
      resourceType: 'complaint',
      resourceId: id,
      societyId: row.society_apartment_id,
      details: { reason: reason || null },
    });
  } catch (error) {
    console.error('Escalate complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to escalate complaint',
      error: error.message,
    });
  }
};

// Get progress history
export const getProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if complaint exists
    const complaint = await query('SELECT id FROM complaints WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Try to get progress history (if complaint_progress table exists)
    try {
      const result = await query(
        `SELECT cp.*, u.name as updated_by_name
         FROM complaint_progress cp
         LEFT JOIN users u ON cp.updated_by = u.id
         WHERE cp.complaint_id = $1
         ORDER BY cp.created_at DESC`,
        [id]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      // If table doesn't exist, return empty array
      console.warn('complaint_progress table may not exist:', error.message);
      res.json({
        success: true,
        data: [],
      });
    }
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message,
    });
  }
};
