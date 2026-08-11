/**
 * Builds live-shaped account objects from demo static sources.
 * Keeps the main-app UI unchanged while this repo stays offline/static.
 */
import {
  PORTFOLIO_ACCOUNTS,
  SYNOVUS_SIGNALS,
  JACK_HENRY_SIGNALS,
  JACK_HENRY_EXEC_INTELLIGENCE,
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

/** Curated overview fields keyed by account id (partial → merged over GENERIC). */
const ACCOUNT_OVERVIEW_BY_ID = {
  A0011: {
    about:
      'Jack Henry & Associates, Inc. is a publicly traded U.S. financial technology provider serving community and regional banks, credit unions, fintechs and related businesses with core processing, digital banking, payments, lending, operational, security and complementary solutions.',
    products:
      'Jack Henry offers digital banking capabilities, digital add-ons, account origination, web solutions and open-banking integration.',
    services:
      "Jack Henry's payments portfolio includes digital payments, instant payments, card processing, ACH, wires, remote deposit, receivables and embedded-payment capabilities.",
    // Fintech / platform provider — omit bank-style financial KPIs until sourced.
    assetSize: null,
    revenue: null,
    nim: null,
    efficiencyRatio: null,
    businessStrategy: null,
    retailBank: null,
    commercialBank: null,
    wealthBank: null,
    competitiveLandscape: [],
  },
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
  const curatedOverview = ACCOUNT_OVERVIEW_BY_ID[row.id];
  // Curated accounts without opp data yet should not inherit generic fallback plays.
  const isOverviewOnly = Boolean(curatedOverview) && (row.opps === 0 || !demo.opportunities?.length);
  const hasCuratedOpps = Boolean(demo.opportunities?.length) && (row.id === 'A001' || row.id === 'A002' || row.id === 'A0011' || Boolean(curatedOverview));
  const isFallbackAccount = !hasCuratedOpps && row.id !== 'A001' && row.id !== 'A002' && !isOverviewOnly;

  let rawOpportunities = isOverviewOnly ? [] : (demo.opportunities ?? []);
  if (isFallbackAccount) {
    rawOpportunities = redistributeDealSizes(rawOpportunities, row.valueMid);
  }

  const opportunities = rawOpportunities.map((opp) =>
    normalizeOpportunity(opp, accountCaps),
  );

  const summary = {
    totalOpportunities: isOverviewOnly
      ? 0
      : (demo.summary?.totalOpportunities ?? opportunities.length ?? row.opps ?? 0),
    // Prefer curated demo range when present (Jack Henry / Citizens / Synovus).
    opportunityRange: isOverviewOnly
      ? '—'
      : (demo.summary?.opportunityRange
        ?? (row.value ? `${row.value}+` : `$${row.valueMid ?? 0}M+`)),
    topServiceLineThemes:
      demo.summary?.topServiceLineThemes ?? accountCaps.join(', '),
    stakeholdersCount:
      demo.summary?.stakeholdersCount ??
      (row.id === 'A002' ? SYNOVUS_ORG.kpis.totalStakeholders : (isOverviewOnly ? 0 : 8)),
  };

  const mock = row.id === 'A002' ? getAccountById('1') : null;
  const overviewFields = curatedOverview
    ? { ...GENERIC_OVERVIEW, ...curatedOverview }
    : overviewFromMock(mock);

  return {
    id: row.id,
    name: row.name,
    sector: row.sector ?? null,
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
  if (accountId === 'A0011') {
    const jh = JACK_HENRY_EXEC_INTELLIGENCE;
    return {
      businessSummary: {
        heading: 'Executive Account summary',
        points: jh.points,
        operatingPriorities: jh.operatingPriorities,
        postureStatements: jh.postureStatements,
        verticalBoxSections: jh.verticalBoxSections,
        confidence: jh.confidence,
      },
      cards: JACK_HENRY_SIGNALS.map((s) => ({
        id: s.id,
        title: s.title,
        text: s.desc,
        color: s.color,
        icon: s.icon,
        relevance: s.relevance,
      })),
    };
  }

  const synovusExecutiveSummaryPoints = [
    'Synovus should be approached as a legacy commercial-bank franchise inside the combined Pinnacle Financial Partners organization, with the strongest account signal centered on March 2027 systems and brand conversion. The account posture should combine integration assurance, commercial treasury growth enablement, data/control readiness, channel continuity, and disciplined risk validation without implying vendor replacement or approved SI scope.',
    'The institution is operating in a post-close merger context as part of Pinnacle Financial Partners, with expanded regional scale and a public conversion milestone ahead.',
    'The public strategy signal combines regional growth, commercial relationship expansion, merger integration, client continuity, expense discipline, and fee-income growth.',
    'Integration-led and outcome-led; the public record supports conversion readiness and product-level commercial connectivity, not a generic enterprise modernization thesis.',
  ];
  const synovusOperatingPriorities = [
    'Controlled merger integration',
    'Client and colleague continuity through conversion',
    'Commercial relationship and treasury growth',
    'Data, reporting, and control readiness',
    'Operating leverage and expense discipline',
    'Disciplined risk validation and conversion assurance',
  ];
  const synovusPostureStatements = [
    'Most credible investment demand is likely tied to conversion execution, commercial workflow enablement, data/control alignment, digital/branch continuity, and change enablement. Directional SI-services estimates are not bank-approved budgets.',
    'Technology posture is integration-led, with confirmed public product-level Koxa/Gateway ERP evidence and otherwise platform-category language across core/deposit, digital, data, integration, security, fraud, and AML domains.',
    'Risk posture should be framed around control continuity, operational resilience, financial-reporting confidence, and conversion evidence. Cyber, fraud, and AML remain discovery/watchlist areas.',
    'High sales relevance, medium-to-high consulting readiness, and medium implementation readiness, driven by a dated conversion event and multiple adjacent workstreams that require careful validation.',
    'Public March 2027 systems and brand conversion after the Pinnacle/Synovus merger.',
    'Lead with independent conversion readiness and assurance, then expand into data/control, commercial treasury integration, digital/branch continuity, and operating-model enablement.',
    'Lead with business-led conversion assurance and integration-readiness advisory, not product displacement, vendor rationalization, or broad modernization claims.',
  ];
  const synovusVerticalBoxSections = [
    {
      heading: 'Business Strategy',
      text: 'The publicly supported strategy is an integration-and-growth agenda: complete the Pinnacle/Synovus combination, preserve customers and operations through conversion, grow commercial relationships and fee income, manage merger-related financial effects, and maintain risk/control discipline.',
    },
    {
      heading: 'AccountSignal AI Inference',
      text: 'The combined evidence suggests a practical consulting-demand trajectory: start with conversion assurance, validate cross-functional governance, then expand into commercial integration, data/control readiness, customer-channel continuity, change enablement, and selective managed support after scope is validated.',
    },
    {
      heading: 'Primary Inference',
      text: 'Conversion assurance is the primary account-entry narrative. The most defensible pursuit theme is not platform replacement; it is independent readiness, assurance, testing, reconciliation, and hypercare support around the March 2027 conversion. This is reasonable because the opportunity portfolio consistently points to date-bound conversion, client continuity, operating readiness, data reconciliation, and cutover assurance while preserving vendor and budget guardrails.',
    },
    {
      heading: 'Executive Intelligence Summary',
      text: 'Synovus is a high-relevance integration-led account where the strongest entry is March 2027 conversion readiness. Commercial treasury integration, finance/data controls, digital/branch continuity, and operating-model enablement form the best expansion paths. Cyber, fraud, and AML remain careful validation areas.',
    },
  ];
  return {
    businessSummary: accountId === 'A002'
      ? {
        heading: 'Executive Account summary',
        points: synovusExecutiveSummaryPoints,
        operatingPriorities: synovusOperatingPriorities,
        postureStatements: synovusPostureStatements,
        verticalBoxSections: synovusVerticalBoxSections,
        confidence: 'High',
      }
      : 'Public and internal signals point to growth, efficiency, and technology modernization priorities across retail, commercial, and wealth franchises.',
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

const TOP_OPP_AVATAR_COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#14b8a6', '#64748b', '#2563eb', '#16a34a', '#7c3aed', '#ea580c', '#0891b2', '#ca8a04'];

const SYNOVUS_REAL_TOP_OPP_OWNER_ROWS = [
  {
    opportunityId: 'synovus_opp_001',
    rank: 1,
    title: 'march_2027_systems_brand_and_client_experience_conversion_readiness',
    priority: 'Critical',
    complexity: 'very_high',
    timeline: 'Q3 2026 through Q2 2027',
    budgetVisibility: 'Medium-High',
    strategicImportance: 'Protect client continuity, operating stability, and merger value realization while reducing conversion disruption risk.',
    buyerLens: 'Executive Mandate',
    executiveSponsor: { name: 'Casey Toops', title: 'SVP, Chief Information Officer @ Pinnacle Financial Partners', influence: 5, engagement: 'high' },
    technologyBuyer: { name: 'Sanjeev Jha', title: 'Managing Director & Head of Product Development at Pinnacle Financial Partners', influence: 5, engagement: 'high' },
    dataBuyer: { name: 'Shanthi Mahendrakar', title: 'Head of Data Engineering and Architecture, Data Modernization - Pinnacle + Synovus', influence: 4, engagement: 'medium' },
  },
  {
    opportunityId: 'synovus_opp_002',
    rank: 2,
    title: 'commercial_treasury_and_erp_connected_workflow_expansion',
    priority: 'High',
    complexity: 'high',
    timeline: 'Q4 2026 through Q4 2027',
    budgetVisibility: 'Medium',
    strategicImportance: 'Improve commercial-client connectivity, product usage, onboarding experience, operational leverage, and fee-income potential.',
    buyerLens: 'Growth / Expansion',
    businessBuyer: { name: 'Joy Bowen', title: 'SVP - Treasury Management Manager at Pinnacle Financial Partners', influence: 5, engagement: 'very_high' },
    technologyBuyer: { name: 'Sanjeev Jha', title: 'Managing Director & Head of Product Development at Pinnacle Financial Partners', influence: 5, engagement: 'high' },
  },
  {
    opportunityId: 'synovus_opp_004',
    rank: 3,
    title: 'digital_and_branch_channel_conversion_continuity',
    priority: 'High',
    complexity: 'very_high',
    timeline: 'Q3 2026 through Q2 2027',
    budgetVisibility: 'Medium',
    strategicImportance: 'Protect client retention, deposits, service quality, and conversion experience.',
    buyerLens: 'Improve CX',
    executiveSponsor: { name: 'Katie Webb', title: 'Chief Consumer Digital & Engagement Officer', influence: 5, engagement: 'very_high' },
    businessBuyer: { name: 'Chip Bowen', title: 'Senior Product Manager | Strategy | Digital Revenue | Banking', influence: 3, engagement: 'medium' },
    technologyBuyer: { name: 'Brandon Cathey', title: 'Director of Digital Banking Solutions at Pinnacle Financial Partners', influence: 4, engagement: 'high' },
    dataBuyer: { name: 'Aileen Thomas', title: 'Sr Director, Consumer Performance Management & Analytics', influence: 3, engagement: 'medium' },
  },
  {
    opportunityId: 'synovus_opp_005',
    rank: 4,
    title: 'integration_operating_model_change_and_workforce_enablement',
    priority: 'High',
    complexity: 'very_high',
    timeline: 'Q3 2026 through Q2 2027',
    budgetVisibility: 'Medium',
    strategicImportance: 'Improve consistent client delivery, operational control, employee readiness, and integration execution.',
    buyerLens: 'Executive Mandate',
    executiveSponsor: { name: 'Jennifer Spinks Upshaw', title: 'EVP, Chief Administrative Officer at Pinnacle Financial Partners', influence: 5, engagement: 'high' },
    businessBuyer: { name: 'Lisa Marie Crews, JD, MBA', title: 'Deputy Chief Efficiency Officer at Pinnacle Financial Partners', influence: 4, engagement: 'high' },
  },
  {
    opportunityId: 'synovus_opp_003',
    rank: 5,
    title: 'enterprise_data_finance_and_regulatory_control_alignment',
    priority: 'High',
    complexity: 'very_high',
    timeline: 'Q4 2026 through Q2 2027',
    budgetVisibility: 'Medium',
    strategicImportance: 'Support management confidence, reporting continuity, expense discipline, and control readiness.',
    buyerLens: 'Risk Reduction',
    executiveSponsor: { name: 'Jill Hurley', title: 'Chief Accounting Officer', influence: 5, engagement: 'high' },
    businessBuyer: { name: 'Chad Lopes', title: 'Executive Director - Head of Corporate Finance', influence: 5, engagement: 'very_high' },
    dataBuyer: { name: 'Christian D. Smith', title: 'Senior Manager, Reporting & Analytics | Data Modeling | FP&A | Databricks | Power BI', influence: 4, engagement: 'high' },
    riskBuyer: { name: 'Anthony Fitzgerald Lewis, Jr.', title: 'Director, Risk Analytics, Data, Automation & Reporting (RADAR) @Pinnacle', influence: 4, engagement: 'high' },
  },
  {
    opportunityId: 'synovus_opp_006',
    rank: 6,
    title: 'cyber_identity_resilience_and_conversion_controls',
    priority: 'Watchlist',
    complexity: 'high',
    timeline: 'Q4 2026 through Q2 2027',
    budgetVisibility: 'Low',
    strategicImportance: 'Reduce conversion-control, access, resilience, and operational-risk exposure.',
    buyerLens: 'Risk Reduction',
    executiveSponsor: { name: 'Keith Thomas', title: 'CISO | Father | Outdoor Enthusiast | Amateur Baker', influence: 5, engagement: 'high' },
    technologyBuyer: { name: 'Kent Garner', title: 'Director of Identity Access Management at Pinnacle Financial Partners', influence: 4, engagement: 'very_high' },
    riskBuyer: { name: 'Candi Herring', title: 'Director, IT Risk Technology Delivery & GRC Program Management', influence: 4, engagement: 'high' },
  },
  {
    opportunityId: 'synovus_opp_007',
    rank: 7,
    title: 'financial_crime_fraud_scams_disputes_readiness',
    priority: 'Watchlist',
    complexity: 'high',
    timeline: 'Q4 2026 through Q2 2027',
    budgetVisibility: 'Low',
    strategicImportance: 'Protect clients, reduce service disruption, and preserve payment and customer-protection controls.',
    buyerLens: 'Risk Reduction',
    dataBuyer: { name: 'Chris Eskue', title: 'Fraud Data and Analysis Program Manager at Synovus', influence: 4, engagement: 'high' },
    riskBuyer: { name: 'Chevonne Richards', title: 'Driving enterprise fraud governance that balances risk, compliance, and customer trust.', influence: 4, engagement: 'medium' },
  },
  {
    opportunityId: 'synovus_opp_008',
    rank: 8,
    title: 'aml_bsa_sanctions_control_and_case_management_readiness',
    priority: 'Watchlist',
    complexity: 'high',
    timeline: 'Q4 2026 through Q2 2027',
    budgetVisibility: 'Low',
    strategicImportance: 'Maintain financial-crime control continuity and operational readiness through organizational and systems change.',
    buyerLens: 'Regulatory Push',
    executiveSponsor: { name: 'Gloria C Banks, CRCM, CERP', title: 'EVP, Chief Ethics & Chief Compliance Officer at Synovus', influence: 5, engagement: 'medium' },
    businessBuyer: { name: 'Stephanie Wise', title: 'Experienced BSA/AML Leader | AML technology, policy, operations, metrics, innovation, product design, analytics & modeling', influence: 5, engagement: 'very_high' },
    technologyBuyer: { name: 'Tara Avery-Fraser, CAFP, CACTS', title: 'Director BSA/AML Analytics & Technology', influence: 5, engagement: 'very_high' },
    dataBuyer: { name: 'Joseph Tucker', title: 'BSA Data and Analytics Specialist at Pinnacle Financial Partners', influence: 3, engagement: 'medium' },
    riskBuyer: { name: 'Sue J Nelson, CRCM, AMLP', title: 'Director BSA/AML Compliance- Corporate BSA/AML Officer at Synovus Financial Corp', influence: 4, engagement: 'high' },
  },
];

function initialsFromName(name) {
  return String(name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function titleCase(value) {
  return String(value ?? '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function hashColor(value) {
  const text = String(value ?? '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return TOP_OPP_AVATAR_COLORS[Math.abs(hash) % TOP_OPP_AVATAR_COLORS.length];
}

function mapComplexity(rawValue) {
  const normalized = String(rawValue ?? '').toLowerCase();
  if (normalized.includes('very_high')) return { complexity: 5, complexityLabel: 'High' };
  if (normalized.includes('high')) return { complexity: 4, complexityLabel: 'High' };
  if (normalized.includes('medium')) return { complexity: 3, complexityLabel: 'Medium' };
  if (normalized.includes('low')) return { complexity: 2, complexityLabel: 'Low' };
  return { complexity: 3, complexityLabel: 'Medium' };
}

function toBuyerCard(role, functionName, buyer) {
  if (!buyer?.name) return null;
  return {
    role,
    initials: initialsFromName(buyer.name),
    bg: hashColor(buyer.name),
    name: buyer.name,
    title: buyer.title ?? '',
    function: functionName,
    influence: Number(buyer.influence ?? 0) || 0,
    engagement: titleCase(buyer.engagement || 'medium'),
  };
}

const SYNOVUS_REAL_TOP_OPP_OWNERS = SYNOVUS_REAL_TOP_OPP_OWNER_ROWS.map((row) => {
  const buyers = [
    toBuyerCard('Executive Sponsor', 'Executive Leadership', row.executiveSponsor),
    toBuyerCard('Economic Buyer', 'Finance', row.economicBuyer),
    toBuyerCard('Business Owner', 'Business', row.businessBuyer),
    toBuyerCard('Technology Owner', 'Technology', row.technologyBuyer),
    toBuyerCard('Data Owner', 'Data & Analytics', row.dataBuyer),
    toBuyerCard('Risk Stakeholder', 'Risk', row.riskBuyer),
  ].filter(Boolean);
  const owners = buyers.slice(0, 3).map((item) => ({ i: item.initials, bg: item.bg }));
  const mappedComplexity = mapComplexity(row.complexity);
  return {
    opportunityId: row.opportunityId,
    rank: row.rank,
    priority: titleCase(row.priority),
    title: row.title,
    complexity: mappedComplexity.complexity,
    complexityLabel: mappedComplexity.complexityLabel,
    timeline: row.timeline,
    budgetVisibility: row.budgetVisibility,
    strategicImportance: row.priority === 'Critical' ? 'Critical' : titleCase(row.priority),
    buyerLens: row.buyerLens,
    owners,
    extraOwners: Math.max(0, buyers.length - owners.length),
    buyingCenter: buyers,
  };
});

const PENDING_ORG = Object.freeze({
  summary: null,
  kpis: {
    totalStakeholders: 0,
    executiveLeaders: 0,
    technologyLeaders: 0,
    opportunityOwners: 0,
  },
  tabs: [],
  stakeholders: [],
  topOpportunityOwners: [],
  pending: true,
});

export function getStaticOrganization(accountId) {
  // Jack Henry org chart / stakeholders are not curated yet — do not inherit Synovus.
  if (accountId === 'A0011') return { ...PENDING_ORG };

  const kpis = SYNOVUS_ORG.kpis ?? {};
  const topOpportunityOwners = accountId === 'A002'
    ? SYNOVUS_REAL_TOP_OPP_OWNERS
    : (SYNOVUS_ORG.topOpportunityOwners ?? []);
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
    topOpportunityOwners,
    pending: false,
  };
}

function parseLooseDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const first = raw.split(/[–—-]/)[0]?.trim();
  const yearMatch = raw.match(/\b(20\d{2})\b/);
  const hasYear = /\b(19|20)\d{2}\b/.test(first);
  const normalized = hasYear || !yearMatch ? first : `${first}, ${yearMatch[1]}`;
  const time = Date.parse(normalized);
  if (Number.isFinite(time)) return new Date(time).toISOString().slice(0, 10);
  return null;
}

function toIsoDate(monthLabel, dayValue, yearValue) {
  if (!monthLabel || !dayValue || !yearValue) return null;
  const time = Date.parse(`${monthLabel} ${dayValue}, ${yearValue}`);
  if (!Number.isFinite(time)) return null;
  return new Date(time).toISOString().slice(0, 10);
}

function parseEventDateRange(value) {
  if (!value) return { startDate: null, endDate: null };
  const raw = String(value).trim();
  const yearMatches = raw.match(/\b(19|20)\d{2}\b/g);
  const year = yearMatches?.[yearMatches.length - 1] ?? '2026';

  const rangeParts = raw.split(/\s*[–—-]\s*/);
  if (rangeParts.length < 2) {
    return { startDate: parseLooseDate(raw), endDate: null };
  }

  const startText = rangeParts[0]?.trim() ?? '';
  const endText = rangeParts.slice(1).join(' - ').trim();

  const startMatch = startText.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (!startMatch) {
    return { startDate: parseLooseDate(raw), endDate: null };
  }

  const startMonth = startMatch[1];
  const startDay = startMatch[2];
  const startDate = toIsoDate(startMonth, startDay, year);

  const cleanedEnd = endText.replace(/\b(19|20)\d{2}\b/g, '').replace(/,/g, ' ').trim();
  const endMonthDayMatch = cleanedEnd.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  const endDayOnlyMatch = cleanedEnd.match(/^(\d{1,2})$/);

  let endDate = null;
  if (endMonthDayMatch) {
    endDate = toIsoDate(endMonthDayMatch[1], endMonthDayMatch[2], year);
  } else if (endDayOnlyMatch) {
    endDate = toIsoDate(startMonth, endDayOnlyMatch[1], year);
  }

  return { startDate, endDate };
}

const PENDING_NEWS = Object.freeze({
  bankNews: [],
  industryUpdates: [],
  upcomingEvents: [],
  pending: true,
});

export function getStaticNews(accountId) {
  // Jack Henry news/events are not curated yet — do not inherit Synovus.
  if (accountId === 'A0011') return { ...PENDING_NEWS };

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

  const upcomingEvents = (SYNOVUS_NEWS.upcomingEvents ?? []).map((item, i) => {
    const { startDate, endDate } = parseEventDateRange(item.date);
    return {
      id: `ev_${i}`,
      news_item_id: `ev_${i}`,
      title: item.name,
      name: item.name,
      start_date: startDate,
      end_date: endDate,
      location: item.location,
      category: item.category,
      categoryColor: item.categoryColor,
      categoryBg: item.categoryBg,
      primary_audience: item.audience,
      why_relevant: item.whyRelevant,
      website: item.website,
    };
  });

  return { bankNews, industryUpdates, upcomingEvents, pending: false };
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
