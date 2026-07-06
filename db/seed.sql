-- DealAxis — seed: 1 user → subscribed to Synovus → 10 opportunities
-- Run after schema: psql $DATABASE_URL -f db/seed.sql
--
-- ID scheme (prefix + 5 digits):
--   users          U00001  Ajay
--   accounts       A00001  Synovus
--   subscriptions  S00001  Ajay → Synovus
--   opportunities  O00001–O00010  Synovus ranks 1–10

TRUNCATE user_account_subscriptions, opportunities, accounts, users CASCADE;

-- ---------------------------------------------------------------------------
-- 3.1 User — Ajay
-- ---------------------------------------------------------------------------
INSERT INTO users (id, email, full_name, role)
VALUES (
  'U00001',
  'ajay@dealaxis.ai',
  'Ajay',
  'admin'
);

-- ---------------------------------------------------------------------------
-- 3.2 Account — Synovus
-- ---------------------------------------------------------------------------
INSERT INTO accounts (
  id,
  name,
  sector,
  logo_url,
  opportunity_range,
  total_opportunities,
  strategic_fit
) VALUES (
  'A00001',
  'Synovus',
  'Banking',
  '/banks/synovus.jpg',
  '$19M–$65M',
  10,
  'High'
);

-- ---------------------------------------------------------------------------
-- 3.3 Subscription — Ajay → Synovus
-- ---------------------------------------------------------------------------
INSERT INTO user_account_subscriptions (id, user_id, account_id, subscribed_at)
VALUES (
  'S00001',
  'U00001',
  'A00001',
  '2026-01-15 09:00:00+00'
);

