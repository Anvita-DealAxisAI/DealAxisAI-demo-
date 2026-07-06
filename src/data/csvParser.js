/**
 * Minimal CSV parser that handles quoted fields with commas inside them.
 * Returns an array of objects keyed by the header row.
 */
export function parseCsv(raw) {
  const lines = raw.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = {};
    headers.forEach((header, i) => {
      row[header.trim()] = (values[i] ?? '').trim();
    });
    return row;
  });
}

/**
 * Splits a single CSV line respecting double-quoted fields.
 */
function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
