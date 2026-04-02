import { query } from '../config/database.js';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Optional month scope for previous-year defaulters.
 * Full year: omit both `months` and `quarter`.
 * Quarter: `quarter=1..4` (calendar Q1–Q4).
 * Custom or single month: `months=1,2,3` (comma-separated, 1–12).
 * If both are sent, `months` wins.
 */
function parsePreviousYearMonthsFilter(query) {
  const monthsRaw = query.months;
  const quarterRaw = query.quarter;

  if (monthsRaw != null && String(monthsRaw).trim() !== '') {
    const parts = String(monthsRaw)
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 12);
    const uniq = [...new Set(parts)].sort((a, b) => a - b);
    if (uniq.length === 0) {
      return { error: 'Invalid months: use comma-separated values 1–12' };
    }
    return { months: uniq, source: 'months' };
  }

  if (quarterRaw != null && String(quarterRaw).trim() !== '') {
    const q = parseInt(quarterRaw, 10);
    if (Number.isNaN(q) || q < 1 || q > 4) {
      return { error: 'Invalid quarter: use 1, 2, 3, or 4' };
    }
    const byQ = {
      1: [1, 2, 3],
      2: [4, 5, 6],
      3: [7, 8, 9],
      4: [10, 11, 12],
    };
    return { months: byQ[q], source: 'quarter', quarter: q };
  }

  return { months: null, source: 'full_year' };
}

function buildPreviousYearPeriodLabel(year, parsed) {
  if (!parsed.months) {
    return `${year} (full year)`;
  }
  if (parsed.source === 'quarter' && parsed.quarter) {
    return `${year} (Q${parsed.quarter})`;
  }
  if (parsed.months.length === 1) {
    return `${year} (${MONTH_SHORT[parsed.months[0] - 1]})`;
  }
  return `${year} (${parsed.months.map((m) => MONTH_SHORT[m - 1]).join(', ')})`;
}

