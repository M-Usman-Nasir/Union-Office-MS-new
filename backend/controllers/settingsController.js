import { query } from '../config/database.js';

// Get settings for a society
export const getSettings = async (req, res) => {
  try {
    const { societyId } = req.params;

    let result;
    if (societyId) {
      result = await query(
        'SELECT * FROM settings WHERE society_apartment_id = $1',
        [societyId]
      );
    } else {
      // Get all settings
      result = await query('SELECT * FROM settings ORDER BY society_apartment_id');
    }

    if (societyId && result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        success: true,
        data: {
          society_apartment_id: parseInt(societyId),
          defaulter_list_visible: false,
          complaint_logs_visible: false,
          financial_reports_visible: false
        }
      });
    }

    res.json({
      success: true,
      data: societyId ? result.rows[0] : result.rows
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
};

// Update settings for a society
export const updateSettings = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { defaulter_list_visible, complaint_logs_visible, financial_reports_visible } = req.body;

    // Check if settings exist
    const existing = await query(
      'SELECT id FROM settings WHERE society_apartment_id = $1',
      [societyId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing settings
      result = await query(
        `UPDATE settings 
         SET defaulter_list_visible = COALESCE($1, defaulter_list_visible),
             complaint_logs_visible = COALESCE($2, complaint_logs_visible),
             financial_reports_visible = COALESCE($3, financial_reports_visible),
             updated_at = CURRENT_TIMESTAMP
         WHERE society_apartment_id = $4
         RETURNING *`,
        [defaulter_list_visible, complaint_logs_visible, financial_reports_visible, societyId]
      );
    } else {
      // Create new settings
      result = await query(
        `INSERT INTO settings (society_apartment_id, defaulter_list_visible, complaint_logs_visible, financial_reports_visible)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          societyId,
          defaulter_list_visible !== undefined ? defaulter_list_visible : false,
          complaint_logs_visible !== undefined ? complaint_logs_visible : false,
          financial_reports_visible !== undefined ? financial_reports_visible : false
        ]
      );
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

// Get maintenance configuration
export const getMaintenanceConfig = async (req, res) => {
  try {
    const { societyId } = req.params;

    // Check if maintenance_config table exists, if not return empty
    const result = await query(`
      SELECT * FROM maintenance_config 
      WHERE society_apartment_id = $1
      ORDER BY 
        CASE WHEN unit_id IS NOT NULL THEN 1 
             WHEN block_id IS NOT NULL THEN 2 
             ELSE 3 END
    `, [societyId]).catch(() => ({ rows: [] }));

    res.json({
      success: true,
      data: result.rows || []
    });
  } catch (error) {
    console.error('Get maintenance config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance configuration',
      error: error.message
    });
  }
};

// Update maintenance configuration
export const updateMaintenanceConfig = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { configs } = req.body; // Array of config objects

    if (!Array.isArray(configs)) {
      return res.status(400).json({
        success: false,
        message: 'Configs must be an array'
      });
    }

    const results = [];

    for (const config of configs) {
      const { id, unit_id, block_id, base_amount } = config;

      if (id) {
        // Update existing config
        const result = await query(`
          UPDATE maintenance_config 
          SET base_amount = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2 AND society_apartment_id = $3
          RETURNING *
        `, [base_amount, id, societyId]).catch(() => ({ rows: [] }));

        if (result.rows.length > 0) {
          results.push(result.rows[0]);
        }
      } else {
        // Create new config
        const result = await query(`
          INSERT INTO maintenance_config (society_apartment_id, unit_id, block_id, base_amount)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [societyId, unit_id || null, block_id || null, base_amount]).catch(() => ({ rows: [] }));

        if (result.rows.length > 0) {
          results.push(result.rows[0]);
        }
      }
    }

    res.json({
      success: true,
      message: 'Maintenance configuration updated successfully',
      data: results
    });
  } catch (error) {
    console.error('Update maintenance config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance configuration',
      error: error.message
    });
  }
};
