/**
 * After migration 043, run once to create unit-based resident logins for units that have none.
 *
 * Usage (from backend folder):
 *   node scripts/backfillUnitResidentUsers.js
 *
 * Requires DATABASE_URL / same env as the API.
 */
import dotenv from 'dotenv';
import { query } from '../config/database.js';
import { createResidentUserForUnit } from '../utils/unitResidentLogin.js';

dotenv.config();

async function main() {
  const units = await query(
    `SELECT u.id FROM units u
     WHERE NOT EXISTS (
       SELECT 1 FROM users usr
       WHERE usr.unit_id = u.id AND usr.role = 'resident'
     )
     ORDER BY u.id`
  );

  let ok = 0;
  let fail = 0;
  for (const row of units.rows) {
    try {
      await createResidentUserForUnit({ unitId: row.id, createdBy: null });
      ok++;
      console.log('Created resident user for unit', row.id);
    } catch (e) {
      fail++;
      console.error('Unit', row.id, e.message);
    }
  }
  console.log(`Done. Created: ${ok}, failed: ${fail}, total units without resident: ${units.rows.length}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
