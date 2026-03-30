import { query } from '../config/database.js';
import { runSyncForSocieties } from './defaulterController.js';
import * as activity from '../services/activityService.js';
import {
  getUiSocietyId,
  getUiResidentIdSync,
  isMultiUiSuperAdmin,
  getResidentRowForMultiUi,
} from '../utils/multiUiContext.js';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Create a finance income record for a maintenance payment (used by recordPayment and approvePaymentRequest). */
async function createFinanceIncomeFromMaintenance({ societyId, addedBy, amount, month, year, unitNumber, transactionDate, maintenanceId }) {
  if (societyId == null || societyId === undefined || addedBy == null || addedBy === undefined || amount == null || amount <= 0) {
    console.warn('createFinanceIncomeFromMaintenance skipped:', { societyId, addedBy, amount });
    return;
  }
  const monthLabel = MONTH_NAMES[Number(month) - 1] || String(month);
  const recordedDate = new Date(transactionDate);
  const recordedMonth = recordedDate.getMonth() + 1;
  const recordedYear = recordedDate.getFullYear();
  const recordedMonthLabel = MONTH_NAMES[recordedMonth - 1] || String(recordedMonth);
  const unitStr = unitNumber != null ? `Unit ${unitNumber}` : 'Unit';
  const description = `Maintenance payment – ${unitStr}, dues ${monthLabel} ${year}, recorded ${recordedMonthLabel} ${recordedYear}`;
  await query(
    `INSERT INTO finance (society_apartment_id, added_by, transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, maintenance_id)
     VALUES ($1, $2, $3, 'income', NULL, 'maintenance', $4, $5, NULL, NULL, $6, $7, 'paid', $8)`,
    [societyId, addedBy, transactionDate, description, amount, month || new Date(transactionDate).getMonth() + 1, year || new Date(transactionDate).getFullYear(), maintenanceId || null]
  );
}

// Get all maintenance records
export const getAll = async (req, res) => {
  try {
    let forceUnitId = null;

    if (req.user?.role === 'resident') {
      if (!req.user.society_apartment_id || !req.user.unit_id) {
        const limitNum = Number(req.query.limit) || 10;
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: limitNum,
            total: 0,
            pages: 0,
          },
        });
      }
      forceUnitId = req.user.unit_id;
    } else if (isMultiUiSuperAdmin(req) && getUiResidentIdSync(req)) {
      const row = await getResidentRowForMultiUi(req);
      if (!row?.unit_id) {
        const limitNum = Number(req.query.limit) || 10;
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: limitNum,
            total: 0,
            pages: 0,
          },
        });
      }
      forceUnitId = row.unit_id;
    }

    const { page = 1, limit = 10, society_id, unit_id, status, month, year } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT m.*, u.unit_number, u.owner_name, s.name as society_name
      FROM maintenance m
      LEFT JOIN units u ON m.unit_id = u.id
      LEFT JOIN apartments s ON m.society_apartment_id = s.id
      WHERE 1=1 AND m.deleted_at IS NULL
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND m.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (unit_id) {
      paramCount++;
      sql += ` AND m.unit_id = $${paramCount}`;
      params.push(unit_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND m.status = $${paramCount}`;
      params.push(status);
    }

    if (month) {
      paramCount++;
      sql += ` AND m.month = $${paramCount}`;
      params.push(month);
    }

    if (year) {
      paramCount++;
      sql += ` AND m.year = $${paramCount}`;
      params.push(year);
    }

    if (forceUnitId != null) {
      paramCount++;
      sql += ` AND m.unit_id = $${paramCount}`;
      params.push(forceUnitId);
    }

    sql += ` ORDER BY m.year DESC, m.month DESC, m.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM maintenance WHERE deleted_at IS NULL';
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (unit_id) {
      countParamCount++;
      countSql += ` AND unit_id = $${countParamCount}`;
      countParams.push(unit_id);
    }
    if (status) {
      countParamCount++;
      countSql += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }
    if (month) {
      countParamCount++;
      countSql += ` AND month = $${countParamCount}`;
      countParams.push(month);
    }
    if (year) {
      countParamCount++;
      countSql += ` AND year = $${countParamCount}`;
      countParams.push(year);
    }

    if (forceUnitId != null) {
      countParamCount++;
      countSql += ` AND unit_id = $${countParamCount}`;
      countParams.push(forceUnitId);
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
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance records',
      error: error.message,
    });
  }
};

