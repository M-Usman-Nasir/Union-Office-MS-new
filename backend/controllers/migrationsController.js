import { runMigrations } from '../services/runMigrations.js';

/**
 * POST /api/super-admin/run-migrations
 * Run database migrations. Super admin only. Safe to re-run (IF NOT EXISTS / skip codes).
 */
export const runMigrationsHandler = async (req, res) => {
  try {
    const result = await runMigrations();
    return res.json({
      success: result.success,
      message: result.message,
      applied: result.applied || [],
      skipped: result.skipped || [],
    });
  } catch (error) {
    console.error('Run migrations error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Migrations failed',
      applied: [],
      skipped: [],
    });
  }
};
