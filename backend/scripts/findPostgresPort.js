import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 Finding PostgreSQL port and configuration...\n');

// Method 1: Check all listening ports
console.log('Method 1: Checking all listening ports...\n');
execAsync('netstat -ano | findstr LISTENING')
  .then(({ stdout }) => {
    if (stdout) {
      const lines = stdout.split('\n');
      const postgresPorts = lines.filter(line => 
        line.includes(':5432') || 
        line.includes(':5433') ||
        line.includes('postgres')
      );
      
      if (postgresPorts.length > 0) {
        console.log('✅ Found potential PostgreSQL ports:');
        postgresPorts.forEach(line => console.log('   ' + line.trim()));
      } else {
        console.log('⚠️  No obvious PostgreSQL ports found in listening ports');
        console.log('\nChecking common PostgreSQL ports...');
      }
    }
  })
  .catch(() => {
    console.log('Could not check listening ports');
  });

// Method 2: Check PostgreSQL configuration file
console.log('\nMethod 2: Checking PostgreSQL configuration...\n');
const possiblePaths = [
  'C:\\Program Files\\PostgreSQL\\18\\data\\postgresql.conf',
  'C:\\Program Files\\PostgreSQL\\18\\data\\postgresql.auto.conf',
  'C:\\Program Files (x86)\\PostgreSQL\\18\\data\\postgresql.conf',
];

import { readFileSync, existsSync } from 'fs';

let foundConfig = false;
for (const path of possiblePaths) {
  try {
    if (existsSync(path)) {
      console.log(`✅ Found config file: ${path}`);
      const config = readFileSync(path, 'utf8');
      
      // Extract port
      const portMatch = config.match(/^port\s*=\s*(\d+)/m);
      if (portMatch) {
        console.log(`   Port: ${portMatch[1]}`);
      } else {
        console.log('   Port: 5432 (default - not explicitly set)');
      }
      
      // Extract listen_addresses
      const listenMatch = config.match(/^listen_addresses\s*=\s*['"]?([^'"]+)['"]?/m);
      if (listenMatch) {
        console.log(`   Listen Addresses: ${listenMatch[1]}`);
        if (listenMatch[1] !== '*' && !listenMatch[1].includes('localhost')) {
          console.log('   ⚠️  WARNING: listen_addresses might be too restrictive!');
        }
      } else {
        console.log('   Listen Addresses: localhost (default)');
      }
      
      foundConfig = true;
      break;
    }
  } catch (error) {
    // Continue to next path
  }
}

if (!foundConfig) {
  console.log('⚠️  Could not find postgresql.conf file');
  console.log('   Common locations:');
  possiblePaths.forEach(path => console.log(`   - ${path}`));
}

// Method 3: Check Windows services for port info
console.log('\nMethod 3: Checking service information...\n');
execAsync('sc qc postgresql-x64-18')
  .then(({ stdout }) => {
    console.log('Service configuration:');
    console.log(stdout);
  })
  .catch(() => {
    console.log('Could not query service details');
  });

console.log('\n💡 Recommendations:');
console.log('1. Check PostgreSQL logs: C:\\Program Files\\PostgreSQL\\18\\data\\log\\');
console.log('2. Verify postgresql.conf has: listen_addresses = \'*\' or \'localhost\'');
console.log('3. Verify port in postgresql.conf matches your .env file');
console.log('4. Check Windows Firewall settings');
console.log('5. Try restarting PostgreSQL service\n');
