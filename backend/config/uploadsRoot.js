import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env before reading UPLOADS_ROOT (ES modules evaluate imports before server.js runs dotenv.config()).
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');

function ensureDir(targetPath) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
}

/**
 * Resolve active uploads root:
 * - development: always local project uploads path
 * - other envs: prefer UPLOADS_ROOT, fallback to local path if not writable
 */
function resolveUploadsRoot() {
  const nodeEnv = String(process.env.NODE_ENV || '').toLowerCase();
  if (nodeEnv === 'development') {
    return DEFAULT_UPLOADS_ROOT;
  }

  const configured = process.env.UPLOADS_ROOT ? path.resolve(process.env.UPLOADS_ROOT) : null;
  if (!configured) return DEFAULT_UPLOADS_ROOT;

  try {
    ensureDir(configured);
    return configured;
  } catch (err) {
    const code = err?.code || 'UNKNOWN';
    console.warn(
      `[uploads] UPLOADS_ROOT "${configured}" is not writable (${code}). Falling back to local path "${DEFAULT_UPLOADS_ROOT}".`
    );
    return DEFAULT_UPLOADS_ROOT;
  }
}

export const UPLOADS_ROOT = resolveUploadsRoot();

/** Subdirs created under UPLOADS_ROOT (must match multer paths). */
export const UPLOAD_SUBDIRS = [
  'profiles',
  'complaints',
  'units-import',
  'invoice-payment-proofs',
  'maintenance-receipts',
  'maintenance-payment-proofs',
];

function formatUploadError(err, targetPath) {
  if (err && err.code === 'EACCES') {
    const hint =
      'Permission denied creating upload directories. ' +
      'If you use a persistent disk (e.g. Render): mount the disk at a path, then set UPLOADS_ROOT to that exact mount path (not a parent path the OS denies). ' +
      'Example: mount disk at /var/data and set UPLOADS_ROOT=/var/data — the app will create profiles/, maintenance-payment-proofs/, etc. inside it.';
    const wrapped = new Error(`${hint}\nAttempted: ${targetPath}`);
    wrapped.code = err.code;
    wrapped.cause = err;
    return wrapped;
  }
  if (err && err.code === 'EROFS') {
    const wrapped = new Error(
      `Read-only filesystem at ${targetPath}. Remove UPLOADS_ROOT or point it to a writable mount.`
    );
    wrapped.code = err.code;
    wrapped.cause = err;
    return wrapped;
  }
  return err;
}

export function ensureUploadsRoot() {
  try {
    ensureDir(UPLOADS_ROOT);
  } catch (err) {
    throw formatUploadError(err, UPLOADS_ROOT);
  }
}

/**
 * Ensures a subdirectory under UPLOADS_ROOT exists. Returns absolute path.
 * @param {string} subdir - e.g. 'profiles', 'maintenance-payment-proofs'
 */
export function ensureUploadSubdir(subdir) {
  const full = path.join(UPLOADS_ROOT, subdir);
  try {
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
    }
  } catch (err) {
    throw formatUploadError(err, full);
  }
  return full;
}

/** Create UPLOADS_ROOT and all known subdirs. Call once at server startup (before listen). */
export function ensureAllUploadSubdirs() {
  ensureUploadsRoot();
  for (const sub of UPLOAD_SUBDIRS) {
    ensureUploadSubdir(sub);
  }
}
