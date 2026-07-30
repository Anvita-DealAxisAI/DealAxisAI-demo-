/**
 * Builds live-shaped account objects from demo static sources.
 * Keeps the main-app UI unchanged while this repo stays offline/static.
 */
import {
  PORTFOLIO_ACCOUNTS,
  SYNOVUS_SIGNALS,
  SYNOVUS_ORG,
  SYNOVUS_NEWS,
  getDemoAccountsSubset,
} from '../data/staticData';
import { getDemoOpportunityAccount } from '../data/demoOpportunityData';
import { getAccountById } from '../data/mockData';
import { totalValueToY } from '../utils/prioritizationMatrix';

/** SI capability set used for ease-of-entry scoring in the demo matrix. */
const CLIENT_CAPABILITIES = [
  'Data', 'AI', 'QE', 'Cloud', 'Core', 'Digital',
];

const GENERIC_OVERVIEW = {
  about:
    'Regional financial-services organization focused on relationship-led banking across retail, commercial and wealth segments.',
  products:
    'Consumer and commercial lending, treasury management, payments, mortgages, digital banking, wealth and advisory services.',
  services:
    'Retail banking, commercial banking, treasury, payments, private banking, wealth advisory, branch and digital servicing.',
  assetSize: '$50B+',
  revenue: '$2.0B',
  nim: '3.0%',
  efficiencyRatio: '60%',
  businessStrategy:
    'Disciplined growth through deeper client relationships, digital modernization, and operational efficiency across core banking franchises.',
  retailBank:
    'Focused on deepening digital engagement, growing core deposits, and enhancing customer experience.',
  commercialBank:
    'Driving commercial lending growth, expanding treasury and payments, and strengthening middle-market relationships.',
  wealthBank:
    'Growing advisory assets and delivering integrated relationship coverage for affluent clients.',
  competitiveLandscape: [
    { bankName: 'Regions', assetSize: '$152B', revenue: '$7.5B', efficiencyRatio: '60%' },
    { bankName: 'Truist', assetSize: '$545B', revenue: '$20.1B', efficiencyRatio: '62%' },
    { bankName: 'Fifth Third', assetSize: '$214B', revenue: '$7.8B', efficiencyRatio: '59%' },
  ],
};

function monStartToIso(monStart) {
  const [month, year] = String(monStart ?? '').trim().split(/\s+/);
  if (!month || !year) return new Date().toISOString();
  const time = Date.parse(`${month} 1, ${year}`);
  return Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
}

function toCapabilityList(value, fallback = []) {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
  }
  return [...fallback];
}

function normalizeOpportunity(opp, accountCaps) {
  const caps = toCapabilityList(opp?.capabilities, accountCaps);
  return {
    ...opp,
    id: opp?.id ?? opp?.opportunityId ?? `opp_${Math.random().toString(36).slice(2, 8)}`,
    title: opp?.title ?? 'Untitled opportunity',
    priority: opp?.priority ?? 'Medium',
    dealSize: opp?.dealSize ?? opp?.deal_size ?? '$1M-$3M',
    capabilities: caps,
  };
}

function financialValue(financials, label) {
  const row = (financials ?? []).find((f) => f.label === label);
  return row?.value ?? null;
}

function overviewFromMock(mockAccount) {
  const ov = mockAccount?.overview;
  if (!ov) return { ...GENERIC_OVERVIEW };

  const segments = ov.segments ?? [];
  const retail = segments.find((s) => /retail/i.test(s.title));
  const commercial = segments.find((s) => /commercial/i.test(s.title));
  const wealth = segments.find((s) => /wealth/i.test(s.title));

  return {
    about: ov.about ?? GENERIC_OVERVIEW.about,
    products: ov.products ?? GENERIC_OVERVIEW.products,
    services: ov.services ?? GENERIC_OVERVIEW.services,
    assetSize: financialValue(ov.financials, 'Asset Size') ?? GENERIC_OVERVIEW.assetSize,
    revenue: financialValue(ov.financials, 'Revenue') ?? GENERIC_OVERVIEW.revenue,
    nim: financialValue(ov.financials, 'NIM') ?? GENERIC_OVERVIEW.nim,
    efficiencyRatio: financialValue(ov.financials, 'Efficiency Ratio') ?? GENERIC_OVERVIEW.efficiencyRatio,
    businessStrategy: ov.strategy ?? GENERIC_OVERVIEW.businessStrategy,
    retailBank: retail?.desc ?? GENERIC_OVERVIEW.retailBank,
    commercialBank: commercial?.desc ?? GENERIC_OVERVIEW.commercialBank,
    wealthBank: wealth?.desc ?? GENERIC_OVERVIEW.wealthBank,
    competitiveLandscape: (ov.competitors ?? []).map((c) => ({
      bankName: c.name ?? c.bankName ?? 'Competitor',
      assetSize: c.assetSize ?? '—',
      revenue: c.revenue ?? '—',
      efficiencyRatio: c.efficiencyRatio ?? c.efficiency ?? '—',
    })),
  };
}

