/**
 * Run all SQL migrations from database/migrations in order (CLI).
 * Uses the shared runMigrations service; then closes pool and exits.
 * Run from backend directory: node scripts/runMigrations.js
 */
import dotenv from 'dotenv';
import pool from '../config/database.js';
import { runMigrations } from '../services/runMigrations.js';

dotenv.config();

runMigrations()
  .then((result) => {
    console.log(result.message);
    if (result.applied?.length) console.log('Applied:', result.applied.join(', '));
    if (result.skipped?.length) console.log('Skipped:', result.skipped.join(', '));
    return pool.end();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err.message || err);
    pool.end().then(() => process.exit(1)).catch(() => process.exit(1));
  });
