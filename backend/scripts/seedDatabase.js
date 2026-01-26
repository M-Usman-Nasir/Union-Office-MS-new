import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { query } from '../config/database.js'

dotenv.config()

console.log('🌱 Seeding database with mock data...\n')

try {
  // 1. Create test users
  console.log('📝 Creating test users...')
  
  const adminPassword = await bcrypt.hash('admin123', 10)
  const residentPassword = await bcrypt.hash('resident123', 10)
  
  // Check if users already exist
  const existingAdmin = await query('SELECT id FROM users WHERE email = $1', ['admin@homelandunion.com'])
  const existingUnionAdmin = await query('SELECT id FROM users WHERE email = $1', ['unionadmin@homelandunion.com'])
  const existingResident = await query('SELECT id FROM users WHERE email = $1', ['resident@homelandunion.com'])
  
  let superAdminId, unionAdminId, residentId
  
  if (existingAdmin.rows.length === 0) {
    const adminResult = await query(
      `INSERT INTO users (email, password, name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['admin@homelandunion.com', adminPassword, 'Super Admin User', 'super_admin', true]
    )
    superAdminId = adminResult.rows[0].id
    console.log('✅ Created Super Admin user')
  } else {
    superAdminId = existingAdmin.rows[0].id
    console.log('ℹ️  Super Admin user already exists')
  }
  
  if (existingUnionAdmin.rows.length === 0) {
    const unionAdminResult = await query(
      `INSERT INTO users (email, password, name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['unionadmin@homelandunion.com', adminPassword, 'Union Admin User', 'union_admin', true]
    )
    unionAdminId = unionAdminResult.rows[0].id
    console.log('✅ Created Union Admin user')
  } else {
    unionAdminId = existingUnionAdmin.rows[0].id
    console.log('ℹ️  Union Admin user already exists')
  }
  
  if (existingResident.rows.length === 0) {
    const residentResult = await query(
      `INSERT INTO users (email, password, name, role, is_active, contact_number) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['resident@homelandunion.com', residentPassword, 'Resident User', 'resident', true, '03001234567']
    )
    residentId = residentResult.rows[0].id
    console.log('✅ Created Resident user')
  } else {
    residentId = existingResident.rows[0].id
    console.log('ℹ️  Resident user already exists')
  }
  
  // 2. Create Society
  console.log('\n🏢 Creating societies...')
  let societyId
  const existingSociety = await query('SELECT id FROM societies WHERE name = $1', ['Homeland Union Society'])
  
  if (existingSociety.rows.length === 0) {
    const societyResult = await query(
      `INSERT INTO societies (name, address, city, total_blocks, total_units) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Homeland Union Society', '123 Main Street', 'Karachi', 3, 30]
    )
    societyId = societyResult.rows[0].id
    console.log('✅ Created society')
  } else {
    societyId = existingSociety.rows[0].id
    console.log('ℹ️  Society already exists')
  }
  
  // Update union admin with society
  await query('UPDATE users SET society_apartment_id = $1 WHERE id = $2', [societyId, unionAdminId])
  
  // 3. Create Blocks
  console.log('\n🏗️  Creating blocks...')
  const blocks = []
  for (let i = 1; i <= 3; i++) {
    const existingBlock = await query('SELECT id FROM blocks WHERE name = $1 AND society_apartment_id = $2', [`Block ${i}`, societyId])
    
    if (existingBlock.rows.length === 0) {
      const blockResult = await query(
        `INSERT INTO blocks (society_apartment_id, name, total_floors, total_units) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [societyId, `Block ${i}`, 5, 10]
      )
      blocks.push(blockResult.rows[0].id)
      console.log(`✅ Created Block ${i}`)
    } else {
      blocks.push(existingBlock.rows[0].id)
      console.log(`ℹ️  Block ${i} already exists`)
    }
  }
  
  // 4. Create Floors
  console.log('\n📐 Creating floors...')
  const floors = []
  for (const blockId of blocks) {
    for (let floorNum = 1; floorNum <= 5; floorNum++) {
      const existingFloor = await query('SELECT id FROM floors WHERE block_id = $1 AND floor_number = $2', [blockId, floorNum])
      
      if (existingFloor.rows.length === 0) {
        const floorResult = await query(
          `INSERT INTO floors (block_id, floor_number, total_units) 
           VALUES ($1, $2, $3) RETURNING id`,
          [blockId, floorNum, 2]
        )
        floors.push(floorResult.rows[0].id)
      }
    }
  }
  console.log(`✅ Created ${floors.length} floors`)
  
  // 5. Create Units
  console.log('\n🏠 Creating units...')
  const units = []
  let unitCounter = 1
  
  for (const blockId of blocks) {
    for (let floorNum = 1; floorNum <= 5; floorNum++) {
      const floorResult = await query('SELECT id FROM floors WHERE block_id = $1 AND floor_number = $2', [blockId, floorNum])
      if (floorResult.rows.length > 0) {
        const floorId = floorResult.rows[0].id
        
        for (let unitNum = 1; unitNum <= 2; unitNum++) {
          const existingUnit = await query('SELECT id FROM units WHERE floor_id = $1 AND unit_number = $2', [floorId, String(unitNum)])
          
          if (existingUnit.rows.length === 0) {
            const unitResult = await query(
              `INSERT INTO units (society_apartment_id, block_id, floor_id, unit_number, owner_name, resident_name, contact_number) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
              [societyId, blockId, floorId, String(unitNum), `Owner ${unitCounter}`, `Resident ${unitCounter}`, `0300${String(unitCounter).padStart(7, '0')}`]
            )
            units.push(unitResult.rows[0].id)
            unitCounter++
          } else {
            units.push(existingUnit.rows[0].id)
          }
        }
      }
    }
  }
  console.log(`✅ Created ${units.length} units`)
  
  // Update resident with unit
  if (units.length > 0) {
    await query('UPDATE users SET unit_id = $1, society_apartment_id = $2 WHERE id = $3', [units[0], societyId, residentId])
  }
  
  // 6. Create Maintenance Records
  console.log('\n💰 Creating maintenance records...')
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  
  for (let i = 0; i < 10; i++) {
    const unitId = units[Math.floor(Math.random() * units.length)]
    const baseAmount = Math.floor(Math.random() * 5000) + 1000
    const totalAmount = baseAmount + Math.floor(Math.random() * 500)
    const month = ((currentMonth + i) % 12) || 12
    const year = currentYear + Math.floor((currentMonth + i - 1) / 12)
    const status = i % 3 === 0 ? 'paid' : 'pending'
    
    const existing = await query(
      'SELECT id FROM maintenance WHERE unit_id = $1 AND month = $2 AND year = $3',
      [unitId, month, year]
    )
    
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO maintenance (unit_id, society_apartment_id, month, year, base_amount, total_amount, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [unitId, societyId, month, year, baseAmount, totalAmount, status]
      )
    }
  }
  console.log('✅ Created maintenance records')
  
  // 7. Create Finance Records
  console.log('\n💵 Creating finance records...')
  const incomeTypes = ['Maintenance Collection', 'Rent', 'Other Income']
  const expenseTypes = ['Utility Payment', 'Salary', 'Repairs', 'Security', 'Cleaning', 'Maintenance']
  
  for (let i = 0; i < 15; i++) {
    const type = Math.random() > 0.5 ? 'income' : 'expense'
    const amount = Math.floor(Math.random() * 50000) + 5000
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    let description, expenseType, incomeType
    
    if (type === 'income') {
      incomeType = incomeTypes[Math.floor(Math.random() * incomeTypes.length)]
      description = `${incomeType} - ${type}`
    } else {
      expenseType = expenseTypes[Math.floor(Math.random() * expenseTypes.length)]
      description = `${expenseType} - ${type}`
    }
    
    await query(
      `INSERT INTO finance (society_apartment_id, transaction_type, expense_type, income_type, amount, description, transaction_date, added_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [societyId, type, expenseType || null, incomeType || null, amount, description, date, unionAdminId]
    )
  }
  console.log('✅ Created finance records')
  
  // 8. Create Complaints
  console.log('\n📢 Creating complaints...')
  const complaintTitles = [
    'Plumbing Issue',
    'Electrical Problem',
    'Security Concern',
    'Cleaning Request',
    'Water Leakage',
    'Noise Complaint',
    'Parking Issue',
    'Maintenance Request'
  ]
  const priorities = ['low', 'medium', 'high', 'urgent']
  const statuses = ['pending', 'in_progress', 'resolved', 'closed']
  
  for (let i = 0; i < 8; i++) {
    const title = complaintTitles[i] || `Complaint ${i + 1}`
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 20))
    
    await query(
      `INSERT INTO complaints (unit_id, society_apartment_id, submitted_by, title, description, priority, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [units[0], societyId, residentId, title, `Description for ${title.toLowerCase()}`, priority, status, date]
    )
  }
  console.log('✅ Created complaints')
  
  // 9. Create Announcements
  console.log('\n📣 Creating announcements...')
  const announcements = [
    { title: 'Monthly Meeting', description: 'Monthly society meeting on 1st of every month', type: 'meeting' },
    { title: 'Maintenance Due', description: 'Please pay your maintenance fees by the 10th', type: 'payment' },
    { title: 'Water Supply Notice', description: 'Water supply will be interrupted for maintenance', type: 'notice' },
    { title: 'Security Update', description: 'New security measures implemented', type: 'update' },
  ]
  
  for (const ann of announcements) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 10))
    
    await query(
      `INSERT INTO announcements (society_apartment_id, title, description, type, created_by, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [societyId, ann.title, ann.description, ann.type, unionAdminId, date]
    )
  }
  console.log('✅ Created announcements')
  
  // 10. Create Defaulters
  console.log('\n⚠️  Creating defaulters...')
  for (let i = 0; i < 5; i++) {
    const unitId = units[Math.floor(Math.random() * units.length)]
    const amount = Math.floor(Math.random() * 20000) + 5000
    const monthsOverdue = Math.floor(Math.random() * 6) + 1
    const status = Math.random() > 0.7 ? 'resolved' : 'active'
    
    const existing = await query('SELECT id FROM defaulters WHERE unit_id = $1', [unitId])
    
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO defaulters (unit_id, society_apartment_id, amount_due, months_overdue, status) 
         VALUES ($1, $2, $3, $4, $5)`,
        [unitId, societyId, amount, monthsOverdue, status]
      )
    }
  }
  console.log('✅ Created defaulters')
  
  console.log('\n✅ Database seeding completed successfully!')
  console.log('\n📋 Test Users:')
  console.log('   Super Admin: admin@homelandunion.com / admin123')
  console.log('   Union Admin: unionadmin@homelandunion.com / admin123')
  console.log('   Resident: resident@homelandunion.com / resident123')
  console.log('\n')
  
  process.exit(0)
} catch (error) {
  console.error('\n❌ Error seeding database:', error.message)
  console.error(error.stack)
  process.exit(1)
}