/**
 * Fallback accounts previously reused the full portfolio range as every opp's
 * dealSize (e.g. 10 × $8–16M), which blew up matrix Y. Spread valueMid instead.
 */
function redistributeDealSizes(opportunities, valueMidM) {
  const count = opportunities.length;
  if (!count || !Number.isFinite(valueMidM) || valueMidM <= 0) return opportunities;

  const avg = valueMidM / count;
  return opportunities.map((opp, index) => {
    const hasOwnCaps = Array.isArray(opp.capabilities) && opp.capabilities.length > 0;
    const low = Math.max(0.4, avg * (0.65 + (index % 3) * 0.08));
    const high = Math.max(low + 0.4, avg * (1.15 + (index % 2) * 0.1));
    return {
      ...opp,
      dealSize: `$${low.toFixed(1)}M-$${high.toFixed(1)}M`,
      capabilities: hasOwnCaps ? opp.capabilities : undefined,
    };
  });
}

function buildAccount(row) {
  const demo = getDemoOpportunityAccount(row.id, row.name) ?? {};
  const accountCaps = toCapabilityList(row.capabilities);
  const isFallbackAccount = row.id !== 'A001' && row.id !== 'A002';

  let rawOpportunities = demo.opportunities ?? [];
  if (isFallbackAccount) {
    rawOpportunities = redistributeDealSizes(rawOpportunities, row.valueMid);
  }

  const opportunities = rawOpportunities.map((opp) =>
    normalizeOpportunity(opp, accountCaps),
  );

  const summary = {
    totalOpportunities: demo.summary?.totalOpportunities ?? opportunities.length ?? row.opps ?? 0,
    // Curated portfolio midpoint keeps KPI/matrix storytelling consistent in the demo.
    opportunityRange: row.value ? `${row.value}+` : (demo.summary?.opportunityRange ?? `$${row.valueMid ?? 0}M+`),
    topServiceLineThemes:
      demo.summary?.topServiceLineThemes ?? accountCaps.join(', '),
    stakeholdersCount:
      demo.summary?.stakeholdersCount ??
      (row.id === 'A002' ? SYNOVUS_ORG.kpis.totalStakeholders : 8),
  };

  const mock = row.id === 'A002' ? getAccountById('1') : null;
  const overviewFields = overviewFromMock(mock);

  return {
    id: row.id,
    name: row.name,
    status: row.status,
    capabilities: accountCaps.join(', '),
    updatedAt: monStartToIso(row.monStart),
    summary,
    opportunities,
    // Designed demo layout so the prioritization matrix stays readable.
    matrixLayout: {
      easeX: row.easeX,
      matrixY: row.matrixY ?? totalValueToY(row.valueMid),
      valueMid: row.valueMid,
      color: row.color,
      valueLabel: row.value,
    },
    ...overviewFields,
  };
}

export function getStaticClientCapabilities() {
  return CLIENT_CAPABILITIES;
}

export function getStaticPortfolioAccounts(bankCount) {
  return getDemoAccountsSubset(bankCount).map(buildAccount);
}

export function getStaticAccountById(accountId, bankCount) {
  const all = getStaticPortfolioAccounts(bankCount);
  return all.find((a) => a.id === accountId) ?? null;
}

