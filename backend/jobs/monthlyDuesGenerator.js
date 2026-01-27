import cron from 'node-cron';
import { query } from '../config/database.js';

// Generate monthly dues for all units
export const generateMonthlyDues = async (month, year) => {
  try {
    console.log(`Starting monthly dues generation for ${month}/${year}...`);
    
    // Get all active units
    const activeUnits = await query(`
      SELECT u.id, u.society_apartment_id, u.block_id
      FROM units u
      WHERE u.society_apartment_id IS NOT NULL
    `);

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
