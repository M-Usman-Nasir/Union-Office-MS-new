import fs from 'fs';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const backupFile = process.argv[2];
if (!backupFile) {
  console.error('Usage: node scripts/restoreDatabase.js <backup-file.sql>');
  process.exit(1);
}
if (!fs.existsSync(backupFile)) {
  console.error(`Backup file not found: ${backupFile}`);
  process.exit(1);
}

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'homeland_union';
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || '';

const env = { ...process.env, PGPASSWORD: password };
const args = ['-h', host, '-p', String(port), '-U', user, '-d', dbName, '-f', backupFile];

console.log(`Restoring database from: ${backupFile}`);
const child = spawn('psql', args, { env, stdio: 'inherit' });

child.on('exit', (code) => {
  if (code === 0) {
    console.log('Restore completed successfully');
    process.exit(0);
  } else {
    console.error(`Restore failed with exit code ${code}`);
    process.exit(code || 1);
  }
});
