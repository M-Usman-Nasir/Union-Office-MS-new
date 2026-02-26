import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runMigrations } from '../services/runMigrations.js';
import pool from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(__dirname, '../../database/schema.sql');

/**
 * POST /api/bootstrap
 * One-time setup: run base schema (if no users table), migrations + create first super_admin if none exist.
 * Protected by X-Bootstrap-Secret header. Set BOOTSTRAP_SECRET, BOOTSTRAP_SUPER_ADMIN_EMAIL, BOOTSTRAP_SUPER_ADMIN_PASSWORD in env.
 */
export const bootstrap = async (req, res) => {
  const secret = req.headers['x-bootstrap-secret'];
  if (!process.env.BOOTSTRAP_SECRET || secret !== process.env.BOOTSTRAP_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing X-Bootstrap-Secret',
    });
  }

  const email = process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Set BOOTSTRAP_SUPER_ADMIN_EMAIL and BOOTSTRAP_SUPER_ADMIN_PASSWORD in environment',
    });
  }

  try {
    const client = await pool.connect();
    let schemaRun = false;

    try {
      // 1. If users table does not exist, run base schema first
      const tableCheck = await client.query(
        "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'"
      );
      if (tableCheck.rows.length === 0 && fs.existsSync(SCHEMA_PATH)) {
        const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
        const trimmed = schemaSql.replace(/^\s*--.*$/gm, '').trim();
        if (trimmed) {
          await client.query(trimmed);
          schemaRun = true;
        }
      }
    } finally {
      client.release();
    }

    // 2. Run migrations (add columns, new tables)
    const migrationResult = await runMigrations();

    // 3. Create super_admin if none exist
    const existing = await pool.query(
      "SELECT id FROM users WHERE role = 'super_admin' LIMIT 1"
    );
    let superAdminCreated = false;
    if (existing.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const name = process.env.BOOTSTRAP_SUPER_ADMIN_NAME || 'Super Admin';
      await pool.query(
        `INSERT INTO users (email, password, name, role, is_active)
         VALUES ($1, $2, $3, 'super_admin', true)`,
        [email, hashedPassword, name]
      );
      superAdminCreated = true;
    }

    return res.json({
      success: true,
      message: 'Bootstrap completed.',
      schemaRun,
      migrations: migrationResult,
      superAdminCreated,
      hint: superAdminCreated
        ? `Log in with ${email} and the password you set. Consider removing BOOTSTRAP_* env vars after first use.`
        : 'A super_admin already exists. You can log in.',
    });
  } catch (error) {
    console.error('Bootstrap error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Bootstrap failed',
    });
  }
};
