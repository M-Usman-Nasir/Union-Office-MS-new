/**
 * Run all SQL migrations from database/migrations in order.
 * Uses ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS so safe to re-run.
 * Run from backend directory: node scripts/runMigrations.js
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config()

const MIGRATIONS_DIR = path.resolve(__dirname, '../../database/migrations')

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error('Migrations directory not found:', MIGRATIONS_DIR)
    process.exit(1)
  }
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] ?? '999', 10)
      const numB = parseInt(b.match(/^\d+/)?.[0] ?? '999', 10)
      if (numA !== numB) return numA - numB
      return a.localeCompare(b)
    })
  return files
}

async function runMigrations() {
  const files = getMigrationFiles()
  console.log(`Found ${files.length} migration(s)\n`)

  const client = await pool.connect()
  try {
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      const trimmed = sql.replace(/^\s*--.*$/gm, '').trim()
      if (!trimmed) {
        console.log(`⏭️  ${file} (empty, skip)`)
        continue
      }
      try {
        await client.query(trimmed)
        console.log(`✅ ${file}`)
      } catch (err) {
        const skipCodes = ['42710', '42P07', '42701', '42P16', '42704']
        if (skipCodes.includes(err.code)) {
          console.log(`⏭️  ${file} (already applied: ${err.message?.slice(0, 50)}...)`)
        } else {
          console.error(`❌ ${file}:`, err.message)
          throw err
        }
      }
    }
    console.log('\n✅ All migrations completed.')
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations().then(
  () => process.exit(0),
  (err) => {
    console.error(err)
    process.exit(1)
  }
)
