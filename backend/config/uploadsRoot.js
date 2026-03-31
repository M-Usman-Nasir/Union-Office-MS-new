import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env before reading UPLOADS_ROOT (ES modules evaluate imports before server.js runs dotenv.config()).
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Absolute path to the uploads directory (profiles, complaints, maintenance-payment-proofs, …).
 * On Render: mount the persistent disk at e.g. /var/data and set UPLOADS_ROOT=/var/data
 * (the app creates profiles/, maintenance-payment-proofs/, etc. inside it).
 * Do not use a path under /var unless that path is your mount — the OS may deny writes.
 */
export const UPLOADS_ROOT = process.env.UPLOADS_ROOT
  ? path.resolve(process.env.UPLOADS_ROOT)
  : path.join(__dirname, '..', 'uploads');

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
    if (!fs.existsSync(UPLOADS_ROOT)) {
      fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
    }
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
