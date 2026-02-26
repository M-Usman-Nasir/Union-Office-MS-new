/**
 * Reusable migration runner. Safe to call from API (does not call pool.end()).
 * Migrations dir: repo root / database/migrations (resolved from backend/services).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../database/migrations');

const SKIP_CODES = ['42710', '42P07', '42701', '42P16', '42704'];

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] ?? '999', 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] ?? '999', 10);
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
    });
}

/**
 * Run all migrations. Does NOT call pool.end() so the app keeps running.
 * @returns {{ success: boolean, message: string, applied: string[], skipped: string[], error?: string }}
 */
export async function runMigrations() {
  const files = getMigrationFiles();
  const applied = [];
  const skipped = [];

  if (files.length === 0) {
    return {
      success: true,
      message: 'No migration files found.',
      applied: [],
      skipped: [],
    };
  }

  const client = await pool.connect();
  try {
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      const trimmed = sql.replace(/^\s*--.*$/gm, '').trim();
      if (!trimmed) {
        skipped.push(`${file} (empty)`);
        continue;
      }
      try {
        await client.query(trimmed);
        applied.push(file);
      } catch (err) {
        if (SKIP_CODES.includes(err.code)) {
          skipped.push(`${file} (already applied)`);
        } else {
          throw err;
        }
      }
    }
    return {
      success: true,
      message: `Migrations completed. ${applied.length} applied, ${skipped.length} skipped.`,
      applied,
      skipped,
    };
  } finally {
    client.release();
  }
}
