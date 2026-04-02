import { query } from '../config/database.js';

/**
 * Store file metadata for uploaded assets.
 * This keeps DB-level traceability now, and aligns with future object storage migration.
 */
export async function recordUploadedFile({
  module,
  ownerUserId = null,
  societyId = null,
  maintenanceId = null,
  storagePath,
  originalName,
  mimeType,
  sizeBytes,
}) {
  if (!module || !storagePath) return null;

  const result = await query(
    `INSERT INTO uploaded_files
      (module, owner_user_id, society_apartment_id, maintenance_id, storage_path, original_name, mime_type, size_bytes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      module,
      ownerUserId,
      societyId,
      maintenanceId,
      storagePath,
      originalName || null,
      mimeType || null,
      sizeBytes != null ? Number(sizeBytes) : null,
    ]
  );
  return result.rows[0] || null;
}
