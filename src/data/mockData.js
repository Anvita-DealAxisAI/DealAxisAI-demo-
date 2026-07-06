/**
 * Runtime CSV integration.
 *
 * Card-level fields (title, priority, deal size, timeline, etc.) come
 * directly from the CSV files — just add a new row and the app updates.
 *
 * Rich detail fields (buyerMap, siEntryWedge, firstMeetingTheme, etc.)
 * are kept in the JS overlay below, keyed by opportunity_id, because
 * they're too complex for flat CSV columns.
 *
 * TODO: Replace with Supabase fetch when ready.
 */

import { parseCsv } from './csvParser';
import synovusLogoUrl from '../../logo/synovus_logo.jpg';

// ── Raw CSV imports (Vite resolves these at build / HMR time) ─────────────
import accountsRaw from '../../data/excel-templates/accounts.csv?raw';
import opportunitiesRaw from '../../Synovus_Opportunities_Wrapped.csv?raw';

const ACCOUNT_ID_MAP = {
  synovus_financial_2026: '1',
};

// ── Rich detail overlay (keyed by opportunity_id as string) ───────────────
const opportunityDetails = {
  synovus_opp_enterprise_change_001: {
    buyerMap: [
      { role: 'Business owner',        contact: 'Integration Office / COO / business-line conversion leads' },
      { role: 'Technology owner',      contact: 'CIO / CTO / core conversion leader' },
      { role: 'Risk / compliance owner', contact: 'Operational risk / compliance / cyber' },
      { role: 'Data owner',            contact: 'Enterprise data / reporting / conversion reconciliation' },
      { role: 'Operations owner',      contact: 'Branch ops / customer care / back office' },
      { role: 'Budget owner',          contact: 'Integration Office / CIO / COO' },
    ],
    siEntryWedge:      'March 2027 conversion readiness and client-experience risk assessment.',
    firstMeetingTheme: 'How do we protect client experience and operational stability during system and brand conversion?',
    firstThirtyDays: [
      'Run a conversion-risk heatmap across core, digital, treasury, branch, lending, data, and servicing.',
      'Identify top 20 client-impact failure points.',
      'Define mock-conversion test model and readiness dashboard.',
    ],
    solutionTeam:
      'Bring merger-conversion PMO, banking core conversion, data migration, testing, digital assurance, and change-management leads. Prepare a reference architecture for conversion assurance: source systems, data migration, reconciliation, regression testing, defect triage, cutover command center, and post-conversion stabilization. Prepare assets for test strategy, data reconciliation, branch readiness, and customer-impact monitoring.',
    keyIntegrationAreas:
      'Core-to-digital, core-to-treasury, core-to-reporting, customer/account data, branch/ATM, identity, alerts, statements, servicing.',
  },
  synovus_opp_core_banking_002: {
    buyerMap: [
      { role: 'Business owner',        contact: 'Deposit operations / retail banking / operations' },
      { role: 'Technology owner',      contact: 'Core banking technology / CIO organization' },
      { role: 'Risk / compliance owner', contact: 'Operational risk / compliance' },
      { role: 'Data owner',            contact: 'Data migration and reconciliation lead' },
      { role: 'Operations owner',      contact: 'Back office / branch ops' },
      { role: 'Budget owner',          contact: 'CIO / Integration Office / COO' },
    ],
    siEntryWedge:      'FIS core and deposit conversion risk review.',
    firstMeetingTheme: 'Deposit conversion accuracy, customer-impact controls, and downstream integration readiness.',
    firstThirtyDays: [
      'Map deposit conversion dependencies.',
      'Identify high-risk product/account mapping scenarios.',
      'Define reconciliation and mock-conversion validation model.',
    ],
    solutionTeam:
      'Bring core banking, deposit operations, data migration, QA automation, and reconciliation experts. Prepare deposit-conversion validation framework and sample control dashboard. Prepare test scenarios for account balances, fees, statements, interest, alerts, digital visibility, and reporting.',
    keyIntegrationAreas:
      'FIS core, digital banking, treasury, branch/teller, reporting, statements/notices, data warehouse, customer communications.',
  },
  synovus_opp_app_rationalization_010: {
    siEntryWedge:      'Post-merger application inventory and dependency heat map.',
    firstMeetingTheme: 'Where can the combined bank reduce complexity without increasing conversion risk?',
  },
  synovus_opp_cybersecurity_identity_resilience_009: {
    siEntryWedge:      'Identity and cyber controls readiness for conversion and AI adoption.',
    firstMeetingTheme: 'Secure conversion: identity, access, AI governance, and cyber control evidence.',
  },
  synovus_opp_digital_banking_008: {
    buyerMap: [
      { role: 'Business owner',          contact: 'Retail banking / digital banking' },
      { role: 'Technology owner',        contact: 'Digital channels / CIO' },
      { role: 'Risk / compliance owner', contact: 'Fraud / IAM / operational risk' },
      { role: 'Data owner',              contact: 'Customer/account data owner' },
      { role: 'Operations owner',        contact: 'Digital support / customer care' },
      { role: 'Budget owner',            contact: 'Retail / digital / integration office / CIO' },
    ],
    siEntryWedge:      'My Synovus migration journey and digital regression readiness review.',
    firstMeetingTheme: 'How do we prevent digital disruption during customer migration?',
    firstThirtyDays: [
      'Map top digital journeys and conversion failure modes.',
      'Assess regression automation coverage.',
      'Define customer support and defect-monitoring readiness model.',
    ],
    solutionTeam:
      'Bring digital banking QA, mobile/web testing, customer journey, authentication, fraud, and contact-center readiness experts. Prepare digital journey test catalog. Prepare release-readiness and defect-triage dashboard.',
    keyIntegrationAreas:
      'Digital banking, core/account data, bill pay, Zelle, mobile deposit, alerts, authentication, branch/ATM locator, customer support.',
  },
  synovus_opp_fraud_scams_disputes_007: {
    buyerMap: [
      { role: 'Business owner',          contact: 'Fraud operations / treasury / digital banking' },
      { role: 'Technology owner',        contact: 'Fraud technology / risk technology / digital' },
      { role: 'Risk / compliance owner', contact: 'Fraud risk / operational risk' },
      { role: 'Data owner',              contact: 'Fraud analytics / data science' },
      { role: 'Operations owner',        contact: 'Fraud operations / disputes' },
      { role: 'Budget owner',            contact: 'Fraud / risk / treasury / CIO' },
    ],
    siEntryWedge:      'Payment-risk and fraud-control effectiveness diagnostic.',
    firstMeetingTheme: 'Improving fraud controls without hurting client experience or treasury usability.',
    firstThirtyDays: [
      'Map fraud/payment-risk controls across treasury and digital journeys.',
      'Identify positive-pay and exception-handling pain points.',
      'Assess model governance and data-quality gaps.',
    ],
    solutionTeam:
      'Bring fraud analytics, payment-risk, treasury operations, model governance, and data-quality experts. Prepare fraud/payment-risk reference architecture: transaction data, risk scoring, positive pay, alerts, case workflow, customer notification, operations dashboard. Prepare false-positive and exception-reduction framework.',
    keyIntegrationAreas:
      'Gateway, positive pay, ACH/wire, digital alerts, core/account data, customer notifications, fraud operations, case/dispute systems.',
  },
  synovus_opp_data_bi_analytics_006: {
    buyerMap: [
      { role: 'Business owner',          contact: 'Finance / risk / business-line reporting owners' },
      { role: 'Technology owner',        contact: 'Data engineering / CIO' },
      { role: 'Risk / compliance owner', contact: 'Operational risk / model risk / compliance' },
      { role: 'Data owner',              contact: 'CDO / enterprise data governance' },
      { role: 'Operations owner',        contact: 'Reporting operations / conversion PMO' },
      { role: 'Budget owner',            contact: 'CIO / CDO / CFO / CRO / Integration Office' },
    ],
    siEntryWedge:      'Conversion reconciliation and AI-ready data diagnostic.',
    firstMeetingTheme: 'Trusted data for conversion, reporting, and governed AI.',
    firstThirtyDays: [
      'Identify top conversion-critical data domains.',
      'Define reconciliation controls for customer, account, deposit, loan, treasury, and reporting data.',
      'Map AI use cases to data-quality and governance requirements.',
    ],
    solutionTeam:
      'Bring data governance, data quality, reconciliation, banking data model, AI data, and reporting experts. Prepare reference architecture: source systems, reconciliation engine, DQ rules, lineage, BI/reporting, AI-ready data products. Prepare sample data-control catalog.',
    keyIntegrationAreas:
      'Core, digital, treasury, lending, reporting, AI tools, document repositories, fraud analytics.',
  },
  synovus_opp_ai_genai_ml_005: {
    buyerMap: [
      { role: 'Business owner',          contact: 'Enterprise operations / line-of-business productivity owners' },
      { role: 'Technology owner',        contact: 'CIO / AI leader / enterprise architecture' },
      { role: 'Risk / compliance owner', contact: 'Compliance / legal / model risk / cyber' },
      { role: 'Data owner',              contact: 'CDO / data governance' },
      { role: 'Operations owner',        contact: 'Knowledge management / operations' },
      { role: 'Budget owner',            contact: 'CIO / enterprise transformation / risk' },
    ],
    siEntryWedge:      'AI governance and use-case scaling readiness assessment.',
    firstMeetingTheme: 'Scaling AI safely with measurable productivity and defensible governance.',
    firstThirtyDays: [
      'Inventory current AI use cases and classify by risk/value.',
      'Map governance controls against NIST-style AI risk expectations.',
      'Select 2–3 use cases for productivity, IDP, or knowledge-search acceleration.',
    ],
    solutionTeam:
      'Bring AI governance, GenAI architecture, data governance, IDP, risk/compliance, and change-adoption leads. Prepare reference architecture: knowledge sources, access controls, RAG pattern, prompt controls, model monitoring, audit logs, human review. Prepare AI governance checklist and use-case prioritization model.',
    keyIntegrationAreas:
      'Enterprise knowledge repositories, document stores, data platform, identity/access controls, monitoring/logging, workflow/case platforms.',
  },
  synovus_opp_lending_004: {
    buyerMap: [
      { role: 'Business owner',          contact: 'Commercial Banking / CIB / Specialty Lending' },
      { role: 'Technology owner',        contact: 'Commercial platforms / lending technology' },
      { role: 'Risk / compliance owner', contact: 'Credit risk / operational risk' },
      { role: 'Data owner',              contact: 'Credit analytics / lending data' },
      { role: 'Operations owner',        contact: 'Credit operations / loan operations' },
      { role: 'Budget owner',            contact: 'Commercial banking / credit / CIO' },
    ],
    siEntryWedge:      'nCino adoption, workflow, and credit-operations effectiveness review.',
    firstMeetingTheme: 'Reducing commercial lending friction while protecting credit discipline.',
    firstThirtyDays: [
      'Map current nCino workflows and leakage points.',
      'Identify high-friction handoffs across banker, credit, docs, closing, and booking.',
      'Define quick-win workflow, data-quality, and adoption improvements.',
    ],
    solutionTeam:
      'Bring nCino, commercial lending, credit workflow, Salesforce-adjacent architecture, testing, and data-quality specialists. Prepare CLOS reference architecture: CRM/RM intake, borrower data, credit decisioning, docs, core booking, reporting. Prepare sample metrics: cycle time, touch time, rework, exceptions, missing docs, approval bottlenecks.',
    keyIntegrationAreas:
      'nCino, core, customer/account data, document systems, reporting, collateral, covenant, portfolio monitoring.',
  },
  synovus_opp_treasury_003: {
    buyerMap: [
      { role: 'Business owner',        contact: 'Treasury Management / Commercial Banking' },
      { role: 'Technology owner',      contact: 'Treasury technology / commercial digital platforms' },
      { role: 'Risk / compliance owner', contact: 'Fraud / payment risk / operational risk' },
      { role: 'Data owner',            contact: 'Treasury analytics / reporting' },
      { role: 'Operations owner',      contact: 'Treasury services operations' },
      { role: 'Budget owner',          contact: 'Commercial banking / treasury / CIO' },
    ],
    siEntryWedge:      'Gateway onboarding and payment-risk control diagnostic.',
    firstMeetingTheme: 'Driving treasury growth while de-risking payment workflows through conversion.',
    firstThirtyDays: [
      'Map top commercial treasury journeys.',
      'Assess onboarding friction and payment-control gaps.',
      'Identify integration and regression-testing priorities for Gateway.',
    ],
    solutionTeam:
      'Bring treasury product, payments, commercial onboarding, fraud controls, integration, and QA experts. Prepare treasury workflow reference architecture: Gateway, entitlements, ACH/wire, positive pay, reporting, alerts, files/APIs, core. Prepare onboarding and payment-control maturity assessment.',
    keyIntegrationAreas:
      'Gateway, ACH/wire, positive pay, core accounts, entitlements, reporting, client files/APIs, treasury operations.',
  },
};

