import cron from 'node-cron';
import { query } from '../config/database.js';
import { notifyDuesGenerated } from '../services/notificationService.js';

// Generate monthly dues for units (optionally scoped to one society for union_admin)
export const generateMonthlyDues = async (month, year, societyId = null) => {
  try {
    console.log(`Starting monthly dues generation for ${month}/${year}${societyId ? ` (society ${societyId})` : ''}...`);

    let activeUnits;
    const residentFilter = ` AND EXISTS (SELECT 1 FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin'))`;
    if (societyId != null && societyId !== '') {
      activeUnits = await query(`
        SELECT u.id, u.society_apartment_id, u.block_id, u.unit_number, s.name as society_name
        FROM units u
        LEFT JOIN apartments s ON u.society_apartment_id = s.id
        WHERE u.society_apartment_id = $1 ${residentFilter}
      `, [societyId]);
    } else {
      activeUnits = await query(`
        SELECT u.id, u.society_apartment_id, u.block_id, u.unit_number, s.name as society_name
        FROM units u
        LEFT JOIN apartments s ON u.society_apartment_id = s.id
        WHERE u.society_apartment_id IS NOT NULL ${residentFilter}
      `);
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const unit of activeUnits.rows) {
      try {
        // Get maintenance config for society/block/unit (priority: unit > block > society)
        // Note: maintenance_config table structure may vary - adjust query as needed
        const config = await query(`
          SELECT base_amount 
          FROM maintenance_config 
          WHERE (
            (unit_id = $1) OR
            (block_id = $2 AND unit_id IS NULL) OR
            (society_apartment_id = $3 AND block_id IS NULL AND unit_id IS NULL)
          )
          ORDER BY 
            CASE WHEN unit_id IS NOT NULL THEN 1 
                 WHEN block_id IS NOT NULL THEN 2 
                 ELSE 3 END
          LIMIT 1
        `, [unit.id, unit.block_id, unit.society_apartment_id]).catch(() => ({ rows: [] }));

        // If no specific config, try to get society-level config
        if (config.rows.length === 0) {
          const societyConfig = await query(`
            SELECT base_amount 
            FROM maintenance_config 
            WHERE society_apartment_id = $1 AND block_id IS NULL AND unit_id IS NULL
            LIMIT 1
          `, [unit.society_apartment_id]).catch(() => ({ rows: [] }));

          if (societyConfig.rows.length > 0) {
            config.rows = societyConfig.rows;
          }
        }

        if (config.rows.length > 0) {
          const baseAmount = parseFloat(config.rows[0].base_amount);
          
          // Check if maintenance already exists for this month
          const existing = await query(`
            SELECT id FROM maintenance 
            WHERE unit_id = $1 AND month = $2 AND year = $3
          `, [unit.id, month, year]);

          if (existing.rows.length === 0) {
            // Create new maintenance record
            // Due date is typically the 1st of the next month
            const dueDate = new Date(year, month, 1); // 1st of the month
            
            await query(`
              INSERT INTO maintenance 
              (unit_id, society_apartment_id, month, year, base_amount, total_amount, status, due_date)
              VALUES ($1, $2, $3, $4, $5, $5, 'pending', $6)
            `, [
              unit.id,
              unit.society_apartment_id,
              month,
              year,
              baseAmount,
              dueDate
            ]);
            
            // Notify resident by email if setting enabled (non-blocking)
            notifyDuesGenerated(
              unit.id,
              unit.society_apartment_id,
              unit.unit_number,
              unit.society_name,
              month,
              year,
              baseAmount,
              dueDate
            ).catch((err) => console.error('Dues notification error for unit', unit.id, err.message));
            
            successCount++;
          }
        } else {
          errors.push(`No maintenance config found for unit ${unit.id}`);
          failCount++;
        }
      } catch (error) {
        errors.push(`Unit ${unit.id}: ${error.message}`);
        failCount++;
        console.error(`Error processing unit ${unit.id}:`, error);
      }
    }

    console.log(`Monthly dues generation completed: ${successCount} successful, ${failCount} failed`);

    return {
      success: true,
      total: activeUnits.rows.length,
      successful: successCount,
      failed: failCount,
      errors: errors
    };
  } catch (error) {
    console.error('Error generating monthly dues:', error);
    throw error;
  }
};

