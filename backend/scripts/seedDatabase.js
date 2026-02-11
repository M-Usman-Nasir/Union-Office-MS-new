/* eslint-env node */
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { query } from '../config/database.js'

dotenv.config()

console.log('🌱 Seeding database with mock data...\n')

// Realistic names and addresses for clean, manageable data
const FIRST_NAMES = [
  'Ali', 'Sara', 'Ahmed', 'Fatima', 'Hassan', 'Ayesha', 'Omar', 'Zainab',
  'Usman', 'Mariam', 'Khalid', 'Hira', 'Bilal', 'Sana', 'Tariq', 'Nadia',
  'Imran', 'Layla', 'Rashid', 'Amina', 'Faisal', 'Samina', 'Nadeem', 'Rukhsar'
]
const LAST_NAMES = [
  'Khan', 'Ahmed', 'Hussain', 'Malik', 'Shah', 'Ali', 'Raza', 'Abbas',
  'Hassan', 'Siddiqui', 'Mirza', 'Chaudhry', 'Sheikh', 'Qureshi', 'Butt'
]
const STREETS = [
  'Block A, Unit 101', 'Block A, Unit 102', 'Block B, Unit 201', 'Block B, Unit 202',
  'Block C, Unit 301', 'Block C, Unit 302', 'Tower 1, Floor 2', 'Tower 2, Floor 1',
  'Wing East, 3rd Floor', 'Wing West, 1st Floor', 'Phase 1, Unit 5', 'Phase 2, Unit 12'
]
function pick(arr, index) {
  return arr[index % arr.length]
}

function randomPhone() {
  return '0300' + String(Math.floor(Math.random() * 9000000) + 1000000)
}