-- ---------------------------------------------------------------------------
-- 3.4 Opportunities — Synovus ranks 1–10
-- ---------------------------------------------------------------------------
INSERT INTO opportunities (
  id, account_id, rank, title, priority, opportunity_type, deal_size, timeline, buyer,
  project_scope, business_driver, confidence, sales_readiness,
  tech_stack_confirmed, tech_stack_inferred, entry_wedge, first_meeting_theme,
  why_strong, first_buyer
) VALUES
(
  'O00001', 'A00001', 1,
  'Merger Systems Conversion and Client Experience Assurance',
  'High', 'Confirmed Opportunity', '$5M–$15M',
  '2026 through early 2027, with stabilization after conversion',
  'Integration Office / COO / business-line conversion leaders',
  ARRAY[
    'Conversion readiness assessment across core, digital, treasury, lending, branch, reporting, identity, and servicing touchpoints.',
    'Independent test assurance, mock-conversion support, defect governance, and cutover command-center support.',
    'Client-experience assurance across account access, payments, statements, alerts, authentication, and servicing.',
    'Branch and field-readiness playbooks, training support, and post-conversion stabilization.'
  ],
  'Executive Mandate', 5, 'High',
  ARRAY['FIS core signal', 'My Synovus', 'Synovus Gateway', 'nCino'],
  ARRAY['Assessment', 'Testing / Validation', 'Integration', 'Change Management', 'Operating Model'],
  'March 2027 conversion readiness and client-experience risk assessment',
  'How do we protect client experience and operational stability during system and brand conversion?',
  'Strongest public evidence, clear timeline, high SI fit, low vendor-claim risk',
  'Integration Office / CIO / COO'
),
(
  'O00002', 'A00001', 2,
  'FIS Core and Deposit Conversion Readiness',
  'High', 'Confirmed Opportunity', '$3M–$10M',
  '2026 through early 2027',
  'Deposit operations / retail banking / operations',
  ARRAY[
    'Core/deposit conversion dependency assessment.',
    'Deposit account, product, balance, fee, statement, and rate mapping validation.',
    'Core-to-digital, core-to-treasury, core-to-reporting, and branch integration testing.',
    'Reconciliation controls and production-readiness dashboards.'
  ],
  'Executive Mandate', 4, 'High',
  ARRAY['FIS core platform signal'],
  ARRAY['Assessment', 'Testing / Validation', 'Data Engineering', 'Integration'],
  'FIS core and deposit conversion risk review',
  'Deposit conversion accuracy, customer-impact controls, and downstream integration readiness.',
  'Core/deposit accuracy is foundational to conversion',
  'Core banking tech / deposit ops'
),
(
  'O00003', 'A00001', 3,
  'Treasury Payments and Synovus Gateway Enablement',
  'High', 'Inferred Opportunity', '$2M–$7M',
  '2026 through 2027',
  'Treasury Management / Commercial Banking',
  ARRAY[
    'Synovus Gateway workflow assessment across onboarding, ACH, wire, positive pay, reporting, alerts, entitlements, and user management.',
    'Treasury client-onboarding optimization and commercial UX testing.',
    'Payment-risk and positive-pay control review.',
    'Treasury conversion and regression testing tied to integration.'
  ],
  'Growth / Expansion', 5, 'High',
  ARRAY['Synovus Gateway'],
  ARRAY['Assessment', 'Integration', 'Testing / Validation', 'Control Automation'],
  'Gateway onboarding and payment-risk control diagnostic',
  'Driving treasury growth while de-risking payment workflows through conversion.',
  'Gateway and treasury risk/growth signals are strong',
  'Treasury / commercial banking'
),
(
  'O00004', 'A00001', 4,
  'Commercial Lending and nCino Workflow Optimization',
  'High', 'Inferred Opportunity', '$1.5M–$5M',
  '2026 through 2027',
  'Commercial Banking / CIB / Specialty Lending',
  ARRAY[
    'nCino workflow assessment across intake, underwriting, approval, documentation, closing, and booking handoffs.',
    'Lending workflow optimization for validated commercial, CIB, specialty, or CRE segments.',
    'nCino integration and data-quality review across core, documents, reporting, and credit analytics.',
    'UAT, release testing, adoption support, and banker/credit-ops enablement.'
  ],
  'Growth / Expansion', 5, 'High',
  ARRAY['nCino loan-origination signal'],
  ARRAY['Assessment', 'Architecture', 'Integration', 'Testing / Validation', 'Change Management'],
  'nCino adoption, workflow, and credit-operations effectiveness review',
  'Reducing commercial lending friction while protecting credit discipline.',
  'Confirmed nCino signal plus commercial growth relevance',
  'Commercial / credit / CIO'
),
(
  'O00005', 'A00001', 5,
  'Governed AI Productivity and Knowledge Enablement',
  'High', 'Inferred Opportunity', '$1.5M–$6M',
  '2026 through 2027',
  'Enterprise operations / line-of-business productivity owners',
  ARRAY[
    'AI use-case portfolio assessment across productivity, knowledge retrieval, document processing, policy analysis, and operational support.',
    'Governance design for GenAI, IDP, ML, and knowledge-assistant use cases.',
    'Knowledge-source curation, access controls, prompt/data guardrails, telemetry, and adoption metrics.',
    'IDP discovery for lending, operations, compliance, and servicing workflows.'
  ],
  'Cost Pressure', 5, 'High',
  ARRAY['Microsoft Copilot', 'Synovus GPT', 'ChatPFP', 'IDP', 'ML/neural networks'],
  ARRAY['Assessment', 'AI Enablement', 'Architecture', 'Control Automation', 'Change Management'],
  'AI governance and use-case scaling readiness assessment',
  'Scaling AI safely with measurable productivity and defensible governance.',
  'Public AI signals are unusually strong and specific',
  'CIO / data / risk'
),
(
  'O00006', 'A00001', 6,
  'AI-Ready Data and Reporting Reconciliation Foundation',
  'High', 'Strategic Hypothesis', '$2M–$8M',
  '2026 through 2027',
  'Finance / risk / business-line reporting owners',
  ARRAY[
    'Data-quality, lineage, reconciliation, and reporting-readiness assessment.',
    'AI-ready data-domain prioritization across customer, account, deposit, loan, payment, fraud, treasury, and document data.',
    'Conversion reconciliation framework for mock conversions and post-conversion validation.',
    'Data governance operating model, stewardship, and control-evidence design.'
  ],
  'Risk Reduction', 4, 'Medium',
  ARRAY['Azure Databricks', 'Power BI', 'SQL', 'Python', 'R', 'SAS', 'Tableau'],
  ARRAY['Assessment', 'Data Engineering', 'Architecture', 'Control Automation'],
  'Conversion reconciliation and AI-ready data diagnostic',
  'Trusted data for conversion, reporting, and governed AI.',
  'Data is the connective tissue for conversion and AI',
  'CDO / CFO / CIO'
),
(
  'O00007', 'A00001', 7,
  'Fraud AI/ML and Payment-Risk Controls',
  'Medium-High', 'Inferred Opportunity', '$1M–$4M',
  '2026 through 2027',
  'Fraud operations / treasury / digital banking',
  ARRAY[
    'Fraud AI/ML and transactional-risk control assessment across digital, treasury, ACH/wire, positive pay, alerts, and customer notifications.',
    'Payment-risk analytics and exception-handling review.',
    'Fraud alert journey mapping from detection to customer notification and operations follow-up.',
    'Model governance and data-quality review for transactional-risk analytics.'
  ],
  'Risk Reduction', 4, 'Medium',
  ARRAY['Synovus Gateway', 'My Synovus security features', 'ML/neural-network transactional risk', 'Positive Pay', 'ACH Positive Pay'],
  ARRAY['Assessment', 'AI Enablement', 'Control Automation', 'Data Engineering'],
  'Payment-risk and fraud-control effectiveness diagnostic',
  'Improving fraud controls without hurting client experience or treasury usability.',
  'Strong risk lens; pairs well with treasury/digital',
  'Fraud / risk / treasury'
),
(
  'O00008', 'A00001', 8,
  'Digital Banking Continuity and Customer Migration Readiness',
  'Medium-High', 'Inferred Opportunity', '$1.5M–$5M',
  '2026 through early 2027, with stabilization after conversion',
  'Retail banking / digital banking',
  ARRAY[
    'My Synovus customer-journey migration and regression-testing readiness.',
    'Digital feature-parity validation across login, MFA, biometrics, mobile deposit, transfers, bill pay, Zelle, alerts, insights, account views, and branch/ATM locator.',
    'Conversion communications and support readiness for digital enrollment, authentication, and servicing issues.',
    'Digital defect triage, release readiness, and post-conversion monitoring.'
  ],
  'Improve CX', 4, 'Medium',
  ARRAY['My Synovus', 'Zelle'],
  ARRAY['Assessment', 'Testing / Validation', 'Change Management', 'Integration'],
  'My Synovus migration journey and digital regression readiness review',
  'How do we prevent digital disruption during customer migration?',
  'Strong digital/conversion link; CX risk reduction',
  'Digital channels / retail banking / CIO'
),
(
  'O00009', 'A00001', 9,
  'Cybersecurity, IAM, and Conversion Resilience',
  'Medium', 'Watchlist', '$750K–$3M',
  '2026 through 2027',
  'Enterprise risk / operations',
  ARRAY[
    'Cyber/IAM readiness assessment for conversion, AI adoption, employee access, customer authentication, and third-party access.',
    'Identity, privileged access, and user-behavior analytics control review.',
    'AI security governance and access-monitoring assessment.',
    'Conversion control-evidence and remediation roadmap.'
  ],
  'Risk Reduction', 4, 'Low',
  ARRAY['MFA/biometrics', 'NIST-aligned AI governance'],
  ARRAY['Assessment', 'Architecture', 'Control Automation', 'Testing / Validation'],
  'Identity and cyber controls readiness for conversion and AI adoption',
  'Secure conversion: identity, access, AI governance, and cyber control evidence.',
  'Conversion and AI adoption create IAM exposure',
  'CIO / CISO / operational risk'
),
(
  'O00010', 'A00001', 10,
  'Application Rationalization and Vendor Optimization Assessment',
  'Medium', 'Strategic Hypothesis', '$500K–$2.5M',
  '2026 through 2028',
  'Enterprise transformation / finance',
  ARRAY[
    'Combined-bank application inventory and dependency mapping.',
    'Duplicate application and vendor-overlap assessment.',
    'Vendor cost, contract, risk, and third-party dependency review.',
    'Decommissioning candidate and managed-services suitability assessment.'
  ],
  'Cost Pressure', 3, 'Low',
  ARRAY['FIS core signal', 'nCino', 'Synovus Gateway', 'My Synovus', 'Wealthscape', 'AI capabilities'],
  ARRAY['Assessment', 'Roadmap', 'Managed Services', 'Operating Model'],
  'Post-merger application inventory and dependency heat map',
  'Where can the combined bank reduce complexity without increasing conversion risk?',
  'Post-merger efficiency play; longer horizon',
  'CIO / CFO / integration office'
);

-- Sync total_opportunities (also maintained by trigger on future inserts/deletes)
UPDATE accounts
SET total_opportunities = (SELECT COUNT(*) FROM opportunities WHERE account_id = accounts.id)
WHERE id = 'A00001';
