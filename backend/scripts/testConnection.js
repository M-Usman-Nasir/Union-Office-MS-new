import dotenv from 'dotenv';
import { testConnection, getTables } from '../config/database.js';

dotenv.config();

console.log('🧪 Testing database connection...\n');

testConnection()
  .then(async (isConnected) => {
    if (isConnected) {
      console.log('\n📊 Fetching database tables...');
      try {
        const tables = await getTables();
        console.log(`\n✅ Found ${tables.length} tables:\n`);
        tables.forEach((table, index) => {
          console.log(`   ${index + 1}. ${table.table_name}`);
        });
        console.log('\n✅ Database connection test completed successfully!\n');
        process.exit(0);
      } catch (error) {
        console.error('\n❌ Error fetching tables:', error.message);
        process.exit(1);
      }
    } else {
      console.error('\n❌ Database connection test failed!\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  });
