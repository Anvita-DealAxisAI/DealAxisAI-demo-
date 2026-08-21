/**
 * Account-level Prioritization Matrix algorithm.
 *
 * X = value-weighted capability-match ease (higher match → Easy / left)
 * Y = sum of opportunity value midpoints
 * Size = total value, capped ≤$8M → min, ≥$50M → max
 * Color = dominant capability by total $
 */

export const MATRIX_CAPABILITY_COLORS = {
  Data: '#3b82f6',
  AI: '#8b5cf6',
  QE: '#f97316',
  'Reg Rpt': '#22c55e',
  AML: '#f59e0b',
  Core: '#64748b',
  Digital: '#ec4899',
  Cybersecurity: '#14b8a6',
  Cloud: '#eab308',
  Other: '#94a3b8',
};

export const MATRIX_CAPABILITY_FILTERS = [
  'All Capabilities',
  'Data',
  'AI',
  'QE',
  'Reg Rpt',
  'AML',
  'Core',
  'Digital',
  'Cybersecurity',
  'Cloud',
];

const DISPLAY_LABELS = {
  Data: 'Data',
  AI: 'AI',
  QE: 'Quality Engineering',
  'Reg Rpt': 'Reg Reporting',
  AML: 'AML / Financial Crime',
  Core: 'Core Modernization',
  Digital: 'Digital Experience',
  Cybersecurity: 'Cybersecurity',
  Cloud: 'Cloud & Infra',
  Other: 'Other',
};

const MIN_BUBBLE_R = 8;
const MAX_BUBBLE_R = 22;

function cleanToken(raw) {
  return String(raw ?? '')
    .trim()
    .replace(/^\[|\]$/g, '')
    .trim();
}

/** Parse "[DATA, DIGITAL, QAQE]" or "Digital, Data, AI" into tokens. */
export function parseCapabilityList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(cleanToken).filter(Boolean);
  }
  return String(raw)
    .replace(/^\[|\]$/g, '')
    .split(/[,|/]/)
    .map(cleanToken)
    .filter(Boolean);
}

/**
 * Map a capability string to a canonical match key + display label.
 * Synonyms (QE/QA/QAQE, Data/DATA, etc.) share the same match key.
 */
