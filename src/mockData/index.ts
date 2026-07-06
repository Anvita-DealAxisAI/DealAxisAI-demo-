import type { Account, Opportunity, BubblePoint, KpiCard } from '../types';

export const kpiCards: KpiCard[] = [
  { label: 'Accounts tracked', value: 12, subtitle: '10 banks + 2 credit unions', color: '#2563eb' },
  { label: 'Hot accounts', value: 4, subtitle: 'Need action this week', color: '#ef4444' },
  { label: 'High value opps', value: 9, subtitle: '$18M potential value', color: '#10b981' },
  { label: 'Stakeholders mapped', value: 31, subtitle: '8 priority targets', color: '#f59e0b' },
  { label: 'Signal velocity', value: 18, subtitle: 'Last 30 days', color: '#8b5cf6' },
];

export const bubbleData: BubblePoint[] = [
  { name: 'Citizens', x: 35, y: 72, z: 800, color: '#ef4444' },
  { name: 'Regions', x: 78, y: 85, z: 1200, color: '#f59e0b' },
  { name: 'BECU', x: 55, y: 45, z: 600, color: '#2563eb' },
  { name: 'Synovus', x: 62, y: 58, z: 700, color: '#8b5cf6' },
  { name: 'Commerce', x: 22, y: 30, z: 500, color: '#10b981' },
];

