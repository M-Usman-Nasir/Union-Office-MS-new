import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 Checking if PostgreSQL is listening on port 5432...\n');

// Check if port 5432 is in use
execAsync('netstat -an | findstr 5432')
  .then(({ stdout, stderr }) => {
    if (stdout) {
      console.log('✅ Port 5432 is being used:');
      console.log(stdout);
      
      // Check if it's listening
      if (stdout.includes('LISTENING')) {
        console.log('\n✅ PostgreSQL appears to be listening on port 5432');
      } else {
        console.log('\n⚠️  Port 5432 is in use but not in LISTENING state');
      }
    } else {
      console.log('❌ Port 5432 is not in use');
      console.log('   PostgreSQL might not be listening on the expected port');
    }
  })
  .catch((error) => {
    console.error('Error checking port:', error.message);
  });

// Also try to connect directly with psql command
console.log('\n🔍 Testing direct psql connection...\n');

execAsync('psql --version')
  .then(() => {
    console.log('✅ psql is available');
    console.log('\n💡 Try connecting manually with:');
    console.log('   psql -U postgres -d homeland_union -h localhost -p 5432');
  })
  .catch(() => {
    console.log('⚠️  psql command not found in PATH');
    console.log('   This is okay - you can still use the Node.js connection');
  });
