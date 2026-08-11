import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon, BankLogo } from '../components/SvgIcons';
import PortfolioKpiCard from '../components/PortfolioKpiCard';
import briefcaseIcon from '../../logo/icons/briefcase-business.svg';
import monitorCogIcon from '../../logo/icons/monitor-cog.svg';
import piggyBankIcon from '../../logo/icons/piggy-bank.svg';
import revenueIcon from '../../logo/icons/chart-no-axes-column-increasing.svg';
import commercialBankIcon from '../../logo/icons/chart-no-axes-combined.svg';
import percentIcon from '../../logo/icons/percent.svg';
import zapIcon from '../../logo/icons/zap.svg';
import businessStrategyIcon from '../../logo/icons/business_strategy.svg';
import shoppingCartIcon from '../../logo/icons/shopping-cart.svg';
import walletIcon from '../../logo/icons/wallet.svg';
import fileTextIcon from '../../logo/icons/file-text.svg';
import cloudIcon from '../../logo/icons/cloud.svg';
import integrationsIcon from '../../logo/icons/integrations.svg';
import stakeholdersIcon from '../../logo/icons/stakeholders.svg';
import userStarIcon from '../../logo/icons/user-star.svg';
import teamIcon from '../../logo/icons/team.svg';
import userPenIcon from '../../logo/icons/user-pen.svg';
import brainIcon from '../../logo/icons/brain.svg';
import { SYNOVUS_ORG, SYNOVUS_OPPORTUNITIES } from '../data/staticData';
import OpportunitiesContent from '../components/OpportunitiesContent';
import {
  fetchAccountById,
  fetchAccountNewsById,
  fetchAccountOrganizationById,
  fetchAccountSignalsById,
} from '../api/accounts';
import appLogoUrl from '../../logo/AccountSignalAI-full-color-4.1.png';
import { generateAccountReportPdf } from '../utils/accountReportPdf';

/* ─── Static account data ─────────────────────────────────────────── */
const TABS = ['Overview','Signals','Opportunities','Organization','News & Events'];

const SYNOVUS_LINKEDIN_BY_NAME = Object.freeze({
  'kevin blair': 'https://www.linkedin.com/in/kevin-blair-849a767/',
  'zack bishop': 'https://www.linkedin.com/in/zackbishop/',
  'vikram ramani': 'https://www.linkedin.com/in/vikramramani/',
  'liz wolverton': 'https://www.linkedin.com/in/liz-wolverton-9212b7146/',
  'shellie creson': 'https://www.linkedin.com/in/shellie-creson-9467495/',
  'jennifer spinks upshaw': 'https://www.linkedin.com/in/jennifer-spinks-upshaw-8622859/',
  'jamie gregory': 'https://www.linkedin.com/in/jamie-gregory-7030455/',
  'allan e kamensky': 'https://www.linkedin.com/in/allan-kamensky-7b9a89203/',
  'dana sanders': 'https://www.linkedin.com/in/dana-sanders-75764b196/',
  'charissa sumerlin': 'https://www.linkedin.com/in/charissa-sumerlin-7138636/',
  'gloria c banks crcm cerp': 'https://www.linkedin.com/in/gloria-c-banks-crcm-cerp-a3b71050/',
  'adam archer': 'https://www.linkedin.com/in/adam-archer-7b20305/',
  'sanjeev jha': 'https://www.linkedin.com/in/sanjeev--jha/',
  'santosh kokate': 'https://www.linkedin.com/in/santoshkokate/',
  'casey toops': 'https://www.linkedin.com/in/caseytoops/',
  'kevin d johnson': 'https://www.linkedin.com/in/k3vindjohnson/',
  'branden hillis': 'https://www.linkedin.com/in/branden-hillis-271418a/',
  'jason olson': 'https://www.linkedin.com/in/agbdf2002/',
  'rob bankston': 'https://www.linkedin.com/in/rob-bankston-45b2a614/',
  'michael robertson': 'https://www.linkedin.com/in/michael-robertson-11a642114/',
  'keith thomas': 'https://www.linkedin.com/in/keith-thomas-73890410/',
  'femi o': 'https://www.linkedin.com/in/femionafowokan/',
  'john e lucas': 'https://www.linkedin.com/in/john-e-lucas/',
  'jeff nicolosi': 'https://www.linkedin.com/in/jeff-nicolosi-8aa31610/',
  'david correa': 'https://www.linkedin.com/in/david-correa-664a9a4/',
  'jeffrey beisler snell ph d ctp phr shrm cp': 'https://www.linkedin.com/in/jeffrey-beisler-snell-ph-d-ctp-phr-shrm-cp-51894084/',
  'chris dodson': 'https://www.linkedin.com/in/chris-dodson-47259113/',
  'julian cornett': 'https://www.linkedin.com/in/juliancornett/',
  'christine antonson': 'https://www.linkedin.com/in/antonson/',
  'gopinath devarajan': 'https://www.linkedin.com/in/gopidev/',
  'grace clark': 'https://www.linkedin.com/in/grace-clark-211bb352/',
  'katherine hamilton': 'https://www.linkedin.com/in/katherinehamilton90/',
  'michaela p': 'https://www.linkedin.com/in/michaelapettway/',
  'sathish madanagopalan': 'https://www.linkedin.com/in/sathish-madan/',
  'sue j nelson crcm amlp': 'https://www.linkedin.com/in/sue-j-nelson-crcm-amlp-132a517/',
});

