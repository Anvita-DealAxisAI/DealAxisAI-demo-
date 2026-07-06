-- DealAxis — seed: signals, org, news for Synovus (A00001) and Comerica (A00002)
-- Run AFTER schema.sql and seed.sql:
--   psql $DATABASE_URL -f db/seed_signals_org_news.sql

TRUNCATE account_news, account_org, account_signals CASCADE;

-- ===========================================================================
-- COMERICA ACCOUNT
-- ===========================================================================
INSERT INTO accounts (id, name, sector, logo_url, opportunity_range, total_opportunities, strategic_fit)
VALUES (
  'A00002',
  'Comerica',
  'Banking',
  '/banks/comerica.png',
  '$5M–$14M',
  7,
  'High'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sector = EXCLUDED.sector,
  logo_url = EXCLUDED.logo_url,
  opportunity_range = EXCLUDED.opportunity_range,
  total_opportunities = EXCLUDED.total_opportunities,
  strategic_fit = EXCLUDED.strategic_fit;

-- Comerica subscription for Ajay
INSERT INTO user_account_subscriptions (id, user_id, account_id, subscribed_at)
VALUES ('S00002', 'U00001', 'A00002', '2026-06-01 09:00:00+00')
ON CONFLICT (user_id, account_id) DO NOTHING;

-- ===========================================================================
-- COMERICA OPPORTUNITIES (7)
-- ===========================================================================
INSERT INTO opportunities (
  id, account_id, rank, title, priority, opportunity_type, deal_size, timeline, buyer,
  project_scope, business_driver, confidence, sales_readiness,
  tech_stack_confirmed, tech_stack_inferred, entry_wedge, first_meeting_theme,
  why_strong, first_buyer
) VALUES
(
  'O00011', 'A00002', 1,
  'Enterprise Conversion Readiness and Customer Continuity Assurance',
  'High', 'Confirmed Opportunity', '$1.5M–$5.0M',
  '0-12 months',
  'Integration Office / COO / CIO',
  ARRAY[
    'Establish an integrated conversion-assurance workplan covering business-process, interface, data and operational readiness across customer-impacting journeys.',
    'Design and execute risk-based test strategy, test-data controls, defect governance and business acceptance readiness.',
    'Create cutover rehearsal, go/no-go, hypercare command-center and customer-impact escalation playbooks.',
    'Assess end-to-end continuity controls for client communications, servicing, product access and issue-resolution paths.'
  ],
  'Executive Mandate', 5, 'High',
  ARRAY[]::TEXT[],
  ARRAY['Conversion testing and quality engineering', 'Integration orchestration', 'Data reconciliation', 'Cutover and hypercare management', 'Customer communication and service-continuity controls'],
  'Independent conversion-readiness assessment and test/cutover governance sprint',
  'How do we protect customer experience and operational stability during the Fifth Third system and brand conversion?',
  'Fifth Third completed the Comerica merger and publicly identified full system and brand conversion as a next-phase priority; customer continuity is a confirmed business imperative.',
  'Integration Office / CIO'
),
(
  'O00012', 'A00002', 2,
  'Integration Application and Vendor Dependency Assessment',
  'Medium-High', 'Inferred Opportunity', '$0.5M–$1.5M',
  '0-18 months',
  'CIO / CTO / Enterprise Architecture',
  ARRAY[
    'Map all Comerica applications and vendor contracts requiring migration, rationalization, or decommissioning.',
    'Assess integration dependencies, data flows, and customer-impacting interfaces.',
    'Identify high-risk vendor relationships and contract obligations during transition.',
    'Produce a prioritized rationalization roadmap aligned to Fifth Third integration sequencing.'
  ],
  'Cost Pressure', 4, 'Medium-High',
  ARRAY[]::TEXT[],
  ARRAY['Application portfolio management', 'Vendor rationalization', 'Integration dependency mapping', 'Enterprise architecture'],
  'Application portfolio and vendor dependency rapid assessment',
  'Where are the highest-risk application and vendor dependencies in the Comerica integration scope?',
  'Public deal materials specifically identified facilities, technology, systems and vendor rationalization as $850M expense-synergy areas.',
  'CIO / Enterprise Architecture'
),
(
  'O00013', 'A00002', 3,
  'Commercial and Treasury Client-Channel Conversion Assurance',
  'Medium-High', 'Inferred Opportunity', '$0.75M–$2.5M',
  '0-12 months',
  'Commercial Banking / Treasury / CIO',
  ARRAY[
    'Assess commercial digital servicing and cash-management channel continuity through conversion.',
    'Validate real-time payments participation and payment operations readiness.',
    'Test commercial client onboarding, reporting, and servicing journeys across conversion milestones.',
    'Develop commercial-client communication and escalation playbooks for conversion events.'
  ],
  'Executive Mandate', 4, 'Medium-High',
  ARRAY[]::TEXT[],
  ARRAY['Commercial digital channels', 'Treasury and cash management', 'Real-time payments', 'Commercial onboarding', 'Payment operations'],
  'Commercial client-channel conversion risk assessment',
  'How do we protect commercial client relationships and revenue through the channel conversion?',
  'Fifth Third identified Comerica commercial and middle-market franchise as a major revenue-synergy source; channel continuity is the primary retention risk.',
  'Commercial Banking Head / Treasury Head'
),
(
  'O00014', 'A00002', 4,
  'Conversion Data Reconciliation and Reporting-Control Assurance',
  'Medium-High', 'Inferred Opportunity', '$0.75M–$2.5M',
  '0-12 months',
  'CFO / Enterprise Data / Risk',
  ARRAY[
    'Identify high-risk data migration domains and reporting dependencies across the conversion scope.',
    'Design and execute data reconciliation controls for balances, positions, products, and regulatory reports.',
    'Build a reporting-readiness dashboard and evidence framework for finance and risk.',
    'Validate regulatory reporting continuity across conversion milestones.'
  ],
  'Risk Mandate', 4, 'Medium-High',
  ARRAY[]::TEXT[],
  ARRAY['Data reconciliation', 'Regulatory reporting', 'Finance controls', 'Data migration', 'Risk reporting'],
  'Data reconciliation and reporting-control rapid assessment for one high-risk domain',
  'What are the highest-risk data migration and reporting-control gaps in the conversion scope?',
  'Combined-bank scale creates data and reporting control complexity; regulatory reporting continuity is a confirmed post-merger discipline.',
  'CFO / Chief Data Officer'
),
(
  'O00015', 'A00002', 5,
  'Identity and Security Assurance for Conversion',
  'Medium-High', 'Inferred Opportunity', '$0.75M–$2.5M',
  '0-12 months',
  'CISO / CIO / Risk',
  ARRAY[
    'Assess identity and access management continuity for employees and customers through conversion.',
    'Review cybersecurity controls, third-party risk, and resilience posture during integration.',
    'Identify IAM governance gaps and credential-migration risks.',
    'Design security test strategy for conversion-impacted systems and customer touchpoints.'
  ],
  'Risk Mandate', 4, 'Medium-High',
  ARRAY[]::TEXT[],
  ARRAY['Identity and access management', 'Cybersecurity', 'Third-party risk', 'Security testing', 'Resilience controls'],
  'IAM and security conversion risk assessment',
  'How do we maintain security controls and identity continuity during the system conversion?',
  'Comerica has public evidence of cyber-risk governance and IAM discipline; conversion creates identity and access migration risk.',
  'CISO / Head of Cybersecurity'
),
(
  'O00016', 'A00002', 6,
  'Wealth and Trust Client-Service Conversion Readiness',
  'Medium', 'Inferred Opportunity', '$0.25M–$0.75M',
  '6-18 months',
  'Head of Wealth Management / CIO',
  ARRAY[
    'Assess wealth and trust client portal continuity and servicing-model conversion readiness.',
    'Map fiduciary, advisory, and trust-platform dependencies to conversion scope.',
    'Design client communication and experience-assurance playbook for wealth segment.',
    'Validate investment and trust account data migration controls.'
  ],
  'Client Retention', 3, 'Medium',
  ARRAY[]::TEXT[],
  ARRAY['Wealth/trust platforms', 'Fiduciary services', 'Client portal', 'Investment data migration'],
  'Wealth and trust client-experience conversion risk discovery',
  'How do we protect wealth and trust client relationships through the conversion?',
  'Wealth Management was a named Comerica segment; trust and fiduciary service continuity is a client-retention risk.',
  'Head of Wealth Management'
),
(
  'O00017', 'A00002', 7,
  'Payment Operations, Reconciliation and Control-Readiness Assessment',
  'Medium', 'Strategic Hypothesis', '$0.25M–$0.75M',
  '6-24 months',
  'Head of Payments / COO',
  ARRAY[
    'Assess payment-operations readiness and reconciliation controls through conversion.',
    'Review RTP, ACH, wire, and card-services continuity plans.',
    'Identify payment-operations staffing and process risks during system transition.',
    'Design payment-reconciliation test strategy and exception-management playbook.'
  ],
  'Risk Mandate', 3, 'Medium',
  ARRAY[]::TEXT[],
  ARRAY['Payment operations', 'RTP/ACH/wire controls', 'Reconciliation', 'Card services', 'Payment testing'],
  'Payment operations and reconciliation risk assessment',
  'Where are the payment-reconciliation and operations risks in the conversion scope?',
  'Comerica has public evidence of RTP participation and payment operations; conversion creates reconciliation and continuity risk.',
  'Head of Payments / COO'
);

-- ===========================================================================
-- SIGNALS — SYNOVUS (A00001)
-- ===========================================================================
INSERT INTO account_signals (id, account_id, category, signal_title, detail, evidence, priority, sort_order) VALUES
('SIG00001','A00001','Operational Priorities','Merger Conversion Execution',
 'March 2027 systems and brand conversion is a public, executive-mandated program. Conversion readiness, client experience protection, and operational stability are the highest-priority near-term imperatives.',
 'Public investor communications confirm March 2027 conversion timeline. FCB integration is largest SI entry point.','High',1),
('SIG00002','A00001','Growth Focus','Commercial Banking Expansion',
 'Loan growth driven by middle market, CIB, and specialty lending. Commercial banking is the primary organic growth engine post-merger.',
 'Q4 2025 earnings commentary highlights commercial loan pipeline growth and middle-market expansion targets.','High',2),
('SIG00003','A00001','Efficiency','Operating Efficiency Under Merger Cost Pressure',
 'Adjusted efficiency ratio remains strong, but merger-related costs are visible. Cost discipline is a stated management priority alongside integration investment.',
 'Efficiency ratio at 61% pre-merger; merger charges expected to impact near-term reported efficiency.','Medium',3),
('SIG00004','A00001','Risk Management','Data, Risk and Reporting Confidence Post-Merger',
 'Combined-bank scale creates data reconciliation, reporting, and control complexity. Risk and data integrity are named priorities for the combined entity.',
 'Public resolution plan and investor materials cite data governance and reporting controls as integration focus areas.','High',4),
('SIG00005','A00001','Technology','Digital Modernization and Channel Investment',
 'Synovus is investing in digital modernization to improve customer experience and operational simplification. Digital self-service expansion is a named retail banking priority.',
 'My Synovus and Synovus Gateway are confirmed public digital platforms. nCino cited in commercial banking context.','Medium',5),
('SIG00006','A00001','Technology','FIS Core Platform Dependency',
 'FIS is the confirmed core banking platform signal. Core platform migration and conversion readiness is the primary technology SI entry point.',
 'FIS platform referenced in public investor materials and technology commentary.','High',6),
('SIG00007','A00001','Market','Competitive Pressure from Regional Peers',
 'Regions ($152B), Truist ($545B), Fifth Third ($214B) and KeyBank ($187B) are primary competitive peers. Scale and digital capability gaps are relevant to SI positioning.',
 'Competitive landscape analysis based on public asset, revenue, and efficiency metrics.','Medium',7);

-- ===========================================================================
-- SIGNALS — COMERICA (A00002)
-- ===========================================================================
INSERT INTO account_signals (id, account_id, category, signal_title, detail, evidence, priority, sort_order) VALUES
('SIG00010','A00002','Operational Priorities','Fifth Third Merger Integration and Conversion',
 'Fifth Third completed the Comerica acquisition on February 1, 2026. Full system and brand conversion is expected later in 2026. Customer continuity, colleague retention, and integration governance are the highest-priority near-term imperatives.',
 'Fifth Third 8-K confirms merger close February 1, 2026. Q1 2026 earnings release confirms active integration and customer-continuity focus.','High',1),
('SIG00011','A00002','Operational Priorities','Expense Synergy Realization ($850M Target)',
 'Fifth Third publicly identified $850M in expected expense synergies including facilities, technology, systems, vendor, and non-customer-facing personnel rationalization.',
 'Fifth Third Goldman Sachs conference presentation and public deal materials cite $850M synergy target.','High',2),
('SIG00012','A00002','Growth Focus','Commercial and Middle-Market Franchise Expansion',
 'Fifth Third identified Comerica commercial and middle-market platform and vertical expertise as a major revenue-synergy source. Commercial lending, treasury, and payments growth are named priorities.',
 'Fifth Third acquisition rationale presentation cites Comerica commercial franchise as key revenue opportunity.','High',3),
('SIG00013','A00002','Growth Focus','Deposit and Household Growth in Comerica Markets',
 'Fifth Third plans to apply consumer acquisition analytics and marketing capabilities in Comerica markets (Texas, California, Michigan, Arizona, Florida).',
 'Q1 2026 earnings commentary describes consumer deposit and household growth as a post-close priority in Comerica geographies.','Medium',4),
('SIG00014','A00002','Technology','System and Vendor Rationalization',
 'Technology, systems, and vendor rationalization are explicitly named as expense-synergy categories. Application portfolio and vendor dependency assessment is a near-term priority.',
 'Fifth Third deal presentation specifically identified systems and vendor rationalization within $850M synergy scope.','High',5),
('SIG00015','A00002','Technology','Commercial Digital Channels and Real-Time Payments',
 'Comerica has confirmed public evidence of commercial digital servicing, cash-management channels, and real-time payments participation. Channel continuity through conversion is a priority.',
 'Comerica public website and commercial banking materials confirm digital cash management and RTP participation.','Medium',6),
('SIG00016','A00002','Risk Management','Cybersecurity, IAM and Resilience Controls',
 'Comerica has public evidence of cyber-risk governance, IAM controls, and formal capital planning. Identity and security assurance through conversion is a named risk area.',
 'Comerica 2025 FDIC resolution plan documents centrally managed liquidity, stress testing, and capital planning.','High',7),
('SIG00017','A00002','Market','Financial Profile (Pre-Close 2025)',
 'Asset size $80B, net interest income $2.3B, NIM 3.12%, CET1 12.02%, 7,876 employees as of December 31, 2025. Post-close results consolidated into Fifth Third.',
 'Comerica Q4 2025 SEC earnings release confirms all cited financial metrics.','Medium',8);

-- ===========================================================================
-- ORG — SYNOVUS (A00001)
-- ===========================================================================
INSERT INTO account_org (id, account_id, name, title, level, department, is_key_buyer, sort_order) VALUES
('ORG00001','A00001','Kevin Blair','Chief Executive Officer','CXO','Executive','true',1),
('ORG00002','A00001','Vikram Ramani','Chief Information Officer','CXO','Technology','true',2),
('ORG00003','A00001','Santosh Kokate','Chief Data Officer','CXO','Data & Analytics','true',3),
('ORG00004','A00001','Andrew Gregory','Chief Financial Officer','CXO','Finance','false',4),
('ORG00005','A00001','Sarah Mitchell','Head of Enterprise Architecture','CXO-1','Technology','false',5),
('ORG00006','A00001','David Chen','Head of Core Banking Technology','CXO-1','Technology','true',6),
('ORG00007','A00001','Priya Nair','Head of Digital Platforms','CXO-1','Digital','true',7),
('ORG00008','A00001','Sathish Madanagopal','Director, Digital Platforms and Assurance','CXO-2','Digital','false',8),
('ORG00009','A00001','James Porter','Director, Retail Systems Modernization','CXO-2','Technology','false',9),
('ORG00010','A00001','Laura Gomez','Director, Digital Engineering','CXO-2','Digital','false',10);

-- ===========================================================================
-- ORG — COMERICA (A00002)
-- ===========================================================================
INSERT INTO account_org (id, account_id, name, title, level, department, is_key_buyer, sort_order) VALUES
('ORG00020','A00002','Curt Farmer','Chairman and CEO (Pre-close)','CXO','Executive','false',1),
('ORG00021','A00002','James Herzog','Chief Financial Officer (Pre-close)','CXO','Finance','false',2),
('ORG00022','A00002','Megan Burkhart','Chief Human Resources Officer','CXO','HR','false',3),
('ORG00023','A00002','Integration Leadership','Chief Integration Officer / COO (TBD)','CXO','Integration','true',4),
('ORG00024','A00002','Technology Leadership','Chief Information Officer (TBD — Needs Validation)','CXO','Technology','true',5),
('ORG00025','A00002','Risk Leadership','Chief Risk Officer (TBD — Needs Validation)','CXO','Risk','false',6),
('ORG00026','A00002','Commercial Banking Head','Head of Commercial Banking (TBD — Needs Validation)','CXO-1','Commercial Banking','true',7),
('ORG00027','A00002','Treasury and Payments Head','Head of Treasury and Payments (TBD — Needs Validation)','CXO-1','Treasury','true',8),
('ORG00028','A00002','Wealth Management Head','Head of Wealth Management (TBD — Needs Validation)','CXO-1','Wealth','false',9),
('ORG00029','A00002','Data and Analytics Lead','Head of Data and Analytics (TBD — Needs Validation)','CXO-1','Data','true',10);

-- ===========================================================================
-- NEWS — SYNOVUS (A00001)
-- ===========================================================================
INSERT INTO account_news (id, account_id, headline, summary, source, published_at, category, relevance, sort_order) VALUES
('NEWS0001','A00001','Synovus Confirms March 2027 Systems and Brand Conversion Timeline',
 'Synovus publicly confirmed the March 2027 target date for core systems and brand conversion following the FCB merger. Executive leadership cited customer experience protection and operational stability as top priorities for the conversion program.',
 'Synovus Investor Relations','2026-03-15','Merger & Integration','High',1),
('NEWS0002','A00001','Commercial Loan Growth Continues in Q1 2026',
 'Synovus reported continued commercial loan pipeline growth in Q1 2026, driven by middle-market, CIB, and specialty lending segments. Management cited disciplined growth and relationship-led expansion as core strategy.',
 'Synovus Earnings Release','2026-04-22','Financial Performance','High',2),
('NEWS0003','A00001','Synovus Expands Digital Banking Platform Capabilities',
 'Synovus announced enhancements to My Synovus and Synovus Gateway platforms, focusing on digital self-service, commercial client experience, and mobile banking capabilities.',
 'Synovus Press Release','2026-02-10','Technology & Digital','Medium',3),
('NEWS0004','A00001','FCB Integration Progress Update — Q4 2025',
 'Synovus provided an integration progress update confirming systems consolidation milestones, talent retention across FCB markets, and customer communication programs ahead of the 2027 conversion.',
 'Synovus Investor Day','2025-11-18','Merger & Integration','High',4),
('NEWS0005','A00001','nCino Implementation Expansion Across Commercial Banking',
 'Synovus expanded nCino deployment across commercial banking workflows to improve lending speed, client onboarding, and commercial relationship management.',
 'Banking Technology News','2025-09-05','Technology & Digital','Medium',5),
('NEWS0006','A00001','Synovus Recognized for Regional Banking Customer Experience',
 'Synovus received recognition for customer experience quality in retail and commercial banking segments, reinforcing its relationship-led strategy across the Southeast.',
 'Banking Industry Report','2026-01-20','Awards & Recognition','Low',6);

-- ===========================================================================
-- NEWS — COMERICA (A00002)
-- ===========================================================================
INSERT INTO account_news (id, account_id, headline, summary, source, published_at, category, relevance, sort_order) VALUES
('NEWS0010','A00002','Fifth Third Completes Comerica Merger — February 1, 2026',
 'Fifth Third Bancorp completed its acquisition of Comerica Incorporated on February 1, 2026, creating the 9th largest U.S. bank. Comerica now operates as a division of Fifth Third Bank, N.A. Full system and brand conversion is expected later in 2026.',
 'Fifth Third Press Release','2026-02-01','Merger & Integration','High',1),
('NEWS0011','A00002','Fifth Third Projects $850M Expense Synergies from Comerica Integration',
 'Fifth Third publicly identified $850M in expected expense synergies from the Comerica acquisition, specifically naming facilities, technology, systems, vendor, and non-customer-facing personnel rationalization as primary sources.',
 'Fifth Third Investor Presentation','2025-09-12','Merger & Integration','High',2),
('NEWS0012','A00002','Comerica Q4 2025: Assets $80B, NIM 3.12%, CET1 12.02%',
 'Comerica reported Q4 2025 results showing $80.074B in assets, $2.301B in net interest income for full-year 2025, NIM of 3.12%, and CET1 ratio of 12.02%. These represent the final standalone Comerica financial disclosures.',
 'Comerica SEC Earnings Release','2026-01-20','Financial Performance','High',3),
('NEWS0013','A00002','Full System and Brand Conversion Planned for Late 2026',
 'Fifth Third confirmed that full system and brand conversion of the Comerica franchise is planned for later in 2026. Customer continuity, colleague retention, and integration governance are cited as top priorities.',
 'Fifth Third Q1 2026 Earnings Call','2026-04-19','Merger & Integration','High',4),
('NEWS0014','A00002','Comerica Commercial and Middle-Market Platform Cited as Revenue Opportunity',
 'Fifth Third highlighted Comerica commercial and middle-market platform, vertical expertise, and geographic presence as a major revenue-synergy source, targeting commercial lending, treasury, and payments growth.',
 'Fifth Third Goldman Sachs Conference','2025-12-08','Strategy & Growth','High',5),
('NEWS0015','A00002','Comerica Confirms Real-Time Payments Participation and Commercial Digital Expansion',
 'Comerica confirmed participation in real-time payments networks and ongoing commercial digital channel enhancements across cash management and treasury servicing platforms.',
 'Comerica Public Website / Press Release','2025-08-14','Technology & Digital','Medium',6),
('NEWS0016','A00002','Fifth Third Q1 2026: Merger Charges Impact Reported Efficiency; Integration on Track',
 'Fifth Third Q1 2026 results showed merger-related charges materially impacting reported efficiency ratio. Management confirmed integration is on track with customer-facing colleague retention ahead of expectations.',
 'Fifth Third Q1 2026 Earnings Release','2026-04-19','Financial Performance','Medium',7);