// ── Account logo map (keyed by account_id) ────────────────────────────────
const accountLogos = {
  '1': synovusLogoUrl,
};

// ── Account overview data (keyed by account_id) ───────────────────────────
const accountOverviews = {
  '1': {
    subtitle: 'Regional banking · Strategic account intelligence view',
    strategicFit: 'High',
    about:
      'Synovus is a financial services company headquartered in Columbus, Georgia, focused on relationship-led banking across retail, commercial, and wealth segments throughout the Southeast.',
    products:
      'Offers a comprehensive suite of products including deposits, lending, treasury management, payments, mortgages, and digital banking solutions tailored to individuals and businesses.',
    services:
      'Provides retail banking, commercial banking, treasury management, wealth advisory, and digital servicing backed by personalized support and innovative technology.',
    financials: [
      { label: 'Asset Size', value: '$60B+', icon: 'asset' },
      { label: 'Revenue', value: '$2.3B', icon: 'revenue' },
      { label: 'NIM', value: '3.2%', icon: '%' },
      { label: 'Efficiency Ratio', value: '61%', icon: 'efficiency' },
    ],
    strategy:
      'Synovus is committed to disciplined growth through deep client relationships and strategic market focus. The bank invests in digital modernization to enhance customer experience and operational efficiency while expanding relationship-based commercial banking and wealth management capabilities. Synovus prioritizes strong credit quality, risk management, and profitable growth to deliver sustainable shareholder value.',
    competitors: [
      { name: 'Regions', assetSize: '$152B', revenue: '$7.5B', efficiency: '60%' },
      { name: 'Truist', assetSize: '$545B', revenue: '$20.1B', efficiency: '62%' },
      { name: 'Fifth Third', assetSize: '$214B', revenue: '$7.8B', efficiency: '59%' },
      { name: 'KeyBank', assetSize: '$187B', revenue: '$6.7B', efficiency: '63%' },
    ],
    segments: [
      {
        title: 'Retail Bank',
        icon: 'cart',
        color: '#2563eb',
        desc: 'Focused on deepening digital engagement, growing core deposits, optimizing branch network, and enhancing customer experience to drive loyalty and lifetime value.',
      },
      {
        title: 'Commercial Bank',
        icon: 'brief',
        color: '#10b981',
        desc: 'Driving commercial lending growth, expanding treasury and payments solutions, strengthening middle-market relationships, and maintaining strong credit quality and risk discipline.',
      },
      {
        title: 'Wealth Bank',
        icon: 'person',
        color: '#8b5cf6',
        desc: 'Growing advisory assets, acquiring affluent clients, delivering comprehensive portfolio services, and leveraging integrated relationship coverage across the enterprise.',
      },
    ],
    serviceLineThemes: ['Core Conversion', 'Digital', 'Treasury', 'AI', 'Data'],
    snapshot: {
      description:
        'Synovus Financial Corp is a $65B regional bank undergoing a major systems conversion following its merger with FCB Financial. Active modernization signals across core conversion, digital banking, treasury, lending, AI, and data.',
      tags: ['Core Conversion', 'AI Adoption', 'Data Quality', 'Treasury Modernization'],
    },
    valueHypothesis: {
      potentialValue: '$19M–$65M',
      primaryEntry: 'Core Conversion & Client Experience',
      recommendedMove: 'Conversion readiness discovery',
    },
    weeklyActions: [
      { title: 'Engage Integration Office / COO', subtitle: 'Anchor on conversion readiness assurance' },
      { title: 'Position core conversion entry', subtitle: 'Lead with March 2027 readiness assessment' },
      { title: 'Map CIO / CTO stakeholders', subtitle: 'Identify conversion and platform owners' },
      { title: 'Build AI governance hook', subtitle: 'Link AI productivity play to governance narrative' },
    ],
    signalTimeline: [
      { timing: 'Now',   label: 'Conversion readiness & client-experience assurance' },
      { timing: 'Next',  label: 'AI / data enablement and treasury optimization' },
      { timing: 'Later', label: 'App rationalization & cyber resilience' },
    ],
    rankedPlays: [
      {
        rank: 1, confidence: 5, salesReadiness: 'High', priority: 'High',
        dealMidpoint: 10,
        title: 'Merger Systems Conversion and Client Experience Assurance',
        why: 'Strongest public evidence, clear timeline, high SI fit, low vendor-claim risk',
        entryWedge: 'Conversion readiness / CX risk diagnostic',
        firstBuyer: 'Integration Office / CIO / COO',
        meetingTheme: 'De-risking early-2027 conversion without client disruption',
      },
      {
        rank: 2, confidence: 4, salesReadiness: 'High', priority: 'High',
        dealMidpoint: 6.5,
        title: 'FIS Core and Deposit Conversion Readiness',
        why: 'Core/deposit accuracy is foundational to conversion',
        entryWedge: 'FIS core and deposit reconciliation review',
        firstBuyer: 'Core banking tech / deposit ops',
        meetingTheme: 'Deposit conversion accuracy and downstream controls',
      },
      {
        rank: 3, confidence: 5, salesReadiness: 'High', priority: 'High',
        dealMidpoint: 4.5,
        title: 'Treasury Payments and Synovus Gateway Enablement',
        why: 'Gateway and treasury risk/growth signals are strong',
        entryWedge: 'Gateway onboarding and payment-risk diagnostic',
        firstBuyer: 'Treasury / commercial banking',
        meetingTheme: 'Treasury continuity, growth, and payment controls',
      },
      {
        rank: 4, confidence: 5, salesReadiness: 'High', priority: 'High',
        dealMidpoint: 3.25,
        title: 'Commercial Lending and nCino Workflow Optimization',
        why: 'Confirmed nCino signal plus commercial growth relevance',
        entryWedge: 'nCino workflow/adoption review',
        firstBuyer: 'Commercial / credit / CIO',
        meetingTheme: 'Reducing lending friction while protecting credit discipline',
      },
      {
        rank: 5, confidence: 5, salesReadiness: 'High', priority: 'High',
        dealMidpoint: 3.75,
        title: 'Governed AI Productivity and Knowledge Enablement',
        why: 'Public AI signals are unusually strong and specific',
        entryWedge: 'AI governance and use-case scaling assessment',
        firstBuyer: 'CIO / data / risk',
        meetingTheme: 'Scaling AI safely with measurable productivity',
      },
      {
        rank: 6, confidence: 4, salesReadiness: 'Medium', priority: 'High',
        dealMidpoint: 5,
        title: 'AI-Ready Data and Reporting Reconciliation Foundation',
        why: 'Data is the connective tissue for conversion and AI',
        entryWedge: 'Conversion reconciliation + AI-ready data diagnostic',
        firstBuyer: 'CDO / CFO / CIO',
        meetingTheme: 'Trusted data for conversion, reporting, and AI',
      },
      {
        rank: 7, confidence: 4, salesReadiness: 'Medium', priority: 'Medium-High',
        dealMidpoint: 2.5,
        title: 'Fraud AI/ML and Payment-Risk Controls',
        why: 'Strong risk lens; pairs well with treasury/digital',
        entryWedge: 'Payment-risk and fraud-control assessment',
        firstBuyer: 'Fraud / risk / treasury',
        meetingTheme: 'Fraud controls without customer or treasury friction',
      },
      {
        rank: 8, confidence: 4, salesReadiness: 'Medium', priority: 'Medium-High',
        dealMidpoint: 3.25,
        title: 'Digital Banking Continuity and Customer Migration Readiness',
        why: 'Strong digital/conversion link; CX risk reduction',
        entryWedge: 'My Synovus migration journey and digital regression readiness review',
        firstBuyer: 'Digital channels / retail banking / CIO',
        meetingTheme: 'How do we prevent digital disruption during customer migration?',
      },
      {
        rank: 9, confidence: 4, salesReadiness: 'Low-Medium', priority: 'Medium',
        dealMidpoint: 1.875,
        title: 'Cybersecurity IAM and Conversion Resilience',
        why: 'Conversion and AI adoption create IAM exposure',
        entryWedge: 'Identity and cyber controls readiness for conversion and AI adoption',
        firstBuyer: 'CIO / CISO / operational risk',
        meetingTheme: 'Secure conversion: identity, access, AI governance, and cyber control evidence',
      },
      {
        rank: 10, confidence: 3, salesReadiness: 'Low-Medium', priority: 'Medium',
        dealMidpoint: 1.5,
        title: 'Application Rationalization and Vendor Optimization Assessment',
        why: 'Post-merger efficiency play; longer horizon',
        entryWedge: 'Post-merger application inventory and dependency heat map',
        firstBuyer: 'CIO / CFO / integration office',
        meetingTheme: 'Where can the combined bank reduce complexity without increasing conversion risk?',
      },
    ],
  },
};

