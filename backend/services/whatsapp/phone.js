export const normalizePhone = (value) => {
  if (!value) return '';
  const digits = String(value).replace(/[^\d]/g, '');
  if (!digits) return '';
  let normalized = digits;
  if (normalized.startsWith('00')) normalized = normalized.slice(2);
  // Pakistan local format (03xxxxxxxxx) -> international (923xxxxxxxxx)
  if (normalized.length === 11 && normalized.startsWith('0')) {
    normalized = `92${normalized.slice(1)}`;
  }
  return normalized;
};

export const phonesMatch = (a, b) => {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  if (!left || !right) return false;
  return left === right || left.endsWith(right) || right.endsWith(left);
};
