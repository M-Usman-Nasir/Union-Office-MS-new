import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

/** Shared initial password for unit-based resident accounts (must be changed on first login). */
export const RESIDENT_INITIAL_PASSWORD = 'Password1!';

const PLACEHOLDER_NAME_PREFIX = 'Unit ';

function slugifyPart(s) {
  if (s == null || s === '') return 'x';
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-') || 'x';
}

/**
 * Build local@domain.com from unit number, block label, apartment name.
 * Example: A-001, block 1, Beech → a-001_1@beech.com
 */
export function buildLoginEmailLocalAndDomain(unitNumber, blockLabel, apartmentName, apartmentId) {
  const unitPart = slugifyPart(unitNumber);
  const blockPart = blockLabel != null && String(blockLabel).trim() !== ''
    ? slugifyPart(blockLabel)
    : 'na';
  const localBase = `${unitPart}_${blockPart}`;
  const domainBase = slugifyPart(apartmentName);
  const domain =
    domainBase.length >= 2
      ? `${domainBase}.com`
      : `society-${apartmentId}.local`;
  return { localBase, domain };
}

async function emailExists(email) {
  const r = await query('SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
  return r.rows.length > 0;
}

export async function allocateUniqueResidentEmail(localBase, domain) {
  let n = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const suffix = n === 0 ? '' : `-${n}`;
    const local = `${localBase}${suffix}`;
    const email = `${local}@${domain}`;
    if (!(await emailExists(email))) return email.toLowerCase();
    n += 1;
    if (n > 500) throw new Error('Could not allocate unique resident email');
  }
}

export async function loadUnitContextForLogin(unitId) {
  const r = await query(
    `SELECT u.id, u.society_apartment_id, u.block_id, u.floor_id, u.unit_number,
            b.name AS block_name, a.name AS apartment_name
     FROM units u
     LEFT JOIN blocks b ON u.block_id = b.id
     INNER JOIN apartments a ON u.society_apartment_id = a.id
     WHERE u.id = $1`,
    [unitId]
  );
  return r.rows[0] || null;
}

export async function previewLoginEmailForUnitId(unitId) {
  const existing = await query(
    `SELECT email FROM users WHERE unit_id = $1 AND role = 'resident' LIMIT 1`,
    [unitId]
  );
  if (existing.rows.length > 0) return existing.rows[0].email;
  const row = await loadUnitContextForLogin(unitId);
  if (!row) return null;
  const { localBase, domain } = buildLoginEmailLocalAndDomain(
    row.unit_number,
    row.block_name || (row.block_id != null ? String(row.block_id) : null),
    row.apartment_name,
    row.society_apartment_id
  );
  return allocateUniqueResidentEmail(localBase, domain);
}

/**
 * When generating email for a new user on this unit, prefer an address that
 * matches preview; if taken (race), allocate next unique.
 */
export async function computeEmailForNewUnitUser(unitId) {
  const row = await loadUnitContextForLogin(unitId);
  if (!row) throw new Error('Unit not found');
  const { localBase, domain } = buildLoginEmailLocalAndDomain(
    row.unit_number,
    row.block_name || (row.block_id != null ? String(row.block_id) : null),
    row.apartment_name,
    row.society_apartment_id
  );
  return allocateUniqueResidentEmail(localBase, domain);
}

export function isPlaceholderResidentName(name) {
  if (!name || typeof name !== 'string') return false;
  return name.startsWith(PLACEHOLDER_NAME_PREFIX) && name.includes('(pending)');
}

export async function createResidentUserForUnit({
  unitId,
  createdBy = null,
  displayName = null,
  mustChangePassword = true,
}) {
  const existing = await query(
    `SELECT id FROM users WHERE unit_id = $1 AND role = 'resident' LIMIT 1`,
    [unitId]
  );
  if (existing.rows.length > 0) {
    return { userId: existing.rows[0].id, created: false };
  }

  const email = await computeEmailForNewUnitUser(unitId);
  const row = await loadUnitContextForLogin(unitId);
  const unitNum = row?.unit_number ?? '?';
  const name =
    displayName && String(displayName).trim()
      ? String(displayName).trim()
      : `${PLACEHOLDER_NAME_PREFIX}${unitNum} (pending)`;

  const hashed = await bcrypt.hash(RESIDENT_INITIAL_PASSWORD, 10);
  const ins = await query(
    `INSERT INTO users (
       email, password, name, role, society_apartment_id, unit_id,
       must_change_password, created_by, is_active
     ) VALUES ($1, $2, $3, 'resident', $4, $5, $6, $7, true)
     RETURNING id, email, name`,
    [
      email,
      hashed,
      name,
      row.society_apartment_id,
      unitId,
      mustChangePassword,
      createdBy,
    ]
  );

  await query(`UPDATE units SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [
    email,
    unitId,
  ]).catch(() => {});

  return { userId: ins.rows[0].id, email: ins.rows[0].email, created: true };
}

export async function recreatePlaceholderResidentForUnit(unitId, createdBy = null) {
  return createResidentUserForUnit({
    unitId,
    createdBy,
    displayName: null,
    mustChangePassword: true,
  });
}
