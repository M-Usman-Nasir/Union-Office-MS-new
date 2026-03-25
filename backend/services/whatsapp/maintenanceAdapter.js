import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../../config/database.js';
import { createMaintenancePaymentRequest } from '../../controllers/maintenanceController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_PROOF_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

const ensureProofDir = () => {
  const dir = path.join(__dirname, '..', '..', 'uploads', 'maintenance-payment-proofs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const createSafeExtension = (mimeType = '') => {
  if (mimeType === 'application/pdf') return '.pdf';
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/gif') return '.gif';
  if (mimeType === 'image/webp') return '.webp';
  return '.jpg';
};

export const resolveLatestOutstandingMaintenance = async ({ residentUserId, unitId }) => {
  const result = await query(
    `SELECT m.id, m.unit_id, m.month, m.year, m.status, m.total_amount, m.amount_paid
     FROM maintenance m
     WHERE m.unit_id = $1
       AND m.status IN ('pending', 'partially_paid')
     ORDER BY m.year DESC, m.month DESC, m.id DESC
     LIMIT 1`,
    [unitId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    maintenance_id: row.id,
    unit_id: row.unit_id,
    month: row.month,
    year: row.year,
    status: row.status,
    total_amount: Number(row.total_amount) || 0,
    amount_paid: Number(row.amount_paid) || 0,
    resident_user_id: residentUserId,
  };
};

export const createPaymentProofFromWhatsApp = async ({
  residentUserId,
  maintenanceId,
  mediaBuffer,
  mimeType,
  note,
}) => {
  if (!residentUserId || !maintenanceId) {
    throw new Error('residentUserId and maintenanceId are required');
  }
  if (!Buffer.isBuffer(mediaBuffer) || mediaBuffer.length === 0) {
    throw new Error('Invalid media file');
  }
  if (mediaBuffer.length > MAX_PROOF_SIZE) {
    const error = new Error('File too large. Maximum size is 5MB.');
    error.status = 400;
    throw error;
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    const error = new Error('Unsupported file type. Allowed: JPEG, PNG, GIF, WebP, PDF.');
    error.status = 400;
    throw error;
  }

  const directory = ensureProofDir();
  const timestamp = Date.now();
  const extension = createSafeExtension(mimeType);
  const fileName = `proof_${maintenanceId}_${residentUserId}_${timestamp}${extension}`;
  const diskPath = path.join(directory, fileName);
  const proofPath = `/uploads/maintenance-payment-proofs/${fileName}`;

  fs.writeFileSync(diskPath, mediaBuffer);

  try {
    const request = await createMaintenancePaymentRequest({
      maintenanceId: Number(maintenanceId),
      submittedBy: residentUserId,
      proofPath,
      note: note || 'Submitted from WhatsApp action bot',
    });
    return request;
  } catch (error) {
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }
    throw error;
  }
};
