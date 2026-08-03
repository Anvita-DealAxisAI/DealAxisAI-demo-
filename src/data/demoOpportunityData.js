import { getAccountById } from './mockData';

const ACCOUNT_ID_TO_MOCK_ID = {
  A002: '1', // Synovus
};

function parsePipeList(value) {
  if (!value) return [];
  return String(value)
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

const CITIZENS_ROWS = [
  {
    id: 'citizens_opp_001',
    rank: 1,
    title: 'AI-enabled operating leverage and productivity execution',
    priority: 'High',
    opportunityType: 'Confirmed Opportunity',
    dealSize: '$2M-$6M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'AI use-case discovery and value-case design | Responsible AI governance and evaluation approach | Workflow automation and adoption planning',
    businessDriver:
      'Cost Pressure: Reimagine-driven operating leverage and AI-enabled productivity',
    tech:
      'AI governance and evaluation controls | LLM-enabled knowledge and workflow automation',
    entryWedge: 'Validate the current-state process and platform landscape.',
    firstMeetingTheme:
      'Validate the evidence for AI-enabled operating leverage and identify a narrow, KPI-linked assessment wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'AI use-case discovery and value-case design; Responsible AI governance and evaluation approach; Workflow automation and adoption planning',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_002',
    rank: 2,
    title: 'Application rationalization, supplier optimization, and managed services simplification',
    priority: 'High',
    opportunityType: 'Confirmed Opportunity',
    dealSize: '$2.5M-$7M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Application portfolio assessment | Supplier and run-cost optimization | Managed-services operating-model design',
    businessDriver: 'Cost Pressure: Cost takeout, simplification, and operating leverage',
    tech: 'Application portfolio management; supplier optimization; managed services governance',
    entryWedge:
      'Assess application portfolio, supplier spend, managed-service handoffs, and simplification opportunities.',
    firstMeetingTheme:
      'Validate the evidence for app rationalization and identify a KPI-linked simplification wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Application portfolio assessment; Supplier and run-cost optimization; Managed-services operating-model design',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_003',
    rank: 3,
    title: 'Commercial bank GenAI product operating model and banker workflow enablement',
    priority: 'High',
    opportunityType: 'Confirmed Opportunity',
    dealSize: '$2M-$6M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'AI use-case discovery and value-case design | Responsible AI governance and evaluation approach | Workflow automation and adoption planning | CRM/workflow current-state validation',
    businessDriver:
      'Growth/Expansion: Commercial, treasury, and fee-income growth',
    tech:
      'AI governance and evaluation controls | LLM-enabled knowledge and workflow automation | CRM/workflow/BPM/low-code integration',
    entryWedge: 'Assess commercial bank product operating model and banker workflow use cases.',
    firstMeetingTheme:
      'Validate the evidence for commercial GenAI workflow enablement and define a KPI-linked wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'AI use-case discovery; Responsible AI governance; Workflow automation and adoption planning; CRM/workflow validation',
    integrations: 'CRM; workflow/BPM; customer data; channels',
  },
  {
    id: 'citizens_opp_004',
    rank: 4,
    title: 'Cybersecurity CIAM, AppSec, and resilience capability validation',
    priority: 'High',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$2.5M-$7M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Identity and access architecture assessment | Vulnerability-management process review | Security control mapping and remediation backlog',
    businessDriver: 'Risk Reduction: Cyber resilience and customer primacy',
    tech: 'CIAM/IAM; AppSec; vulnerability management; resilience controls',
    entryWedge: 'Assess CIAM/IAM, AppSec, resilience, and customer authentication roadmap signals.',
    firstMeetingTheme:
      'Validate cyber and resilience evidence and identify a narrow KPI-linked risk-reduction wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Identity and access architecture; vulnerability-management review; security control mapping',
    integrations: 'identity providers; app inventory; security tooling; ticketing/workflow',
  },
  {
    id: 'citizens_opp_005',
    rank: 5,
    title: 'Finance data repository, regulatory analytics, and AI-ready governed data',
    priority: 'High',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$2M-$6M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'AI use-case discovery and value-case design | Responsible AI governance and evaluation approach | Workflow automation and adoption planning | Data architecture and lineage assessment',
    businessDriver:
      'Risk Reduction: Risk, finance, regulatory reporting, and AI-ready data productivity',
    tech:
      'AI governance and evaluation controls | LLM-enabled workflow automation | Data engineering/BI/data quality/lineage',
    entryWedge: 'Assess reporting, lineage, quality, and AI-ready data requirements.',
    firstMeetingTheme:
      'Validate finance data and reporting evidence and define a KPI-linked data-governance wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'AI use-case discovery; Responsible AI governance; Workflow automation; Data architecture and lineage',
    integrations: 'source systems; data warehouse/lakehouse; BI tools; risk/finance data feeds',
  },
  {
    id: 'citizens_opp_006',
    rank: 6,
    title: 'LLM-enabled contact center and servicing redesign',
    priority: 'High',
    opportunityType: 'Confirmed Opportunity',
    dealSize: '$2.5M-$7M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'AI use-case discovery and value-case design | Responsible AI governance and evaluation approach | Workflow automation and adoption planning | Servicing journey and call-driver assessment',
    businessDriver: 'Cost Pressure: Efficiency ratio improvement and customer primacy',
    tech:
      'Content architecture/CMS | AI governance and controls | LLM-enabled knowledge and workflow automation',
    entryWedge:
      'Assess servicing and contact-center workflows for LLM-enabled knowledge retrieval and QA.',
    firstMeetingTheme:
      'Validate servicing transformation evidence and identify a narrow KPI-linked contact-center wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'AI use-case discovery; Responsible AI governance; Workflow automation; Servicing journey assessment',
    integrations: 'contact center; knowledge/content management; CRM/workflow; identity/customer data',
  },
  {
    id: 'citizens_opp_007',
    rank: 7,
    title: 'Vulnerability management and third-party technology risk validation',
    priority: 'High',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$2M-$6M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Identity and access architecture assessment | Vulnerability-management process review | Security control mapping and remediation backlog',
    businessDriver: 'Risk Reduction: Cyber and third-party resilience',
    tech: 'CIAM/IAM; AppSec; vulnerability management; resilience controls',
    entryWedge:
      'Assess vulnerability management toolchain and third-party technology risk workflow.',
    firstMeetingTheme:
      'Validate vulnerability management evidence and define a KPI-linked risk-control wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Identity and access architecture; vulnerability-management review; security control mapping',
    integrations: 'identity providers; app inventory; security tooling; ticketing/workflow',
  },
  {
    id: 'citizens_opp_008',
    rank: 8,
    title: 'Vulnerability management ecosystem validation',
    priority: 'High',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$2M-$6M',
    timeline: 'Q3 2026 to Q2 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Identity and access architecture assessment | Vulnerability-management process review | Security control mapping and remediation backlog',
    businessDriver: 'Risk Reduction: Cybersecurity, AppSec, and resilience',
    tech: 'CIAM/IAM; AppSec; vulnerability management; resilience controls',
    entryWedge:
      'Assess vulnerability management toolchain and third-party technology risk workflow.',
    firstMeetingTheme:
      'Validate ecosystem-level vulnerability evidence and define a KPI-linked remediation wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Identity and access architecture; vulnerability-management review; security control mapping',
    integrations: 'identity providers; app inventory; security tooling; ticketing/workflow',
  },
  {
    id: 'citizens_opp_009',
    rank: 9,
    title: 'AML/BSA sanctions monitoring and financial-crime control resilience',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'AML/BSA process and control assessment | Case-management workflow review | Model/rules tuning and governance backlog',
    businessDriver: 'Risk Reduction: Regulatory posture and financial-crime risk reduction',
    tech:
      'AML/BSA/sanctions case management and monitoring | IAM/AppSec controls | investigator workflow',
    entryWedge:
      'Assess AML/BSA/sanctions workflow, data lineage, model governance, and alert/case triage.',
    firstMeetingTheme:
      'Validate AML/sanctions evidence and define a KPI-linked case-management wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'AML/BSA process assessment; case-workflow review; model/rules governance design',
    integrations: 'case management; transaction data; customer data; investigator workflow',
  },
  {
    id: 'citizens_opp_010',
    rank: 10,
    title: 'Branch, ATM, and field operations technology validation',
    priority: 'Medium',
    opportunityType: 'Watchlist Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Branch/ATM process and field-operations assessment | Branch-to-digital journey mapping | Physical network technology validation',
    businessDriver: 'Improve CX: Branch network optimization and field-ops efficiency',
    tech: 'Branch operations; ATM platform; field operations; branch-to-digital workflow',
    entryWedge:
      'Validate branch, ATM, field operations, and branch-to-digital operating priorities.',
    firstMeetingTheme:
      'Validate branch and field-ops evidence and identify a narrow KPI-linked operations wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Branch/ATM process assessment; branch-to-digital mapping; physical network technology validation',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_011',
    rank: 11,
    title: 'CRM, BPM, workflow, and low-code enablement for commercial and customer workflows',
    priority: 'Medium',
    opportunityType: 'Strategic Hypothesis Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'CRM/workflow current-state validation | Relationship workflow and customer-360 discovery | Low-code/BPM governance model',
    businessDriver:
      'Growth/Expansion: Commercial growth, customer primacy, and operating simplification',
    tech: 'CRM/workflow/BPM/low-code integration',
    entryWedge: 'Validate CRM, BPM, workflow, and low-code platform usage and buyer scope.',
    firstMeetingTheme:
      'Validate CRM/workflow evidence and identify a narrow, KPI-linked assessment wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'CRM/workflow validation; customer-360 discovery; low-code/BPM governance model design',
    integrations: 'CRM; workflow/BPM; customer data profile; channels',
  },
  {
    id: 'citizens_opp_012',
    rank: 12,
    title: 'Cards and unsecured lending analytics adjacency',
    priority: 'Medium',
    opportunityType: 'Strategic Hypothesis Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Credit and lending workflow assessment | Decisioning/analytics backlog design | Loan operations and servicing process review',
    businessDriver:
      'Improve CX: Cards/unsecured lending analytics and fraud/customer profitability',
    tech: 'Data engineering/BI/lineage and treasury/payments analytics category',
    entryWedge: 'Validate cards and unsecured-lending analytics priorities.',
    firstMeetingTheme:
      'Validate cards/lending analytics evidence and define a KPI-linked discovery wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Credit workflow assessment; decisioning backlog design; loan operations review',
    integrations: 'loan origination and servicing; pricing and decisioning; document workflows; data and BI',
  },
  {
    id: 'citizens_opp_013',
    rank: 13,
    title: 'Cloud, API, microservices integration and platform engineering enablement',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Discovery and current-state assessment | Target-state roadmap and value case | Implementation backlog and governance design',
    businessDriver:
      'Improve CX: AI-ready data, open banking, digital experience, and efficiency',
    tech: 'API management; integration; microservices; cloud platform engineering',
    entryWedge:
      'Assess cloud, API, microservices, integration, and platform engineering patterns.',
    firstMeetingTheme:
      'Validate cloud and integration evidence and define a narrow KPI-linked modernization wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Current-state discovery; target-state roadmap; implementation governance design',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_014',
    rank: 14,
    title: 'Commercial lending platform and loan operations capability validation',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Credit and lending workflow assessment | Decisioning/analytics backlog design | Loan operations and servicing process review',
    businessDriver:
      'Growth/Expansion: Lending growth, lending efficiency, and commercial banking growth',
    tech: 'Loan origination, servicing, onboarding, and portfolio analytics',
    entryWedge: 'Validate commercial lending platform landscape and loan operations bottlenecks.',
    firstMeetingTheme:
      'Validate commercial lending evidence and define a KPI-linked operations wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Credit workflow assessment; decisioning/analytics design; loan operations process review',
    integrations: 'loan origination and servicing; pricing and decisioning; document workflows; data and BI',
  },
  {
    id: 'citizens_opp_015',
    rank: 15,
    title: 'Commercial pricing and PrecisionLender validation',
    priority: 'Medium',
    opportunityType: 'Watchlist Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Credit and lending workflow assessment | Decisioning/analytics backlog design | Loan operations and servicing process review',
    businessDriver:
      'Growth/Expansion: Commercial banking growth and relationship profitability',
    tech: 'Data engineering/BI/data quality/lineage analytics',
    entryWedge: 'Validate the current-state process and platform landscape.',
    firstMeetingTheme:
      'Validate pricing and profitability evidence and identify a narrow KPI-linked discovery wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Credit workflow assessment; decisioning backlog; loan operations process review',
    integrations: 'loan origination and servicing; pricing and decisioning; document workflows; data and BI',
  },
  {
    id: 'citizens_opp_016',
    rank: 16,
    title: 'Commercial treasury, payments, trade-finance and fee-income technology enablement',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Treasury/payment workflow discovery | API and integration readiness assessment | Commercial customer journey and fee-income enablement design',
    businessDriver: 'Growth/Expansion: Commercial, treasury, and fee-income growth',
    tech: 'Treasury management, commercial payments, and money-movement category',
    entryWedge:
      'Assess treasury, payments, trade-finance, and fee-income workflow dependencies.',
    firstMeetingTheme:
      'Validate treasury and payments evidence and define a KPI-linked enablement wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Treasury workflow discovery; API/integration readiness; fee-income journey design',
    integrations: 'treasury platforms; payment rails; customer channels; ERP/connectivity endpoints',
  },
  {
    id: 'citizens_opp_017',
    rank: 17,
    title: 'Content, document, records, and knowledge management for servicing and regulatory AI use cases',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Servicing journey and call-driver assessment | Agent-assist workflow design | Knowledge/content integration planning',
    businessDriver:
      'Risk Reduction: Contact-center productivity, reporting quality, and AI-ready knowledge',
    tech: 'Content/CMS, knowledge management, records workflow, and AI-enabled servicing',
    entryWedge: 'Assess content, document, records, and knowledge-management workflows.',
    firstMeetingTheme:
      'Validate content and knowledge-management evidence and define a narrow KPI-linked wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Servicing journey assessment; agent-assist workflow design; knowledge integration planning',
    integrations: 'contact center; knowledge/content management; CRM/workflow; identity/customer data',
  },
  {
    id: 'citizens_opp_018',
    rank: 18,
    title: 'Core and deposits platform validation for growth and resilience',
    priority: 'Medium',
    opportunityType: 'Watchlist Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Deposit platform and account-servicing discovery | Core-adjacent integration assessment | Resilience and growth-readiness backlog',
    businessDriver: 'Growth/Expansion: Deposit growth and regulatory recordkeeping',
    tech: 'Digital banking, account opening, core/deposit integration, and resilience controls',
    entryWedge:
      'Validate digital banking, deposits, account opening, servicing, and core/deposit integration priorities.',
    firstMeetingTheme:
      'Validate core and deposit evidence and define a narrow KPI-linked resilience wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Deposit-platform discovery; core-adjacent integration assessment; resilience backlog',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_019',
    rank: 19,
    title: 'Digital banking and customer experience capability validation',
    priority: 'Medium',
    opportunityType: 'Strategic Hypothesis Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Discovery and current-state assessment | Target-state roadmap and value case | Implementation backlog and governance design',
    businessDriver: 'Improve CX: Deposit growth, customer primacy, and experience',
    tech: 'Digital banking, account opening, and core/deposit integration',
    entryWedge:
      'Validate digital banking, deposits, account-opening, servicing, and core/deposit integration priorities.',
    firstMeetingTheme:
      'Validate digital experience evidence and identify a narrow KPI-linked CX wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Current-state discovery; target-state roadmap; implementation governance design',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_020',
    rank: 20,
    title: 'Fraud AI/ML detection and scam prevention validation',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'AI use-case discovery and value-case design | Responsible AI governance and evaluation approach | Workflow automation and adoption planning | Fraud-signal and scam typology assessment',
    businessDriver:
      'Risk Reduction: Fraud/scam/dispute risk reduction and customer protection',
    tech: 'Fraud analytics, investigator workflow, and AI governance controls',
    entryWedge:
      'Assess fraud detection signal quality, scam patterns, and model-monitoring needs.',
    firstMeetingTheme:
      'Validate fraud AI/ML evidence and define a narrow KPI-linked risk-control wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'AI use-case discovery; governance and evaluation controls; fraud-signal typology assessment',
    integrations: 'case management; transaction data; customer data; investigator workflow',
  },
  {
    id: 'citizens_opp_021',
    rank: 21,
    title: 'Fraud claims, disputes, and investigator workflow optimization',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Claims and disputes workflow assessment | Investigator desktop/process design | Case triage and evidence-pack automation',
    businessDriver:
      'Risk Reduction: Fraud/scam/dispute risk reduction and customer protection',
    tech: 'Fraud analytics, investigator workflow, CRM, BPM, and case platforms',
    entryWedge: 'Map fraud claims, disputes, call monitoring, and investigator workflows.',
    firstMeetingTheme:
      'Validate fraud/disputes workflow evidence and define a KPI-linked optimization wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Claims/disputes workflow assessment; investigator-process design; case-triage automation',
    integrations: 'case management; transaction data; customer data; investigator workflow; CRM',
  },
  {
    id: 'citizens_opp_022',
    rank: 22,
    title: 'Marketing analytics and personalization for customer primacy',
    priority: 'Medium',
    opportunityType: 'Strategic Hypothesis Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Customer-segmentation and personalization discovery | Marketing analytics data readiness assessment | Campaign measurement and governance design',
    businessDriver:
      'Growth/Expansion: Customer primacy and relationship/deposit growth',
    tech: 'Data engineering, BI, quality, lineage, and campaign analytics',
    entryWedge:
      'Validate customer primacy, segmentation, personalization, and campaign measurement priorities.',
    firstMeetingTheme:
      'Validate marketing analytics evidence and define a narrow KPI-linked personalization wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Segmentation/personalization discovery; analytics readiness assessment; measurement governance',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_023',
    rank: 23,
    title: 'Observability, APM, ITSM, and incident management validation',
    priority: 'Medium',
    opportunityType: 'Strategic Hypothesis Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'ITSM/APM/observability current-state review | Incident and service-health operating model | SRE and reliability backlog',
    businessDriver: 'Cost Pressure: Resilience, platform engineering, and simplification',
    tech: 'ITSM, observability, APM, and incident-management platform category',
    entryWedge: 'Validate observability, ITSM, APM, and incident-management pain points.',
    firstMeetingTheme:
      'Validate observability and ITSM evidence and identify a KPI-linked reliability wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'ITSM/APM/observability review; incident operating model; SRE backlog design',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_024',
    rank: 24,
    title: 'Open banking API and FDX-aligned integration enablement',
    priority: 'Medium',
    opportunityType: 'Inferred Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Treasury/payment workflow discovery | API and integration readiness assessment | Commercial customer journey and fee-income enablement design',
    businessDriver: 'Improve CX: Digital data access, compliance, and resilience',
    tech: 'API management, integration, microservices, and partner onboarding',
    entryWedge:
      'Assess open banking API use cases, FDX-aligned integration needs, and security controls.',
    firstMeetingTheme:
      'Validate open banking evidence and define a narrow KPI-linked integration wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Treasury/payment discovery; API readiness assessment; partner onboarding design',
    integrations: 'treasury platforms; payment rails; customer channels; ERP/connectivity endpoints',
  },
  {
    id: 'citizens_opp_025',
    rank: 25,
    title: 'Private bank and wealth advisor client platform enablement',
    priority: 'Medium',
    opportunityType: 'Strategic Hypothesis Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Advisor and client journey assessment | Wealth data and workflow readiness review | Advisor platform integration discovery',
    businessDriver: 'Growth/Expansion: Private bank and wealth growth enablement',
    tech: 'Advisor platforms, onboarding, portfolio workflow, and reporting',
    entryWedge: 'Validate private bank and wealth advisor/client platform priorities.',
    firstMeetingTheme:
      'Validate wealth-platform evidence and define a narrow KPI-linked advisor-enablement wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Advisor/client journey assessment; wealth workflow readiness; platform integration discovery',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_026',
    rank: 26,
    title: 'Salesforce CRM public-indicator validation for relationship workflows',
    priority: 'Medium',
    opportunityType: 'Watchlist Opportunity',
    dealSize: '$1M-$3.5M',
    timeline: 'Q4 2026 to Q3 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'CRM/workflow current-state validation | Relationship workflow and customer-360 discovery | Low-code/BPM governance model',
    businessDriver: 'Improve CX: Customer primacy and commercial growth',
    tech: 'CRM/workflow/BPM/low-code integration category',
    entryWedge: 'Validate CRM, BPM, workflow, and low-code platform usage and buyer scope.',
    firstMeetingTheme:
      'Validate Salesforce-anchored workflow signals and define a narrow KPI-linked wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'CRM/workflow validation; relationship-workflow discovery; low-code/BPM governance model',
    integrations: 'CRM; workflow/BPM; customer data profile; channels',
  },
  {
    id: 'citizens_opp_027',
    rank: 27,
    title: 'Commercial onboarding and portfolio analytics validation watchlist',
    priority: 'Watchlist',
    opportunityType: 'Watchlist Opportunity',
    dealSize: '$0.5M-$1.5M',
    timeline: 'Q1 2027 to Q4 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Discovery and current-state assessment | Target-state roadmap and value case | Implementation backlog and governance design',
    businessDriver:
      'Growth/Expansion: Commercial banking and lending operations (if validated)',
    tech: 'Onboarding, portfolio analytics, and lending workflow data enablement',
    entryWedge: 'Validate the current-state process and platform landscape.',
    firstMeetingTheme:
      'Validate onboarding and analytics watchlist signals and define a bounded assessment wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Current-state discovery; target-state roadmap; implementation governance design',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
  {
    id: 'citizens_opp_028',
    rank: 28,
    title: 'Digital assets and tokenization market-readiness watchlist',
    priority: 'Watchlist',
    opportunityType: 'Watchlist Opportunity',
    dealSize: '$0.5M-$1.5M',
    timeline: 'Q1 2027 to Q4 2027',
    buyer:
      'Technology product/platform owner, architecture, engineering, or CIO-organization function relevant to the domain',
    projectScope:
      'Discovery and current-state assessment | Target-state roadmap and value case | Implementation backlog and governance design',
    businessDriver:
      'Improve CX: Digital assets/tokenization scan requirement with no direct funded signal yet',
    tech: null,
    entryWedge: 'Monitor digital-assets and tokenization signals and regulatory posture.',
    firstMeetingTheme:
      'Validate tokenization watchlist evidence and define a bounded market-readiness assessment wedge.',
    first30:
      'Validate business owner, technology owner, KPI pain, current platform landscape, and safe vocabulary.',
    solutionTeam:
      'Current-state discovery; target-state roadmap; implementation governance design',
    integrations: 'source systems; workflow tools; data platforms; security controls',
  },
];

const FALLBACK_SUMMARIES = {
  A003: {
    name: 'BECU',
    totalOpportunities: 10,
    opportunityRange: '$8M-$16M',
    topServiceLineThemes: 'Data, AI',
    stakeholdersCount: 11,
  },
  A004: {
    name: 'PNC',
    totalOpportunities: 9,
    opportunityRange: '$6M-$12M',
    topServiceLineThemes: 'Reg Rpt, Data',
    stakeholdersCount: 8,
  },
  A005: {
    name: 'US Bank',
    totalOpportunities: 8,
    opportunityRange: '$5M-$10M',
    topServiceLineThemes: 'Cloud, Infra',
    stakeholdersCount: 7,
  },
  A006: {
    name: 'M&T Bank',
    totalOpportunities: 8,
    opportunityRange: '$5M-$10M',
    topServiceLineThemes: 'Core, Data',
    stakeholdersCount: 6,
  },
  A007: {
    name: 'Truist',
    totalOpportunities: 7,
    opportunityRange: '$4M-$9M',
    topServiceLineThemes: 'QE, Digital',
    stakeholdersCount: 5,
  },
  A008: {
    name: 'Fifth Third',
    totalOpportunities: 7,
    opportunityRange: '$4M-$8M',
    topServiceLineThemes: 'Reg Rpt, Data',
    stakeholdersCount: 4,
  },
  A009: {
    name: 'Regions',
    totalOpportunities: 7,
    opportunityRange: '$4M-$8M',
    topServiceLineThemes: 'Core, AI',
    stakeholdersCount: 4,
  },
  A010: {
    name: 'KeyBank',
    totalOpportunities: 7,
    opportunityRange: '$4M-$8M',
    topServiceLineThemes: 'Core, Data',
    stakeholdersCount: 4,
  },
};

function parseDealRange(dealSize) {
  const matches = String(dealSize ?? '').match(/[\d.]+/g);
  if (!matches || matches.length === 0) return null;
  const min = Number(matches[0]);
  const max = Number(matches[matches.length - 1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return [min, max];
}

function formatMillions(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

function buildRangeFromOpportunities(opportunities) {
  const totals = opportunities.reduce(
    (acc, opp) => {
      const bounds = parseDealRange(opp.dealSize);
      if (!bounds) return acc;
      return {
        min: acc.min + bounds[0],
        max: acc.max + bounds[1],
      };
    },
    { min: 0, max: 0 },
  );

  if (!totals.max) return '—';
  return `$${formatMillions(totals.min)}M-$${formatMillions(totals.max)}M`;
}

function buildDealMidpoint(dealSize) {
  const bounds = parseDealRange(dealSize);
  if (!bounds) return null;
  return (bounds[0] + bounds[1]) / 2;
}

function toOpportunity(row) {
  return {
    id: row.id,
    title: row.title,
    rank: row.rank,
    priority: row.priority,
    opportunityType: row.opportunityType,
    salesReadiness: row.priority === 'High' ? 'High' : 'Medium',
    dealSize: row.dealSize,
    timeline: row.timeline,
    buyer: row.buyer,
    confidenceScore: row.priority === 'High' ? 5 : 3,
    projectScope: parsePipeList(row.projectScope),
    businessDriver: row.businessDriver,
    technologyStack: {
      confirmed: row.tech,
      inferred: null,
      unknowns: null,
    },
    buyerMap: [{ role: 'Primary buyer', contact: row.buyer }],
    siEntryWedge: row.entryWedge,
    firstMeetingTheme: row.firstMeetingTheme,
    firstThirtyDays: parsePipeList(row.first30),
    solutionTeam: row.solutionTeam,
    keyIntegrationAreas: row.integrations,
  };
}

const CITIZENS_OPPORTUNITIES = CITIZENS_ROWS.map(toOpportunity);

function withExecutiveMandateDrivers(account) {
  if (!account?.opportunities?.length) return account;

  const buildSynovusDriverText = (opp, index) => {
    const title = String(opp?.title ?? '').toLowerCase();
    const first = 'Executive Mandate:';

    if (
      title.includes('command center')
      || (title.includes('merger') && title.includes('conversion'))
    ) {
      return 'Executive mandate is to protect client trust, deposit stability, operational continuity, and brand reputation by preventing conversion errors across account mapping, rates, fees, statements, digital access, branches, treasury, and reporting.';
    }
    if (title.includes('deposit') || title.includes('fis') || title.includes('core')) {
      return `${first} Protect balance, product, and statement integrity during core and deposit cutover activities.`;
    }
    if (title.includes('treasury') || title.includes('payment')) {
      return `${first} Stabilize treasury and payment workflows while improving onboarding speed for commercial clients.`;
    }
    if (title.includes('lending') || title.includes('ncino')) {
      return `${first} Reduce commercial-lending cycle time by removing workflow friction across origination and approval.`;
    }
    if (title.includes('ai') || title.includes('genai')) {
      return `${first} Scale AI productivity use cases under a governed model with clear risk and compliance guardrails.`;
    }
    if (title.includes('data') || title.includes('reporting')) {
      return `${first} Establish trusted, audit-ready data foundations for finance, risk, and executive reporting decisions.`;
    }
    if (title.includes('fraud')) {
      return `${first} Improve fraud detection and response speed while minimizing false positives for client-facing channels.`;
    }
    if (title.includes('digital')) {
      return `${first} Preserve digital customer experience through migration events, releases, and authentication changes.`;
    }
    if (title.includes('cyber') || title.includes('iam') || title.includes('identity')) {
      return `${first} Raise cyber and identity-control maturity before large-scale platform and conversion milestones.`;
    }
    if (title.includes('application') || title.includes('vendor')) {
      return `${first} Reduce run-cost and complexity by rationalizing overlapping applications and third-party dependencies.`;
    }

    return `${first} Accelerate this priority initiative with clear executive ownership, timelines, and measurable outcomes.`;
  };

  const opportunities = account.opportunities.map((opp, index) => {
    const existing = String(opp?.businessDriver ?? '').trim();
    const shortLabels = new Set([
      'executive mandate',
      'growth / expansion',
      'growth/expansion',
      'cost pressure',
      'risk reduction',
      'improve cx',
    ]);
    // Keep long-form CSV/demo drivers instead of overwriting with generic templates.
    if (existing && existing.length > 60 && !shortLabels.has(existing.toLowerCase())) {
      return opp;
    }
    return {
      ...opp,
      businessDriver: buildSynovusDriverText(opp, index),
    };
  });

  const rankedPlays = (account.overview?.rankedPlays ?? []).map((play, index) => ({
    ...play,
    why: opportunities[index]?.businessDriver ?? play.why,
  }));

  return {
    ...account,
    opportunities,
    overview: {
      ...(account.overview ?? {}),
      rankedPlays,
    },
  };
}

const CITIZENS_ACCOUNT = {
  id: 'A001',
  name: 'Citizens',
  summary: {
    totalOpportunities: CITIZENS_OPPORTUNITIES.length,
    opportunityRange: buildRangeFromOpportunities(CITIZENS_OPPORTUNITIES),
    topServiceLineThemes: 'AI, Workflow, Security, Data, Operations',
    stakeholdersCount: 9,
  },
  opportunities: CITIZENS_OPPORTUNITIES,
  overview: {
    rankedPlays: CITIZENS_OPPORTUNITIES.map((opp) => ({
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

function buildFallbackAccount(accountId, accountName) {
  const summary = FALLBACK_SUMMARIES[accountId] ?? {
    name: accountName ?? 'Account',
    totalOpportunities: 3,
    opportunityRange: '$1M-$3M',
    topServiceLineThemes: 'Data, AI',
    stakeholdersCount: 4,
  };

  const opportunities = Array.from({ length: summary.totalOpportunities }, (_, index) => {
    const rank = index + 1;
    return {
      id: `${accountId}-opp-${String(rank).padStart(2, '0')}`,
      title: `${summary.name} strategic opportunity ${rank}`,
      rank,
      priority: rank <= 2 ? 'High' : rank <= 4 ? 'Medium' : 'Low',
      opportunityType: rank <= 2 ? 'Confirmed Opportunity' : 'Inferred Opportunity',
      salesReadiness: rank <= 2 ? 'High' : 'Medium',
      dealSize: summary.opportunityRange,
      timeline: 'Next 2-4 quarters',
      buyer: 'Executive stakeholder',
      confidenceScore: rank <= 2 ? 4 : 3,
      projectScope: ['Scope to be confirmed with account team.'],
      businessDriver: 'Growth and efficiency priorities.',
      technologyStack: { confirmed: summary.topServiceLineThemes, inferred: null, unknowns: null },
      buyerMap: [{ role: 'Primary buyer', contact: 'Executive stakeholder' }],
      siEntryWedge: 'Discovery and readiness assessment.',
      firstMeetingTheme: 'Validate priorities, timeline, and success metrics.',
      firstThirtyDays: ['Run discovery workshops and define initial roadmap.'],
      solutionTeam: 'Cross-functional consulting and delivery team.',
      keyIntegrationAreas: 'Core systems, workflows, and reporting.',
    };
  });

  return {
    id: accountId,
    name: summary.name,
    summary: {
      totalOpportunities: summary.totalOpportunities,
      opportunityRange: summary.opportunityRange,
      topServiceLineThemes: summary.topServiceLineThemes,
      stakeholdersCount: summary.stakeholdersCount,
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
}

export function getDemoOpportunityAccount(accountId, accountName) {
  if (accountName === 'Citizens' || accountId === 'A001') return CITIZENS_ACCOUNT;

  const mappedId = ACCOUNT_ID_TO_MOCK_ID[accountId] ?? accountId;
  if (mappedId === '1') {
    const synovus = getAccountById(mappedId) ?? getAccountById('1');
    return withExecutiveMandateDrivers(synovus);
  }
  return buildFallbackAccount(accountId, accountName);
}