// Get maintenance by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT m.*, u.unit_number, u.owner_name, s.name as society_name
       FROM maintenance m
       LEFT JOIN units u ON m.unit_id = u.id
       LEFT JOIN apartments s ON m.society_apartment_id = s.id
       WHERE m.id = $1 AND m.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance record',
      error: error.message,
    });
  }
};

// Create maintenance record
export const create = async (req, res) => {
  try {
    const { unit_id, society_apartment_id, month, year, base_amount, total_amount, due_date } = req.body;

    if (!unit_id || !society_apartment_id || !month || !year || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Unit ID, society ID, month, year, and total amount are required',
      });
    }

    const configResult = await query(
      `SELECT base_amount FROM maintenance_config 
       WHERE society_apartment_id = $1 AND block_id IS NULL AND unit_id IS NULL LIMIT 1`,
      [society_apartment_id]
    );
    if (configResult.rows.length > 0) {
      const maxAllowed = parseFloat(configResult.rows[0].base_amount);
      if (!Number.isNaN(maxAllowed) && maxAllowed >= 0 && parseFloat(total_amount) > maxAllowed) {
        return res.status(400).json({
          success: false,
          message: `Amount cannot exceed the base amount (${maxAllowed}) set in Settings.`,
        });
      }
    }

    const result = await query(
      `INSERT INTO maintenance (unit_id, society_apartment_id, month, year, base_amount, total_amount, due_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [unit_id, society_apartment_id, month, year, base_amount || total_amount, total_amount, due_date || null]
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'maintenance.create',
      resourceType: 'maintenance',
      resourceId: result.rows[0]?.id,
      societyId: society_apartment_id,
      details: { month, year },
    });
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance record',
      error: error.message,
    });
  }
};

// Create maintenance record for all units in a society (one record per unit for given month/year; skips existing)
export const createForAllUnits = async (req, res) => {
  try {
    const societyId =
      getUiSocietyId(req) ||
      (req.user?.role === 'union_admin' ? req.user.society_apartment_id : null) ||
      req.body.society_apartment_id;
    const { month, year, base_amount, total_amount, due_date } = req.body;

    if (!societyId || !month || !year || total_amount == null) {
      return res.status(400).json({
        success: false,
        message: 'Society ID, month, year, and total amount are required',
      });
    }

    const amount = parseFloat(total_amount) || 0;
    const unitsResult = await query(
      'SELECT id, society_apartment_id FROM units WHERE society_apartment_id = $1',
      [societyId]
    );
    let created = 0;
    let skipped = 0;

    for (const unit of unitsResult.rows) {
      const existing = await query(
        'SELECT id FROM maintenance WHERE unit_id = $1 AND month = $2 AND year = $3 AND deleted_at IS NULL',
        [unit.id, month, year]
      );
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }
      const monthDueDate = due_date ? new Date(due_date) : new Date(year, month, 1);
      await query(
        `INSERT INTO maintenance (unit_id, society_apartment_id, month, year, base_amount, total_amount, status, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)`,
        [unit.id, unit.society_apartment_id, month, year, amount, amount, monthDueDate]
      );
      created++;
    }

    res.status(201).json({
      success: true,
      message: `Maintenance created for all units. ${created} created, ${skipped} skipped (already exist).`,
      data: { created, skipped, total: unitsResult.rows.length },
    });
    await activity.track(req, {
      eventType: 'maintenance.bulk_create',
      resourceType: 'maintenance',
      societyId,
      details: { month, year, created, skipped },
    });
  } catch (error) {
    console.error('Create for all units error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance for all units',
      error: error.message,
    });
  }
};

// Update maintenance record
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { base_amount, total_amount, status, amount_paid, due_date } = req.body;

    const existing = await query('SELECT id, society_apartment_id FROM maintenance WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    if (total_amount != null) {
      const societyId = existing.rows[0].society_apartment_id;
      if (societyId) {
        const configResult = await query(
          `SELECT base_amount FROM maintenance_config 
           WHERE society_apartment_id = $1 AND block_id IS NULL AND unit_id IS NULL LIMIT 1`,
          [societyId]
        );
        if (configResult.rows.length > 0) {
          const maxAllowed = parseFloat(configResult.rows[0].base_amount);
          if (!Number.isNaN(maxAllowed) && maxAllowed >= 0 && parseFloat(total_amount) > maxAllowed) {
            return res.status(400).json({
              success: false,
              message: `Amount cannot exceed the base amount (${maxAllowed}) set in Settings.`,
            });
          }
        }
      }
    }

    const result = await query(
      `UPDATE maintenance 
       SET base_amount = COALESCE($1, base_amount),
           total_amount = COALESCE($2, total_amount),
           status = COALESCE($3, status),
           amount_paid = COALESCE($4, amount_paid),
           due_date = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [base_amount, total_amount, status, amount_paid, due_date ?? null, id]
    );

    res.json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: result.rows[0],
    });
    await activity.track(req, {
      eventType: 'maintenance.update',
      resourceType: 'maintenance',
      resourceId: id,
      societyId: existing.rows[0]?.society_apartment_id,
      details: { fields: Object.keys(req.body || {}) },
    });
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance record',
      error: error.message,
    });
  }
};

