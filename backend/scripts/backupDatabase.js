import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.resolve(process.cwd(), 'backups');
const backupFile = path.join(backupDir, `hums-backup-${now}.sql`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'homeland_union';
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || '';

const args = ['-h', host, '-p', String(port), '-U', user, '-d', dbName, '-f', backupFile];
const env = { ...process.env, PGPASSWORD: password };

console.log(`Creating backup: ${backupFile}`);
const child = spawn('pg_dump', args, { env, stdio: 'inherit' });

child.on('exit', (code) => {
  if (code === 0) {
    console.log('Backup completed successfully');
    process.exit(0);
  } else {
    console.error(`Backup failed with exit code ${code}`);
    process.exit(code || 1);
  }
});
