import { query } from '../config/database.js';
import * as auditLog from '../services/auditLogService.js';

/**
 * GET /api/settings/global – super admin only
 * Returns all global settings as key-value object.
 */
export const getGlobal = async (req, res) => {
  try {
    const result = await query('SELECT key, value, value_json FROM global_settings ORDER BY key');
    const data = {};
    (result.rows || []).forEach((row) => {
      if (row.value_json != null) {
        data[row.key] = row.value_json;
      } else {
        data[row.key] = row.value;
      }
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get global settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global settings',
      error: error.message,
    });
  }
};

/**
 * PUT /api/settings/global – super admin only
 * Body: { default_currency?, default_due_day?, maintenance_reminder_days_default?, max_upload_size_mb? }
 */
export const updateGlobal = async (req, res) => {
  try {
    const payload = req.body || {};
    const allowedKeys = ['default_currency', 'default_due_day', 'maintenance_reminder_days_default', 'max_upload_size_mb'];

    for (const key of allowedKeys) {
      if (payload[key] === undefined) continue;
      const value = payload[key];
      const valueStr = value != null && typeof value !== 'object' ? String(value) : null;
      const valueJson = typeof value === 'object' ? JSON.stringify(value) : null;

      await query(
        `INSERT INTO global_settings (key, value, value_json, updated_at, updated_by)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
         ON CONFLICT (key) DO UPDATE SET
           value = COALESCE($2, global_settings.value),
           value_json = COALESCE($3, global_settings.value_json),
           updated_at = CURRENT_TIMESTAMP,
           updated_by = $4`,
        [key, valueStr, valueJson, req.user?.id || null]
      );
    }

    await auditLog.log(req, {
      action: 'global_settings.update',
      resourceType: 'global_settings',
      details: payload,
    });

    const result = await query('SELECT key, value, value_json FROM global_settings ORDER BY key');
    const data = {};
    (result.rows || []).forEach((row) => {
      if (row.value_json != null) {
        data[row.key] = row.value_json;
      } else {
        data[row.key] = row.value;
      }
    });

    res.json({ success: true, message: 'Global settings updated', data });
  } catch (error) {
    console.error('Update global settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update global settings',
      error: error.message,
    });
  }
};
