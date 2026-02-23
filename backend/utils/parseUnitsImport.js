import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { XMLParser } from 'fast-xml-parser';

/**
 * Normalize object keys: trim, lowercase, replace spaces with underscores.
 */
function normalizeKey(k) {
  if (typeof k !== 'string') return k;
  return k
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Map a raw row (from CSV/XLSX/XML) to a unit row with standard keys.
 */
function mapRow(raw, rowIndex) {
  const row = {};
  for (const [key, value] of Object.entries(raw)) {
    const norm = normalizeKey(key);
    if (value !== undefined && value !== null && value !== '') {
      if (norm === 'is_occupied') {
        row[norm] = /^(1|true|yes|y)$/i.test(String(value).trim());
      } else if (norm === 'number_of_cars' || norm === 'society_apartment_id' || norm === 'block_id' || norm === 'floor_id') {
        const n = parseInt(String(value).trim(), 10);
        row[norm] = Number.isNaN(n) ? undefined : n;
      } else {
        row[norm] = String(value).trim();
      }
    }
  }
  return row;
}

/**
 * Parse CSV file. First row = headers.
 */
function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });
  return records.map((r, i) => mapRow(r, i + 2));
}

/**
 * Parse XLSX file. First sheet, first row = headers.
 * Uses read() with buffer (readFile not available in ESM build).
 */
function parseXlsx(filePath) {
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  return rows.map((r, i) => mapRow(r, i + 2));
}

/**
 * Parse XML file. Expects <units><unit>...</unit></units> with child tags or attributes.
 */
function parseXml(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const parsed = parser.parse(content);
  if (!parsed || typeof parsed !== 'object') return [];
  const root = parsed.units || parsed.data || parsed;
  let unitNodes = root.unit;
  if (!unitNodes) return [];
  if (!Array.isArray(unitNodes)) unitNodes = [unitNodes];
  return unitNodes.map((node, i) => {
    const raw = {};
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k.startsWith('@_')) raw[k.replace('@_', '')] = v;
        else if (v !== undefined && v !== null && typeof v !== 'object') raw[k] = v;
      }
    }
    return mapRow(raw, i + 1);
  });
}

/**
 * Parse a units import file. Returns { rows, format }.
 */
export function parseUnitsImportFile(filePath) {
  const ext = (path.extname(filePath) || '').toLowerCase();
  let rows = [];
  let format = ext.replace('.', '') || 'unknown';
  if (ext === '.csv') {
    rows = parseCsv(filePath);
    format = 'csv';
  } else if (ext === '.xlsx' || ext === '.xls') {
    rows = parseXlsx(filePath);
    format = 'xlsx';
  } else if (ext === '.xml') {
    rows = parseXml(filePath);
    format = 'xml';
  } else {
    throw new Error(`Unsupported file format: ${ext}. Use .xlsx, .xml, or .csv.`);
  }
  return { rows, format };
}