// Upload receipt for a maintenance record (multipart: receipt file)
export const uploadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file || !req.file.filename) {
      return res.status(400).json({
        success: false,
        message: 'No receipt file uploaded. Please select an image or PDF.',
      });
    }
    const receiptPath = `/uploads/maintenance-receipts/${req.file.filename}`;
    const result = await query(
      `UPDATE maintenance SET receipt_path = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [receiptPath, parseInt(id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }
    res.json({
      success: true,
      message: 'Receipt uploaded successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Upload receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload receipt',
      error: error.message,
    });
  }
};

// Record payment
export const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_paid } = req.body;

    if (!amount_paid) {
      return res.status(400).json({
        success: false,
        message: 'Amount paid is required',
      });
    }

    const existing = await query('SELECT * FROM maintenance WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    const maintenance = existing.rows[0];
    const currentAmountPaid = parseFloat(maintenance.amount_paid) || 0;
    const paymentAmount = parseFloat(amount_paid);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    const newAmountPaid = currentAmountPaid + paymentAmount;
    const totalAmount = parseFloat(maintenance.total_amount) || 0;
    const newStatus = newAmountPaid >= totalAmount ? 'paid' : 
                     newAmountPaid > 0 ? 'partially_paid' : 'pending';

    // Set payment_date only if status is 'paid'
    const paymentDate = newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null;

    const result = await query(
      `UPDATE maintenance 
       SET amount_paid = $1::DECIMAL(10, 2),
           status = $2::VARCHAR,
           payment_date = COALESCE($3::DATE, payment_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4::INTEGER
       RETURNING *`,
      [newAmountPaid, newStatus, paymentDate, parseInt(id)]
    );

    const societyId = maintenance.society_apartment_id;
    if (societyId) {
      runSyncForSocieties([societyId]).catch((err) =>
        console.error('Defaulters sync after payment failed:', err)
      );
    }

    // Add maintenance payment as income on Finance page
    let financeCreated = false;
    try {
      const unitRes = await query('SELECT unit_number FROM units WHERE id = $1', [maintenance.unit_id]);
      const unitNumber = unitRes.rows[0]?.unit_number ?? null;
      const transactionDate = paymentDate || new Date().toISOString().split('T')[0];
      const recordedDate = new Date(transactionDate);
      await createFinanceIncomeFromMaintenance({
        societyId,
        addedBy: req.user?.id,
        amount: paymentAmount,
        month: recordedDate.getMonth() + 1,
        year: recordedDate.getFullYear(),
        unitNumber,
        transactionDate,
        maintenanceId: parseInt(id),
      });
      financeCreated = true;
    } catch (financeErr) {
      console.error('Create finance income from maintenance payment failed:', financeErr?.message || financeErr);
    }

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: result.rows[0],
      finance_income_created: financeCreated,
    });
    await activity.track(req, {
      eventType: 'maintenance.record_payment',
      resourceType: 'maintenance',
      resourceId: id,
      societyId,
      details: { amount_paid: paymentAmount, finance_income_created: financeCreated },
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message,
    });
  }
};

// Delete maintenance record
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE maintenance
       SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id, req.user?.id || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.json({
      success: true,
      message: 'Maintenance record deleted successfully',
    });
    await activity.track(req, {
      eventType: 'maintenance.delete',
      resourceType: 'maintenance',
      resourceId: id,
      details: {},
    });
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete maintenance record',
      error: error.message,
    });
  }
};

// Delete all maintenance records for a given year (for current user's society)
export const deleteByYear = async (req, res) => {
  try {
    // Prefer query params (DELETE body often stripped by proxies); fallback to body
    const yearParam = req.query.year != null ? req.query.year : req.body?.year;
    const year = yearParam != null ? parseInt(yearParam, 10) : null;
    const societyId =
      getUiSocietyId(req) ||
      (req.user?.role === 'union_admin' ? req.user.society_apartment_id : null) ||
      req.query.society_id ||
      req.body?.society_id;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: 'society_id is required (or use as union_admin)',
      });
    }
    if (year == null || Number.isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: 'year is required',
      });
    }

    const result = await query(
      `UPDATE maintenance
       SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $3, updated_at = CURRENT_TIMESTAMP
       WHERE society_apartment_id = $1 AND year = $2 AND deleted_at IS NULL
       RETURNING id`,
      [societyId, year, req.user?.id || null]
    );
    const deleted = result.rows.length;

    res.json({
      success: true,
      message: `Deleted ${deleted} maintenance record(s) for year ${year}.`,
      data: { deleted, year },
    });
    await activity.track(req, {
      eventType: 'maintenance.delete_year',
      resourceType: 'maintenance',
      societyId,
      details: { year, deleted },
    });
  } catch (error) {
    console.error('Delete by year error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete maintenance for year',
      error: error.message,
    });
  }
};

// --- Maintenance payment requests (resident submit proof → admin approve/reject) ---

// Resident: submit payment proof for a maintenance record (must be resident's unit)
export const submitPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    let userId = req.user?.id;
    let unitId = req.user?.unit_id;

    if (isMultiUiSuperAdmin(req)) {
      const row = await getResidentRowForMultiUi(req);
      if (!row?.unit_id) {
        return res.status(403).json({
          success: false,
          message: 'Resident context required (Multi-UI: select resident / X-Hums-Ui-Resident-Id).',
        });
      }
      userId = row.id;
      unitId = row.unit_id;
    } else if (req.user?.role !== 'resident' || !unitId) {
      return res.status(403).json({
        success: false,
        message: 'Only residents can submit payment proof for their unit.',
      });
    }
    if (!req.file || !req.file.filename) {
      return res.status(400).json({
        success: false,
        message: 'No proof file uploaded. Please select an image or PDF.',
      });
    }

    const maintenanceResult = await query(
      'SELECT id, unit_id, society_apartment_id FROM maintenance WHERE id = $1 AND deleted_at IS NULL',
      [parseInt(id)]
    );
    if (maintenanceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }
    const maintenance = maintenanceResult.rows[0];
    if (Number(maintenance.unit_id) !== Number(unitId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit proof for maintenance of your own unit.',
      });
    }

    const insertResult = await createMaintenancePaymentRequest({
      maintenanceId: parseInt(id),
      submittedBy: userId,
      proofPath: `/uploads/maintenance-payment-proofs/${req.file.filename}`,
      note: (req.body && req.body.note) ? String(req.body.note).trim() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Payment proof submitted. It will be reviewed by the office.',
      data: insertResult.rows[0],
    });
    await activity.track(req, {
      eventType: 'maintenance.payment_proof_submit',
      resourceType: 'maintenance',
      resourceId: id,
      societyId: maintenance.society_apartment_id,
      details: {},
    });
  } catch (error) {
    console.error('Submit payment proof error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit payment proof',
      error: error.message,
    });
  }
};

export async function createMaintenancePaymentRequest({ maintenanceId, submittedBy, proofPath, note = null }) {
  const existingPending = await query(
    `SELECT id FROM maintenance_payment_requests 
     WHERE maintenance_id = $1 AND status = 'pending' LIMIT 1`,
    [maintenanceId]
  );
  if (existingPending.rows.length > 0) {
    const error = new Error('A payment proof is already pending for this record. Wait for admin to review.');
    error.status = 400;
    throw error;
  }

  const insertResult = await query(
    `INSERT INTO maintenance_payment_requests (maintenance_id, submitted_by, proof_path, note, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [maintenanceId, submittedBy, proofPath, note]
  );
  return insertResult.rows[0];
}

// Resident: get my payment requests (for showing "Pending verification" on resident maintenance page)
export const getMyPaymentRequests = async (req, res) => {
  try {
    const userId =
      getUiResidentIdSync(req) || (req.user?.role === 'resident' ? req.user.id : null);
    if (!userId) {
      return res.json({ success: true, data: [] });
    }

    const result = await query(
      `SELECT id, maintenance_id, status, proof_path, created_at 
       FROM maintenance_payment_requests 
       WHERE submitted_by = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get my payment requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your payment requests',
      error: error.message,
    });
  }
};

// Admin: list payment requests (pending by default; filter by society_id)
export const getPaymentRequests = async (req, res) => {
  try {
    const { status = 'pending', society_id } = req.query;

    let sql = `
      SELECT r.id, r.maintenance_id, r.proof_path, r.note, r.status, r.created_at, r.reviewed_at, r.rejection_reason,
             m.unit_id, m.month, m.year, m.total_amount, m.amount_paid, m.society_apartment_id,
             u.unit_number,
             s.name AS society_name,
             submitter.name AS submitted_by_name, submitter.email AS submitted_by_email
      FROM maintenance_payment_requests r
      JOIN maintenance m ON m.id = r.maintenance_id AND m.deleted_at IS NULL
      LEFT JOIN units u ON u.id = m.unit_id
      LEFT JOIN apartments s ON s.id = m.society_apartment_id
      LEFT JOIN users submitter ON submitter.id = r.submitted_by
      WHERE r.status = $1
    `;
    const params = [status];
    let paramCount = 1;

    if (society_id) {
      paramCount++;
      sql += ` AND m.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }
    const unionScope = getUiSocietyId(req) || (req.user?.role === 'union_admin' ? req.user.society_apartment_id : null);
    if (unionScope) {
      paramCount++;
      sql += ` AND m.society_apartment_id = $${paramCount}`;
      params.push(unionScope);
    }

    sql += ` ORDER BY r.created_at ASC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get payment requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment requests',
      error: error.message,
    });
  }
};

// Admin: approve payment request → record payment and set receipt_path
export const approvePaymentRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const reviewerId = req.user?.id;

    const reqResult = await query(
      `SELECT r.id, r.maintenance_id, r.proof_path, r.status,
              m.total_amount, m.amount_paid, m.society_apartment_id, m.month, m.year,
              u.unit_number
       FROM maintenance_payment_requests r
       JOIN maintenance m ON m.id = r.maintenance_id AND m.deleted_at IS NULL
       LEFT JOIN units u ON u.id = m.unit_id
       WHERE r.id = $1`,
      [requestId]
    );
    if (reqResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment request not found',
      });
    }
    const row = reqResult.rows[0];
    if (row.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    const totalAmount = parseFloat(row.total_amount) || 0;
    const amountPaid = parseFloat(row.amount_paid) || 0;
    const dueAmount = totalAmount - amountPaid;

    await query(
      `UPDATE maintenance_payment_requests 
       SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $1 
       WHERE id = $2`,
      [reviewerId, requestId]
    );

    await query(
      `UPDATE maintenance 
       SET amount_paid = $1::DECIMAL(10, 2), status = 'paid', 
           payment_date = CURRENT_DATE, receipt_path = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [totalAmount, row.proof_path, row.maintenance_id]
    );

    const societyId = row.society_apartment_id;
    if (societyId) {
      runSyncForSocieties([societyId]).catch((err) =>
        console.error('Defaulters sync after approve payment request failed:', err)
      );
    }

    // Add maintenance payment as income on Finance page (dueAmount = amount just approved)
    let financeCreated = false;
    if (dueAmount > 0) {
      try {
        const transactionDate = new Date().toISOString().split('T')[0];
        const recordedDate = new Date(transactionDate);
        await createFinanceIncomeFromMaintenance({
          societyId,
          addedBy: reviewerId,
          amount: dueAmount,
          month: recordedDate.getMonth() + 1,
          year: recordedDate.getFullYear(),
          unitNumber: row.unit_number ?? null,
          transactionDate,
          maintenanceId: row.maintenance_id,
        });
        financeCreated = true;
      } catch (financeErr) {
        console.error('Create finance income from approved payment request failed:', financeErr?.message || financeErr);
      }
    }

    res.json({
      success: true,
      message: 'Payment approved and recorded successfully',
      data: { maintenance_id: row.maintenance_id, finance_income_created: financeCreated },
    });
    await activity.track(req, {
      eventType: 'maintenance.payment_request_approve',
      resourceType: 'maintenance',
      resourceId: row.maintenance_id,
      societyId: societyId,
      details: { request_id: requestId },
    });
  } catch (error) {
    console.error('Approve payment request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve payment request',
      error: error.message,
    });
  }
};