try {
  // 1. Create test users (Super Admin + Union Admins + first Resident)
  console.log('📝 Creating test users...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const residentPassword = await bcrypt.hash('resident123', 10)

  const superAdminEmail = 'hasanshkh17@gmail.com'
  const existingAdmin = await query('SELECT id FROM users WHERE email = $1', [superAdminEmail])
  const oldAdmin = await query('SELECT id FROM users WHERE email = $1 AND role = $2', ['admin@homelandunion.com', 'super_admin'])
  const existingUnionAdmin = await query('SELECT id FROM users WHERE email = $1', ['unionadmin@homelandunion.com'])
  const existingResident = await query('SELECT id FROM users WHERE email = $1', ['resident@homelandunion.com'])

  let unionAdminId, residentId

  if (existingAdmin.rows.length === 0) {
    if (oldAdmin.rows.length > 0) {
      await query(
        `UPDATE users SET email = $1, name = $2 WHERE id = $3`,
        [superAdminEmail, 'Sheikh Hasan', oldAdmin.rows[0].id]
      )
      console.log('✅ Updated existing Super Admin to Sheikh Hasan / hasanshkh17@gmail.com')
    } else {
      await query(
        `INSERT INTO users (email, password, name, role, is_active) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [superAdminEmail, adminPassword, 'Sheikh Hasan', 'super_admin', true]
      )
      console.log('✅ Created Super Admin user (Sheikh Hasan)')
    }
  } else {
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
      `INSERT INTO users (email, password, name, role, is_active, contact_number, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      ['resident@homelandunion.com', residentPassword, 'Resident User', 'resident', true, '03001234567', '123 Main Street, Block A, Unit 101, Karachi']
    )
    residentId = residentResult.rows[0].id
    console.log('✅ Created Resident user')
  } else {
    residentId = existingResident.rows[0].id
    console.log('ℹ️  Resident user already exists')
  }

  // Apartments to seed: name, address, city, area, blocks, floorsPerBlock, unitsPerFloor
  const apartmentSpecs = [
    { name: 'Homeland Union Society', address: '123 Main Street', city: 'Karachi', area: 'DHA', blocks: 3, floorsPerBlock: 5, unitsPerFloor: 2 },
    { name: 'Marina Heights', address: '45 Sea View Road', city: 'Karachi', area: 'Clifton', blocks: 2, floorsPerBlock: 4, unitsPerFloor: 2 },
    { name: 'Green Valley Apartments', address: '78 Garden Avenue', city: 'Lahore', area: 'Gulberg', blocks: 2, floorsPerBlock: 3, unitsPerFloor: 2 }
  ]

  const allUnitIdsByApartment = []
  const apartmentIds = []
  let unionAdminIds = [unionAdminId]
  const residentUserIds = [residentId]

  for (let aptIndex = 0; aptIndex < apartmentSpecs.length; aptIndex++) {
    const spec = apartmentSpecs[aptIndex]
    console.log(`\n🏢 Creating apartment: ${spec.name}...`)

    let societyId
    const existingApartment = await query('SELECT id FROM apartments WHERE name = $1', [spec.name])

    if (existingApartment.rows.length === 0) {
      const totalUnits = spec.blocks * spec.floorsPerBlock * spec.unitsPerFloor
      const totalFloors = spec.blocks * spec.floorsPerBlock
      const apartmentResult = await query(
        `INSERT INTO apartments (name, address, city, area, total_blocks, total_floors, total_units) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [spec.name, spec.address, spec.city, spec.area || null, spec.blocks, totalFloors, totalUnits]
      )
      societyId = apartmentResult.rows[0].id
      console.log(`✅ Created apartment: ${spec.name}`)
    } else {
      societyId = existingApartment.rows[0].id
      console.log(`ℹ️  Apartment already exists: ${spec.name}`)
    }
    apartmentIds.push(societyId)

    // One Union Admin per apartment (for apartments 2 and 3, create new union admins)
    if (aptIndex >= 1) {
      const uaEmail = `unionadmin${aptIndex + 1}@homelandunion.com`
      const existingUA = await query('SELECT id FROM users WHERE email = $1', [uaEmail])
      let uaId
      if (existingUA.rows.length === 0) {
        const uaResult = await query(
          `INSERT INTO users (email, password, name, role, is_active, society_apartment_id) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [uaEmail, adminPassword, `Union Admin ${spec.name}`, 'union_admin', true, societyId]
        )
        uaId = uaResult.rows[0].id
        console.log(`✅ Created Union Admin for ${spec.name}`)
      } else {
        uaId = existingUA.rows[0].id
        await query('UPDATE users SET society_apartment_id = $1 WHERE id = $2', [societyId, uaId])
      }
      unionAdminIds.push(uaId)
    } else {
      await query('UPDATE users SET society_apartment_id = $1 WHERE id = $2', [societyId, unionAdminId])
    }

    // Blocks
    console.log(`   🏗️  Creating ${spec.blocks} blocks...`)
    const blocks = []
    for (let i = 1; i <= spec.blocks; i++) {
      const blockName = `Block ${String.fromCharCode(64 + i)}`
      const existingBlock = await query('SELECT id FROM blocks WHERE name = $1 AND society_apartment_id = $2', [blockName, societyId])
      const totalUnitsBlock = spec.floorsPerBlock * spec.unitsPerFloor
      if (existingBlock.rows.length === 0) {
        const blockResult = await query(
          `INSERT INTO blocks (society_apartment_id, name, total_floors, total_units) 
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [societyId, blockName, spec.floorsPerBlock, totalUnitsBlock]
        )
        blocks.push(blockResult.rows[0].id)
      } else {
        blocks.push(existingBlock.rows[0].id)
      }
    }

    // Floors
    const floors = []
    for (const blockId of blocks) {
      for (let floorNum = 1; floorNum <= spec.floorsPerBlock; floorNum++) {
        const existingFloor = await query('SELECT id FROM floors WHERE block_id = $1 AND floor_number = $2', [blockId, floorNum])
        if (existingFloor.rows.length === 0) {
          const floorResult = await query(
            `INSERT INTO floors (block_id, floor_number, total_units) 
             VALUES ($1, $2, $3) RETURNING id`,
            [blockId, floorNum, spec.unitsPerFloor]
          )
          floors.push(floorResult.rows[0].id)
        }
      }
    }

    // Units with realistic owner/resident names
    console.log(`   🏠 Creating units with resident names...`)
    const unitIds = []
    let unitCounter = 0
    for (const blockId of blocks) {
      for (let floorNum = 1; floorNum <= spec.floorsPerBlock; floorNum++) {
        const floorResult = await query('SELECT id FROM floors WHERE block_id = $1 AND floor_number = $2', [blockId, floorNum])
        if (floorResult.rows.length > 0) {
          const floorId = floorResult.rows[0].id
          for (let unitNum = 1; unitNum <= spec.unitsPerFloor; unitNum++) {
            const existingUnit = await query('SELECT id FROM units WHERE floor_id = $1 AND unit_number = $2', [floorId, String(unitNum)])
            const ownerName = `${pick(FIRST_NAMES, unitCounter)} ${pick(LAST_NAMES, unitCounter + 7)}`
            const residentName = `${pick(FIRST_NAMES, unitCounter + 3)} ${pick(LAST_NAMES, unitCounter + 11)}`
            const contact = randomPhone()
            if (existingUnit.rows.length === 0) {
              const unitResult = await query(
                `INSERT INTO units (society_apartment_id, block_id, floor_id, unit_number, owner_name, resident_name, contact_number) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [societyId, blockId, floorId, String(unitNum), ownerName, residentName, contact]
              )
              unitIds.push(unitResult.rows[0].id)
            } else {
              unitIds.push(existingUnit.rows[0].id)
            }
            unitCounter++
          }
        }
      }
    }
    allUnitIdsByApartment.push({ societyId, unitIds, spec })
    console.log(`   ✅ Created ${unitIds.length} units`)
  }

  // Link first resident to first apartment's first unit and set address
  const firstApt = allUnitIdsByApartment[0]
  if (firstApt.unitIds.length > 0) {
    await query(
      'UPDATE users SET unit_id = $1, society_apartment_id = $2, address = $3 WHERE id = $4',
      [firstApt.unitIds[0], firstApt.societyId, `${firstApt.spec.address}, ${pick(STREETS, 0)}, ${firstApt.spec.city}`, residentId]
    )
  }

  // Create additional resident users (different names and addresses) across apartments
  console.log('\n👥 Creating additional residents with names and addresses...')
  const residentSeed = [
    { email: 'sara.ahmed@example.com', name: 'Sara Ahmed', address: '123 Main Street, Block A, Unit 102, Karachi', societyIndex: 0, unitIndex: 1 },
    { email: 'ahmed.khan@example.com', name: 'Ahmed Khan', address: '123 Main Street, Block B, Unit 201, Karachi', societyIndex: 0, unitIndex: 2 },
    { email: 'fatima.malik@example.com', name: 'Fatima Malik', address: '123 Main Street, Block B, Unit 202, Karachi', societyIndex: 0, unitIndex: 3 },
    { email: 'hassan.raza@example.com', name: 'Hassan Raza', address: '123 Main Street, Block C, Unit 301, Karachi', societyIndex: 0, unitIndex: 4 },
    { email: 'ayesha.ali@example.com', name: 'Ayesha Ali', address: '45 Sea View Road, Tower 1, Floor 2, Karachi', societyIndex: 1, unitIndex: 0 },
    { email: 'omar.siddiqui@example.com', name: 'Omar Siddiqui', address: '45 Sea View Road, Tower 2, Floor 1, Karachi', societyIndex: 1, unitIndex: 1 },
    { email: 'zainab.hussain@example.com', name: 'Zainab Hussain', address: '78 Garden Avenue, Phase 1, Unit 5, Lahore', societyIndex: 2, unitIndex: 0 },
    { email: 'bilal.chaudhry@example.com', name: 'Bilal Chaudhry', address: '78 Garden Avenue, Phase 2, Unit 12, Lahore', societyIndex: 2, unitIndex: 1 }
  ]

  for (const r of residentSeed) {
    const existing = await query('SELECT id FROM users WHERE email = $1', [r.email])
    if (existing.rows.length > 0) continue
    const apt = allUnitIdsByApartment[r.societyIndex]
    const unitId = apt.unitIds[r.unitIndex]
    if (!unitId) continue
    const resResult = await query(
      `INSERT INTO users (email, password, name, role, is_active, contact_number, address, unit_id, society_apartment_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [r.email, residentPassword, r.name, 'resident', true, randomPhone(), r.address, unitId, apt.societyId]
    )
    residentUserIds.push(resResult.rows[0].id)
  }
  console.log(`✅ Created/verified ${residentUserIds.length} resident users with addresses`)

  // 6. Maintenance Records (spread across apartments and units)
  console.log('\n💰 Creating maintenance records...')
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  for (const { societyId, unitIds } of allUnitIdsByApartment) {
    for (let i = 0; i < 8; i++) {
      const unitId = unitIds[Math.floor(Math.random() * unitIds.length)]
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
  }
  console.log('✅ Created maintenance records')

  // 7. Finance Records (per apartment)
  console.log('\n💵 Creating finance records...')
  const incomeTypes = ['Maintenance Collection', 'Rent', 'Other Income']
  const expenseTypes = ['Utility Payment', 'Salary', 'Repairs', 'Security', 'Cleaning', 'Maintenance']

  for (let a = 0; a < apartmentIds.length; a++) {
    const societyId = apartmentIds[a]
    const addedBy = unionAdminIds[a] || unionAdminIds[0]
    for (let i = 0; i < 8; i++) {
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
        [societyId, type, expenseType || null, incomeType || null, amount, description, date, addedBy]
      )
    }
  }
  console.log('✅ Created finance records')

  // 8. Complaints (from various residents)
  console.log('\n📢 Creating complaints...')
  const complaintTitles = [
    'Plumbing Issue', 'Electrical Problem', 'Security Concern', 'Cleaning Request',
    'Water Leakage', 'Noise Complaint', 'Parking Issue', 'Maintenance Request'
  ]
  const priorities = ['low', 'medium', 'high', 'urgent']
  const statuses = ['pending', 'in_progress', 'resolved', 'closed']

  for (let i = 0; i < complaintTitles.length; i++) {
    const submitterId = residentUserIds[i % residentUserIds.length]
    const apt = allUnitIdsByApartment[i % allUnitIdsByApartment.length]
    const unitId = apt.unitIds[i % apt.unitIds.length]
    const title = complaintTitles[i]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 20))
    await query(
      `INSERT INTO complaints (unit_id, society_apartment_id, submitted_by, title, description, priority, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [unitId, apt.societyId, submitterId, title, `Description for ${title.toLowerCase()}`, priority, status, date]
    )
  }
  console.log('✅ Created complaints')

  // 9. Announcements (per apartment)
  console.log('\n📣 Creating announcements...')
  const announcements = [
    { title: 'Monthly Meeting', description: 'Monthly society meeting on 1st of every month', type: 'meeting' },
    { title: 'Maintenance Due', description: 'Please pay your maintenance fees by the 10th', type: 'payment' },
    { title: 'Water Supply Notice', description: 'Water supply will be interrupted for maintenance', type: 'notice' },
    { title: 'Security Update', description: 'New security measures implemented', type: 'update' }
  ]

  for (let a = 0; a < apartmentIds.length; a++) {
    const societyId = apartmentIds[a]
    const createdBy = unionAdminIds[a] || unionAdminIds[0]
    for (const ann of announcements) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 10))
      await query(
        `INSERT INTO announcements (society_apartment_id, title, description, type, created_by, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [societyId, ann.title, ann.description, ann.type, createdBy, date]
      )
    }
  }
  console.log('✅ Created announcements')

  // 10. Defaulters (spread across units)
  console.log('\n⚠️  Creating defaulters...')
  for (const { societyId, unitIds } of allUnitIdsByApartment) {
    const selected = new Set()
    for (let i = 0; i < 3; i++) {
      const unitId = unitIds[Math.floor(Math.random() * unitIds.length)]
      if (selected.has(unitId)) continue
      selected.add(unitId)
      const existing = await query('SELECT id FROM defaulters WHERE unit_id = $1', [unitId])
      if (existing.rows.length === 0) {
        const amount = Math.floor(Math.random() * 20000) + 5000
        const monthsOverdue = Math.floor(Math.random() * 6) + 1
        const status = Math.random() > 0.7 ? 'resolved' : 'active'
        await query(
          `INSERT INTO defaulters (unit_id, society_apartment_id, amount_due, months_overdue, status) 
           VALUES ($1, $2, $3, $4, $5)`,
          [unitId, societyId, amount, monthsOverdue, status]
        )
      }
    }
  }
  console.log('✅ Created defaulters')

  console.log('\n✅ Database seeding completed successfully!')
  console.log('\n📋 Test Users:')
  console.log('   Super Admin: hasanshkh17@gmail.com / admin123 (Sheikh Hasan)')
  console.log('   Union Admin (Apt 1): unionadmin@homelandunion.com / admin123')
  console.log('   Union Admin (Apt 2): unionadmin2@homelandunion.com / admin123')
  console.log('   Union Admin (Apt 3): unionadmin3@homelandunion.com / admin123')
  console.log('   Resident: resident@homelandunion.com / resident123')
  console.log('   Other residents: sara.ahmed@example.com, ahmed.khan@example.com, ... (password: resident123)')
  console.log('\n')
  process.exit(0)
} catch (error) {
  console.error('\n❌ Error seeding database:', error.message)
  console.error(error.stack)
  process.exit(1)
}