import { query } from '../config/database.js';
import { sendNewComplaintNotificationToAdmin } from '../services/emailService.js';

// Get all complaints
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, status, priority, assigned_to } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT c.*, u.unit_number, s.name as society_name, 
             submitter.name as submitted_by_name, assignee.name as assigned_to_name
      FROM complaints c
      LEFT JOIN units u ON c.unit_id = u.id
      LEFT JOIN apartments s ON c.society_apartment_id = s.id
      LEFT JOIN users submitter ON c.submitted_by = submitter.id
      LEFT JOIN users assignee ON c.assigned_to = assignee.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // Residents can see their own complaints and public complaints
    if (req.user.role === 'resident') {
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

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM complaints WHERE 1=1';
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

    let whereClause = 'WHERE 1=1';
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
      `SELECT c.*, u.unit_number, s.name as society_name,
              submitter.name as submitted_by_name, assignee.name as assigned_to_name
       FROM complaints c
       LEFT JOIN units u ON c.unit_id = u.id
       LEFT JOIN apartments s ON c.society_apartment_id = s.id
       LEFT JOIN users submitter ON c.submitted_by = submitter.id
       LEFT JOIN users assignee ON c.assigned_to = assignee.id
       WHERE c.id = $1`,
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
    const { unit_id, society_apartment_id, title, subject, description, priority, is_public } = req.body;
    const complaintTitle = title || subject;

    if (!society_apartment_id || !complaintTitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Society ID, title (or subject), and description are required',
      });
    }

    const result = await query(
      `INSERT INTO complaints (unit_id, society_apartment_id, submitted_by, title, description, priority, is_public, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        unit_id || null,
        society_apartment_id,
        req.user.id,
        complaintTitle,
        description,
        priority || 'medium',
        is_public || false,
      ]
    );

    // Notify union admin(s) by email (do not block response)
    (async () => {
      try {
        const admins = await query(
          'SELECT email FROM users WHERE society_apartment_id = $1 AND role = $2 AND is_active = true',
          [society_apartment_id, 'union_admin']
        );
        const society = await query('SELECT name FROM apartments WHERE id = $1', [society_apartment_id]);
        const toEmails = admins.rows.map((r) => r.email).filter(Boolean);
        if (toEmails.length > 0) {
          await sendNewComplaintNotificationToAdmin({
            toEmails,
            residentName: req.user.name || req.user.email,
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
    const { unit_id, society_apartment_id, title, subject, description, priority, is_public } = req.body;
    const complaintTitle = title || subject;

    if (!society_apartment_id || !complaintTitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Society ID, title (or subject), and description are required',
      });
    }

    const attachmentPaths = (req.files || []).map((f) => `/uploads/complaints/${f.filename}`);

    const result = await query(
      `INSERT INTO complaints (unit_id, society_apartment_id, submitted_by, title, description, priority, is_public, status, attachments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
       RETURNING *`,
      [
        unit_id || null,
        society_apartment_id,
        req.user.id,
        complaintTitle,
        description,
        priority || 'medium',
        is_public === 'true' || is_public === true,
        attachmentPaths.length > 0 ? attachmentPaths : null,
      ]
    );

    // Notify union admin(s) by email
    (async () => {
      try {
        const admins = await query(
          'SELECT email FROM users WHERE society_apartment_id = $1 AND role = $2 AND is_active = true',
          [society_apartment_id, 'union_admin']
        );
        const society = await query('SELECT name FROM apartments WHERE id = $1', [society_apartment_id]);
        const toEmails = admins.rows.map((r) => r.email).filter(Boolean);
        if (toEmails.length > 0) {
          await sendNewComplaintNotificationToAdmin({
            toEmails,
            residentName: req.user.name || req.user.email,
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

    const existing = await query('SELECT * FROM complaints WHERE id = $1', [id]);
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
       WHERE id = $2
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
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message,
    });
  }
};

// Delete complaint
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await query('SELECT submitted_by FROM complaints WHERE id = $1', [id]);
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

    const result = await query('DELETE FROM complaints WHERE id = $1 RETURNING id', [id]);

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
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
    const complaint = await query('SELECT id FROM complaints WHERE id = $1', [id]);
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
    const complaint = await query('SELECT id FROM complaints WHERE id = $1', [id]);
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
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add progress',
      error: error.message,
    });
  }
};

// Get progress history
export const getProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if complaint exists
    const complaint = await query('SELECT id FROM complaints WHERE id = $1', [id]);
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
