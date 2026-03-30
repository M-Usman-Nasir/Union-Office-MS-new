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
 * On Render and similar hosts, set UPLOADS_ROOT to a persistent disk mount so files survive restarts.
 * Example: UPLOADS_ROOT=/var/data/uploads
 */
export const UPLOADS_ROOT = process.env.UPLOADS_ROOT
  ? path.resolve(process.env.UPLOADS_ROOT)
  : path.join(__dirname, '..', 'uploads');

export function ensureUploadsRoot() {
  if (!fs.existsSync(UPLOADS_ROOT)) {
    fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
  }
}
