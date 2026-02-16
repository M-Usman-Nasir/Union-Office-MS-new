/* eslint-env node */
import dotenv from 'dotenv';
import { query } from '../config/database.js';
import { refreshApartmentTotals } from '../controllers/propertyController.js';

dotenv.config();

async function run() {
  try {
    const result = await query('SELECT id, name FROM apartments ORDER BY id');
    console.log(`Refreshing totals for ${result.rows.length} apartment(s)...`);
    for (const row of result.rows) {
      await refreshApartmentTotals(row.id);
      console.log(`  ✓ ${row.name || 'Apartment #' + row.id} (id=${row.id})`);
    }
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  process.exit(0);
}

run();