// ── Parse CSVs ────────────────────────────────────────────────────────────

function priorityToneFromPriority(priority) {
  if (priority === 'High' || priority === 'Medium-High') return 'red';
  if (priority === 'Medium') return 'orange';
  return null;
}

function formatBudgetAmount(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return `$${Number.isInteger(millions) ? millions : millions.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) return `$${Math.round(num / 1_000)}K`;
  return `$${num}`;
}

function formatDealSize(min, max) {
  const low = formatBudgetAmount(min);
  const high = formatBudgetAmount(max);
  if (low && high) return `${low}–${high}`;
  return low || high || null;
}

function parsePythonList(value) {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed.startsWith('[')) return [trimmed];

  try {
    return JSON.parse(trimmed.replace(/'/g, '"'));
  } catch {
    return [trimmed];
  }
}

function formatListField(value) {
  const items = parsePythonList(value);
  return items.length ? items.join('; ') : null;
}

function buildBuyerMap(row) {
  const roles = [
    ['Business owner', row.likely_business_owner],
    ['Technology owner', row.likely_technology_owner],
    ['Risk / compliance owner', row.likely_risk_owner],
    ['Data owner', row.likely_data_owner],
    ['Operations owner', row.likely_operations_owner],
    ['Budget owner', row.likely_budget_owner],
  ];

  return roles
    .filter(([, contact]) => contact)
    .map(([role, contact]) => ({ role, contact }));
}

function mapAccountId(rawAccountId) {
  return ACCOUNT_ID_MAP[rawAccountId] ?? rawAccountId;
}

function buildOpportunity(row) {
  const id = row.opportunity_id;
  const details = opportunityDetails[id] ?? {};
  const buyerMap = buildBuyerMap(row);

  return {
    id,
    title: row.opportunity_title,
    priority: row.priority,
    priorityTone: priorityToneFromPriority(row.priority),
    opportunityType: row.opportunity_type,
    salesReadiness: row.sales_readiness || null,
    dealSize: formatDealSize(row.si_services_budget_min, row.si_services_budget_max),
    timeline: row.implementation_window || null,
    buyer: row.likely_business_owner || null,
    confidenceScore: row.confidence_score ? Number(row.confidence_score) : null,
    claimSafetyNotes: row.claim_safety_notes || null,

    projectScope: parsePythonList(row.specific_project_scope),

    businessDriver: row.business_driver || null,

    technologyStack: row.technology_stack_summary || row.expansion_path || row.primary_si_motion
      ? {
          confirmed: row.technology_stack_summary || null,
          inferred: formatListField(row.expansion_path) || formatListField(row.primary_si_motion),
        }
      : null,

    buyerMap: buyerMap.length ? buyerMap : undefined,
    siEntryWedge: row.entry_wedge || null,

    // Rich detail fields from JS overlay (first meeting theme, 30-day plan, etc.)
    ...details,
  };
}

function buildAccount(row, opportunities) {
  const id = row.account_id;
  return {
    id,
    name: row.account_name,
    logo: accountLogos[id] ?? null,
    overview: accountOverviews[id] ?? null,
    summary: {
      totalOpportunities: Number(row.total_opportunities) || 0,
      opportunityRange: row.opportunity_range || '—',
      topServiceLineThemes: row.top_service_line_themes || null,
      stakeholdersCount: Number(row.stakeholders_count) || 0,
    },
    opportunities: opportunities.filter((o) => String(o.accountId) === String(id)),
  };
}

// Parse both CSVs
const opportunityRows = parseCsv(opportunitiesRaw).map((row) => ({
  ...buildOpportunity(row),
  accountId: mapAccountId(row.account_id),
}));

const accountRows = parseCsv(accountsRaw);

export const accounts = accountRows.map((row) => buildAccount(row, opportunityRows));

export const defaultAccountId = accounts[0]?.id ?? '1';

export function getAccountById(accountId) {
  return accounts.find((a) => a.id === String(accountId)) ?? null;
}

export function getOpportunityById(accountId, opportunityId) {
  const account = getAccountById(accountId);
  return account?.opportunities.find((o) => String(o.id) === String(opportunityId)) ?? null;
}

export function buildSummaryStats(summary) {
  const themes = summary.topServiceLineThemes?.trim() || '—';
  return [
    { id: 'total-opportunities',    label: 'Total opportunities',    value: String(summary.totalOpportunities), accent: 'green' },
    { id: 'opportunity-range',      label: 'Opportunity range',      value: summary.opportunityRange,           accent: 'blue' },
    { id: 'top-service-line-themes',label: 'Top service line themes',value: themes,                             accent: 'orange', valueVariant: 'text' },
    { id: 'stakeholders',           label: 'Stakeholders',           value: String(summary.stakeholdersCount),  accent: 'purple' },
  ];
}

export const navItems = [
  { id: 'portfolio',    label: 'Portfolio',    path: '/' },
  { id: 'accounts',     label: 'Accounts',     path: '/accounts' },
  { id: 'settings',     label: 'Settings',     path: '/settings' },
];

export const userDisplayName = 'Ajay';
