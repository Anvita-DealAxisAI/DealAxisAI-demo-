const READINESS_X = {
  High: 82,
  Medium: 55,
  'Low-Medium': 38,
  Low: 22,
};

const TYPE_COLORS = {
  'Confirmed Opportunity': '#10b981',
  Confirmed: '#10b981',
  'Inferred Opportunity': '#3b82f6',
  Inferred: '#3b82f6',
  'Strategic Hypothesis': '#8b5cf6',
  Watchlist: '#94a3b8',
};

const PRIORITY_COLORS = {
  High: '#ef4444',
  'Medium-High': '#f97316',
  Medium: '#eab308',
  Low: '#94a3b8',
};

export function parseDealSizeMillions(dealSize) {
  if (!dealSize) return { min: 0, max: 0, midpoint: 0 };

  const parts = dealSize.split(/[–-]/).map((part) => {
    const match = part.match(/([\d.]+)\s*M/i);
    return match ? Number(match[1]) : 0;
  });

  const min = parts[0] || 0;
  const max = parts[1] ?? parts[0] ?? 0;
  return { min, max, midpoint: (min + max) / 2 };
}

function formatMillions(value) {
  if (!Number.isFinite(value) || value <= 0) return '$0';
  if (value >= 1) {
    const rounded = Number.isInteger(value) ? value : value.toFixed(1).replace(/\.0$/, '');
    return `$${rounded}M`;
  }
  return `$${Math.round(value * 1000)}K`;
}

export function buildPortfolioSnapshot(accounts) {
  const allOpportunities = accounts.flatMap((account) =>
    (account.opportunities ?? []).map((opp) => ({ ...opp, accountId: account.id, accountName: account.name }))
  );

  const pipelineMin = allOpportunities.reduce((sum, opp) => sum + parseDealSizeMillions(opp.dealSize).min, 0);
  const pipelineMax = allOpportunities.reduce((sum, opp) => sum + parseDealSizeMillions(opp.dealSize).max, 0);

  const highPriorityOpps = allOpportunities.filter((opp) => opp.priority === 'High').length;
  const highValueOpps = allOpportunities.filter((opp) => parseDealSizeMillions(opp.dealSize).max >= 5).length;
  const stakeholders = accounts.reduce((sum, account) => sum + (account.summary?.stakeholdersCount ?? 0), 0);

  const maxMidpoint = Math.max(
    ...allOpportunities.map((opp) => parseDealSizeMillions(opp.dealSize).midpoint),
    1
  );

  const matrixPoints = allOpportunities.map((opp) => {
    const { midpoint } = parseDealSizeMillions(opp.dealSize);
    const readiness = opp.salesReadiness || 'Medium';
    const confidence = opp.confidenceScore ?? 3;

    return {
      id: opp.id,
      accountId: opp.accountId,
      accountName: opp.accountName,
      name: opp.title.length > 42 ? `${opp.title.slice(0, 39)}…` : opp.title,
      fullTitle: opp.title,
      value: opp.dealSize || '—',
      numVal: midpoint,
      x: Math.min(
        95,
        Math.max(
          5,
          (READINESS_X[readiness] ?? 50) * 0.75 + (confidence / 5) * 100 * 0.25
        )
      ),
      y: Math.min(95, Math.max(5, (midpoint / maxMidpoint) * 90 + 5)),
      opportunityType: opp.opportunityType || 'Inferred Opportunity',
      priority: opp.priority || 'Medium',
      color: TYPE_COLORS[opp.opportunityType] || PRIORITY_COLORS[opp.priority] || '#64748b',
    };
  });

  const accountRows = accounts.map((account) => {
    const themes = account.overview?.serviceLineThemes ?? [];

    return {
      id: account.id,
      name: account.name,
      logo: account.logo,
      opps: account.opportunities?.length ?? account.summary?.totalOpportunities ?? 0,
      value: account.summary?.opportunityRange || account.overview?.valueHypothesis?.potentialValue || '—',
      themes,
      themeLabel: themes.length ? themes.slice(0, 3).join(' · ') : '—',
      stakeholders: account.summary?.stakeholdersCount ?? 0,
      strategicFit: account.overview?.strategicFit || '—',
    };
  });

  const opportunityTypes = [...new Set(allOpportunities.map((opp) => opp.opportunityType).filter(Boolean))];

  return {
    kpis: [
      {
        label: 'Accounts',
        value: String(accounts.length),
        sub: accounts.length === 1 ? 'Account in portfolio' : 'Accounts in portfolio',
        color: '#3b82f6',
        bg: '#eff6ff',
      },
      {
        label: 'Opportunities',
        value: String(allOpportunities.length),
        sub: `${highPriorityOpps} high priority`,
        color: '#10b981',
        bg: '#ecfdf5',
      },
      {
        label: 'High Value Opps',
        value: String(highValueOpps),
        sub: 'Deals with $5M+ upside',
        color: '#8b5cf6',
        bg: '#f5f3ff',
      },
      {
        label: 'Pipeline Range',
        value: pipelineMin && pipelineMax ? `${formatMillions(pipelineMin)}–${formatMillions(pipelineMax)}` : '—',
        sub: `${stakeholders} stakeholders mapped`,
        color: '#f59e0b',
        bg: '#fffbeb',
      },
    ],
    matrixPoints,
    accountRows,
    opportunityTypes,
    allOpportunities,
  };
}

export const portfolioTypeColors = TYPE_COLORS;
