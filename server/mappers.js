function parseDealMidpoint(dealSize) {
  if (!dealSize) return null;
  const parts = dealSize.split(/[–-]/).map((part) => {
    const match = part.match(/([\d.]+)\s*M/i);
    return match ? Number(match[1]) : null;
  });
  const min = parts[0];
  const max = parts[1] ?? parts[0];
  if (min == null && max == null) return null;
  return ((min ?? max) + (max ?? min)) / 2;
}

function priorityTone(priority) {
  if (priority === 'High' || priority === 'Medium-High') return 'red';
  if (priority === 'Medium') return 'orange';
  return null;
}

export function mapOpportunity(row) {
  const confirmed = row.tech_stack_confirmed ?? [];
  const inferred = row.tech_stack_inferred ?? [];

  return {
    id: row.id,
    accountId: row.account_id,
    title: row.title,
    priority: row.priority,
    priorityTone: priorityTone(row.priority),
    opportunityType: row.opportunity_type,
    salesReadiness: row.sales_readiness,
    dealSize: row.deal_size,
    timeline: row.timeline,
    buyer: row.buyer,
    confidenceScore: row.confidence,
    projectScope: row.project_scope ?? [],
    businessDriver: row.business_driver,
    technologyStack:
      confirmed.length || inferred.length
        ? {
            confirmed: confirmed.length ? confirmed.join(', ') : null,
            inferred: inferred.length ? inferred.join('; ') : null,
          }
        : null,
    buyerMap: buildBuyerMap(row),
    siEntryWedge: row.entry_wedge,
    firstMeetingTheme: row.first_meeting_theme,
    whyStrong: row.why_strong,
    firstBuyer: row.first_buyer,
    rank: row.rank,
  };
}

function buildBuyerMap(row) {
  if (!row.buyer) return undefined;
  return [{ role: 'Primary buyer', contact: row.buyer }];
}

export function mapRankedPlay(row) {
  return {
    rank: row.rank,
    confidence: row.confidence,
    salesReadiness: row.sales_readiness,
    priority: row.priority,
    dealMidpoint: parseDealMidpoint(row.deal_size),
    title: row.title,
    why: row.why_strong,
    entryWedge: row.entry_wedge,
    firstBuyer: row.first_buyer,
    meetingTheme: row.first_meeting_theme,
  };
}

export function mapAccount(row, opportunities, overviewExtra) {
  const overview = overviewExtra
    ? {
        subtitle: overviewExtra.subtitle,
        strategicFit: row.strategic_fit,
        serviceLineThemes: overviewExtra.serviceLineThemes,
        about: overviewExtra.about,
        products: overviewExtra.products,
        services: overviewExtra.services,
        financials: overviewExtra.financials,
        strategy: overviewExtra.strategy,
        competitors: overviewExtra.competitors,
        segments: overviewExtra.segments,
        snapshot: overviewExtra.snapshot,
        valueHypothesis: overviewExtra.valueHypothesis,
        signalTimeline: overviewExtra.signalTimeline,
        rankedPlays: opportunities.map(mapRankedPlay),
      }
    : row.strategic_fit
      ? {
          strategicFit: row.strategic_fit,
          rankedPlays: opportunities.map(mapRankedPlay),
        }
      : null;

  const themes = overviewExtra?.serviceLineThemes?.join(', ') ?? null;

  return {
    id: row.id,
    name: row.name,
    sector: row.sector,
    logo: normalizeLogoUrl(row.logo_url),
    overview,
    summary: {
      totalOpportunities: row.total_opportunities,
      opportunityRange: row.opportunity_range ?? '—',
      topServiceLineThemes: themes,
      stakeholdersCount: overviewExtra?.stakeholdersCount ?? 0,
    },
    opportunities,
  };
}

function normalizeLogoUrl(logoUrl) {
  if (!logoUrl) return null;
  if (logoUrl.startsWith('/banks/') || logoUrl.startsWith('/logo/')) return logoUrl;
  if (logoUrl.includes('synovus')) return '/banks/synovus.jpg';
  return logoUrl;
}

export function buildSummaryStats(summary) {
  const themes = summary.topServiceLineThemes?.trim() || '—';
  return [
    { id: 'total-opportunities', label: 'Total opportunities', value: String(summary.totalOpportunities), accent: 'green' },
    { id: 'opportunity-range', label: 'Opportunity range', value: summary.opportunityRange, accent: 'blue' },
    { id: 'top-service-line-themes', label: 'Top service line themes', value: themes, accent: 'orange', valueVariant: 'text' },
    { id: 'stakeholders', label: 'Stakeholders', value: String(summary.stakeholdersCount), accent: 'purple' },
  ];
}