export const accounts: Account[] = [
  { id: '1',  name: 'Citizens Bank', fit: 'High', value: '$$$$',  urgency: 'High', entry: 'Med',  relationship: 'Warm',    signals: 'AI | Risk | Data',  status: 'Hot',     heatScore: 92, strategicFit: 'High',   tags: ['AI', 'Risk', 'Data', 'Regulatory'] },
  { id: '2',  name: 'Regions Bank',  fit: 'High', value: '$$$$$', urgency: 'Med',  entry: 'Hard', relationship: 'Cold',    signals: 'Core | Data',       status: 'Monitor', heatScore: 74, strategicFit: 'High',   tags: ['Core', 'Data'] },
  { id: '3',  name: 'Commerce Bank', fit: 'Med',  value: '$$$',   urgency: 'Low',  entry: 'Easy', relationship: 'Warm',    signals: 'QE | Ops',          status: 'Active',  heatScore: 68, strategicFit: 'Medium', tags: ['QE', 'Ops'] },
  { id: '4',  name: 'BECU',          fit: 'Med',  value: '$$',    urgency: 'Med',  entry: 'Med',  relationship: 'Neutral', signals: 'Data | AI',         status: 'Hot',     heatScore: 61, strategicFit: 'Medium', tags: ['Data', 'AI'] },
  { id: '5',  name: 'Synovus',       fit: 'High', value: '$$$',   urgency: 'High', entry: 'Med',  relationship: 'Warm',    signals: 'Risk | Reg',        status: 'Hot',     heatScore: 79, strategicFit: 'High',   tags: ['Risk', 'Regulatory'] },
  { id: '6',  name: 'KeyBank',       fit: 'Med',  value: '$$$',   urgency: 'Med',  entry: 'Med',  relationship: 'Neutral', signals: 'Data | AI',         status: 'Monitor', heatScore: 61, strategicFit: 'Medium', tags: ['Data', 'AI'] },
  { id: '7',  name: 'M&T Bank',      fit: 'Med',  value: '$$$',   urgency: 'Low',  entry: 'Med',  relationship: 'Warm',    signals: 'Core | Data',       status: 'Active',  heatScore: 65, strategicFit: 'Medium', tags: ['Core', 'Data'] },
  { id: '8',  name: 'PNC',           fit: 'High', value: '$$$$',  urgency: 'Med',  entry: 'Med',  relationship: 'Warm',    signals: 'Reg Rpt | Data',    status: 'Active',  heatScore: 70, strategicFit: 'High',   tags: ['Reg Reporting', 'Data'] },
  { id: '9',  name: 'Truist',        fit: 'Med',  value: '$$$',   urgency: 'Med',  entry: 'Hard', relationship: 'Cold',    signals: 'QE | Digital',      status: 'Monitor', heatScore: 58, strategicFit: 'Medium', tags: ['QE', 'Digital'] },
  { id: '10', name: 'US Bank',       fit: 'High', value: '$$$$',  urgency: 'Med',  entry: 'Easy', relationship: 'Warm',    signals: 'Cloud | Infra',     status: 'Active',  heatScore: 67, strategicFit: 'High',   tags: ['Cloud', 'Infra'] },
];

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Regulatory Reporting Automation',
    priority: 'High',
    status: 'Confirmed',
    dealSize: '$3M-$8M',
    timeline: '6-9 months',
    buyer: 'Risk + Finance Tech',
    businessDriver: 'Regulatory scrutiny, cost pressure and manual reconciliation cycles create executive appetite for reporting efficiency.',
    technicalDriver: 'Fragmented data pipelines and legacy reporting workflows increase audit and remediation effort.',
    whyNow: 'Multiple signals indicate urgency around risk, finance, data quality and AI-controlled automation.',
    nextAction: 'Propose a 45-minute discovery workshop with Risk Tech, Finance Tech and Enterprise Data.',
    positioningMessage: 'Reduce reporting effort and improve audit readiness through governed data validation.',
    primaryBuyer: 'Head of Risk Technology / Finance Technology',
    influencers: 'Enterprise Data, Architecture, Compliance Operations',
    likelyObjection: 'AI in regulated reporting may create control concerns.',
    counterStrategy: 'Start with deterministic validation and human-in-the-loop review.',
    confidence: '4.5/5',
    entryEase: 'Medium',
  },
  {
    id: '2',
    title: 'AML Investigation AI',
    priority: 'Medium',
    status: 'Validated',
    dealSize: '$2M-$5M',
    timeline: '9-12 months',
    buyer: 'Financial Crime Unit',
    businessDriver: 'Rising AML investigation volume and false-positive rates are straining compliance teams.',
    technicalDriver: 'Legacy case management systems lack AI-assisted triage and pattern recognition.',
    whyNow: 'Recent regulatory guidance on AI in financial crime creates a favorable window for modernization.',
    nextAction: 'Schedule a technical discovery session with the Financial Crime Unit to understand current workflows.',
    positioningMessage: 'Accelerate AML investigations with AI-assisted triage that reduces false positives by 40%.',
    primaryBuyer: 'Chief Compliance Officer / Head of Financial Crime',
    influencers: 'Risk Technology, Data Science, Legal',
    likelyObjection: 'Regulatory acceptance of AI decisions in AML context.',
    counterStrategy: 'Position as human-augmentation tool with full audit trail and explainability.',
    confidence: '3.8/5',
    entryEase: 'Hard',
  },
  {
    id: '3',
    title: 'Data Quality & Governance Factory',
    priority: 'Emerging',
    status: 'Emerging',
    dealSize: '$1.5M-$3M',
    timeline: '3-6 months',
    buyer: 'Enterprise Data',
    businessDriver: 'Data quality issues are creating downstream errors in risk, reporting and customer analytics.',
    technicalDriver: 'No centralized data quality monitoring or automated remediation capability.',
    whyNow: 'New CDO mandate to establish data governance before major cloud migration initiative.',
    nextAction: 'Present data quality maturity assessment framework to Enterprise Data team.',
    positioningMessage: 'Build a self-healing data quality layer that prevents issues before they reach downstream systems.',
    primaryBuyer: 'Chief Data Officer / Enterprise Data Architecture',
    influencers: 'Risk, Compliance, BI & Analytics',
    likelyObjection: 'Budget competition with ongoing cloud migration.',
    counterStrategy: 'Position as an enabler of the cloud migration, not a separate initiative.',
    confidence: '3.2/5',
    entryEase: 'Easy',
  },
  {
    id: '4',
    title: 'AI-enabled QA Modernization',
    priority: 'Medium',
    status: 'Watch',
    dealSize: '$750K-$1.5M',
    timeline: '3-6 months',
    buyer: 'Technology Ops',
    businessDriver: 'Manual QA processes are slowing release cycles and increasing production defect rates.',
    technicalDriver: 'No intelligent test automation or AI-assisted defect prediction in current toolchain.',
    whyNow: 'Accelerating digital transformation agenda requires faster, more reliable software delivery.',
    nextAction: 'Identify QA engineering leadership and present ROI model for AI-assisted testing.',
    positioningMessage: 'Compress QA cycles by 60% while improving coverage through intelligent test generation.',
    primaryBuyer: 'Head of Quality Engineering / Technology Ops',
    influencers: 'Software Engineering, DevOps, Product',
    likelyObjection: 'Skepticism about AI-generated test coverage quality.',
    counterStrategy: 'Offer a 4-week proof-of-concept on a single application with measurable outcomes.',
    confidence: '3.5/5',
    entryEase: 'Easy',
  },
];

