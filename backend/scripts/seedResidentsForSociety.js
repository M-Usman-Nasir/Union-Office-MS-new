/* eslint-env node */
/**
 * One-time script: create a resident user for each unit in a society that doesn't have one.
 * Usage: node scripts/seedResidentsForSociety.js <society_id>
 * Example: node scripts/seedResidentsForSociety.js 1
 *
 * Creates users with dummy email (user_<unitId>@society<societyId>.local), name (User <unit_number>),
 * and password (Password1!) so residents can log in and edit their details later.
 */
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { query } from '../config/database.js'

dotenv.config()

const societyId = process.argv[2] ? parseInt(process.argv[2], 10) : null
if (!societyId || Number.isNaN(societyId)) {
  console.error('Usage: node scripts/seedResidentsForSociety.js <society_id>')
  console.error('Example: node scripts/seedResidentsForSociety.js 1')
  process.exit(1)
}

const DUMMY_PASSWORD = 'Password1!'

async function run() {
  console.log(`\n🌱 Seeding residents for society_id = ${societyId}...\n`)

  const hashedPassword = await bcrypt.hash(DUMMY_PASSWORD, 10)

  const unitsResult = await query(
    'SELECT id, unit_number, society_apartment_id FROM units WHERE society_apartment_id = $1 ORDER BY id',
    [societyId]
  )
  const units = unitsResult.rows
  if (units.length === 0) {
    console.log('No units found for this society. Exiting.')
    process.exit(0)
  }
  console.log(`Found ${units.length} unit(s) in society ${societyId}.`)

  let created = 0
  let skipped = 0

  for (const unit of units) {
    const existing = await query(
      `SELECT 1 FROM users WHERE unit_id = $1 AND role IN ('resident', 'union_admin')`,
      [unit.id]
    )
    if (existing.rows.length > 0) {
      skipped++
      continue
    }

    const email = `user_${unit.id}_society${societyId}@example.com`
    const name = `User ${unit.unit_number || unit.id}`

    await query(
      `INSERT INTO users (email, password, name, role, society_apartment_id, unit_id, created_by)
       VALUES ($1, $2, $3, 'resident', $4, $5, NULL)`,
      [email, hashedPassword, name, societyId, unit.id]
    )
    created++
    console.log(`  Created resident: ${email} (${name}) for unit ${unit.unit_number || unit.id}`)
  }

  console.log(`\n✅ Done. Created ${created} resident(s), skipped ${skipped} unit(s) that already have a resident.\n`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
