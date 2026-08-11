/**
 * Jack Henry (A0011) opportunities — generated from analyst export.
 * Source JSON: ./jackHenryOpportunities.json
 */
import jackHenryOpportunities from './jackHenryOpportunities.json';

function parseDealRange(dealSize) {
  const parts = String(dealSize ?? '').match(/(\d+(?:\.\d+)?)\s*([KM])?/gi);
  if (!parts?.length) return null;
  const vals = [];
  for (const part of parts) {
    const m = part.match(/(\d+(?:\.\d+)?)\s*([KM])?/i);
    if (!m) continue;
    let v = Number(m[1]);
    const unit = (m[2] || 'M').toUpperCase();
    if (unit === 'K') v /= 1000;
    vals.push(v);
  }
  if (!vals.length) return null;
  return [vals[0], vals[vals.length - 1]];
}

function formatMillions(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

function buildRangeFromOpportunities(opportunities) {
  const totals = opportunities.reduce(
    (acc, opp) => {
      const bounds = parseDealRange(opp.dealSize);
      if (!bounds) return acc;
      return { min: acc.min + bounds[0], max: acc.max + bounds[1] };
    },
    { min: 0, max: 0 },
  );
  if (!totals.max) return '—';
  return `$${formatMillions(totals.min)}M–$${formatMillions(totals.max)}M`;
}

function buildDealMidpoint(dealSize) {
  const bounds = parseDealRange(dealSize);
  if (!bounds) return null;
  return (bounds[0] + bounds[1]) / 2;
}

/** Keep only Confirmed + Inferred on Jack Henry tech-stack cards. */
function sanitizeTechnologyStack(stack) {
  if (!stack || typeof stack !== 'object') return stack;
  return {
    confirmed: stack.confirmed ?? null,
    inferred: stack.inferred ?? null,
  };
}

const opportunities = (jackHenryOpportunities ?? []).map((opp) => ({
  ...opp,
  // List/matrix surfaces expect a flat capability list.
  capabilities: Array.isArray(opp.capabilities) ? opp.capabilities : [],
  technologyStack: sanitizeTechnologyStack(opp.technologyStack),
}));

const opportunityRange = buildRangeFromOpportunities(opportunities);

const JACK_HENRY_TOP_THEMES =
  'Enterprise Integration, Product Architecture, Core, AI';

export const JACK_HENRY_ACCOUNT = {
  id: 'A0011',
  name: 'Jack Henry',
  summary: {
    totalOpportunities: opportunities.length,
    opportunityRange,
    topServiceLineThemes: JACK_HENRY_TOP_THEMES,
    stakeholdersCount: 0,
  },
  opportunities,
  overview: {
    rankedPlays: opportunities.map((opp) => ({
      rank: opp.rank,
      confidence: opp.confidenceScore,
      salesReadiness: opp.salesReadiness,
      priority: opp.priority,
      dealMidpoint: buildDealMidpoint(opp.dealSize),
      title: opp.title,
      why: opp.businessDriver,
      entryWedge: opp.siEntryWedge,
      firstBuyer: opp.buyer,
      meetingTheme: opp.firstMeetingTheme,
    })),
  },
};

export { opportunities as JACK_HENRY_OPPORTUNITIES };