// Generate monthly dues for a specific block or floor within a society
export const generateMonthlyDuesForScope = async (month, year, societyId, { blockId = null, floorId = null } = {}) => {
  if (societyId == null || societyId === '') {
    throw new Error('societyId is required for scope-based generation');
  }
  try {
    let sql = `
      SELECT u.id, u.society_apartment_id, u.block_id, u.unit_number, s.name as society_name
      FROM units u
      LEFT JOIN apartments s ON u.society_apartment_id = s.id
      WHERE u.society_apartment_id = $1
        AND EXISTS (SELECT 1 FROM users usr WHERE usr.unit_id = u.id AND usr.role IN ('resident', 'union_admin'))
    `;
    const params = [societyId];
    if (blockId != null && blockId !== '') {
      params.push(blockId);
      sql += ` AND u.block_id = $${params.length}`;
    }
    if (floorId != null && floorId !== '') {
      params.push(floorId);
      sql += ` AND u.floor_id = $${params.length}`;
    }
    const activeUnits = await query(sql, params);

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const unit of activeUnits.rows) {
      try {
        const config = await query(`
          SELECT base_amount 
          FROM maintenance_config 
          WHERE (
            (unit_id = $1) OR
            (block_id = $2 AND unit_id IS NULL) OR
            (society_apartment_id = $3 AND block_id IS NULL AND unit_id IS NULL)
          )
          ORDER BY 
            CASE WHEN unit_id IS NOT NULL THEN 1 
                 WHEN block_id IS NOT NULL THEN 2 
                 ELSE 3 END
          LIMIT 1
        `, [unit.id, unit.block_id, unit.society_apartment_id]).catch(() => ({ rows: [] }));

        if (config.rows.length === 0) {
          const societyConfig = await query(`
            SELECT base_amount FROM maintenance_config 
            WHERE society_apartment_id = $1 AND block_id IS NULL AND unit_id IS NULL LIMIT 1
          `, [unit.society_apartment_id]).catch(() => ({ rows: [] }));
          if (societyConfig.rows.length > 0) config.rows = societyConfig.rows;
        }

        if (config.rows.length > 0) {
          const baseAmount = parseFloat(config.rows[0].base_amount);
          const existing = await query(`
            SELECT id FROM maintenance WHERE unit_id = $1 AND month = $2 AND year = $3
          `, [unit.id, month, year]);
          if (existing.rows.length === 0) {
            const dueDate = new Date(year, month, 1);
            await query(`
              INSERT INTO maintenance 
              (unit_id, society_apartment_id, month, year, base_amount, total_amount, status, due_date)
              VALUES ($1, $2, $3, $4, $5, $5, 'pending', $6)
            `, [unit.id, unit.society_apartment_id, month, year, baseAmount, dueDate]);
            notifyDuesGenerated(
              unit.id, unit.society_apartment_id, unit.unit_number, unit.society_name,
              month, year, baseAmount, dueDate
            ).catch((err) => console.error('Dues notification error for unit', unit.id, err.message));
            successCount++;
          }
        } else {
          errors.push(`No maintenance config found for unit ${unit.id}`);
          failCount++;
        }
      } catch (error) {
        errors.push(`Unit ${unit.id}: ${error.message}`);
        failCount++;
      }
    }

    return {
      success: true,
      total: activeUnits.rows.length,
      successful: successCount,
      failed: failCount,
      errors
    };
  } catch (error) {
    console.error('Generate for scope error:', error);
    throw error;
  }
};

// Schedule monthly dues generation (runs on 1st of every month at 00:00)
export const scheduleMonthlyDues = () => {
  cron.schedule('0 0 1 * *', async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      await generateMonthlyDues(currentMonth, currentYear);
    } catch (error) {
      console.error('Scheduled monthly dues generation error:', error);
    }
  });
  
  console.log('Monthly dues scheduler initialized (runs on 1st of every month at 00:00)');
};