// Admin: reject payment request
export const rejectPaymentRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const reviewerId = req.user?.id;
    const rejectionReason = req.body?.rejection_reason ? String(req.body.rejection_reason).trim() : null;

    const reqResult = await query(
      'SELECT id, status FROM maintenance_payment_requests WHERE id = $1',
      [requestId]
    );
    if (reqResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment request not found',
      });
    }
    if (reqResult.rows[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    await query(
      `UPDATE maintenance_payment_requests 
       SET status = 'rejected', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $1, rejection_reason = $2 
       WHERE id = $3`,
      [reviewerId, rejectionReason, requestId]
    );

    res.json({
      success: true,
      message: 'Payment proof rejected',
      data: { id: requestId },
    });
    await activity.track(req, {
      eventType: 'maintenance.payment_request_reject',
      resourceType: 'maintenance_payment_request',
      resourceId: requestId,
      details: {},
    });
  } catch (error) {
    console.error('Reject payment request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject payment request',
      error: error.message,
    });
  }
};

// Get yearly maintenance ledger (one row per unit with monthly columns + total/paid/due)
export const getYearlyLedger = async (req, res) => {
  try {
    const { society_id, year } = req.query;
    const ledgerYear = year ? parseInt(year, 10) : new Date().getFullYear();

    if (!society_id) {
      return res.status(400).json({
        success: false,
        message: 'society_id is required',
      });
    }

    const sql = `
      SELECT
        u.id AS unit_id,
        u.unit_number AS flat_no,
        u.unit_number AS unit_number,
        COALESCE(
          (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
          NULLIF(TRIM(u.resident_name), ''),
          NULLIF(TRIM(u.owner_name), ''),
          ''
        ) AS resident_name,
        (SELECT usr.id FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1) AS resident_id,
        f.floor_number,
        u.floor_id,
        u.block_id,
        b.name AS block_name,
        SUM(CASE WHEN m.month = 1 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS jan,
        SUM(CASE WHEN m.month = 2 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS feb,
        SUM(CASE WHEN m.month = 3 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS mar,
        SUM(CASE WHEN m.month = 4 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS apr,
        SUM(CASE WHEN m.month = 5 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS may,
        SUM(CASE WHEN m.month = 6 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS jun,
        SUM(CASE WHEN m.month = 7 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS jul,
        SUM(CASE WHEN m.month = 8 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS aug,
        SUM(CASE WHEN m.month = 9 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS sep,
        SUM(CASE WHEN m.month = 10 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS oct,
        SUM(CASE WHEN m.month = 11 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS nov,
        SUM(CASE WHEN m.month = 12 THEN GREATEST(0, m.total_amount - COALESCE(m.amount_paid, 0)) ELSE 0 END) AS dec,
        SUM(CASE WHEN m.month = 1 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS jan_paid,
        SUM(CASE WHEN m.month = 2 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS feb_paid,
        SUM(CASE WHEN m.month = 3 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS mar_paid,
        SUM(CASE WHEN m.month = 4 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS apr_paid,
        SUM(CASE WHEN m.month = 5 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS may_paid,
        SUM(CASE WHEN m.month = 6 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS jun_paid,
        SUM(CASE WHEN m.month = 7 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS jul_paid,
        SUM(CASE WHEN m.month = 8 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS aug_paid,
        SUM(CASE WHEN m.month = 9 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS sep_paid,
        SUM(CASE WHEN m.month = 10 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS oct_paid,
        SUM(CASE WHEN m.month = 11 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS nov_paid,
        SUM(CASE WHEN m.month = 12 THEN COALESCE(m.amount_paid, 0) ELSE 0 END) AS dec_paid,
        COALESCE(SUM(m.total_amount), 0) AS total_payment,
        COALESCE(SUM(m.amount_paid), 0) AS paid_payment,
        COALESCE(SUM(m.total_amount), 0) - COALESCE(SUM(m.amount_paid), 0) AS due
      FROM units u
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN blocks b ON u.block_id = b.id
      LEFT JOIN maintenance m ON m.unit_id = u.id AND m.year = $1 AND m.deleted_at IS NULL
      WHERE u.society_apartment_id = $2
      GROUP BY u.id, u.unit_number, u.resident_name, u.owner_name, f.floor_number, u.floor_id, u.block_id, b.name
      ORDER BY b.name NULLS LAST, f.floor_number NULLS LAST, u.unit_number
    `;

    const result = await query(sql, [ledgerYear, society_id]);

    res.json({
      success: true,
      data: result.rows,
      year: ledgerYear,
    });
  } catch (error) {
    console.error('Get yearly ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yearly maintenance ledger',
      error: error.message,
    });
  }
};