export function getStaticSignals(accountId) {
  // Demo currently reuses Synovus signal narrative for all banks.
  void accountId;
  return {
    businessSummary:
      'Public and internal signals point to growth, efficiency, and technology modernization priorities across retail, commercial, and wealth franchises.',
    cards: SYNOVUS_SIGNALS.map((s) => ({
      id: s.id,
      title: s.title,
      text: s.desc,
      color: s.color,
      icon: s.icon,
      relevance: s.relevance,
    })),
  };
}

export function getStaticOrganization(accountId) {
  void accountId;
  const kpis = SYNOVUS_ORG.kpis ?? {};
  return {
    summary: SYNOVUS_ORG.summary ?? null,
    kpis: {
      totalStakeholders: kpis.totalStakeholders ?? 0,
      executiveLeaders: kpis.executiveLeaders ?? 0,
      technologyLeaders: kpis.technologyLeaders ?? kpis.functionLeaders ?? 0,
      opportunityOwners: kpis.opportunityOwners ?? 0,
    },
    tabs: SYNOVUS_ORG.tabs ?? [],
    stakeholders: [],
  };
}

function parseLooseDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const first = raw.split(/[–—-]/)[0]?.trim();
  const time = Date.parse(first);
  if (Number.isFinite(time)) return new Date(time).toISOString().slice(0, 10);
  return null;
}

export function getStaticNews(accountId) {
  void accountId;
  const bankNews = (SYNOVUS_NEWS.bankNews ?? []).map((item, i) => ({
    id: `bn_${i}`,
    news_item_id: `bn_${i}`,
    title: item.title,
    published_at: parseLooseDate(item.date),
    source: item.source,
    category: item.category,
    categoryColor: item.categoryColor,
    categoryBg: item.categoryBg,
    sales_relevance: item.relevance,
    relevance: item.relevance,
    source_url: item.link,
    summary: item.summary ?? null,
  }));

  const industryUpdates = (SYNOVUS_NEWS.industryUpdates ?? []).map((item, i) => ({
    id: `iu_${i}`,
    news_item_id: `iu_${i}`,
    title: item.title,
    published_at: parseLooseDate(item.date),
    source: item.source,
    category: item.category,
    categoryColor: item.categoryColor,
    categoryBg: item.categoryBg,
    summary: item.summary,
    affected_business_domains: item.affectedDomains,
    why_it_matters: item.whyMatters,
    source_url: item.link,
  }));

  const upcomingEvents = (SYNOVUS_NEWS.upcomingEvents ?? []).map((item, i) => ({
    id: `ev_${i}`,
    news_item_id: `ev_${i}`,
    title: item.name,
    name: item.name,
    start_date: parseLooseDate(item.date),
    end_date: null,
    location: item.location,
    category: item.category,
    categoryColor: item.categoryColor,
    categoryBg: item.categoryBg,
    primary_audience: item.audience,
    why_relevant: item.whyRelevant,
    website: item.website,
  }));

  return { bankNews, industryUpdates, upcomingEvents };
}

export function getStaticOpportunity(accountId, opportunityId) {
  const account = getStaticAccountById(accountId);
  const opportunity =
    account?.opportunities?.find((o) => String(o.id) === String(opportunityId)) ?? null;
  return opportunity;
}

export function getStaticNotifications(accounts) {
  const list = (accounts ?? getStaticPortfolioAccounts()).slice(0, 4);
  const now = Date.now();
  const notifications = list.map((acct, i) => {
    const opp = acct.opportunities?.[0];
    return {
      id: `n_${acct.id}_${i}`,
      accountId: acct.id,
      accountName: acct.name,
      opportunityId: opp?.id ?? null,
      eventType: i % 2 === 0 ? 'opportunity_updated' : 'account_signal',
      title: i % 2 === 0
        ? `${acct.name}: opportunity update`
        : `${acct.name}: new signal detected`,
      body: opp?.title ?? 'Review the latest account intelligence.',
      createdAt: new Date(now - i * 3_600_000).toISOString(),
      isRead: i > 1,
    };
  });
  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  };
}

export { PORTFOLIO_ACCOUNTS };