// Get all defaulters
export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, status, block_id, floor_id, search } = req.query;
    const offset = (page - 1) * limit;

    // Check if defaulter list is visible for residents
    if (req.user.role === 'resident') {
      const societyId = society_id || req.user.society_apartment_id;
      const settings = await query(
        'SELECT defaulter_list_visible FROM settings WHERE society_apartment_id = $1',
        [societyId]
      );

      if (settings.rows.length === 0 || !settings.rows[0].defaulter_list_visible) {
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0,
          },
          message: 'Defaulter list is not visible for residents',
        });
      }
    }

    let sql = `
      SELECT d.*, u.unit_number, u.owner_name, u.contact_number as resident_contact,
             u.block_id, u.floor_id, f.floor_number,
             s.name as society_name,
             (SELECT usr.id FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1) AS resident_id,
             COALESCE(
               (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
               NULLIF(TRIM(u.resident_name), ''),
               NULLIF(TRIM(u.owner_name), ''),
               ''
             ) AS resident_name,
             (SELECT MAX(m.payment_date) FROM maintenance m WHERE m.unit_id = d.unit_id AND m.payment_date IS NOT NULL) AS last_payment_date,
             (SELECT TO_CHAR(TO_DATE(m.year::text || '-' || LPAD(m.month::text, 2, '0') || '-01', 'YYYY-MM-DD'), 'Mon YYYY')
              FROM maintenance m WHERE m.unit_id = d.unit_id ORDER BY m.year DESC, m.month DESC LIMIT 1) AS last_maintenance_period
      FROM defaulters d
      LEFT JOIN units u ON d.unit_id = u.id
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN apartments s ON d.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (society_id) {
      paramCount++;
      sql += ` AND d.society_apartment_id = $${paramCount}`;
      params.push(society_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND d.status = $${paramCount}`;
      params.push(status);
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

    if (search && String(search).trim() !== '') {
      paramCount++;
      const searchPattern = '%' + String(search).trim() + '%';
      sql += ` AND (
        u.unit_number ILIKE $${paramCount}
        OR COALESCE((SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1), '') ILIKE $${paramCount}
        OR NULLIF(TRIM(u.resident_name), '') ILIKE $${paramCount}
        OR NULLIF(TRIM(u.owner_name), '') ILIKE $${paramCount}
        OR u.contact_number ILIKE $${paramCount}
      )`;
      params.push(searchPattern);
    }

    sql += ` ORDER BY d.months_overdue DESC, d.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count (join units for block/floor filter)
    let countSql = `
      SELECT COUNT(*) FROM defaulters d
      LEFT JOIN units u ON d.unit_id = u.id
      WHERE 1=1
    `;
    const countParams = [];
    let countParamCount = 0;

    if (society_id) {
      countParamCount++;
      countSql += ` AND d.society_apartment_id = $${countParamCount}`;
      countParams.push(society_id);
    }
    if (status) {
      countParamCount++;
      countSql += ` AND d.status = $${countParamCount}`;
      countParams.push(status);
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
    if (search && String(search).trim() !== '') {
      countParamCount++;
      const searchPattern = '%' + String(search).trim() + '%';
      countSql += ` AND (
        u.unit_number ILIKE $${countParamCount}
        OR COALESCE((SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1), '') ILIKE $${countParamCount}
        OR NULLIF(TRIM(u.resident_name), '') ILIKE $${countParamCount}
        OR NULLIF(TRIM(u.owner_name), '') ILIKE $${countParamCount}
        OR u.contact_number ILIKE $${countParamCount}
      )`;
      countParams.push(searchPattern);
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
    console.error('Get defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch defaulters',
      error: error.message,
    });
  }
};

// Get defaulter statistics
export const getStatistics = async (req, res) => {
  try {
    const { society_id } = req.query;

    let sql = `
      SELECT 
        COUNT(*) as total_defaulters,
        COALESCE(SUM(amount_due), 0) as total_amount_due,
        AVG(months_overdue) as avg_months_overdue,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
        COUNT(CASE WHEN status = 'escalated' THEN 1 END) as escalated_count
      FROM defaulters
      WHERE 1=1
    `;
    const params = [];

    if (society_id) {
      sql += ' AND society_apartment_id = $1';
      params.push(society_id);
    }

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get defaulter statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch defaulter statistics',
      error: error.message,
    });
  }
};

// Get previous-year defaulters (aggregated by unit for a specific year; optional month / quarter scope)
export const getPreviousYearDefaulters = async (req, res) => {
  try {
    const { page = 1, limit = 10, society_id, year, block_id, floor_id, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const targetYear = parseInt(year, 10);

    if (Number.isNaN(targetYear)) {
      return res.status(400).json({
        success: false,
        message: 'Valid year is required',
      });
    }

    const currentYear = new Date().getFullYear();
    if (targetYear > currentYear) {
      return res.status(400).json({
        success: false,
        message: 'Year cannot be in the future',
      });
    }

    const effectiveSocietyId =
      req.user?.role === 'union_admin'
        ? req.user.society_apartment_id
        : society_id;

    if (!effectiveSocietyId) {
      return res.status(400).json({
        success: false,
        message: 'society_id is required',
      });
    }

    const monthParsed = parsePreviousYearMonthsFilter(req.query);
    if (monthParsed.error) {
      return res.status(400).json({
        success: false,
        message: monthParsed.error,
      });
    }
    const periodLabel = buildPreviousYearPeriodLabel(targetYear, monthParsed);

    let sql = `
      SELECT
        u.id AS unit_id,
        u.unit_number,
        u.contact_number AS resident_contact,
        u.block_id,
        u.floor_id,
        f.floor_number,
        b.name AS block_name,
        COALESCE(
          (SELECT usr.id FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
          NULL
        ) AS resident_id,
        COALESCE(
          (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
          NULLIF(TRIM(u.resident_name), ''),
          NULLIF(TRIM(u.owner_name), ''),
          ''
        ) AS resident_name,
        SUM(m.total_amount - COALESCE(m.amount_paid, 0))::DECIMAL(10, 2) AS total_amount_due
      FROM maintenance m
      JOIN units u ON m.unit_id = u.id
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN blocks b ON u.block_id = b.id
      WHERE m.society_apartment_id = $1
        AND m.year = $2
        AND (m.total_amount - COALESCE(m.amount_paid, 0)) > 0
    `;
    const params = [effectiveSocietyId, targetYear];
    let paramCount = 2;

    if (monthParsed.months) {
      paramCount++;
      sql += ` AND m.month = ANY($${paramCount}::int[])`;
      params.push(monthParsed.months);
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

    if (search && String(search).trim() !== '') {
      paramCount++;
      const searchPattern = `%${String(search).trim()}%`;
      sql += ` AND (
        u.unit_number ILIKE $${paramCount}
        OR COALESCE((SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1), '') ILIKE $${paramCount}
        OR NULLIF(TRIM(u.resident_name), '') ILIKE $${paramCount}
        OR NULLIF(TRIM(u.owner_name), '') ILIKE $${paramCount}
        OR u.contact_number ILIKE $${paramCount}
      )`;
      params.push(searchPattern);
    }

    sql += `
      GROUP BY u.id, u.unit_number, u.contact_number, u.block_id, u.floor_id, f.floor_number, b.name, u.resident_name, u.owner_name
      ORDER BY total_amount_due DESC, u.unit_number
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    params.push(Number(limit), offset);

    const result = await query(sql, params);

    let countSql = `
      SELECT COUNT(*) FROM (
        SELECT u.id
        FROM maintenance m
        JOIN units u ON m.unit_id = u.id
        WHERE m.society_apartment_id = $1
          AND m.year = $2
          AND (m.total_amount - COALESCE(m.amount_paid, 0)) > 0
    `;
    const countParams = [effectiveSocietyId, targetYear];
    let countParamCount = 2;

    if (monthParsed.months) {
      countParamCount++;
      countSql += ` AND m.month = ANY($${countParamCount}::int[])`;
      countParams.push(monthParsed.months);
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

    if (search && String(search).trim() !== '') {
      countParamCount++;
      const searchPattern = `%${String(search).trim()}%`;
      countSql += ` AND (
        u.unit_number ILIKE $${countParamCount}
        OR COALESCE((SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1), '') ILIKE $${countParamCount}
        OR NULLIF(TRIM(u.resident_name), '') ILIKE $${countParamCount}
        OR NULLIF(TRIM(u.owner_name), '') ILIKE $${countParamCount}
        OR u.contact_number ILIKE $${countParamCount}
      )`;
      countParams.push(searchPattern);
    }

    countSql += ' GROUP BY u.id ) x';
    const countResult = await query(countSql, countParams);

    res.json({
      success: true,
      data: result.rows,
      period_label: periodLabel,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(countResult.rows[0]?.count || 0),
        pages: Math.ceil(Number(countResult.rows[0]?.count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get previous year defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch previous year defaulters',
      error: error.message,
    });
  }
};

// Export previous-year defaulters as CSV (admin only)
export const exportPreviousYearDefaultersCsv = async (req, res) => {
  try {
    const { society_id, year, block_id, floor_id, search } = req.query;
    const targetYear = parseInt(year, 10);

    if (Number.isNaN(targetYear)) {
      return res.status(400).json({
        success: false,
        message: 'Valid year is required',
      });
    }

    const currentYear = new Date().getFullYear();
    if (targetYear > currentYear) {
      return res.status(400).json({
        success: false,
        message: 'Year cannot be in the future',
      });
    }

    const effectiveSocietyId =
      req.user?.role === 'union_admin'
        ? req.user.society_apartment_id
        : society_id;

    if (!effectiveSocietyId) {
      return res.status(400).json({
        success: false,
        message: 'society_id is required',
      });
    }

    const monthParsed = parsePreviousYearMonthsFilter(req.query);
    if (monthParsed.error) {
      return res.status(400).json({
        success: false,
        message: monthParsed.error,
      });
    }
    const periodLabel = buildPreviousYearPeriodLabel(targetYear, monthParsed);

    let sql = `
      SELECT
        u.unit_number,
        COALESCE(
          (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
          NULLIF(TRIM(u.resident_name), ''),
          NULLIF(TRIM(u.owner_name), ''),
          ''
        ) AS resident_name,
        u.contact_number AS resident_contact,
        b.name AS block_name,
        f.floor_number,
        SUM(m.total_amount - COALESCE(m.amount_paid, 0))::DECIMAL(10, 2) AS total_amount_due
      FROM maintenance m
      JOIN units u ON m.unit_id = u.id
      LEFT JOIN floors f ON u.floor_id = f.id
      LEFT JOIN blocks b ON u.block_id = b.id
      WHERE m.society_apartment_id = $1
        AND m.year = $2
        AND (m.total_amount - COALESCE(m.amount_paid, 0)) > 0
    `;
    const params = [effectiveSocietyId, targetYear];
    let paramCount = 2;

    if (monthParsed.months) {
      paramCount++;
      sql += ` AND m.month = ANY($${paramCount}::int[])`;
      params.push(monthParsed.months);
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

    if (search && String(search).trim() !== '') {
      paramCount++;
      const searchPattern = `%${String(search).trim()}%`;
      sql += ` AND (
        u.unit_number ILIKE $${paramCount}
        OR COALESCE((SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1), '') ILIKE $${paramCount}
        OR NULLIF(TRIM(u.resident_name), '') ILIKE $${paramCount}
        OR NULLIF(TRIM(u.owner_name), '') ILIKE $${paramCount}
        OR u.contact_number ILIKE $${paramCount}
      )`;
      params.push(searchPattern);
    }

    sql += `
      GROUP BY u.id, u.unit_number, u.contact_number, b.name, f.floor_number, u.resident_name, u.owner_name
      ORDER BY total_amount_due DESC, u.unit_number
    `;

    const result = await query(sql, params);

    const headers = ['Year', 'Period', 'Unit', 'Resident', 'Contact', 'Block', 'Floor', 'Total Amount Due'];
    const escapeCsv = (val) => {
      if (val == null) return '';
      const s = String(val);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const rows = (result.rows || []).map((r) => ([
      escapeCsv(targetYear),
      escapeCsv(periodLabel),
      escapeCsv(r.unit_number),
      escapeCsv(r.resident_name),
      escapeCsv(r.resident_contact),
      escapeCsv(r.block_name),
      escapeCsv(r.floor_number),
      escapeCsv(r.total_amount_due),
    ]));

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const periodSlug = periodLabel.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="previous-defaulters-${targetYear}-${periodSlug}-${effectiveSocietyId}-${Date.now()}.csv"`
    );
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  } catch (error) {
    console.error('Export previous year defaulters CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export previous year defaulters',
      error: error.message,
    });
  }
};

// Export defaulters as CSV (admin only)
export const exportDefaulters = async (req, res) => {
  try {
    const { society_id } = req.query;

    let sql = `
      SELECT d.id, d.unit_id, d.amount_due, d.months_overdue, d.remarks, d.created_at,
             u.unit_number, u.contact_number as resident_contact, u.email,
             s.name as society_name,
             COALESCE(
               (SELECT usr.name FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin') ORDER BY usr.id ASC LIMIT 1),
               NULLIF(TRIM(u.resident_name), ''),
               NULLIF(TRIM(u.owner_name), ''),
               ''
             ) AS resident_name,
             (SELECT MAX(m.payment_date) FROM maintenance m WHERE m.unit_id = d.unit_id AND m.payment_date IS NOT NULL) AS last_payment_date,
             (SELECT TO_CHAR(TO_DATE(m.year::text || '-' || LPAD(m.month::text, 2, '0') || '-01', 'YYYY-MM-DD'), 'Mon YYYY')
              FROM maintenance m WHERE m.unit_id = d.unit_id ORDER BY m.year DESC, m.month DESC LIMIT 1) AS last_maintenance_period
      FROM defaulters d
      LEFT JOIN units u ON d.unit_id = u.id
      LEFT JOIN apartments s ON d.society_apartment_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (society_id) {
      sql += ' AND d.society_apartment_id = $1';
      params.push(society_id);
    }

    sql += ' ORDER BY d.months_overdue DESC, d.created_at DESC';

    const result = await query(sql, params);

    const formatDate = (val) => (val == null ? '' : new Date(val).toISOString().slice(0, 10));

    // Build CSV (aligned with table: Unit, Resident, Last Payment Date, Amount Due, Months Overdue, Remarks, Society)
    const headers = ['Unit', 'Resident', 'Last Payment Date', 'Contact', 'Email', 'Amount Due', 'Months Overdue', 'Remarks', 'Society'];
    const escapeCsv = (val) => {
      if (val == null) return '';
      const s = String(val);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = result.rows.map((r) => [
      escapeCsv(r.unit_number),
      escapeCsv(r.resident_name),
      escapeCsv(r.last_payment_date ? formatDate(r.last_payment_date) : ''),
      escapeCsv(r.resident_contact),
      escapeCsv(r.email),
      escapeCsv(r.amount_due),
      escapeCsv(r.months_overdue),
      escapeCsv(r.remarks),
      escapeCsv(r.society_name),
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="defaulters-${society_id || 'all'}-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  } catch (error) {
    console.error('Export defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export defaulters',
      error: error.message,
    });
  }
};

// Update defaulter status (and optional remarks)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['active', 'resolved', 'escalated'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const result = await query(
      `UPDATE defaulters 
       SET status = $1,
           remarks = COALESCE($2, remarks),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, remarks !== undefined ? remarks : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Defaulter record not found',
      });
    }

    res.json({
      success: true,
      message: 'Defaulter status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update defaulter status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update defaulter status',
      error: error.message,
    });
  }
};

/**
 * Sync defaulters table from maintenance: units with unpaid maintenance
 * (total_amount - amount_paid > 0) are added/updated in defaulters; units with
 * no unpaid maintenance are removed from defaulters for that society.
 * union_admin: syncs their society only. super_admin: society_id optional, syncs all if omitted.
 */
export const syncFromMaintenance = async (req, res) => {
  try {
    const societyIdParam = req.body?.society_id ?? req.query?.society_id;
    const isUnionAdmin = req.user?.role === 'union_admin';

    let societyIds = [];
    if (isUnionAdmin) {
      const sid = req.user?.society_apartment_id;
      if (!sid) {
        return res.status(400).json({
          success: false,
          message: 'Society context required',
        });
      }
      societyIds = [sid];
    } else {
      // super_admin
      if (societyIdParam != null && societyIdParam !== '') {
        societyIds = [societyIdParam];
      } else {
        const societies = await query('SELECT id FROM apartments ORDER BY id');
        societyIds = societies.rows.map((r) => r.id);
      }
    }

    const result = await runSyncForSocieties(societyIds);

    res.json({
      success: true,
      message: 'Defaulters synced from maintenance successfully',
      data: {
        societies_processed: societyIds.length,
        defaulters_inserted: result.inserted,
        previous_records_removed: result.deleted,
      },
    });
  } catch (error) {
    console.error('Sync defaulters from maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync defaulters from maintenance',
      error: error.message,
    });
  }
};

/**
 * Run defaulters sync for one or more society IDs (used by API and by maintenance controller).
 * Returns { inserted, deleted }.
 */
export async function runSyncForSocieties(societyIds) {
  let totalInserted = 0;
  let totalDeleted = 0;

  for (const societyId of societyIds) {
    const unpaidSql = `
      WITH unpaid AS (
        SELECT
          m.unit_id,
          m.society_apartment_id,
          (m.total_amount - COALESCE(m.amount_paid, 0)) AS due,
          GREATEST(0, (EXTRACT(YEAR FROM CURRENT_DATE)::int - m.year) * 12 + (EXTRACT(MONTH FROM CURRENT_DATE)::int - m.month)) AS months_ago
        FROM maintenance m
        WHERE (m.total_amount - COALESCE(m.amount_paid, 0)) > 0
          AND m.society_apartment_id = $1
          AND (
            m.year < EXTRACT(YEAR FROM CURRENT_DATE)::int
            OR (
              m.year = EXTRACT(YEAR FROM CURRENT_DATE)::int
              AND m.month < EXTRACT(MONTH FROM CURRENT_DATE)::int
            )
          )
      ),
      agg AS (
        SELECT
          unit_id,
          society_apartment_id,
          SUM(due)::DECIMAL(10,2) AS amount_due,
          MAX(months_ago)::int AS months_overdue
        FROM unpaid
        GROUP BY unit_id, society_apartment_id
      )
      SELECT unit_id, society_apartment_id, amount_due, months_overdue FROM agg
    `;
    const unpaidResult = await query(unpaidSql, [societyId]);
    const rows = unpaidResult.rows || [];

    const deleteResult = await query(
      'DELETE FROM defaulters WHERE society_apartment_id = $1 RETURNING id',
      [societyId]
    );
    totalDeleted += deleteResult.rowCount ?? 0;

    for (const row of rows) {
      await query(
        `INSERT INTO defaulters (unit_id, society_apartment_id, amount_due, months_overdue, status)
         VALUES ($1, $2, $3, $4, 'active')`,
        [row.unit_id, row.society_apartment_id, row.amount_due, row.months_overdue]
      );
      totalInserted++;
    }
  }

  return { inserted: totalInserted, deleted: totalDeleted };
}