export const aiRecommendations = [
  { title: 'Prioritize Citizens', description: 'High urgency, warm entry path, AI + risk signal cluster', color: '#ef4444' },
  { title: 'Accelerate Commerce', description: 'Fastest entry path through QE modernization', color: '#10b981' },
  { title: 'Monitor Regions', description: 'Largest value, but hard entry and long-cycle pursuit', color: '#f59e0b' },
];

export const weeklyActions = [
  { title: 'Engage Head of Risk Tech', subtitle: 'Anchor on reporting efficiency' },
  { title: 'Position data validation entry', subtitle: 'Low-risk, measurable starting point' },
  { title: 'Map AI engineering leadership', subtitle: 'Expand into AML investigation AI' },
  { title: 'Build org relationship map', subtitle: 'Identify CIO-2/CIO-3 owners' },
];

export const prioritySignalTimeline = [
  { stage: 'Now', label: 'Regulatory reporting efficiency', color: '#ef4444' },
  { stage: 'Next', label: 'Data platform modernization', color: '#2563eb' },
  { stage: 'Later', label: 'AML investigation AI expansion', color: '#10b981' },
];

export const pipelineTrend = [
  { week: 'Week 1', value: 82 },
  { week: 'Week 2', value: 91 },
  { week: 'Week 3', value: 98 },
  { week: 'Week 4', value: 110 },
  { week: 'Week 5', value: 128 },
  { week: 'Week 6', value: 142.5 },
];

export const opportunityMix = [
  { name: 'Confirmed', value: 38, color: '#0f172a' },
  { name: 'Inferred', value: 27, color: '#475569' },
  { name: 'Hypothesis', value: 20, color: '#94a3b8' },
  { name: 'Watchlist', value: 15, color: '#cbd5e1' },
];

export const portfolioOpportunities = [
  { title: 'Core Banking', type: 'Confirmed', typeColor: '#10b981', priority: 'P1', priorityColor: '#ef4444', readiness: 85, businessDriver: 'Cost Reduction', techDriver: 'Legacy Debt', buyer: 'CTO / COO', fit: 'High', fitColor: '#10b981', whyNow: 'Contract Renewal', action: 'Engage', actionColor: '#2563eb' },
  { title: 'ESG Reporting', type: 'Inferred', typeColor: '#8b5cf6', priority: 'P2', priorityColor: '#f59e0b', readiness: 62, businessDriver: 'Compliance', techDriver: 'Data Silos', buyer: 'Chief Risk Off.', fit: 'High', fitColor: '#10b981', whyNow: 'New Regulation', action: 'Validate', actionColor: '#8b5cf6' },
  { title: 'Wealth Mgmt AI', type: 'Hypothesis', typeColor: '#f59e0b', priority: 'P2', priorityColor: '#f59e0b', readiness: 45, businessDriver: 'Market Share', techDriver: 'GenAI Stack', buyer: 'Head of Wealth', fit: 'Medium', fitColor: '#f59e0b', whyNow: 'Competitor Launch', action: 'Discovery', actionColor: '#10b981' },
  { title: 'Cyber Resilience', type: 'Watchlist', typeColor: '#94a3b8', priority: 'P3', priorityColor: '#94a3b8', readiness: 30, businessDriver: 'Risk Mitigation', techDriver: 'Zero Trust', buyer: 'CISO', fit: 'High', fitColor: '#10b981', whyNow: 'Recent Breach', action: 'Monitor', actionColor: '#64748b' },
];