const SYNOVUS_OPP_OWNER_ENRICHMENT_BY_NAME = Object.freeze({
  'kevin blair': {
    executivePriority: ["Enterprise leadership", "Merger integration oversight", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
    whyItMatters: "Selected for Executive Leadership relevance and executive seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness"],
  },
  'zack bishop': {
    executivePriority: ["Operating model readiness", "Change and delivery execution"],
    whyItMatters: "Selected for Operations, Technology and Integration relevance and executive seniority. No direct opportunity ownership count assigned because Step 3/4 did not map this stakeholder to a specific opportunity.",
    relatedOpportunities: [],
  },
  'vikram ramani': {
    executivePriority: ["Enterprise technology strategy", "Technology modernization", "Systems and brand conversion readiness"],
    whyItMatters: "Selected for Technology relevance and executive seniority. Mapped to 2 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "integration_operating_model_change_and_workforce_enablement"],
  },
  'liz wolverton': {
    executivePriority: ["Digital product and banking platforms", "Client experience continuity"],
    whyItMatters: "Selected for Digital, Product and Customer Experience relevance and executive seniority. No direct opportunity ownership count assigned because Step 3/4 did not map this stakeholder to a specific opportunity.",
    relatedOpportunities: [],
  },
  'shellie creson': {
    executivePriority: ["Risk and compliance governance", "Control and regulatory readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
    whyItMatters: "Selected for Risk relevance and executive seniority. Mapped to 3 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness", "aml_bsa_sanctions_control_and_case_management_readiness"],
  },
  'jennifer spinks upshaw': {
    executivePriority: ["Operating model readiness", "Change and delivery execution"],
    whyItMatters: "Selected for Administration and Shared Services relevance and executive seniority. No direct opportunity ownership count assigned because Step 3/4 did not map this stakeholder to a specific opportunity.",
    relatedOpportunities: [],
  },
  'jamie gregory': {
    executivePriority: ["Finance and reporting controls", "Regulatory and management reporting"],
    whyItMatters: "Selected for Finance relevance and executive seniority. No direct opportunity ownership count assigned because Step 3/4 did not map this stakeholder to a specific opportunity.",
    relatedOpportunities: [],
  },
  'allan e kamensky': {
    executivePriority: ["Risk and compliance governance", "Control and regulatory readiness"],
    whyItMatters: "Selected for Legal and Governance relevance and executive seniority. No direct opportunity ownership count assigned because Step 3/4 did not map this stakeholder to a specific opportunity.",
    relatedOpportunities: [],
  },
  'dana sanders': {
    executivePriority: ["Risk and compliance governance", "Control and regulatory readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
    whyItMatters: "Selected for Internal Audit relevance and executive seniority. Mapped to 3 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness", "aml_bsa_sanctions_control_and_case_management_readiness"],
  },
  'charissa sumerlin': {
    executivePriority: ["Functional leadership", "Opportunity validation", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Credit Risk relevance and executive seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'gloria c banks crcm cerp': {
    executivePriority: ["Risk and compliance governance", "Control and regulatory readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
    whyItMatters: "Selected for Compliance and Ethics relevance and executive seniority. Mapped to 3 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness", "aml_bsa_sanctions_control_and_case_management_readiness"],
  },
  'adam archer': {
    executivePriority: ["Infrastructure and IT operations", "Operational resilience", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Infrastructure and IT Operations relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'sanjeev jha': {
    executivePriority: ["Digital product and banking platforms", "Client experience continuity", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Digital and branch continuity"],
    whyItMatters: "Selected for Product Engineering relevance and svp_vp seniority. Mapped to 3 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "digital_and_branch_channel_conversion_continuity"],
  },
  'santosh kokate': {
    executivePriority: ["Enterprise technology strategy", "Technology modernization", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
    whyItMatters: "Selected for Divisional CIO / Technology Leadership relevance and executive seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness"],
  },
  'casey toops': {
    executivePriority: ["Enterprise technology strategy", "Technology modernization", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Pinnacle CIO / Technology Leadership relevance and executive seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'kevin d johnson': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
    whyItMatters: "Selected for AI and Automation relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness"],
  },
  'branden hillis': {
    executivePriority: ["Merger integration management", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow"],
    whyItMatters: "Selected for Integration Management relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'jason olson': {
    executivePriority: ["Enterprise architecture", "Platform and integration design", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow"],
    whyItMatters: "Selected for Enterprise Architecture relevance and director seniority. Mapped to 2 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion"],
  },
  'rob bankston': {
    executivePriority: ["Integration delivery", "Application development", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Application Development and Delivery relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'michael robertson': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Enterprise data and reporting controls", "Digital and branch continuity"],
    whyItMatters: "Selected for Data Management Services relevance and director seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "enterprise_data_finance_and_regulatory_control_alignment", "digital_and_branch_channel_conversion_continuity", "financial_crime_fraud_scams_disputes_readiness"],
  },
  'keith thomas': {
    executivePriority: ["Cybersecurity and identity", "Conversion control readiness"],
    whyItMatters: "Selected for Cybersecurity / Information Security relevance and executive seniority. Mapped to 1 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["cyber_identity_resilience_and_conversion_controls"],
  },
  'femi o': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
    whyItMatters: "Selected for AI and Automation Governance relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness"],
  },
  'john e lucas': {
    executivePriority: ["Treasury and payments", "Commercial workflow enablement"],
    whyItMatters: "Selected for Treasury Product Management and Development relevance and director seniority. No direct opportunity ownership count assigned because Step 3/4 did not map this stakeholder to a specific opportunity.",
    relatedOpportunities: [],
  },
  'jeff nicolosi': {
    executivePriority: ["Commercial banking growth", "Client relationship enablement", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Commercial Banking / Group Leadership relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'david correa': {
    executivePriority: ["Functional leadership", "Opportunity validation", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow"],
    whyItMatters: "Selected for Capital Markets relevance and svp_vp seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'jeffrey beisler snell ph d ctp phr shrm cp': {
    executivePriority: ["Treasury and payments", "Commercial workflow enablement", "Commercial treasury and ERP workflow"],
    whyItMatters: "Selected for International Banking and Treasury Management relevance and svp_vp seniority. Mapped to 1 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["commercial_treasury_and_erp_connected_workflow_expansion"],
  },
  'chris dodson': {
    executivePriority: ["Enterprise architecture", "Platform and integration design", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Technology, Architecture and Engineering relevance and director seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'julian cornett': {
    executivePriority: ["Enterprise architecture", "Platform and integration design", "Systems and brand conversion readiness", "Digital and branch continuity"],
    whyItMatters: "Selected for Technology, Architecture and Engineering relevance and director seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement", "cyber_identity_resilience_and_conversion_controls"],
  },
  'christine antonson': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Digital and branch continuity"],
    whyItMatters: "Selected for Enterprise Data, Analytics and AI relevance and manager seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "digital_and_branch_channel_conversion_continuity", "integration_operating_model_change_and_workforce_enablement"],
  },
  'gopinath devarajan': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
    whyItMatters: "Selected for Risk, Compliance and Audit relevance and architect_lead seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "enterprise_data_finance_and_regulatory_control_alignment", "integration_operating_model_change_and_workforce_enablement"],
  },
  'grace clark': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
    whyItMatters: "Selected for Risk, Compliance and Audit relevance and director seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "enterprise_data_finance_and_regulatory_control_alignment", "financial_crime_fraud_scams_disputes_readiness", "aml_bsa_sanctions_control_and_case_management_readiness"],
  },
  'katherine hamilton': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
    whyItMatters: "Selected for Enterprise Data, Analytics and AI relevance and architect_lead seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "enterprise_data_finance_and_regulatory_control_alignment", "integration_operating_model_change_and_workforce_enablement"],
  },
  'michaela p': {
    executivePriority: ["Cybersecurity and identity", "Conversion control readiness", "Systems and brand conversion readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
    whyItMatters: "Selected for Cybersecurity, Identity and Operational Resilience relevance and manager seniority. Mapped to 4 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "enterprise_data_finance_and_regulatory_control_alignment", "cyber_identity_resilience_and_conversion_controls", "aml_bsa_sanctions_control_and_case_management_readiness"],
  },
  'sathish madanagopalan': {
    executivePriority: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Digital and branch continuity"],
    whyItMatters: "Selected for Digital, Retail Banking and Client Experience relevance and director seniority. Mapped to 3 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["march_2027_systems_brand_and_client_experience_conversion_readiness", "commercial_treasury_and_erp_connected_workflow_expansion", "digital_and_branch_channel_conversion_continuity"],
  },
  'sue j nelson crcm amlp': {
    executivePriority: ["Risk and compliance governance", "Control and regulatory readiness", "AML/BSA and sanctions readiness"],
    whyItMatters: "Selected for BSA/AML Compliance and Financial Crime relevance and director seniority. Mapped to 1 identified opportunities through Step 3/4 buying-center evidence.",
    relatedOpportunities: ["aml_bsa_sanctions_control_and_case_management_readiness"],
  },
});

const SYNOVUS_KEY_LEADERS = Object.freeze([
  {
    name: "Kevin Blair",
    title: "President and CEO, Pinnacle Financial Partners",
    function: "Executive Leadership",
    initials: "KB",
    bg: "#3b82f6",
    stars: 5,
    opps: 4,
    focus: ["Enterprise leadership", "Merger integration oversight", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
  },
  {
    name: "Zack Bishop",
    title: "Chief Operating Officer",
    function: "Executive Leadership",
    initials: "ZB",
    bg: "#22c55e",
    stars: 5,
    opps: 0,
    focus: ["Operating model readiness", "Change and delivery execution"],
  },
  {
    name: "Vikram Ramani",
    title: "Chief Information Officer",
    function: "Executive Leadership",
    initials: "VR",
    bg: "#8b5cf6",
    stars: 5,
    opps: 2,
    focus: ["Enterprise technology strategy", "Technology modernization", "Systems and brand conversion readiness"],
  },
  {
    name: "Liz Wolverton",
    title: "Chief Digital and Product Solutions Officer",
    function: "Executive Leadership",
    initials: "LW",
    bg: "#f97316",
    stars: 5,
    opps: 0,
    focus: ["Digital product and banking platforms", "Client experience continuity"],
  },
  {
    name: "Shellie Creson",
    title: "Chief Risk Officer at Pinnacle Financial Partners",
    function: "Executive Leadership",
    initials: "SC",
    bg: "#14b8a6",
    stars: 5,
    opps: 3,
    focus: ["Risk and compliance governance", "Control and regulatory readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
  },
  {
    name: "Jennifer Spinks Upshaw",
    title: "EVP, Chief Administrative Officer at Pinnacle Financial Partners",
    function: "Executive Leadership",
    initials: "JU",
    bg: "#2563eb",
    stars: 5,
    opps: 0,
    focus: ["Operating model readiness", "Change and delivery execution"],
  },
  {
    name: "Jamie Gregory",
    title: "Chief Financial Officer",
    function: "Executive Leadership",
    initials: "JG",
    bg: "#16a34a",
    stars: 5,
    opps: 0,
    focus: ["Finance and reporting controls", "Regulatory and management reporting"],
  },
  {
    name: "Allan E. Kamensky",
    title: "Chief Legal Officer",
    function: "Executive Leadership",
    initials: "AK",
    bg: "#7c3aed",
    stars: 5,
    opps: 0,
    focus: ["Risk and compliance governance", "Control and regulatory readiness"],
  },
  {
    name: "Dana Sanders",
    title: "Chief Audit Executive at Pinnacle Financial Partners",
    function: "Executive Leadership",
    initials: "DS",
    bg: "#ea580c",
    stars: 5,
    opps: 3,
    focus: ["Risk and compliance governance", "Control and regulatory readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
  },
  {
    name: "Charissa Sumerlin",
    title: "Chief Credit Officer at Pinnacle Financial Partners",
    function: "Executive Leadership",
    initials: "CS",
    bg: "#0891b2",
    stars: 5,
    opps: 4,
    focus: ["Functional leadership", "Opportunity validation", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "Gloria C Banks, CRCM, CERP",
    title: "EVP, Chief Ethics & Chief Compliance Officer at Synovus",
    function: "Executive Leadership",
    initials: "GC",
    bg: "#ca8a04",
    stars: 5,
    opps: 3,
    focus: ["Risk and compliance governance", "Control and regulatory readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
  },
  {
    name: "Adam Archer",
    title: "Head of Infrastructure and IT Operations at Synovus",
    function: "Technology Leadership",
    initials: "AA",
    bg: "#64748b",
    stars: 4,
    opps: 4,
    focus: ["Infrastructure and IT operations", "Operational resilience", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "Sanjeev Jha",
    title: "Managing Director & Head of Product Development at Pinnacle Financial Partners ✦ Responsible for Product Engineering acr",
    function: "Technology Leadership",
    initials: "SJ",
    bg: "#3b82f6",
    stars: 4,
    opps: 3,
    focus: ["Digital product and banking platforms", "Client experience continuity", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Digital and branch continuity"],
  },
  {
    name: "Santosh Kokate",
    title: "Divisional CIO, Managing Director at Pinnacle Financial Partners",
    function: "Technology Leadership",
    initials: "SK",
    bg: "#22c55e",
    stars: 5,
    opps: 4,
    focus: ["Enterprise technology strategy", "Technology modernization", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
  },
  {
    name: "Casey Toops",
    title: "SVP, Chief Information Officer @ Pinnacle Financial Partners",
    function: "Technology Leadership",
    initials: "CT",
    bg: "#8b5cf6",
    stars: 5,
    opps: 4,
    focus: ["Enterprise technology strategy", "Technology modernization", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "Kevin D. Johnson",
    title: "Head of AI & Automation @ Pinnacle Financial Partners",
    function: "Technology Leadership",
    initials: "KJ",
    bg: "#f97316",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
  },
  {
    name: "Branden Hillis",
    title: "Executive Director; Head of Integration Management",
    function: "Technology Leadership",
    initials: "BH",
    bg: "#14b8a6",
    stars: 4,
    opps: 4,
    focus: ["Merger integration management", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow"],
  },
  {
    name: "Jason Olson",
    title: "Director, Enterprise Architecture @ Pinnacle Financial Partners",
    function: "Technology Leadership",
    initials: "JO",
    bg: "#2563eb",
    stars: 5,
    opps: 2,
    focus: ["Enterprise architecture", "Platform and integration design", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow"],
  },
  {
    name: "Rob Bankston",
    title: "Executive Director, Application Development and Delivery",
    function: "Technology Leadership",
    initials: "RB",
    bg: "#16a34a",
    stars: 5,
    opps: 4,
    focus: ["Integration delivery", "Application development", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "Michael Robertson",
    title: "Senior I.T. Director, Data Management Services at Synovus",
    function: "Technology Leadership",
    initials: "MR",
    bg: "#7c3aed",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Enterprise data and reporting controls", "Digital and branch continuity"],
  },
  {
    name: "Keith Thomas",
    title: "CISO",
    function: "Technology Leadership",
    initials: "KT",
    bg: "#ea580c",
    stars: 5,
    opps: 1,
    focus: ["Cybersecurity and identity", "Conversion control readiness"],
  },
  {
    name: "Femi O.",
    title: "SVP, Director AI and Automation Governance at Pinnacle Financial Partners",
    function: "Technology Leadership",
    initials: "FO",
    bg: "#0891b2",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
  },
  {
    name: "John E. Lucas",
    title: "Director of Product Management and Development, Treasury and Payment Solutions",
    function: "Business Leadership",
    initials: "JL",
    bg: "#ca8a04",
    stars: 3,
    opps: 0,
    focus: ["Treasury and payments", "Commercial workflow enablement"],
  },
  {
    name: "Jeff Nicolosi",
    title: "Managing Director & Group Head at Synovus",
    function: "Business Leadership",
    initials: "JN",
    bg: "#64748b",
    stars: 4,
    opps: 4,
    focus: ["Commercial banking growth", "Client relationship enablement", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "David Correa",
    title: "Managing Director, Capital Markets at Synovus",
    function: "Business Leadership",
    initials: "DC",
    bg: "#3b82f6",
    stars: 4,
    opps: 4,
    focus: ["Functional leadership", "Opportunity validation", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow"],
  },
  {
    name: "Jeffrey Beisler-Snell, Ph.D., CTP, PHR, SHRM-CP",
    title: "Ph.D.",
    function: "Business Leadership",
    initials: "JC",
    bg: "#22c55e",
    stars: 4,
    opps: 1,
    focus: ["Treasury and payments", "Commercial workflow enablement", "Commercial treasury and ERP workflow"],
  },
  {
    name: "Chris Dodson",
    title: "Director, Information Technology",
    function: "Opportunity Owners",
    initials: "CD",
    bg: "#8b5cf6",
    stars: 5,
    opps: 4,
    focus: ["Enterprise architecture", "Platform and integration design", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "Julian Cornett",
    title: "Director, Secretary, Treasurer at Pinnacle Technology USA, Inc.",
    function: "Opportunity Owners",
    initials: "JC",
    bg: "#f97316",
    stars: 5,
    opps: 4,
    focus: ["Enterprise architecture", "Platform and integration design", "Systems and brand conversion readiness", "Digital and branch continuity"],
  },
  {
    name: "Christine Antonson",
    title: "Product Innovation & Integration, Program Manager",
    function: "Opportunity Owners",
    initials: "CA",
    bg: "#14b8a6",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Digital and branch continuity"],
  },
  {
    name: "Gopinath Devarajan",
    title: "Data & AI Executive",
    function: "Opportunity Owners",
    initials: "GD",
    bg: "#2563eb",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
  },
  {
    name: "Grace Clark",
    title: "Senior Director of Model Risk & Data Governance at Pinnacle Financial Partners",
    function: "Opportunity Owners",
    initials: "GC",
    bg: "#16a34a",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
  },
  {
    name: "Katherine Hamilton",
    title: "Lead, Executive Reporting & Integration (COO Org)",
    function: "Opportunity Owners",
    initials: "KH",
    bg: "#7c3aed",
    stars: 4,
    opps: 4,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Enterprise data and reporting controls"],
  },
  {
    name: "Michaela P.",
    title: "Program Manager",
    function: "Opportunity Owners",
    initials: "MP",
    bg: "#ea580c",
    stars: 4,
    opps: 4,
    focus: ["Cybersecurity and identity", "Conversion control readiness", "Systems and brand conversion readiness", "Enterprise data and reporting controls", "AML/BSA and sanctions readiness"],
  },
  {
    name: "Sathish Madanagopalan",
    title: "Director, Product Engineering",
    function: "Opportunity Owners",
    initials: "SM",
    bg: "#0891b2",
    stars: 5,
    opps: 3,
    focus: ["Data, analytics and AI", "Reporting and data governance", "Systems and brand conversion readiness", "Commercial treasury and ERP workflow", "Digital and branch continuity"],
  },
  {
    name: "Sue J Nelson, CRCM, AMLP",
    title: "Director BSA/AML Compliance- Corporate BSA/AML Officer at Synovus Financial Corp",
    function: "Opportunity Owners",
    initials: "SA",
    bg: "#ca8a04",
    stars: 4,
    opps: 1,
    focus: ["Risk and compliance governance", "Control and regulatory readiness", "AML/BSA and sanctions readiness"],
  },
]);

const synovusLeaderHasRelatedOpportunities = (leader) => {
  const key = normalizeStakeholderName(leader?.name);
  const fromEnrichment = SYNOVUS_OPP_OWNER_ENRICHMENT_BY_NAME[key]?.relatedOpportunities;
  if (Array.isArray(fromEnrichment)) return fromEnrichment.length > 0;
  return Number(leader?.opps ?? 0) > 0;
};

// Key Leaders tab: only people with at least one related opportunity.
const SYNOVUS_KEY_LEADERS_TO_ENGAGE = Object.freeze(
  SYNOVUS_KEY_LEADERS.filter((leader) => synovusLeaderHasRelatedOpportunities(leader)),
);

// People with an empty Related Opportunities column, filed by Leadership Group.
const SYNOVUS_LEADERS_BY_GROUP = Object.freeze(
  SYNOVUS_KEY_LEADERS
    .filter((leader) => !synovusLeaderHasRelatedOpportunities(leader))
    .reduce((acc, leader) => {
      const groupKey = normalizeStakeholderName(leader?.function);
      if (!groupKey) return acc;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(leader);
      return acc;
    }, {}),
);

const SYNOVUS_RELATED_OPP_TITLE_ALIASES = Object.freeze({
  // Supabase rank labels -> demo opportunity titles shown in UI
  'march 2027 systems brand and client experience conversion readiness': [
    'Merger Conversion Assurance & Client Experience Command Center',
    'FIS Core & Deposit Conversion Readiness Assessment',
  ],
  'commercial treasury and erp connected workflow expansion': [
    'Treasury Payments and Synovus Gateway Enablement',
    'Commercial Lending Workflow Optimization on nCino',
  ],
  'digital and branch channel conversion continuity': [
    'Digital Banking Continuity and Customer Migration Readiness',
  ],
  // Explicitly remove this from demo mappings
  'integration operating model change and workforce enablement': [],
  'enterprise data finance and regulatory control alignment': [
    'Merger Conversion Assurance & Client Experience Command Center',
    'FIS Core & Deposit Conversion Readiness Assessment',
  ],
  'cyber identity resilience and conversion controls': [
    'Cybersecurity IAM and Conversion Resilience',
  ],
  'financial crime fraud scams disputes readiness': [
    'Fraud AI/ML and Payment-Risk Controls',
  ],
  'aml bsa sanctions control and case management readiness': [
    'Fraud AI/ML and Payment-Risk Controls',
  ],
  'ai enabled operating leverage and productivity execution readiness': [
    'Governed AI Productivity and Knowledge Enablement',
  ],
  'application rationalization supplier optimization and managed services simplification': [
    'Application Rationalization and Vendor Optimization Assessment',
  ],
});

function normalizeStakeholderName(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getStakeholderLinkedInUrl(accountName, stakeholderName) {
  if (!accountName || !/synovus/i.test(accountName)) return null;
  return SYNOVUS_LINKEDIN_BY_NAME[normalizeStakeholderName(stakeholderName)] ?? null;
}

function LinkedInIconLink({ url, stakeholderName }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open ${stakeholderName} LinkedIn profile`}
      aria-label={`Open ${stakeholderName} LinkedIn profile`}
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        background: '#0A66C2',
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        flexShrink: 0,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <span style={{ fontSize: 9, fontWeight: 700, lineHeight: 1 }}>in</span>
    </a>
  );
}

/* ─── OVERVIEW TAB ────────────────────────────────────────────────── */
function OverviewTab({ acct }) {
  const aboutText = acct.about ?? '—';
  const productsText = acct.products ?? '—';
  const servicesText = acct.services ?? '—';
  const strategyText = acct.businessStrategy ?? '—';
  const retailBankText = acct.retailBank ?? '—';
  const commercialBankText = acct.commercialBank ?? '—';
  const wealthBankText = acct.wealthBank ?? '—';
  const competitiveRows = Array.isArray(acct.competitiveLandscape) ? acct.competitiveLandscape : [];
  const capabilityList = String(acct.capabilities ?? '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const hasFinancials = [acct.assetSize, acct.revenue, acct.nim, acct.efficiencyRatio]
    .some((v) => v != null && String(v).trim() && String(v).trim() !== '—');
  const hasStrategy = strategyText && strategyText !== '—';
  const hasSegments = [retailBankText, commercialBankText, wealthBankText]
    .some((t) => t && t !== '—');

  return (
    <div className="animate-in">
      {/* Info cards */}
      <div className="portfolio-kpi-grid portfolio-kpi-grid--3">
        {[
          {
            label: 'About',
            variant: 'accounts',
            sub: aboutText,
          },
          {
            label: 'Products',
            variant: 'opportunity-value',
            icon: briefcaseIcon,
            sub: productsText,
          },
          {
            label: 'Services',
            variant: 'high-value',
            icon: monitorCogIcon,
            sub: servicesText,
          },
        ].map((kpi, i) => (
          <PortfolioKpiCard
            key={kpi.label}
            kpi={kpi}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          />
        ))}
      </div>

      {capabilityList.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Capabilities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {capabilityList.map((cap) => (
              <span
                key={cap}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#1e40af',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid #bfdbfe',
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Financials */}
      {hasFinancials && (
      <div style={{marginBottom:20}}>
        <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:12}}>Key Financials</h3>
        <div className="asi-financials">
          {[
            { label:'Asset Size',       value:acct.assetSize ?? '—',        icon: piggyBankIcon,  bg:'#fdf2f8', iconSize: 21 },
            { label:'Revenue',          value:acct.revenue ?? '—',          icon: revenueIcon,    bg:'#f0fdf4' },
            { label:'NIM',              value:acct.nim ?? '—',              icon: percentIcon,    bg:'#fef9c3' },
            { label:'Efficiency Ratio', value:acct.efficiencyRatio ?? '—',  icon: zapIcon,        bg:'#f5f3ff' },
          ].map(f=>(
            <div key={f.label} className="asi-financial">
              <div className="asi-financial__icon" style={{background:f.bg}}>
                <img src={f.icon} alt="" width={f.iconSize ?? 20} height={f.iconSize ?? 20} aria-hidden />
              </div>
              <div>
                <p className="asi-financial__label">{f.label}</p>
                <p className="asi-financial__value">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Business Strategy */}
      {hasStrategy && (
      <div className="asi-strategy">
        <div className="asi-strategy__icon"><img src={businessStrategyIcon} alt="" width={24} height={24} aria-hidden /></div>
        <div>
          <h3 className="asi-strategy__title">Business Strategy</h3>
          <p className="asi-strategy__text">{strategyText}</p>
        </div>
      </div>
      )}

      {/* Competitive Landscape */}
      {competitiveRows.length > 0 && (
      <div style={{marginBottom:20}}>
        <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:12}}>Competitive Landscape</h3>
        <div className="asi-card" style={{overflow:'hidden'}}>
          <table className="asi-table overview-comp-table">
            <thead><tr>
              <th style={{ fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>Bank</th>
              <th style={{ textAlign: 'center', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>Asset Size</th>
              <th style={{ textAlign: 'center', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>Revenue</th>
              <th style={{ textAlign: 'center', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>Efficiency Ratio</th>
            </tr></thead>
            <tbody>
              {competitiveRows.map((r)=>(
                <tr key={`${r.bankName}-${r.assetSize}-${r.revenue}-${r.efficiencyRatio}`}>
                  <td><div style={{display:'flex',alignItems:'center',gap:10}}><BankLogo name={r.bankName} size={28}/><span style={{fontWeight:500}}>{r.bankName}</span></div></td>
                  <td style={{textAlign:'center'}}>{r.assetSize}</td>
                  <td style={{textAlign:'center'}}>{r.revenue}</td>
                  <td style={{textAlign:'center'}}>{r.efficiencyRatio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Business Segments */}
      {hasSegments && (
      <div className="asi-info-grid">
        {[
          { title:'Retail Bank',       icon: shoppingCartIcon,   color:'blue',  bg:'#eff6ff',
            text: retailBankText },
          { title:'Commercial Bank',   icon: commercialBankIcon, color:'green', bg:'#f0fdf4',
            text: commercialBankText },
          { title:'Wealth Bank',       icon: walletIcon,         color:'purple',bg:'#f5f3ff',
            text: wealthBankText },
        ].map(c=>(
          <div key={c.title} className={`asi-info-card asi-info-card--${c.color}`}>
            <div className="asi-info-card__head">
              <div className="asi-info-card__icon" style={{background:c.bg}}><img src={c.icon} alt="" width={20} height={20} aria-hidden /></div>
              <h3 className="asi-info-card__title">{c.title}</h3>
            </div>
            <p className="asi-info-card__text">{c.text}</p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

/* ─── SIGNALS TAB ─────────────────────────────────────────────────── */
const SIG_STYLE_BY_TITLE = [
  { match: /growth strategy/i, color: 'blue', icon: 'trend' },
  { match: /operational efficiency/i, color: 'green', icon: 'gear' },
  { match: /profitability/i, color: 'purple', icon: 'people' },
  { match: /loan growth/i, color: 'orange', icon: 'brief' },
  { match: /deposit growth/i, color: 'purple', icon: 'person' },
  { match: /technology/i, color: 'teal', icon: 'cloud' },
];
const SIG_STYLE_FALLBACK = [
  { color: 'blue', icon: 'trend' },
  { color: 'green', icon: 'gear' },
  { color: 'purple', icon: 'people' },
  { color: 'orange', icon: 'brief' },
  { color: 'teal', icon: 'person' },
  { color: 'blue', icon: 'cloud' },
];
const SIG_ICON_ASSETS = {
  trend: commercialBankIcon,
  gear: integrationsIcon,
  people: shoppingCartIcon,
  brief: briefcaseIcon,
  person: walletIcon,
  cloud: cloudIcon,
};
const SIG_COLORS = {
  blue:   {border:'#2563eb',bg:'#eff6ff',ic:'#2563eb'},
  green:  {border:'#16a34a',bg:'#f0fdf4',ic:'#16a34a'},
  purple: {border:'#7c3aed',bg:'#f5f3ff',ic:'#7c3aed'},
  orange: {border:'#ea580c',bg:'#fff7ed',ic:'#ea580c'},
  teal:   {border:'#0891b2',bg:'#ecfeff',ic:'#0891b2'},
};

function resolveSignalStyle(title, index) {
  const matched = SIG_STYLE_BY_TITLE.find((entry) => entry.match.test(title));
  if (matched) return matched;
  return SIG_STYLE_FALLBACK[index % SIG_STYLE_FALLBACK.length];
}

function SignalsTab({ accountId }) {
  const [businessSummary, setBusinessSummary] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!accountId) {
        setBusinessSummary(null);
        setCards([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const data = await fetchAccountSignalsById(accountId);
        if (!cancelled) {
          setBusinessSummary(data.businessSummary);
          setCards(data.cards);
        }
      } catch (err) {
        console.error('Failed to load account signals', err);
        if (!cancelled) {
          setBusinessSummary(null);
          setCards([]);
          setError(err?.message || 'Failed to load signals');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  if (isLoading) {
    return <div className="animate-in" style={{ color: '#64748b', fontSize: 13 }}>Loading signals…</div>;
  }

  if (error) {
    return <div className="animate-in" style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div>;
  }

  const summaryHeading =
    businessSummary && typeof businessSummary === 'object'
      ? String(businessSummary.heading ?? '').trim()
      : '';
  const summaryPoints =
    businessSummary && typeof businessSummary === 'object' && Array.isArray(businessSummary.points)
      ? businessSummary.points.map((point) => String(point ?? '').trim()).filter(Boolean)
      : [];
  const summaryText =
    typeof businessSummary === 'string'
      ? businessSummary
      : '';
  const operatingPriorities =
    businessSummary && typeof businessSummary === 'object' && Array.isArray(businessSummary.operatingPriorities)
      ? businessSummary.operatingPriorities.map((item) => String(item ?? '').trim()).filter(Boolean)
      : [];
  const postureStatements =
    businessSummary && typeof businessSummary === 'object' && Array.isArray(businessSummary.postureStatements)
      ? businessSummary.postureStatements.map((item) => String(item ?? '').trim()).filter(Boolean)
      : [];
  const confidenceLabel =
    businessSummary && typeof businessSummary === 'object'
      ? String(businessSummary.confidence ?? '').trim()
      : '';
  const confidenceTone = (() => {
    const normalized = confidenceLabel.toLowerCase();
    // 180° scale: 0–60 Low, 60–120 Medium, 120–180 High.
    // Needle points to each segment midpoint.
    if (normalized.includes('very high')) return { label: 'Very High', bucket: 'high', meterDegree: 165, color: '#15803d' };
    if (normalized.includes('high')) return { label: 'High', bucket: 'high', meterDegree: 150, color: '#16a34a' };
    if (normalized.includes('medium')) return { label: 'Medium', bucket: 'medium', meterDegree: 90, color: '#ca8a04' };
    if (normalized.includes('low')) return { label: 'Low', bucket: 'low', meterDegree: 30, color: '#f97316' };
    return { label: confidenceLabel || 'High', bucket: 'high', meterDegree: 150, color: '#16a34a' };
  })();
  const confidenceNeedleDeg = -180 + confidenceTone.meterDegree;
  const verticalBoxSections =
    businessSummary && typeof businessSummary === 'object' && Array.isArray(businessSummary.verticalBoxSections)
      ? businessSummary.verticalBoxSections
        .map((section) => ({
          heading: String(section?.heading ?? '').trim(),
          text: String(section?.text ?? '').trim(),
        }))
        .filter((section) => section.heading || section.text)
      : [];
  const hasStructuredSummary = Boolean(
    summaryHeading
    || summaryPoints.length > 0
    || operatingPriorities.length > 0
    || postureStatements.length > 0
    || verticalBoxSections.length > 0
    || confidenceLabel,
  );

  return (
    <div className="animate-in">
      {businessSummary && hasStructuredSummary ? (
        <div
          className="asi-signals-bento"
          style={{
            marginBottom: 24,
            background: 'linear-gradient(135deg, rgba(96, 176, 232, 0.03) 0%, rgba(37, 99, 235, 0.06) 35%, rgba(0, 89, 207, 0.09) 70%, rgba(0, 89, 207, 0.1) 100%)',
          }}
        >
          <div className="asi-signals-bento__left-column">
            <article className="asi-signals-bento__card asi-signals-bento__card--primary">
              <div className="asi-signals-bento__header">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1px solid rgba(37, 99, 235, 0.18)',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img src={fileTextIcon} alt="" width={16} height={16} aria-hidden style={{ display: 'block' }} />
                </div>
                <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',margin:0}}>
                  {summaryHeading || 'Executive Account summary'}
                </h3>
              </div>
              {summaryPoints.length > 0 ? (
                <ul className="asi-chic-list asi-chic-list--executive-summary">
                  {summaryPoints.map((point, index) => (
                    <li className="asi-chic-list__item" key={`${index}-${point.slice(0, 24)}`}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p style={{fontSize:13,color:'#334155',lineHeight:1.7,margin:0}}>{summaryText}</p>
              )}
            </article>
            <article className="asi-signals-bento__card asi-signals-bento__card--tertiary">
              <div className="asi-signals-bento__header">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1px solid rgba(37, 99, 235, 0.18)',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img src={brainIcon} alt="" width={16} height={16} aria-hidden style={{ display: 'block' }} />
                </div>
                <h4 className="asi-signals-bento__side-title" style={{ margin: 0 }}>Strategic Posture</h4>
              </div>
              <ul className="asi-chic-list asi-chic-list--tight">
                {postureStatements.map((item, index) => (
                  <li className="asi-chic-list__item" key={`posture-left-${index}-${item.slice(0, 24)}`}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="asi-signals-bento__right-column">
            <div className="asi-signals-bento__right-top-grid">
              <article className="asi-signals-bento__card asi-signals-bento__mini-card">
                <h4 className="asi-signals-bento__side-title">Operating Priorities</h4>
                <ul className="asi-chic-list asi-chic-list--tight">
                  {operatingPriorities.map((item, index) => (
                    <li className="asi-chic-list__item" key={`op-${index}-${item.slice(0, 24)}`}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="asi-signals-bento__card asi-signals-bento__mini-card asi-signals-bento__mini-card--meter">
                <h4 className="asi-signals-bento__side-title" style={{ margin: 0 }}>
                  Confidence Meter : <span className="asi-confidence-meter__title-value" style={{ color: confidenceTone.color }}>{confidenceTone.label}</span>
                </h4>
                <div className="asi-confidence-meter" role="img" aria-label={`Confidence level ${confidenceTone.label}`}>
                  <div className="asi-confidence-meter__arc" />
                  <div className="asi-confidence-meter__needle-wrap">
                    <div
                      className="asi-confidence-meter__needle"
                      style={{ transform: `rotate(${confidenceNeedleDeg}deg)` }}
                    />
                  </div>
                  <div className="asi-confidence-meter__hub" />
                </div>
                <div className="asi-confidence-meter__scale" aria-hidden>
                  <span className={`asi-confidence-meter__tick${confidenceTone.bucket === 'low' ? ' active' : ''}`}>Low</span>
                  <span className={`asi-confidence-meter__tick${confidenceTone.bucket === 'medium' ? ' active' : ''}`}>Medium</span>
                  <span className={`asi-confidence-meter__tick${confidenceTone.bucket === 'high' ? ' active' : ''}`}>High</span>
                </div>
              </article>
            </div>
            <article className="asi-signals-bento__card asi-signals-bento__card--secondary">
              <h4 className="asi-signals-bento__side-title">Strategy and Intelligence</h4>
              {verticalBoxSections.length > 0 ? (
                <div className="asi-vertical-panel">
                  {verticalBoxSections.map((section, index) => (
                    <section className="asi-vertical-panel__item" key={`${index}-${section.heading.slice(0, 24)}`}>
                      {section.heading ? <p className="asi-vertical-panel__heading">{section.heading}</p> : null}
                      {section.text ? <p className="asi-vertical-panel__text">{section.text}</p> : null}
                    </section>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                  No additional strategy sections available.
                </p>
              )}
            </article>
          </div>
        </div>
      ) : businessSummary ? (
        <div
          className="asi-summary-card"
          style={{
            marginBottom: 24,
            background: 'linear-gradient(135deg, rgba(96, 176, 232, 0.03) 0%, rgba(37, 99, 235, 0.06) 35%, rgba(0, 89, 207, 0.09) 70%, rgba(0, 89, 207, 0.1) 100%)',
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid rgba(37, 99, 235, 0.18)',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img src={fileTextIcon} alt="" width={26} height={26} aria-hidden style={{ display: 'block' }} />
          </div>
          <div>
            <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:6}}>Executive Account summary</h3>
            <p style={{fontSize:13,color:'#334155',lineHeight:1.7}}>{summaryText}</p>
          </div>
        </div>
      ) : null}

      <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:14}}>Signal Inventory</h3>
      {cards.length === 0 ? (
        <p style={{ fontSize: 13, color: '#64748b' }}>No signal cards available for this account.</p>
      ) : (
        <div className={`asi-signal-grid asi-signal-grid--count-${Math.min(cards.length, 6)}`}>
          {cards.map((card, index) => {
            const style = resolveSignalStyle(card.title, index);
            const col = SIG_COLORS[style.color] || SIG_COLORS.blue;
            const iconSrc = SIG_ICON_ASSETS[style.icon] || integrationsIcon;
            return (
              <div key={card.id} className={`asi-signal-card asi-signal-card--${style.color}`}>
                <div className="asi-signal-card__head">
                  <div className="asi-signal-card__icon" style={{background:col.bg}}>
                    <img src={iconSrc} alt="" width={20} height={20} aria-hidden />
                  </div>
                </div>
                <h4 className="asi-signal-card__title">{card.title}</h4>
                <p className="asi-signal-card__desc">{card.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── OPPORTUNITIES TAB ───────────────────────────────────────────── */
function OpportunitiesTab({ account }) {
  return (
    <div className="animate-in">
      <OpportunitiesContent account={account} isLoading={!account} />
    </div>
  );
}

/* ─── ORGANIZATION TAB ────────────────────────────────────────────── */
const EMPTY_ORG = {
  kpis: {
    totalStakeholders: 0,
    executiveLeaders: 0,
    technologyLeaders: 0,
    opportunityOwners: 0,
  },
  tabs: [
    { key: 'executive_leadership', label: 'Executive Leadership', icon: 'people', people: [], viewAllLabel: 'View All Executive Leadership (0)' },
    { key: 'technology_leadership', label: 'Technology Leadership', icon: 'trend', people: [], viewAllLabel: 'View All Technology Leadership (0)' },
    { key: 'business_leadership', label: 'Business Leadership', icon: 'bank', people: [], viewAllLabel: 'View All Business Leadership (0)' },
    { key: 'opportunity_owners', label: 'Opportunity Owners', icon: 'revenue', people: [], viewAllLabel: 'View All Opportunity Owners (0)' },
  ],
  topOpportunityOwners: [],
  pending: false,
};

function PendingDataPanel({ title, detail }) {
  return (
    <div
      className="animate-in"
      style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: 'var(--card-shadow)',
        padding: '48px 28px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</p>
      <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.45 }}>
        {detail}
      </p>
    </div>
  );
}

function OrganizationTab({ accountId, name, opportunities = [] }) {
  const ORGANIZATION_OPP_OWNERS_TAB_LABEL = 'Key Leaders to Engage';
  const SCROLL_TOP_OFFSET_PX = 110;
  const navigate = useNavigate();
  const [activeOrgTab, setActiveOrgTab] = React.useState(0);
  const [expandedOpp, setExpandedOpp] = React.useState(null);
  const [scrollToOppCardIndex, setScrollToOppCardIndex] = React.useState(null);
  const [hoveredOppId, setHoveredOppId] = React.useState(null);
  const [orgData, setOrgData] = React.useState(EMPTY_ORG);
  const [isLoadingOrg, setIsLoadingOrg] = React.useState(true);
  const expandedOppPanelRef = React.useRef(null);
  const topOppCardRefs = React.useRef(new Map());

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!accountId) {
        setOrgData(EMPTY_ORG);
        setIsLoadingOrg(false);
        return;
      }
      setIsLoadingOrg(true);
      try {
        const org = await fetchAccountOrganizationById(accountId);
        if (!cancelled) {
          const isPending = Boolean(org?.pending);
          setOrgData({
            kpis: org?.kpis ?? EMPTY_ORG.kpis,
            tabs: isPending
              ? []
              : (Array.isArray(org?.tabs) && org.tabs.length > 0 ? org.tabs : EMPTY_ORG.tabs),
            topOpportunityOwners: Array.isArray(org?.topOpportunityOwners) ? org.topOpportunityOwners : [],
            pending: isPending,
          });
          setActiveOrgTab(0);
          setExpandedOpp(null);
          setHoveredOppId(null);
        }
      } catch (err) {
        console.error('Failed to load organization', err);
        if (!cancelled) setOrgData(EMPTY_ORG);
      } finally {
        if (!cancelled) setIsLoadingOrg(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  const isOpportunityOwnersTabEntry = React.useCallback((entry) => {
    const key = String(entry?.key ?? '').toLowerCase();
    const label = String(entry?.label ?? '').toLowerCase();
    return key === 'opportunity_owners'
      || label === 'opportunity owners'
      || label === 'key leaders to engage';
  }, []);
  const orderedOrgTabs = React.useMemo(() => {
    const tabs = Array.isArray(orgData.tabs) ? orgData.tabs : [];
    const renamed = tabs.map((entry) => (
      isOpportunityOwnersTabEntry(entry)
        ? { ...entry, label: ORGANIZATION_OPP_OWNERS_TAB_LABEL }
        : entry
    ));
    const owners = renamed.filter((entry) => isOpportunityOwnersTabEntry(entry));
    const others = renamed.filter((entry) => !isOpportunityOwnersTabEntry(entry));
    return [...owners, ...others];
  }, [orgData.tabs, isOpportunityOwnersTabEntry]);
  const tab = orderedOrgTabs[activeOrgTab] ?? orderedOrgTabs[0];
  const isOpportunityOwnersTab = isOpportunityOwnersTabEntry(tab);
  const isSynovusOpportunityOwnersTab = /synovus/i.test(String(name ?? '')) && isOpportunityOwnersTab;
  const compactTablePaddingX = isOpportunityOwnersTab ? 14 : 20;
  const compactTablePaddingY = isOpportunityOwnersTab ? 10 : 14;
  const stakeholderGridColumns = isSynovusOpportunityOwnersTab
    ? '230px minmax(190px,1fr) minmax(250px,1.35fr) 90px'
    : '240px 210px 170px 1fr 110px 100px';
  const stakeholderColumnGapPx = isSynovusOpportunityOwnersTab ? 2 : 1;
  const stakeholderHeaders = isSynovusOpportunityOwnersTab
    ? ['Stakeholder', 'Executive Priority', 'Related Opportunities', 'Influence']
    : ['Stakeholder', 'Title', 'Function', 'Executive Priority', 'Opportunities', 'Influence'];

  const stars = (n) => Array.from({length:5}, (_, i) => (
    <span key={i} style={{color: i < n ? '#f59e0b' : '#e2e8f0', fontSize:15}}>★</span>
  ));

  const isSynovusOrg = /synovus/i.test(String(name ?? ''));
  const synovusKeyLeadersCount = SYNOVUS_KEY_LEADERS_TO_ENGAGE.length;
  const kpis = isSynovusOrg
    ? [
      {
        label: 'Total Stakeholders',
        value: orgData.kpis.totalStakeholders,
        sub: 'Across all functions',
        icon: stakeholdersIcon,
        color: '#eff6ff',
        gradient: 'linear-gradient(135deg, rgba(96, 176, 232, 0.03) 0%, rgba(37, 99, 235, 0.06) 35%, rgba(0, 89, 207, 0.09) 70%, rgba(0, 89, 207, 0.1) 100%)',
      },
      {
        label: 'Key Leaders to Engage',
        value: synovusKeyLeadersCount,
        sub: 'Priority engagement targets',
        icon: teamIcon,
        color: '#fff7ed',
        gradient: 'linear-gradient(135deg, rgba(254, 226, 226, 0.03) 0%, rgba(252, 165, 165, 0.06) 35%, rgba(239, 68, 68, 0.09) 70%, rgba(220, 38, 38, 0.1) 100%)',
      },
      {
        label: 'Executive Leaders',
        value: orgData.kpis.executiveLeaders,
        sub: 'CxO / SVP / EVP',
        icon: userStarIcon,
        color: '#f0fdf4',
        gradient: 'linear-gradient(135deg, rgba(204, 251, 196, 0.03) 0%, rgba(130, 209, 115, 0.06) 35%, rgba(36, 158, 70, 0.09) 70%, rgba(36, 158, 70, 0.1) 100%)',
      },
      {
        label: 'Technology Leaders',
        value: orgData.kpis.technologyLeaders,
        sub: 'Technology leadership',
        icon: userPenIcon,
        color: '#faf5ff',
        gradient: 'linear-gradient(135deg, rgba(237, 233, 254, 0.03) 0%, rgba(196, 181, 253, 0.06) 35%, rgba(139, 92, 246, 0.09) 70%, rgba(109, 40, 217, 0.1) 100%)',
      },
    ]
    : [
    {
      label:'Total Stakeholders',
      value:orgData.kpis.totalStakeholders,
      sub:'Across all functions',
      icon: stakeholdersIcon,
      color:'#eff6ff',
      gradient:'linear-gradient(135deg, rgba(96, 176, 232, 0.03) 0%, rgba(37, 99, 235, 0.06) 35%, rgba(0, 89, 207, 0.09) 70%, rgba(0, 89, 207, 0.1) 100%)',
    },
    {
      label:'Executive Leaders',
      value:orgData.kpis.executiveLeaders,
      sub:'CxO / SVP / EVP',
      icon: userStarIcon,
      color:'#f0fdf4',
      gradient:'linear-gradient(135deg, rgba(204, 251, 196, 0.03) 0%, rgba(130, 209, 115, 0.06) 35%, rgba(36, 158, 70, 0.09) 70%, rgba(36, 158, 70, 0.1) 100%)',
    },
    {
      label:'Technology Leaders',
      value:orgData.kpis.technologyLeaders,
      sub:'Technology leadership',
      icon: userPenIcon,
      color:'#faf5ff',
      gradient:'linear-gradient(135deg, rgba(237, 233, 254, 0.03) 0%, rgba(196, 181, 253, 0.06) 35%, rgba(139, 92, 246, 0.09) 70%, rgba(109, 40, 217, 0.1) 100%)',
    },
    {
      label:'Opportunity Owners',
      value:orgData.kpis.opportunityOwners,
      sub:'Mapped to opportunities',
      icon: teamIcon,
      color:'#fff7ed',
      gradient:'linear-gradient(135deg, rgba(254, 226, 226, 0.03) 0%, rgba(252, 165, 165, 0.06) 35%, rgba(239, 68, 68, 0.09) 70%, rgba(220, 38, 38, 0.1) 100%)',
    },
  ];

  const engagementColor = (e) => e==='Very High' ? '#16a34a' : e==='High' ? '#2563eb' : '#94a3b8';
  const formatOpportunityTitle = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw) return 'Untitled Opportunity';
    if (raw.includes('_')) {
      return raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    }
    return raw;
  };
  const resolveSynovusRelatedOpportunityTitles = (values = []) => {
    const resolved = [];
    values.forEach((rawValue) => {
      const normalized = normalizeStakeholderName(String(rawValue ?? '').replace(/_/g, ' '));
      const aliased = SYNOVUS_RELATED_OPP_TITLE_ALIASES[normalized];
      if (Array.isArray(aliased)) {
        aliased.forEach((title) => {
          if (title && !resolved.includes(title)) resolved.push(title);
        });
        return;
      }
      const formatted = formatOpportunityTitle(rawValue);
      if (formatted && !resolved.includes(formatted)) resolved.push(formatted);
    });
    return resolved;
  };
  const normalizeOpportunityLookupKey = (value) => (
    String(value ?? '')
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  );
  const stakeholderPool = React.useMemo(() => {
    const merged = [];
    const seen = new Set();
    for (const orgTab of orgData.tabs ?? []) {
      for (const person of orgTab.people ?? []) {
        const key = String(person?.name ?? '').trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        merged.push(person);
      }
    }
    return merged;
  }, [orgData.tabs]);
  const complexityMetaFromOpportunity = (opp) => {
    const confidence = Number(opp?.confidenceScore);
    if (Number.isFinite(confidence) && confidence > 0) {
      if (confidence >= 4.5) return { complexity: 5, complexityLabel: 'High' };
      if (confidence >= 3.5) return { complexity: 4, complexityLabel: 'High' };
      if (confidence >= 2.5) return { complexity: 3, complexityLabel: 'Medium' };
      return { complexity: 2, complexityLabel: 'Low' };
    }
    const priority = String(opp?.priority ?? '').toLowerCase();
    if (priority.includes('high')) return { complexity: 4, complexityLabel: 'High' };
    if (priority.includes('medium')) return { complexity: 3, complexityLabel: 'Medium' };
    return { complexity: 2, complexityLabel: 'Low' };
  };
  const budgetVisibilityFromDealSize = (dealSize) => {
    const values = String(dealSize ?? '')
      .match(/[\d.]+/g)
      ?.map(Number)
      .filter((value) => Number.isFinite(value)) ?? [];
    const max = values.length ? Math.max(...values) : 0;
    if (max >= 8) return 'High';
    if (max >= 3) return 'Medium';
    return 'Low';
  };
  const engagementLabelFromInfluence = (influence) => (
    influence >= 5 ? 'Very High' : influence >= 4 ? 'High' : 'Medium'
  );
  const topOpportunityOwners = React.useMemo(() => {
    const PRIORITY_ORDER = {
      critical: 0,
      hot: 1,
      high: 2,
      'medium-high': 3,
      medium: 4,
      low: 5,
    };
    const TYPE_ORDER = {
      'Confirmed Opportunity': 0,
      Confirmed: 0,
      'Confirmed / Inferred': 1,
      'Inferred Opportunity': 2,
      Inferred: 2,
      'Strategic Hypothesis': 3,
      Watchlist: 4,
      'Strategic Hypothesis / Watchlist': 4,
    };
    const roleOrder = [
      'Executive Sponsor',
      'Economic Buyer',
      'Business Owner',
      'Technology Owner',
      'Data Owner',
      'Risk Stakeholder',
    ];
    const sortedOpps = [...(opportunities ?? [])].sort((a, b) => {
      const pa = PRIORITY_ORDER[String(a?.priority ?? '').trim().toLowerCase()] ?? 99;
      const pb = PRIORITY_ORDER[String(b?.priority ?? '').trim().toLowerCase()] ?? 99;
      if (pa !== pb) return pa - pb;

      const ta = TYPE_ORDER[a?.opportunityType] ?? 99;
      const tb = TYPE_ORDER[b?.opportunityType] ?? 99;
      return ta - tb;
    });

    if (!sortedOpps.length) {
      return Array.isArray(orgData.topOpportunityOwners) && orgData.topOpportunityOwners.length > 0
        ? orgData.topOpportunityOwners
        : (SYNOVUS_ORG.topOpportunityOwners ?? []);
    }

    return sortedOpps.map((opp, index) => {
      const complexityMeta = complexityMetaFromOpportunity(opp);
      const priority = String(opp?.priority ?? 'Medium');
      const rank = Number(opp?.rank) || index + 1;
      const clusterStart = stakeholderPool.length ? (index * 2) % stakeholderPool.length : 0;
      const buyingCenter = roleOrder.map((role, roleIndex) => {
        const person = stakeholderPool.length
          ? stakeholderPool[(clusterStart + roleIndex) % stakeholderPool.length]
          : null;
        const nameText = person?.name ?? role;
        const initials = person?.initials
          ?? String(nameText).split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
        const influence = Number(person?.stars) || (4 - (roleIndex > 3 ? 1 : 0));
        return {
          role,
          initials,
          bg: person?.bg ?? '#64748b',
          name: nameText,
          title: person?.title ?? 'Stakeholder',
          function: person?.function ?? 'Organization',
          influence,
          engagement: engagementLabelFromInfluence(influence),
        };
      });
      const owners = buyingCenter.slice(0, 3).map((person) => ({ i: person.initials, bg: person.bg }));
      return {
        opportunityId: opp?.id ?? `opp-${rank}`,
        rank,
        priority,
        title: String(opp?.title ?? 'Untitled Opportunity'),
        complexity: complexityMeta.complexity,
        complexityLabel: complexityMeta.complexityLabel,
        timeline: opp?.timeline ?? 'TBD',
        budgetVisibility: budgetVisibilityFromDealSize(opp?.dealSize),
        strategicImportance: priority.toLowerCase().includes('high') ? 'Critical' : 'High',
        buyerLens: opp?.buyer ?? 'Opportunity Lens',
        owners,
        extraOwners: Math.max(0, buyingCenter.length - owners.length),
        buyingCenter,
      };
    });
  }, [opportunities, orgData.topOpportunityOwners, stakeholderPool]);
  const relatedOpportunitiesByOwner = React.useMemo(() => {
    if (!isSynovusOpportunityOwnersTab || topOpportunityOwners.length === 0) return new Map();
    const mapped = new Map();
    topOpportunityOwners.forEach((opp) => {
      const opportunityTitle = formatOpportunityTitle(opp?.title);
      (opp.buyingCenter ?? []).forEach((owner) => {
        const normalizedName = normalizeStakeholderName(owner?.name);
        if (!normalizedName) return;
        if (!mapped.has(normalizedName)) mapped.set(normalizedName, []);
        const list = mapped.get(normalizedName);
        if (!list.includes(opportunityTitle)) list.push(opportunityTitle);
      });
    });
    return mapped;
  }, [isSynovusOpportunityOwnersTab, topOpportunityOwners]);
  const relatedOpportunityIndexByKey = React.useMemo(() => {
    const indexMap = new Map();
    topOpportunityOwners.forEach((opp, idx) => {
      const titleKey = normalizeOpportunityLookupKey(opp?.title);
      const formattedTitleKey = normalizeOpportunityLookupKey(formatOpportunityTitle(opp?.title));
      const idKey = normalizeOpportunityLookupKey(opp?.opportunityId);
      if (titleKey && !indexMap.has(titleKey)) indexMap.set(titleKey, idx);
      if (formattedTitleKey && !indexMap.has(formattedTitleKey)) indexMap.set(formattedTitleKey, idx);
      if (idKey && !indexMap.has(idKey)) indexMap.set(idKey, idx);
    });
    return indexMap;
  }, [topOpportunityOwners]);
  const setTopOppCardRef = React.useCallback((idx, node) => {
    if (node) {
      topOppCardRefs.current.set(idx, node);
    } else {
      topOppCardRefs.current.delete(idx);
    }
  }, []);
  const scrollElementWithTopOffset = React.useCallback((element, offsetPx = SCROLL_TOP_OFFSET_PX) => {
    if (!element || typeof window === 'undefined') return;
    const absoluteTop = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo({
      top: Math.max(0, absoluteTop - offsetPx),
      behavior: 'smooth',
    });
  }, []);
  const openTopOpportunityCard = React.useCallback((rawOpportunityValue) => {
    const lookupKey = normalizeOpportunityLookupKey(rawOpportunityValue);
    if (!lookupKey) return;
    let targetIndex = relatedOpportunityIndexByKey.get(lookupKey);
    if (typeof targetIndex !== 'number') {
      targetIndex = topOpportunityOwners.findIndex((opp) => {
        const rawKey = normalizeOpportunityLookupKey(opp?.title);
        const displayKey = normalizeOpportunityLookupKey(formatOpportunityTitle(opp?.title));
        return rawKey.includes(lookupKey)
          || lookupKey.includes(rawKey)
          || displayKey.includes(lookupKey)
          || lookupKey.includes(displayKey);
      });
    }
    if (typeof targetIndex !== 'number' || targetIndex < 0) return;
    setExpandedOpp(targetIndex);
    setScrollToOppCardIndex(targetIndex);
    const selectedOpp = topOpportunityOwners[targetIndex];
    setHoveredOppId(selectedOpp?.opportunityId || selectedOpp?.title || `slot-${targetIndex}`);
  }, [relatedOpportunityIndexByKey, topOpportunityOwners]);
  const openOpportunityDetailFromTopCard = React.useCallback((opp) => {
    const opportunityId = String(opp?.opportunityId ?? '').trim();
    if (!accountId || !opportunityId) return;
    navigate(`/accounts/${encodeURIComponent(accountId)}/opportunities/${encodeURIComponent(opportunityId)}`);
  }, [accountId, navigate]);
  React.useEffect(() => {
    if (expandedOpp === null) return;
    const raf = window.requestAnimationFrame(() => {
      if (typeof scrollToOppCardIndex === 'number') {
        const targetCard = topOppCardRefs.current.get(scrollToOppCardIndex);
        if (targetCard) {
          // Keep the selected lower card fully visible after expansion.
          scrollElementWithTopOffset(targetCard, 140);
          setScrollToOppCardIndex(null);
          return;
        }
      }
      if (expandedOppPanelRef.current) {
        scrollElementWithTopOffset(expandedOppPanelRef.current);
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [expandedOpp, scrollElementWithTopOffset, scrollToOppCardIndex]);
  const displayedStakeholders = React.useMemo(() => {
    const sortStakeholders = (list) => {
      const next = [...list];
      next.sort((a, b) => {
        const starsA = Number(a?.stars ?? 0);
        const starsB = Number(b?.stars ?? 0);
        if (starsA !== starsB) return starsB - starsA;
        const oppsA = Number(a?.opps ?? 0);
        const oppsB = Number(b?.opps ?? 0);
        if (oppsA !== oppsB) return oppsB - oppsA;
        return String(a?.name ?? '').localeCompare(String(b?.name ?? ''));
      });
      return next;
    };

    if (isSynovusOpportunityOwnersTab) {
      return sortStakeholders(SYNOVUS_KEY_LEADERS_TO_ENGAGE);
    }

    // Synovus leadership-group tabs: people with empty Related Opportunities.
    if (/synovus/i.test(String(name ?? '')) && tab?.label) {
      const groupKey = normalizeStakeholderName(tab.label);
      const groupPeople = SYNOVUS_LEADERS_BY_GROUP[groupKey];
      if (Array.isArray(groupPeople)) {
        return sortStakeholders(groupPeople);
      }
    }

    return tab?.people ?? [];
  }, [isSynovusOpportunityOwnersTab, name, tab?.label, tab?.people]);
  const showStaticOpportunityOwners = topOpportunityOwners.length > 0;
  const topOpportunityOwnerSlots = (() => {
    const cardsPerRow = 5;
    if (topOpportunityOwners.length === 0) return [];
    const padded = [...topOpportunityOwners];
    const remainder = padded.length % cardsPerRow;
    if (remainder !== 0) {
      const placeholdersNeeded = cardsPerRow - remainder;
      for (let i = 0; i < placeholdersNeeded; i += 1) {
        padded.push(null);
      }
    }
    return padded;
  })();
  const getTopOpportunityTitle = React.useCallback((opp) => {
    if (!opp) return 'Untitled Opportunity';
    return formatOpportunityTitle(opp.title);
  }, []);

  if (!isLoadingOrg && orgData.pending) {
    return (
      <PendingDataPanel
        title="Organization data is on the way"
        detail={`${name || 'This account'} stakeholder mapping and leadership hierarchy are not loaded yet. Check back once the org chart is curated.`}
      />
    );
  }

  return (
    <div className="animate-in">

      {/* Subtitle line */}
      <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>Key decision makers and influencers across {name}</p>

      {/* 4 KPI cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {kpis.map(k => (
          <div key={k.label} style={{background:k.gradient,borderRadius:12,padding:'20px 18px',boxShadow:'var(--card-shadow)',display:'flex',alignItems:'flex-start',gap:14}}>
            <div style={{width:48,height:48,borderRadius:10,background:k.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <img src={k.icon} alt="" width={24} height={24} aria-hidden />
            </div>
            <div>
              <p style={{fontSize:26,fontWeight:700,color:'#0f172a',lineHeight:1}}>{isLoadingOrg ? '—' : k.value}</p>
              <p style={{fontSize:13,fontWeight:600,color:'#0f172a',marginTop:4}}>{k.label}</p>
              <p style={{fontSize:12,color:'#64748b',marginTop:2}}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main stakeholder card */}
      <div style={{background:'white',borderRadius:12,boxShadow:'var(--card-shadow)',overflow:'hidden',marginBottom:24}}>
        {/* Tab bar — leadership_type pivot */}
        <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',padding:'0 20px',gap:0}}>
          {orderedOrgTabs.map((t, idx) => (
            <button key={t.key || t.label} onClick={() => setActiveOrgTab(idx)} style={{
              display:'flex',alignItems:'center',gap:8,padding:'14px 20px',fontSize:13,fontWeight:500,
              color: activeOrgTab===idx ? '#2563eb' : '#64748b',
              background:'none',border:'none',cursor:'pointer',
              borderBottom: activeOrgTab===idx ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom:'-1px',
            }}>
              <Icon name={t.icon} size={15} color={activeOrgTab===idx ? '#2563eb' : '#94a3b8'}/>
              {t.label}
            </button>
          ))}
        </div>
        {/* Table header */}
        <div style={{display:'grid',gridTemplateColumns:stakeholderGridColumns,columnGap:stakeholderColumnGapPx,padding:`9px ${compactTablePaddingX}px`,background:'#f8fafc',borderBottom:'1px solid #e2e8f0'}}>
          {stakeholderHeaders.map((h,hi) => (
            <span key={h} style={{fontSize:11,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',textAlign:!isSynovusOpportunityOwnersTab && hi===4?'center':'left'}}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {isLoadingOrg && (
          <div style={{padding:'28px 20px',textAlign:'center',fontSize:13,color:'#64748b'}}>Loading organization…</div>
        )}
        {!isLoadingOrg && displayedStakeholders.length === 0 && (
          <div style={{padding:'28px 20px',textAlign:'center',fontSize:13,color:'#64748b'}}>No stakeholders mapped for this leadership type yet.</div>
        )}
        {!isLoadingOrg && displayedStakeholders.map((p, i) => {
          const linkedinUrl = getStakeholderLinkedInUrl(name, p.name);
          const stakeholderNameKey = normalizeStakeholderName(p.name);
          const ownerEnrichment = SYNOVUS_OPP_OWNER_ENRICHMENT_BY_NAME[stakeholderNameKey] ?? null;
          const executivePriorityValues = ownerEnrichment?.executivePriority?.length
            ? ownerEnrichment.executivePriority
            : (p.focus ?? []);
          const relatedOppsFromCsv = resolveSynovusRelatedOpportunityTitles(
            ownerEnrichment?.relatedOpportunities ?? [],
          );
          const relatedOppsFromDynamic = relatedOpportunitiesByOwner.get(stakeholderNameKey) ?? [];
          const relatedOpps = relatedOppsFromCsv.length > 0 ? relatedOppsFromCsv : relatedOppsFromDynamic;
          const whyItMattersText = String(
            ownerEnrichment?.whyItMatters
            ?? p.whyItMatters
            ?? p.why_it_matters
            ?? '',
          ).trim();
          return (
            <div key={p.id || `${p.name}-${i}`} style={{
              display:'grid',gridTemplateColumns:stakeholderGridColumns,columnGap:stakeholderColumnGapPx,
              alignItems:'start',padding:`${compactTablePaddingY}px ${compactTablePaddingX}px`,
              borderBottom: i < displayedStakeholders.length - 1 ? '1px solid #f1f5f9' : 'none',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontSize:12,fontWeight:700,color:'#fff'}}>{p.initials}</span>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:14,fontWeight:600,color:'#0f172a'}}>{p.name}</span>
                    <LinkedInIconLink url={linkedinUrl} stakeholderName={p.name} />
                  </div>
                  {isSynovusOpportunityOwnersTab ? (
                    <p style={{fontSize:11,color:'#64748b',lineHeight:1.3,marginTop:2}}>
                      {p.title || '—'}
                    </p>
                  ) : null}
                </div>
              </div>
              {!isSynovusOpportunityOwnersTab ? (
                <span style={{fontSize:13,color:'#475569',lineHeight:1.4}}>{p.title}</span>
              ) : null}
              {isSynovusOpportunityOwnersTab ? (
                <>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {executivePriorityValues.map(a => (
                      <span key={a} style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#eff6ff',color:'#2563eb',fontWeight:500}}>{a}</span>
                    ))}
                  </div>
                  <div style={{paddingRight:10, minWidth: 0}}>
                    {relatedOpps.length === 0 ? (
                      <span style={{fontSize:12,color:'#94a3b8'}}>—</span>
                    ) : (
                      <ol style={{margin:0,paddingLeft:16,listStyleType:'decimal',display:'grid',gap:3,minWidth:0}}>
                        {relatedOpps.map((oppName) => (
                          <li key={`${p.name}-${oppName}`} style={{fontSize:11,color:'#334155',lineHeight:1.35,minWidth:0}}>
                            <button
                              type="button"
                              onClick={() => openTopOpportunityCard(oppName)}
                              style={{
                                // Block-level so the list marker tracks the first
                                // wrapped line instead of the button's baseline.
                                display: 'block',
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                cursor: 'pointer',
                                color: '#64748b',
                                fontSize: 11,
                                lineHeight: 1.35,
                                whiteSpace: 'normal',
                                overflowWrap: 'anywhere',
                                wordBreak: 'break-word',
                                width: '100%',
                                textAlign: 'left',
                                textDecoration: 'none',
                              }}
                              onMouseEnter={(event) => { event.currentTarget.style.textDecoration = 'underline'; }}
                              onMouseLeave={(event) => { event.currentTarget.style.textDecoration = 'none'; }}
                              title={oppName}
                            >
                              {oppName}
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span style={{fontSize:13,color:'#64748b'}}>{p.function}</span>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {(p.focus ?? []).map(a => (
                      <span key={a} style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#eff6ff',color:'#2563eb',fontWeight:500}}>{a}</span>
                    ))}
                  </div>
                </>
              )}
              {!isSynovusOpportunityOwnersTab ? (
                <span style={{fontSize:14,fontWeight:600,color:'#0f172a',textAlign:'center',display:'block',alignSelf:'start'}}>{p.opps}</span>
              ) : null}
              <div style={{alignSelf:'start'}}>{stars(p.stars)}</div>
            </div>
          );
        })}
      </div>

      {/* Top Opportunity Owners — static Synovus enrichment until opp-owner mapping is modeled */}
      {showStaticOpportunityOwners && (
        <>
      <div style={{marginBottom:12}}>
        <h3 style={{fontSize:15,fontWeight:600,color:'#0f172a',margin:0}}>Top Opportunity Owners</h3>
      </div>

      {/* Expanded card view */}
      {expandedOpp !== null && (
        <div ref={expandedOppPanelRef} style={{background:'white',borderRadius:12,boxShadow:'var(--card-shadow)',padding:24,marginBottom:20,border:'2px solid #2563eb'}}>
          {/* Back + header */}
          <button onClick={() => setExpandedOpp(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#2563eb',fontWeight:500,marginBottom:16,display:'flex',alignItems:'center',gap:4}}>
            ← Back to Organization
          </button>
          {(() => {
            const opp = topOpportunityOwners[expandedOpp];
            if (!opp) {
              return <div style={{padding:'10px 0',fontSize:13,color:'#64748b'}}>No details found for this opportunity.</div>;
            }
            const priorityStyle = opp.priority==='High' ? {bg:'#fef2f2',color:'#dc2626'} : {bg:'#fff7ed',color:'#ea580c'};
            return (
              <>
                {/* Opportunity header */}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                      <span style={{width:28,height:28,borderRadius:'50%',background:'#eff6ff',color:'#2563eb',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>{opp.rank}</span>
                      <button
                        type="button"
                        onClick={() => openOpportunityDetailFromTopCard(opp)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#0f172a',
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                          cursor: 'pointer',
                          textAlign: 'left',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(event) => { event.currentTarget.style.textDecoration = 'underline'; }}
                        onMouseLeave={(event) => { event.currentTarget.style.textDecoration = 'none'; }}
                        title="Open opportunity detail"
                      >
                        {getTopOpportunityTitle(opp)}
                      </button>
                      <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,background:priorityStyle.bg,color:priorityStyle.color}}>{opp.priority} Priority</span>
                    </div>
                    {/* Meta row */}
                    <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
                      {[
                        {label:'Complexity',    value:null,        dots:opp.complexity, dotLabel:opp.complexityLabel},
                        {label:'Target Timeline',value:opp.timeline},
                        {label:'Budget Visibility',value:opp.budgetVisibility,pill:{High:'#f0fdf4',Medium:'#fff7ed'}},
                        {label:'Strategic Importance',value:opp.strategicImportance,pill:{Critical:'#fef2f2',High:'#eff6ff'}},
                        {label:'Buyer Lens',    value:opp.buyerLens},
                      ].map(m => (
                        <div key={m.label}>
                          <p style={{fontSize:10,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>{m.label}</p>
                          {m.dots !== undefined ? (
                            <div style={{display:'flex',alignItems:'center',gap:6}}>
                              <div>{Array.from({length:5},(_,ii)=><span key={ii} style={{display:'inline-block',width:9,height:9,borderRadius:'50%',marginRight:2,background:ii<m.dots?'#f97316':'#e2e8f0'}}/>)}</div>
                              <span style={{fontSize:12,fontWeight:600,color:'#475569'}}>{m.dotLabel}</span>
                            </div>
                          ) : m.pill ? (
                            <span style={{fontSize:12,fontWeight:600,padding:'3px 10px',borderRadius:20,background:m.pill[m.value]||'#f1f5f9',color:'#0f172a'}}>{m.value}</span>
                          ) : (
                            <span style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{m.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Buying Center */}
                <div style={{borderTop:'1px solid #e2e8f0',paddingTop:20}}>
                  <h4 style={{fontSize:14,fontWeight:600,color:'#0f172a',marginBottom:16}}>Buying Center &amp; Key Stakeholders</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12}}>
                    {opp.buyingCenter.map(bc => (
                      <div key={bc.role} style={{borderRadius:10,padding:14,background:'#f8fafc',border:'1px solid #e2e8f0'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                          <span style={{width:8,height:8,borderRadius:'50%',background:'#2563eb',display:'inline-block',flexShrink:0}}/>
                          <span style={{fontSize:11,fontWeight:700,color:'#2563eb'}}>{bc.role}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
                          <div style={{width:32,height:32,borderRadius:'50%',background:bc.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <span style={{fontSize:11,fontWeight:700,color:'#fff'}}>{bc.initials}</span>
                          </div>
                          <div style={{minWidth:0}}>
                            <p style={{fontSize:12,fontWeight:600,color:'#0f172a',lineHeight:1.3,wordBreak:'break-word'}}>{bc.name}</p>
                            <p style={{fontSize:11,color:'#64748b',lineHeight:1.3}}>{bc.title}</p>
                          </div>
                        </div>
                        <p style={{fontSize:11,color:'#94a3b8',marginBottom:4}}><span style={{fontWeight:600}}>Function:</span> {bc.function}</p>
                        <p style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>Influence {Array.from({length:5},(_,ii)=><span key={ii} style={{color:ii<bc.influence?'#f59e0b':'#e2e8f0',fontSize:12}}>★</span>)}</p>
                        <p style={{fontSize:11,color:'#94a3b8'}}>Engagement Priority <span style={{fontWeight:600,color:engagementColor(bc.engagement)}}>{bc.engagement}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Opportunity cards grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14}}>
        {topOpportunityOwnerSlots.map((opp, idx) => {
          if (!opp) {
            return (
              <div
                key={`top-opp-placeholder-${idx}`}
                style={{
                  borderRadius: 12,
                  padding: '16px',
                  border: '1px solid transparent',
                  background: 'transparent',
                  minHeight: 188,
                }}
              />
            );
          }
          const ps = opp.priority==='High' ? {bg:'#fef2f2',color:'#dc2626'} : {bg:'#fff7ed',color:'#ea580c'};
          const isOpen = expandedOpp === idx;
          const isHovered = hoveredOppId === (opp.opportunityId || opp.title || `slot-${idx}`);
          const ownerCluster = Array.isArray(opp.owners) ? opp.owners : [];
          return (
            <div key={opp.title}
              ref={(node) => setTopOppCardRef(idx, node)}
              onClick={() => setExpandedOpp(isOpen ? null : idx)}
              onMouseEnter={() => setHoveredOppId(opp.opportunityId || opp.title || `slot-${idx}`)}
              onMouseLeave={() => setHoveredOppId(null)}
              style={{
                background:'white',
                borderRadius:12,
                padding:'16px',
                minWidth:0,
                boxShadow:(isOpen || isHovered) ? '0 12px 28px rgba(0, 26, 65, 0.2), 0 6px 14px rgba(0, 0, 0, 0.12)' : 'var(--card-shadow)',
                cursor:'pointer',
                border: isOpen ? '2px solid #2563eb' : '2px solid transparent',
                transform: isOpen ? 'translateY(-1px)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition:'border 0.15s ease, box-shadow 0.18s ease, transform 0.18s ease',
              }}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:ps.bg,color:ps.color}}>{opp.priority}</span>
                <span style={{fontSize:10,color:'#94a3b8'}}>#{opp.rank}</span>
              </div>
              <p style={{fontSize:13,fontWeight:600,color:'#0f172a',lineHeight:1.4,marginBottom:14,minHeight:52,overflowWrap:'anywhere',wordBreak:'break-word'}}>{getTopOpportunityTitle(opp)}</p>
              <p style={{fontSize:11,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>Owner Cluster</p>
              <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:14}}>
                {ownerCluster.map((o, oi) => (
                  <div key={oi} style={{width:28,height:28,borderRadius:'50%',background:o.bg,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid white',marginLeft:oi>0?-8:0,position:'relative',zIndex:ownerCluster.length-oi}}>
                    <span style={{fontSize:9,fontWeight:700,color:'#fff'}}>{o.i}</span>
                  </div>
                ))}
                {opp.extraOwners > 0 && (
                  <div style={{width:28,height:28,borderRadius:'50%',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid white',marginLeft:-8}}>
                    <span style={{fontSize:9,fontWeight:700,color:'#64748b'}}>+{opp.extraOwners}</span>
                  </div>
                )}
              </div>
              <p style={{fontSize:11,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>Complexity</p>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div>{Array.from({length:5},(_,ii)=><span key={ii} style={{display:'inline-block',width:9,height:9,borderRadius:'50%',marginRight:2,background:ii<opp.complexity?'#f97316':'#e2e8f0'}}/>)}</div>
                <span style={{fontSize:12,fontWeight:600,color:'#475569'}}>{opp.complexityLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}



/* ─── NEWS TAB ────────────────────────────────────────────────────── */
const CATEGORY_STYLES = {
  bank_announcement: { label: 'Bank Announcement', color: '#ea580c', bg: '#fff7ed' },
  earnings_update: { label: 'Earnings Update', color: '#7c3aed', bg: '#f5f3ff' },
  leadership_change: { label: 'Leadership Change', color: '#2563eb', bg: '#eff6ff' },
  regulatory_risk: { label: 'Regulatory / Risk', color: '#dc2626', bg: '#fef2f2' },
  technology_vendor: { label: 'Technology / Vendor', color: '#0891b2', bg: '#ecfeff' },
  banking_regulation: { label: 'Banking Regulation', color: '#16a34a', bg: '#f0fdf4' },
  ai_in_banking: { label: 'AI in Banking', color: '#7c3aed', bg: '#f5f3ff' },
  payments_modernization: { label: 'Payments Modernization', color: '#7c3aed', bg: '#f5f3ff' },
  fraud_aml: { label: 'Fraud / AML', color: '#dc2626', bg: '#fef2f2' },
  core_digital_banking: { label: 'Core / Digital Banking', color: '#ea580c', bg: '#fff7ed' },
  wealthtech: { label: 'Wealthtech', color: '#2563eb', bg: '#eff6ff' },
  risk_compliance_event: { label: 'Risk / Compliance', color: '#dc2626', bg: '#fef2f2' },
  fintech_event: { label: 'Fintech', color: '#0891b2', bg: '#ecfeff' },
  wealthtech_event: { label: 'Wealthtech', color: '#7c3aed', bg: '#f5f3ff' },
  banking_conference: { label: 'Banking', color: '#16a34a', bg: '#f0fdf4' },
  payments_event: { label: 'Payments', color: '#0891b2', bg: '#ecfeff' },
  ai_data_banking_event: { label: 'AI / Data', color: '#7c3aed', bg: '#f5f3ff' },
};

function formatNewsCategory(category) {
  if (!category) return { label: '—', color: '#64748b', bg: '#f1f5f9' };
  const known = CATEGORY_STYLES[category];
  if (known) return known;
  return {
    label: String(category).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    color: '#475569',
    bg: '#f1f5f9',
  };
}

function formatNewsDate(value) {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatEventDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '—';
  if (!endDate || startDate === endDate) return formatNewsDate(startDate);
  const start = formatNewsDate(startDate);
  const end = formatNewsDate(endDate);
  if (start === '—' || end === '—') return start !== '—' ? start : end;
  const startParts = start.split(' ');
  const endParts = end.split(' ');
  if (startParts[0] === endParts[0] && startParts[2] === endParts[2]) {
    return `${startParts[0]} ${startParts[1].replace(',', '')} – ${endParts[1]} ${endParts[2]}`;
  }
  return `${start} – ${end}`;
}

function formatPipeList(value) {
  if (!value) return '—';
  return String(value).split('|').map((part) => part.trim()).filter(Boolean).join(', ');
}

function NewsTab({ accountId }) {
  const [activeNewsTab, setActiveNewsTab] = useState(0);
  const [newsData, setNewsData] = useState({ bankNews: [], industryUpdates: [], upcomingEvents: [], pending: false });
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!accountId) return;
      setIsLoadingNews(true);
      setNewsError('');
      try {
        const data = await fetchAccountNewsById(accountId);
        if (!cancelled) {
          setNewsData({
            bankNews: data?.bankNews ?? [],
            industryUpdates: data?.industryUpdates ?? [],
            upcomingEvents: data?.upcomingEvents ?? [],
            pending: Boolean(data?.pending),
          });
        }
      } catch (err) {
        console.error('Failed to load account news', err);
        if (!cancelled) {
          setNewsData({ bankNews: [], industryUpdates: [], upcomingEvents: [], pending: false });
          setNewsError(err?.message || 'Failed to load news');
        }
      } finally {
        if (!cancelled) setIsLoadingNews(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  if (!isLoadingNews && newsData.pending) {
    return (
      <PendingDataPanel
        title="News & events are on the way"
        detail="Company news, industry updates, and upcoming events for this account are not loaded yet. Check back once the feed is curated."
      />
    );
  }

  const newsTabs = [
    { label:'Bank News',        icon:'bank'    },
    { label:'Industry Updates', icon:'trend'   },
    { label:'Upcoming Events',  icon:'calendar'},
  ];

  const CategoryPill = ({ category }) => {
    const style = formatNewsCategory(category);
    return (
      <span style={{display:'inline-block',fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:style.bg,color:style.color,whiteSpace:'nowrap'}}>
        {style.label}
      </span>
    );
  };

  const ExternalLink = ({ href }) => (
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:6,background:'#f1f5f9',color:'#2563eb',fontSize:14,cursor:'pointer',textDecoration:'none'}}
      >↗</a>
    ) : (
      <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:6,background:'#f1f5f9',color:'#94a3b8',fontSize:14}}>—</span>
    )
  );

  const ColHdr = ({ cols }) => (
    <div style={{display:'grid',gridTemplateColumns:cols.map(c=>c.w).join(' '),padding:'10px 20px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0'}}>
      {cols.map(c=>(
        <span key={c.label} style={{fontSize:11,fontWeight:700,color:'#475569'}}>{c.label}</span>
      ))}
    </div>
  );

  const EmptyState = ({ label }) => (
    <div style={{padding:'28px 20px',fontSize:13,color:'#64748b'}}>
      {isLoadingNews ? 'Loading…' : newsError || `No ${label} available for this account.`}
    </div>
  );

  return (
    <div className="animate-in">
      <div style={{background:'white',borderRadius:12,boxShadow:'var(--card-shadow)',overflow:'hidden'}}>
        <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',padding:'0 20px'}}>
          {newsTabs.map((t, idx) => (
            <button key={t.label} onClick={() => setActiveNewsTab(idx)} style={{
              display:'flex',alignItems:'center',gap:8,padding:'14px 20px',
              fontSize:13,fontWeight:500,background:'none',border:'none',cursor:'pointer',
              color: activeNewsTab===idx ? '#2563eb' : '#64748b',
              borderBottom: activeNewsTab===idx ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom:'-1px',
            }}>
              <Icon name={t.icon} size={15} color={activeNewsTab===idx ? '#2563eb' : '#94a3b8'}/>
              {t.label}
            </button>
          ))}
        </div>

        {activeNewsTab === 0 && (
          <>
            <ColHdr cols={[
              {label:'Title',w:'2fr'},{label:'Date',w:'100px'},{label:'Source',w:'130px'},
              {label:'Category',w:'150px'},{label:'Relevance to Sales',w:'2fr'},{label:'Link',w:'60px'}
            ]}/>
            {!isLoadingNews && newsData.bankNews.length === 0 ? (
              <EmptyState label="bank news" />
            ) : newsData.bankNews.map((item,i) => (
              <div key={item.news_item_id || item.id || item.title} style={{
                display:'grid',gridTemplateColumns:'2fr 100px 130px 150px 2fr 60px',
                alignItems:'center',padding:'14px 20px',
                borderBottom: i < newsData.bankNews.length-1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{fontSize:13,fontWeight:500,color:'#0f172a',lineHeight:1.4,paddingRight:12}}>{item.title}</span>
                <span style={{fontSize:12,color:'#64748b'}}>{formatNewsDate(item.published_at)}</span>
                <span style={{fontSize:12,color:'#64748b'}}>{item.source || '—'}</span>
                <div><CategoryPill category={item.category}/></div>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{item.sales_relevance || item.relevance || '—'}</span>
                <ExternalLink href={item.source_url}/>
              </div>
            ))}
            {isLoadingNews && <EmptyState label="bank news" />}
          </>
        )}

        {activeNewsTab === 1 && (
          <>
            <ColHdr cols={[
              {label:'Title',w:'2fr'},{label:'Date',w:'90px'},{label:'Source',w:'120px'},
              {label:'Category',w:'160px'},{label:'Summary',w:'2fr'},{label:'Affected Domains',w:'180px'},{label:'Why it Matters',w:'1.5fr'}
            ]}/>
            {!isLoadingNews && newsData.industryUpdates.length === 0 ? (
              <EmptyState label="industry updates" />
            ) : newsData.industryUpdates.map((item,i) => (
              <div key={item.news_item_id || item.id || item.title} style={{
                display:'grid',gridTemplateColumns:'2fr 90px 120px 160px 2fr 180px 1.5fr',
                alignItems:'start',padding:'14px 20px',
                borderBottom: i < newsData.industryUpdates.length-1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{fontSize:13,fontWeight:500,color:'#0f172a',lineHeight:1.4,paddingRight:12}}>{item.title}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{formatNewsDate(item.published_at)}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{item.source || '—'}</span>
                <div style={{paddingTop:2}}><CategoryPill category={item.category}/></div>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{item.summary || '—'}</span>
                <span style={{fontSize:12,color:'#64748b',lineHeight:1.4,paddingRight:12}}>{formatPipeList(item.affected_business_domains)}</span>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4}}>{item.why_it_matters || '—'}</span>
              </div>
            ))}
            {isLoadingNews && <EmptyState label="industry updates" />}
          </>
        )}

        {activeNewsTab === 2 && (
          <>
            <ColHdr cols={[
              {label:'Event Name',w:'2fr'},{label:'Date',w:'130px'},{label:'Location',w:'120px'},
              {label:'Category',w:'150px'},{label:'Audience',w:'2fr'},{label:'Why Relevant',w:'1.8fr'},{label:'Website',w:'70px'}
            ]}/>
            {!isLoadingNews && newsData.upcomingEvents.length === 0 ? (
              <EmptyState label="upcoming events" />
            ) : newsData.upcomingEvents.map((ev,i) => (
              <div key={ev.news_item_id || ev.id || ev.title} style={{
                display:'grid',gridTemplateColumns:'2fr 130px 120px 150px 2fr 1.8fr 70px',
                alignItems:'start',padding:'14px 20px',
                borderBottom: i < newsData.upcomingEvents.length-1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{fontSize:13,fontWeight:500,color:'#0f172a',lineHeight:1.4,paddingRight:12}}>{ev.title}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{formatEventDateRange(ev.start_date, ev.end_date)}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{ev.location || '—'}</span>
                <div style={{paddingTop:2}}><CategoryPill category={ev.category}/></div>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{formatPipeList(ev.primary_audience)}</span>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{ev.why_relevant || '—'}</span>
                <ExternalLink href={ev.website || ev.source_url}/>
              </div>
            ))}
            {isLoadingNews && <EmptyState label="upcoming events" />}
          </>
        )}
      </div>
    </div>
  );
}

export default function AccountOverviewPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [synovusMergeTipOpen, setSynovusMergeTipOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const fromParam = searchParams.get('from');
  const activeTab = TABS.includes(tabParam) ? tabParam : 'Overview';
  const setActiveTab = (tab) => {
    const params = {};
    if (tab !== 'Overview') params.tab = tab;
    if (fromParam) params.from = fromParam;
    setSearchParams(params);
  };
  const backLabel = fromParam === 'accounts' ? 'Back to Accounts' : 'Back to Portfolio';
  const backPath  = fromParam === 'accounts' ? '/accounts' : '/';

  const handleDownloadReport = async () => {
    if (!accountId || isDownloadingReport) return;
    setIsDownloadingReport(true);
    try {
      const account = realAccount ?? (await fetchAccountById(accountId));
      if (!account) return;
      const [signals, organization, news] = await Promise.all([
        fetchAccountSignalsById(accountId),
        fetchAccountOrganizationById(accountId),
        fetchAccountNewsById(accountId),
      ]);
      await generateAccountReportPdf({
        account,
        signals,
        organization,
        news,
        logoUrl: appLogoUrl,
      });
    } catch (err) {
      console.error('Failed to download account report', err);
      window.alert('Unable to generate report PDF right now. Please try again.');
    } finally {
      setIsDownloadingReport(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoadingAccount(true);
    setAccountData(null);

    const load = async () => {
      if (!accountId) {
        if (!cancelled) {
          setAccountData(null);
          setIsLoadingAccount(false);
        }
        return;
      }
      try {
        const account = await fetchAccountById(accountId);
        if (!cancelled) setAccountData(account ?? null);
      } catch (err) {
        console.error('Failed to load account detail', err);
        if (!cancelled) setAccountData(null);
      } finally {
        if (!cancelled) setIsLoadingAccount(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  useEffect(() => {
    setSynovusMergeTipOpen(false);
  }, [accountId]);

  // Never show a previously viewed bank while the next account is loading.
  const realAccount =
    accountData && String(accountData.id) === String(accountId) ? accountData : null;
  const acct = realAccount
    ? {
        id: realAccount.id,
        name: realAccount.name,
        sector: realAccount.sector,
        about: realAccount.about,
        products: realAccount.products,
        services: realAccount.services,
        assetSize: realAccount.assetSize,
        revenue: realAccount.revenue,
        nim: realAccount.nim,
        efficiencyRatio: realAccount.efficiencyRatio,
        businessStrategy: realAccount.businessStrategy,
        retailBank: realAccount.retailBank,
        commercialBank: realAccount.commercialBank,
        wealthBank: realAccount.wealthBank,
        competitiveLandscape: realAccount.competitiveLandscape,
        capabilities: realAccount.capabilities,
      }
    : {
        id: accountId,
        name: isLoadingAccount ? 'Loading…' : 'Account',
        sector: null,
        about: null,
        products: null,
        services: null,
        assetSize: null,
        revenue: null,
        nim: null,
        efficiencyRatio: null,
        businessStrategy: null,
        retailBank: null,
        commercialBank: null,
        wealthBank: null,
        competitiveLandscape: [],
        capabilities: null,
      };
  const isSynovusOverview = activeTab === 'Overview'
    && String(acct?.name ?? '').toLowerCase().includes('synovus');

  return (
    <div className="animate-in">
      <button className="asi-back" onClick={()=>navigate(backPath)}>
        ← {backLabel}
      </button>

      {/* Bank Header */}
      <div className="asi-bank-header">
        <BankLogo name={acct.name} size={56} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="asi-bank-header__name" style={{ margin: 0 }}>
              {acct.name} {activeTab === 'Overview' ? 'Overview' : activeTab}
            </h1>
            {isSynovusOverview && (
              <div
                className={`asi-info-tip${synovusMergeTipOpen ? ' is-open' : ''}`}
                onMouseEnter={() => setSynovusMergeTipOpen(true)}
                onMouseLeave={() => setSynovusMergeTipOpen(false)}
              >
                <button
                  type="button"
                  className="asi-info-tip__trigger"
                  aria-label="Synovus merger info"
                  aria-expanded={synovusMergeTipOpen}
                  aria-controls="synovus-merge-tip"
                  onClick={() => setSynovusMergeTipOpen((open) => !open)}
                  onBlur={(e) => {
                    if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                      setSynovusMergeTipOpen(false);
                    }
                  }}
                >
                  i
                </button>
                <div
                  id="synovus-merge-tip"
                  role="tooltip"
                  className="asi-info-tip__panel"
                >
                  Synovus has officially merged with Pinnacle Financial Partners, and all branches are scheduled to fully transition to the Pinnacle brand in early 2027.
                </div>
              </div>
            )}
          </div>
          <p className="asi-bank-header__sub">
            {isLoadingAccount && 'Loading account data... '}
            {activeTab==='Overview' && (acct.sector
              ? acct.sector
              : 'Strategic account overview for portfolio review and expansion planning.')}
            {activeTab==='Signals' && 'Business and technology signals shaping account priorities and GTM timing.'}
            {activeTab==='Opportunities' && 'Ranked revenue plays derived from outside-in business, technology and stakeholder signals.'}
            {activeTab==='Organization' && 'Organization structure and leadership hierarchy shaping account access and buying influence.'}
            {activeTab==='News & Events' && 'Market, regulatory, company, thought-leadership, and event signals relevant to account strategy.'}
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleDownloadReport}
            disabled={isDownloadingReport || isLoadingAccount || !accountId}
            style={{
              border: '1px solid #cbd5e1',
              background: isDownloadingReport ? '#f8fafc' : '#ffffff',
              color: '#0f172a',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: isDownloadingReport ? 'default' : 'pointer',
            }}
          >
            {isDownloadingReport ? 'Preparing PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="asi-tabs">
        {TABS.map(tab=>(
          <button key={tab} className={`asi-tab${activeTab===tab?' active':''}`} onClick={()=>setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab==='Overview'      && <OverviewTab acct={acct}/>}
      {activeTab==='Signals'       && <SignalsTab accountId={accountId}/>}
      {activeTab==='Opportunities' && <OpportunitiesTab account={realAccount}/>}
      {activeTab==='Organization'  && <OrganizationTab accountId={accountId} name={acct.name} opportunities={realAccount?.opportunities ?? []}/>}
      {activeTab==='News & Events'  && <NewsTab accountId={acct.id}/>}
    </div>
  );
}
