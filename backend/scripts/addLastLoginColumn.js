import dotenv from 'dotenv'
import { query } from '../config/database.js'

dotenv.config()

console.log('🔄 Adding last_login column to users table...\n')

try {
  // Add last_login column if it doesn't exist
  await query(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP
  `)
  
  console.log('✅ Successfully added last_login column to users table\n')
  
  // Also add is_active if it doesn't exist
  await query(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
  `)
  
  console.log('✅ Successfully added is_active column to users table\n')
  
  process.exit(0)
} catch (error) {
  console.error('\n❌ Error:', error.message)
  process.exit(1)
}