// Apply society-level base amount to all units for all months of a year (create missing records only)
export const applyBaseForYear = async (req, res) => {
  try {
    const societyId =
      getUiSocietyId(req) ||
      (req.user?.role === 'union_admin' ? req.user.society_apartment_id : null) ||
      req.body.society_id;
    const year = req.body.year ? parseInt(req.body.year, 10) : new Date().getFullYear();

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: 'society_id is required (or use as union_admin)',
      });
    }

    const configResult = await query(
      `SELECT base_amount FROM maintenance_config 
       WHERE society_apartment_id = $1 AND block_id IS NULL AND unit_id IS NULL 
       LIMIT 1`,
      [societyId]
    );
    if (configResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Maintenance Amount Configuration not set. Set Base Amount in Settings first.',
      });
    }
    const baseAmount = parseFloat(configResult.rows[0].base_amount);
    if (isNaN(baseAmount) || baseAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base amount in Maintenance Amount Configuration',
      });
    }

    const unitsResult = await query(
      'SELECT id, society_apartment_id FROM units WHERE society_apartment_id = $1',
      [societyId]
    );
    let created = 0;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const lastMonthToCreate = year === currentYear ? currentMonth : 12;

    for (const unit of unitsResult.rows) {
      for (let month = 1; month <= lastMonthToCreate; month++) {
        const existing = await query(
          'SELECT id FROM maintenance WHERE unit_id = $1 AND month = $2 AND year = $3 AND deleted_at IS NULL',
          [unit.id, month, year]
        );
        if (existing.rows.length > 0) continue;
        const monthDueDate = new Date(year, month, 1);
        await query(
          `INSERT INTO maintenance 
           (unit_id, society_apartment_id, month, year, base_amount, total_amount, status, due_date)
           VALUES ($1, $2, $3, $4, $5, $5, 'pending', $6)`,
          [unit.id, unit.society_apartment_id, month, year, baseAmount, monthDueDate]
        );
        created++;
      }
    }

    res.json({
      success: true,
      message: `Applied base amount (${baseAmount}) to all units for ${year}${year === currentYear ? ` (months 1–${lastMonthToCreate} only)` : ''}. ${created} record(s) created.`,
      data: { created, year, base_amount: baseAmount },
    });
  } catch (error) {
    console.error('Apply base for year error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply base amount for year',
      error: error.message,
    });
  }
};

