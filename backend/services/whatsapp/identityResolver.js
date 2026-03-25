import { query } from '../../config/database.js';
import { normalizePhone, phonesMatch } from './phone.js';

export const resolveResidentByPhone = async (phoneNumber) => {
  const normalizedIncoming = normalizePhone(phoneNumber);
  if (!normalizedIncoming) return null;

  const result = await query(
    `SELECT id, name, role, society_apartment_id, unit_id, contact_number
     FROM users
     WHERE role = 'resident'
       AND is_active = true
       AND contact_number IS NOT NULL
       AND contact_number <> ''`
  );

  const matched = result.rows.find((row) => phonesMatch(row.contact_number, normalizedIncoming));
  if (!matched) return null;

  return {
    id: matched.id,
    name: matched.name,
    role: matched.role,
    society_apartment_id: matched.society_apartment_id,
    unit_id: matched.unit_id,
    contact_number: matched.contact_number,
    normalized_phone: normalizedIncoming,
  };
};