export function normalizeCapability(raw) {
  const key = cleanToken(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

  if (!key) return null;

  if (key === 'data' || key.includes('data')) {
    return { matchKey: 'data', label: 'Data' };
  }
  if (key === 'ai' || key.includes('artificialintelligence')) {
    return { matchKey: 'ai', label: 'AI' };
  }
  if (
    key === 'qe' ||
    key === 'qa' ||
    key === 'qaqe' ||
    key.includes('quality') ||
    key.includes('qaqe')
  ) {
    return { matchKey: 'qe', label: 'QE' };
  }
  if (
    key.includes('reg') ||
    key === 'rpt' ||
    key.includes('regulatory') ||
    key.includes('reporting')
  ) {
    return { matchKey: 'regrpt', label: 'Reg Rpt' };
  }
  if (key.includes('aml') || key.includes('financialcrime') || key.includes('fraud')) {
    return { matchKey: 'aml', label: 'AML' };
  }
  if (key.includes('core')) {
    return { matchKey: 'core', label: 'Core' };
  }
  if (key.includes('digital')) {
    return { matchKey: 'digital', label: 'Digital' };
  }
  if (key.includes('cyber') || key.includes('infosec') || key.includes('security')) {
    return { matchKey: 'cyber', label: 'Cybersecurity' };
  }
  if (
    key.includes('cloud') ||
    key.includes('infra') ||
    key === 'itops' ||
    key.includes('itops')
  ) {
    return { matchKey: 'cloud', label: 'Cloud' };
  }

  return { matchKey: key, label: cleanToken(raw) };
}

export function capabilityDisplayLabel(label) {
  return DISPLAY_LABELS[label] ?? label;
}

export function parseDealMidpointMillions(dealSize) {
  if (dealSize == null || dealSize === '') return null;
  const parts = String(dealSize)
    .split(/[–-]/)
    .map((part) => {
      const normalized = part.replace(/,/g, '').trim();
      const match = normalized.match(/(\d+(?:\.\d+)?)\s*([kmb])?/i);
      if (!match) return null;
      const value = Number(match[1]);
      if (!Number.isFinite(value)) return null;
      const unit = (match[2] ?? 'm').toLowerCase();
      if (unit === 'b') return value * 1000;
      if (unit === 'k') return value / 1000;
      return value;
    })
    .filter((value) => value != null);

  if (!parts.length) return null;
  if (parts.length === 1) return parts[0];
  return (Math.min(...parts) + Math.max(...parts)) / 2;
}

export function formatMillionsLabel(value) {
  if (!Number.isFinite(value) || value <= 0) return '$0M';
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  return `$${rounded}M`;
}

/** Ease % = matched opp caps / total opp caps (0–100). Null if no opp caps. */
export function computeOpportunityEasePercent(opportunityCapabilities, clientCapabilities) {
  const oppNormalized = parseCapabilityList(opportunityCapabilities)
    .map(normalizeCapability)
    .filter(Boolean);
  if (!oppNormalized.length) return null;

  const clientKeys = new Set(
    parseCapabilityList(clientCapabilities)
      .map(normalizeCapability)
      .filter(Boolean)
      .map((item) => item.matchKey),
  );

  if (!clientKeys.size) return 0;

  const matched = oppNormalized.filter((item) => clientKeys.has(item.matchKey)).length;
  return (matched / oppNormalized.length) * 100;
}

export function bubbleRadiusFromValue(totalValueM) {
  if (!Number.isFinite(totalValueM) || totalValueM <= 8) return MIN_BUBBLE_R;
  if (totalValueM >= 50) return MAX_BUBBLE_R;
  const t = (totalValueM - 8) / (50 - 8);
  return MIN_BUBBLE_R + t * (MAX_BUBBLE_R - MIN_BUBBLE_R);
}

/** Higher ease % → left (Easy). */
export function easePercentToX(easePercent) {
  const clamped = Math.max(0, Math.min(100, easePercent));
  return 100 - clamped;
}

/**
 * Map total $M onto chart Y with $20M bands up to 100+:
 * 0–20, 20–40, 40–60, 60–80, 80–100+.
 * Linear 0–100 scale so $30M lands in the 20–40 band.
 */
export function totalValueToY(totalValueM) {
  const value = Math.max(0, totalValueM);
  const capped = Math.min(value, 100);
  return Math.min(95, Math.max(5, (capped / 100) * 90 + 5));
}

function opportunityCapabilities(opportunity) {
  if (Array.isArray(opportunity?.capabilities) && opportunity.capabilities.length) {
    return opportunity.capabilities;
  }
  return opportunity?.capabilitiesRaw ?? opportunity?.capabilities ?? null;
}

/**
 * Aggregate one account into a matrix bubble row.
 * Returns null when the account has no usable (non-null value) opportunities.
 */
export function aggregateAccountForMatrix(account, clientCapabilities, deriveStatus) {
  const opportunities = account?.opportunities ?? [];
  const valued = [];

  for (const opportunity of opportunities) {
    const midpoint = parseDealMidpointMillions(opportunity.dealSize);
    if (midpoint == null || midpoint <= 0) continue;

    const caps = opportunityCapabilities(opportunity);
    const easePercent = computeOpportunityEasePercent(caps, clientCapabilities);
    const normalizedCaps = parseCapabilityList(caps)
      .map(normalizeCapability)
      .filter(Boolean);

    valued.push({
      opportunity,
      midpoint,
      easePercent,
      normalizedCaps,
      title: opportunity.title ?? opportunity.name ?? 'Opportunity',
    });
  }

  if (!valued.length) return null;

  const totalValue = valued.reduce((sum, row) => sum + row.midpoint, 0);

  const easeEligible = valued.filter((row) => row.easePercent != null);
  let weightedEase = 0;
  if (easeEligible.length) {
    const weightSum = easeEligible.reduce((sum, row) => sum + row.midpoint, 0);
    weightedEase =
      weightSum > 0
        ? easeEligible.reduce((sum, row) => sum + row.easePercent * row.midpoint, 0) / weightSum
        : 0;
  }

  const valueByCapability = new Map();
  for (const row of valued) {
    if (!row.normalizedCaps.length) continue;
    const share = row.midpoint / row.normalizedCaps.length;
    for (const cap of row.normalizedCaps) {
      valueByCapability.set(cap.label, (valueByCapability.get(cap.label) ?? 0) + share);
    }
  }

  let dominantCapability = 'Other';
  let dominantValue = -1;
  const capabilityEntries = [...valueByCapability.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  if (capabilityEntries.length) {
    dominantCapability = capabilityEntries[0][0];
    dominantValue = capabilityEntries[0][1];
  }

  const highest = [...valued].sort((a, b) => b.midpoint - a.midpoint)[0];
  const capabilityLabels = capabilityEntries.map(([label]) => label);
  const topCapabilities = capabilityEntries
    .slice(0, 3)
    .map(([label, value]) => `${label} ${formatMillionsLabel(value)}`);

  const status =
    typeof deriveStatus === 'function'
      ? deriveStatus(account)
      : account.status ?? 'Monitor';

  return {
    id: account.id,
    name: account.name,
    totalValue,
    valueLabel: formatMillionsLabel(totalValue),
    opportunityCount: valued.length,
    weightedEase,
    easeX: easePercentToX(weightedEase),
    y: totalValueToY(totalValue),
    r: bubbleRadiusFromValue(totalValue),
    dominantCapability,
    dominantCapabilityLabel: capabilityDisplayLabel(dominantCapability),
    color: MATRIX_CAPABILITY_COLORS[dominantCapability] ?? MATRIX_CAPABILITY_COLORS.Other,
    capabilityLabels,
    topCapabilities,
    highestValueOpportunity: highest
      ? { title: highest.title, value: formatMillionsLabel(highest.midpoint) }
      : null,
    status,
    // keep a touch of unused dominantValue for debugging/tests
    _dominantValue: dominantValue,
  };
}

/**
 * Top N capabilities for an account, ranked by opportunity deal-value share.
 * Same ranking as the prioritization matrix color/dominant-capability logic.
 * Falls back to the account-level capabilities list when no valued opps exist.
 */
export function getTopAccountCapabilities(account, limit = 4) {
  const max = Math.max(1, Number(limit) || 4);
  const opportunities = account?.opportunities ?? [];
  const valueByCapability = new Map();

  for (const opportunity of opportunities) {
    const midpoint = parseDealMidpointMillions(opportunity.dealSize);
    if (midpoint == null || midpoint <= 0) continue;

    const normalizedCaps = parseCapabilityList(opportunityCapabilities(opportunity))
      .map(normalizeCapability)
      .filter(Boolean);
    if (!normalizedCaps.length) continue;

    const share = midpoint / normalizedCaps.length;
    for (const cap of normalizedCaps) {
      valueByCapability.set(cap.label, (valueByCapability.get(cap.label) ?? 0) + share);
    }
  }

  if (valueByCapability.size) {
    return [...valueByCapability.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .slice(0, max)
      .map(([label]) => label);
  }

  // Fallback: account-level capability tags, first N unique canonical labels.
  const seen = new Set();
  const fallback = [];
  for (const raw of parseCapabilityList(account?.capabilities ?? account?.summary?.topServiceLineThemes)) {
    const normalized = normalizeCapability(raw);
    const label = normalized?.label ?? cleanToken(raw);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    fallback.push(label);
    if (fallback.length >= max) break;
  }
  return fallback;
}

export function buildPrioritizationMatrix(accounts, clientCapabilities, deriveStatus) {
  return (accounts ?? [])
    .map((account) => aggregateAccountForMatrix(account, clientCapabilities, deriveStatus))
    .filter(Boolean);
}

export function filterMatrixByCapability(rows, capFilter) {
  if (!capFilter || capFilter === 'All Capabilities') return rows;
  const normalizedFilter = normalizeCapability(capFilter);
  if (!normalizedFilter) return rows;
  return rows.filter((row) => {
    const labels = Array.isArray(row.capabilityLabels) && row.capabilityLabels.length
      ? row.capabilityLabels
      : [row.dominantCapability].filter(Boolean);
    return labels.some((label) => {
      const normalized = normalizeCapability(label);
      return normalized?.matchKey === normalizedFilter.matchKey;
    });
  });
}