// Generate monthly dues manually (union_admin: only their society; super_admin: all societies)
export const generateMonthlyDues = async (req, res) => {
  try {
    const { month, year } = req.body;

    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const societyId = getUiSocietyId(req) || (req.user?.role === 'union_admin' ? req.user.society_apartment_id : null);

    const { generateMonthlyDues: generateDues } = await import('../jobs/monthlyDuesGenerator.js');
    const result = await generateDues(targetMonth, targetYear, societyId);

    const societyIdsToSync = societyId
      ? [societyId]
      : (await query('SELECT id FROM apartments')).rows.map((r) => r.id);
    if (societyIdsToSync.length > 0) {
      runSyncForSocieties(societyIdsToSync).catch((err) =>
        console.error('Defaulters sync after generate monthly dues failed:', err)
      );
    }

    res.json({
      success: true,
      message: 'Monthly dues generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Generate monthly dues error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly dues',
      error: error.message,
    });
  }
};

// Generate monthly dues for a block or floor (union_admin only, for their society)
export const generateForScope = async (req, res) => {
  try {
    const societyId = getUiSocietyId(req) || req.user?.society_apartment_id;
    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: 'Society (apartment) is required. Only union admins can generate for a block or floor.',
      });
    }

    const { month, year, scope, block_id, floor_id } = req.body;
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    let blockId = null;
    let floorId = null;
    if (scope === 'block' && block_id != null && block_id !== '') {
      blockId = block_id;
    } else if (scope === 'floor' && floor_id != null && floor_id !== '') {
      floorId = floor_id;
      if (block_id != null && block_id !== '') blockId = block_id;
    } else {
      return res.status(400).json({
        success: false,
        message: scope === 'block' ? 'block_id is required' : 'floor_id is required for floor scope',
      });
    }

    const { generateMonthlyDuesForScope } = await import('../jobs/monthlyDuesGenerator.js');
    const result = await generateMonthlyDuesForScope(targetMonth, targetYear, societyId, { blockId, floorId });

    runSyncForSocieties([societyId]).catch((err) =>
      console.error('Defaulters sync after generate for scope failed:', err)
    );

    res.json({
      success: true,
      message: `Dues generated for ${scope}: ${result.successful} created, ${result.failed} failed`,
      data: result
    });
  } catch (error) {
    console.error('Generate for scope error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dues for scope',
      error: error.message,
    });
  }
};
