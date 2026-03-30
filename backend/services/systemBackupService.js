/* eslint-env node */
import { execFile, execFileSync } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { query } from '../config/database.js';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKUP_FILENAME_RE = /^hums-backup-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.dump$/;

export function getBackupDir() {
  const dir = process.env.HUMS_BACKUPS_DIR || path.join(__dirname, '../backups');
  return path.resolve(dir);
}

export async function ensureBackupDir() {
  const dir = getBackupDir();
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function parseDbConfig() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const u = new URL(url);
    let db = u.pathname.replace(/^\//, '');
    if (db.includes('?')) db = db.split('?')[0];
    return {
      host: u.hostname,
      port: String(u.port || '5432'),
      database: db,
      user: decodeURIComponent(u.username || 'postgres'),
      password: decodeURIComponent(u.password || ''),
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: String(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'homeland_union',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };
}

/**
 * Env for pg_dump / pg_restore: libpq uses PGSSLMODE, not discrete SSL args.
 * Matches pool behavior: DATABASE_URL + DB_SSL !== 'false' uses TLS for non-local hosts.
 */
function buildPgCliEnv(cfg) {
  const env = { ...process.env, PGPASSWORD: cfg.password };
  const url = process.env.DATABASE_URL;
  if (url) {
    try {
      const u = new URL(url);
      const mode = u.searchParams.get('sslmode');
      if (mode) env.PGSSLMODE = mode;
    } catch {
      /* ignore */
    }
  }
  if (!env.PGSSLMODE && url && process.env.DB_SSL !== 'false') {
    const h = String(cfg.host || '').toLowerCase();
    if (h && h !== 'localhost' && h !== '127.0.0.1') {
      env.PGSSLMODE = 'require';
    }
  }
  return env;
}

function pgTool(name) {
  const bin = process.env.PGBIN;
  if (bin) {
    const exe = path.join(bin, process.platform === 'win32' ? `${name}.exe` : name);
    return exe;
  }
  return process.platform === 'win32' ? `${name}.exe` : name;
}

/**
 * @param {string} name — basename only
 */
export function assertSafeBackupFilename(name) {
  const base = path.basename(name);
  if (base !== name || !BACKUP_FILENAME_RE.test(base)) {
    throw new Error('Invalid backup filename');
  }
  const root = path.resolve(getBackupDir());
  const resolved = path.resolve(root, base);
  const rel = path.relative(root, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('Invalid backup path');
  }
  return base;
}

export async function listBackups() {
  const dir = await ensureBackupDir();
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!BACKUP_FILENAME_RE.test(e.name)) continue;
    const fp = path.join(dir, e.name);
    const stat = await fs.stat(fp);
    files.push({
      filename: e.name,
      sizeBytes: stat.size,
      createdAt: stat.birthtime?.toISOString?.() || stat.mtime.toISOString(),
    });
  }
  files.sort((a, b) => b.filename.localeCompare(a.filename));
  return files;
}

export async function createBackupFile() {
  const dir = await ensureBackupDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `hums-backup-${stamp}.dump`;
  const filepath = path.join(dir, filename);
  const pgDump = pgTool('pg_dump');
  const cfg = parseDbConfig();
  const args = [
    '-h', cfg.host,
    '-p', cfg.port,
    '-U', cfg.user,
    '-d', cfg.database,
    '-Fc',
    '-f', filepath,
    '--no-owner',
    '--no-acl',
  ];
  const env = buildPgCliEnv(cfg);
  try {
    await execFileAsync(pgDump, args, { env, maxBuffer: 512 * 1024 * 1024 });
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        'pg_dump not found. Install PostgreSQL client tools (pg_dump) or set PGBIN to the bin directory (e.g. C:\\Program Files\\PostgreSQL\\16\\bin).'
      );
    }
    throw err;
  }
  return filename;
}

export async function deleteBackupFile(filename) {
  const safe = assertSafeBackupFilename(filename);
  const fp = path.join(getBackupDir(), safe);
  await fs.unlink(fp);
}

export async function terminateOtherSessions() {
  await query(`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = current_database()
      AND pid <> pg_backend_pid()
      AND backend_type = 'client'
  `);
}

/**
 * Run pg_restore (must be called after closing the pool; process should exit).
 */
export function runPgRestoreSync(filename) {
  const safe = assertSafeBackupFilename(filename);
  const fp = path.join(getBackupDir(), safe);
  if (!fsSync.existsSync(fp)) {
    throw new Error('Backup file not found');
  }
  const pgRestore = pgTool('pg_restore');
  const cfg = parseDbConfig();
  const args = [
    '-h', cfg.host,
    '-p', cfg.port,
    '-U', cfg.user,
    '-d', cfg.database,
    '--clean',
    '--if-exists',
    '--no-owner',
    '--no-acl',
    fp,
  ];
  const env = buildPgCliEnv(cfg);
  try {
    execFileSync(pgRestore, args, { env, maxBuffer: 1024 * 1024 * 1024, stdio: 'inherit' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        'pg_restore not found. Install PostgreSQL client tools or set PGBIN to the bin directory.'
      );
    }
    throw err;
  }
}

/**
 * Truncate all public tables (empty application data). Schema remains.
 */
export async function factoryResetTruncateAll() {
  const countRes = await query(`
    SELECT COUNT(*)::int AS c
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  const tableCount = countRes.rows[0]?.c ?? 0;
  const { rows } = await query(`
    SELECT string_agg(quote_ident(table_name), ', ' ORDER BY table_name) AS tables
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  const t = rows[0]?.tables;
  if (!t) {
    return { tablesTruncated: 0 };
  }
  await query(`TRUNCATE TABLE ${t} RESTART IDENTITY CASCADE`);
  return { tablesTruncated: tableCount };
}
