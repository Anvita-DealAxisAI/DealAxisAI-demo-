import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { accounts } from '../../mockData';
import BankLogo from '../../components/ui/BankLogo';

const tabs = ['Overview', 'Signals', 'Opportunities', 'Organization', 'News'];

// ── Per-bank data ─────────────────────────────────────────────────────────────
const bankData: Record<string, any> = {
  'Synovus': {
    subtitle: 'Strategic account overview for portfolio review and expansion planning.',
    about: 'Synovus is a financial services company headquartered in Columbus, Georgia, focused on relationship-led banking across retail, commercial, and wealth segments throughout the Southeast.',
    products: 'Offers a comprehensive suite of products including deposits, lending, treasury management, payments, mortgages, and digital banking solutions tailored to individuals and businesses.',
    services: 'Provides retail banking, commercial banking, treasury management, wealth advisory, and digital servicing backed by personalized support and innovative technology.',
    financials: [
      { label: 'Asset Size', value: '$60B+', icon: '🏦' },
      { label: 'Revenue', value: '$2.3B', icon: '📈' },
      { label: 'NIM', value: '3.2%', icon: '%' },
      { label: 'Efficiency Ratio', value: '61%', icon: '⚡' },
    ],
    strategy: 'Synovus is committed to disciplined growth through deep client relationships and strategic market focus. The bank invests in digital modernization to enhance customer experience and operational efficiency while expanding relationship-based commercial banking and wealth management capabilities. Synovus prioritizes strong credit quality, risk management, and profitable growth to deliver sustainable shareholder value.',
    competitors: [
      { name: 'Regions', assetSize: '$152B', revenue: '$7.5B', efficiency: '60%' },
      { name: 'Truist', assetSize: '$545B', revenue: '$20.1B', efficiency: '62%' },
      { name: 'Fifth Third', assetSize: '$214B', revenue: '$7.8B', efficiency: '59%' },
      { name: 'KeyBank', assetSize: '$187B', revenue: '$6.7B', efficiency: '63%' },
    ],
    segments: [
      { title: 'Retail Bank', icon: '🛒', color: '#2563eb', desc: 'Focused on deepening digital engagement, growing core deposits, optimizing branch network, and enhancing customer experience to drive loyalty and lifetime value.' },
      { title: 'Commercial Bank', icon: '💼', color: '#10b981', desc: 'Driving commercial lending growth, expanding treasury and payments solutions, strengthening middle-market relationships, and maintaining strong credit quality and risk discipline.' },
      { title: 'Wealth Bank', icon: '👤', color: '#8b5cf6', desc: 'Growing advisory assets, acquiring affluent clients, delivering comprehensive portfolio services, and leveraging integrated relationship coverage across the enterprise.' },
    ],
    signalSummary: 'Synovus is executing a disciplined growth strategy focused on deepening client relationships, expanding commercial and wealth capabilities, and optimizing the deposit franchise. The bank is investing in digital capabilities, simplifying operations, and modernizing core platforms to improve efficiency, enhance client experience, and drive sustainable shareholder value across the Southeast.',
    signals: [
      { title: 'Growth Strategy', icon: '📈', color: '#2563eb', relevance: 'High relevance', relevanceColor: '#10b981', desc: 'Pursuing disciplined growth through client share expansion, selective market investments, and deepening commercial, treasury, and wealth relationships.' },
      { title: 'Operational Efficiency', icon: '⚙️', color: '#10b981', relevance: 'High relevance', relevanceColor: '#10b981', desc: 'Driving efficiency through process simplification, automation, and right-sizing the expense base to improve productivity and client experience.' },
      { title: 'Retail Growth Efficiencies', icon: '👥', color: '#8b5cf6', relevance: 'Active', relevanceColor: '#8b5cf6', desc: 'Strengthening the retail franchise by growing primary relationships, optimizing branch and channel mix, and accelerating digital self-service adoption.' },
      { title: 'Commercial Growth Efficiencies', icon: '💼', color: '#f59e0b', relevance: 'Active', relevanceColor: '#f59e0b', desc: 'Expanding middle-market and corporate relationships, enhancing treasury management capabilities, and delivering specialized industry solutions.' },
      { title: 'Wealth Growth Efficiencies', icon: '💎', color: '#8b5cf6', relevance: 'High relevance', relevanceColor: '#10b981', desc: 'Growing advisory and affluent relationships through integrated planning, expanded product capabilities, and investments in advisor productivity and digital tools.' },
      { title: 'Technology Priorities', icon: '☁️', color: '#06b6d4', relevance: 'Active', relevanceColor: '#8b5cf6', desc: 'Modernizing core platforms and data foundations, advancing cloud and API enablement, and strengthening operational resilience, security, and risk management.' },
    ],
    opportunities: {
      total: 4, range: '$8M-$15M', themes: '—', stakeholders: 12,
      list: [
        {
          title: 'Merger Systems Conversion and Client Experience Assurance',
          priority: 'High', status: 'Confirmed',
          dealSize: '$5M-$15M', timeline: '2026 through early 2027 with stabilization after conversion', buyer: 'Future MVP',
          projectScope: ['Conversion readiness assessment across core, digital, treasury, lending, branch, reporting, identity, and customer-servicing touchpoints.', 'Independent test assurance, mock-conversion support, defect governance, and cutover command-center support.', 'Client-experience assurance across account access, payments, statements, alerts, authentication, and servicing.', 'Branch and field-readiness playbooks, training support, and post-conversion stabilization.'],
          businessDriver: 'Executive mandate, CX protection, operational risk reduction. The public conversion timeline makes this the clearest near-term SI wedge.',
          techStack: { confirmed: 'FIS core signal, My Synovus, Synovus Gateway, nCino.', inferred: 'Core conversion, deposits, digital banking, treasury/payments, branch/teller, IAM, data reconciliation, testing, ITSM/command center.', unknowns: 'Target-state architecture, middleware, branch platform, observability/ITSM, exact nCino scope.' },
        },
        {
          title: 'AI-Enabled Wealth and Commercial Advisory Intelligence',
          priority: 'Medium', status: 'Validated',
          dealSize: '$3M-$8M', timeline: '2026-2027', buyer: 'Chief Data Officer',
          projectScope: ['AI-powered client insights for wealth advisors', 'Commercial relationship scoring and next-best-action recommendations', 'Data platform modernization for analytics enablement'],
          businessDriver: 'Growing advisory assets and improving advisor productivity through AI-driven insights and automation.',
          techStack: { confirmed: 'Salesforce, nCino', inferred: 'Azure ML, Snowflake, Tableau', unknowns: 'Data mesh architecture, real-time streaming platform' },
        },
      ],
    },
    org: {
      summary: 'Synovus operates as a hybrid organization, vertically aligned by core business lines—Retail Banking, Commercial Banking, and Wealth Management—supported by centralized enterprise functions. The technology, data, and analytics leadership (CIO, CDO, and CAO) work in close partnership to coordinate technology strategy, modernization, risk management, and customer experience initiatives across all lines of business.',
      levels: [
        { level: 'CXO', people: [{ name: 'Vikram Ramani', role: 'Chief Information Officer', btn: 'View CIO-1' }, { name: 'Santosh Kokate', role: 'Chief Data Officer', btn: 'View CDO-1' }, { name: 'Kevin Blair', role: 'Chief Analytics Officer', btn: 'View CAO-1' }] },
        { level: 'CXO-1', people: [{ name: 'Sarah Mitchell', role: 'Head of Enterprise Architecture', btn: 'View Details' }, { name: 'David Chen', role: 'Head of Core Banking Technology', btn: 'View Details' }, { name: 'Priya Nair', role: 'Head of Digital Platforms', btn: 'View Details' }] },
        { level: 'CXO-2', people: [{ name: 'Michael Turner', role: 'Director, Data Engineering', btn: 'View Details' }, { name: 'Laura Gomez', role: 'Director, Risk Technology', btn: 'View Details' }, { name: 'James Porter', role: 'Director, Retail Systems Modernization', btn: 'View Details' }] },
      ],
    },
    news: {
      summary: 'Deposit competition remains intense as rate pressures and money market flows persist. Banks are doubling down on digital engagement, payments innovation, and platform modernization to drive growth and efficiency. Regulatory focus is on capital strength, consumer protection, cyber resilience, and responsible AI. Upcoming industry events will spotlight AI, data, and client experience as key priorities for 2025.',
      industry: [
        { title: 'Deposit Competition Intensifies as Rates Stabilize', source: 'American Banker', date: 'May 6, 2025', desc: 'Banks are boosting savings yields and loyalty offers to retain deposits as funding costs remain elevated and rate normalization slows.', icon: '🏦' },
        { title: 'Digital Banking Adoption Hits New Highs', source: 'Forrester', date: 'Apr 30, 2025', desc: 'Digital-first interactions surpass 70% of total banking activity as banks invest in mobile, personalization, and AI-driven experiences.', icon: '📱' },
        { title: 'Wealth Advisors Turn to AI to Drive Productivity', source: 'WealthManagement.com', date: 'Apr 24, 2025', desc: 'AI tools for portfolio insights, client communication, and reporting are helping advisors scale relationships and deepen engagement.', icon: '👥' },
        { title: 'Real-Time Payments and Fraud Prevention Go Mainstream', source: 'PYMNTS', date: 'Apr 17, 2025', desc: 'Financial institutions accelerate real-time rails adoption while investing in advanced fraud detection and authentication.', icon: '⚡' },
      ],
      regulatory: [
        { title: 'Basel III Endgame Capital and Risk Guidance', tag: 'Regulatory', desc: 'Regulators finalize Basel III endgame rules impacting capital, liquidity, and operational risk frameworks for large banks.' },
        { title: 'CFPB Focus on Overdraft and Fees', tag: 'Watchlist', desc: "CFPB proposes new rules to enhance transparency and limit overdraft fees and junk fees for consumer accounts." },
        { title: 'Cyber Resilience and AI Governance in Focus', tag: 'High relevance', desc: 'Agencies emphasize third-party risk, incident reporting, and governance for AI model risk and data privacy.' },
      ],
      bankNews: [
        { month: 'May', day: '06', title: 'Synovus Reports Q1 2025 Results with Strong Loan and Deposit Growth', desc: 'Reported solid quarterly performance driven by commercial lending growth, disciplined expense management, and continued investment in digital and client experience.' },
        { month: 'Apr', day: '30', title: 'Synovus Expands Treasury Management Platform for Middle Market Clients', desc: 'Enhanced capabilities include real-time payments, advanced liquidity tools, and integrated working capital solutions to support growth and efficiency.' },
        { month: 'Apr', day: '22', title: 'Synovus Recognized for Excellence in Client Service and Digital Innovation', desc: 'Awarded by Greenwich Associates for top performance in overall satisfaction and digital banking experience among mid-sized regional banks.' },
      ],
      cxoBlogs: [
        { name: 'Kevin Blair', role: 'Chief Analytics Officer', date: 'May 5, 2025', title: 'Turning Data Into Growth: The Power of Predictive Insights', desc: 'How analytics and AI are enabling better decisions, stronger client outcomes, and sustainable growth in banking.' },
        { name: 'Sarah Mitchell', role: 'Head of Enterprise Architecture', date: 'Apr 29, 2025', title: 'Modernizing Core for the Future of Banking', desc: 'Why core modernization is the foundation for agility, innovation, and seamless customer experiences.' },
        { name: 'Vikram Ramani', role: 'Chief Information Officer', date: 'Apr 21, 2025', title: 'Building Secure, Resilient, and Intelligent Financial Platforms', desc: 'Prioritizing cyber resilience, cloud-native infrastructure, and responsible AI to drive trust and performance.' },
      ],
      events: [
        { name: 'BankTech 2025', dates: 'May 18-21, 2025', location: 'Orlando, FL', desc: 'Explore innovation in digital banking, AI, and payments to drive client engagement.', icon: '🏦' },
        { name: 'WealthManagement Edge', dates: 'June 9-11, 2025', location: 'Boston, MA', desc: 'Connect with industry leaders on advisor productivity, client experience, and growth strategies.', icon: '👥' },
        { name: 'Risk & Compliance Summit', dates: 'July 15-17, 2025', location: 'New York, NY', desc: 'Insights on regulatory change, cyber resilience, and operational risk management.', icon: '🛡️' },
        { name: 'Sibos 2025', dates: 'Sept 29-Oct 2, 2025', location: 'Toronto, Canada', desc: 'The global financial services event for payments, innovation, and collaboration.', icon: '🌐' },
      ],
    },
  },
};

// Generic fallback data for other banks
const genericData = (name: string) => ({
  subtitle: `Strategic account overview for portfolio review and expansion planning.`,
  about: `${name} is a leading financial institution focused on delivering innovative banking solutions across retail, commercial, and wealth segments.`,
  products: `Offers comprehensive banking products including deposits, lending, treasury management, payments, and digital banking solutions.`,
  services: `Provides retail banking, commercial banking, wealth advisory, and digital servicing backed by innovative technology.`,
  financials: [
    { label: 'Asset Size', value: '$45B+', icon: '🏦' },
    { label: 'Revenue', value: '$1.8B', icon: '📈' },
    { label: 'NIM', value: '3.0%', icon: '%' },
    { label: 'Efficiency Ratio', value: '63%', icon: '⚡' },
  ],
  strategy: `${name} is committed to disciplined growth through deep client relationships and strategic market focus, investing in digital modernization to enhance customer experience and operational efficiency.`,
  competitors: [
    { name: 'Regions', assetSize: '$152B', revenue: '$7.5B', efficiency: '60%' },
    { name: 'Truist', assetSize: '$545B', revenue: '$20.1B', efficiency: '62%' },
  ],
  segments: [
    { title: 'Retail Bank', icon: '🛒', color: '#2563eb', desc: 'Focused on deepening digital engagement, growing core deposits, and enhancing customer experience.' },
    { title: 'Commercial Bank', icon: '💼', color: '#10b981', desc: 'Driving commercial lending growth and expanding treasury and payments solutions.' },
    { title: 'Wealth Bank', icon: '👤', color: '#8b5cf6', desc: 'Growing advisory assets and delivering comprehensive portfolio services.' },
  ],
  signalSummary: `${name} is executing a disciplined growth strategy focused on deepening client relationships and expanding capabilities across key business lines.`,
  signals: [
    { title: 'Growth Strategy', icon: '📈', color: '#2563eb', relevance: 'High relevance', relevanceColor: '#10b981', desc: 'Pursuing disciplined growth through client share expansion and deepening commercial relationships.' },
    { title: 'Technology Priorities', icon: '☁️', color: '#06b6d4', relevance: 'Active', relevanceColor: '#8b5cf6', desc: 'Modernizing core platforms and advancing cloud and API enablement.' },
  ],
  opportunities: { total: 3, range: '$5M-$12M', themes: '—', stakeholders: 8, list: [] },
  org: {
    summary: `${name} operates with a hybrid organizational structure aligned by core business lines supported by centralized enterprise functions.`,
    levels: [
      { level: 'CXO', people: [{ name: 'John Smith', role: 'Chief Information Officer', btn: 'View CIO-1' }, { name: 'Jane Doe', role: 'Chief Data Officer', btn: 'View CDO-1' }] },
      { level: 'CXO-1', people: [{ name: 'Alex Johnson', role: 'Head of Enterprise Architecture', btn: 'View Details' }, { name: 'Maria Garcia', role: 'Head of Digital Platforms', btn: 'View Details' }] },
    ],
  },
  news: { summary: '', industry: [], regulatory: [], bankNews: [], cxoBlogs: [], events: [] },
});

const priorityColors: Record<string, string> = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const statusColors: Record<string, string> = { Confirmed: '#2563eb', Validated: '#10b981', Watch: '#f59e0b' };

export default function Accounts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Overview');

  // If navigated from Portfolio with a selected bank, use it
  const initialBank = location.state?.selectedBank
    ? accounts.find(a => a.name === location.state.selectedBank) || accounts[0]
    : accounts[0];
  const [selected, setSelected] = useState(initialBank);
  const [expandedOpp, setExpandedOpp] = useState<number | null>(0);

  const data = bankData[selected.name] || genericData(selected.name);

  const statusCfg: Record<string, any> = {
    Hot: { bg: '#fef2f2', color: '#dc2626' },
    'Big Bet': { bg: '#f5f3ff', color: '#7c3aed' },
    Active: { bg: '#f0fdf4', color: '#16a34a' },
    Watch: { bg: '#fffbeb', color: '#d97706' },
  };

  return (
    <div style={{ display: 'flex', gap: 20, minHeight: '100%' }}>
      {/* Left Account List */}
      <div className="card animate-fade" style={{ width: 210, flexShrink: 0, padding: 12, alignSelf: 'flex-start' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 8px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accounts</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {accounts.map(acc => {
            const isActive = selected.id === acc.id;
            const st = statusCfg[acc.status] || statusCfg.Active;
            return (
              <button key={acc.id} onClick={() => { setSelected(acc); setActiveTab('Overview'); setExpandedOpp(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent', borderLeft: `3px solid ${isActive ? '#2563eb' : 'transparent'}`, transition: 'all 0.15s' }}>
                <BankLogo name={acc.name} size={30} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.name}</p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10, background: st.bg, color: st.color }}>{acc.status}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Detail */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Back + Header */}
        <div>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 14, fontWeight: 500 }}>
            ← Back to Portfolio
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BankLogo name={selected.name} size={56} />
            <div>
              <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', margin: 0 }}>{selected.name} Overview</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{data.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border-color)' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '10px 20px', fontSize: 13, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: `2px solid ${activeTab === t ? '#2563eb' : 'transparent'}`, color: activeTab === t ? '#2563eb' : 'var(--text-secondary)', marginBottom: -2, transition: 'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* About / Products / Services */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { title: 'About Bank', icon: '🏛️', color: '#2563eb', text: data.about },
                { title: 'Products', icon: '📦', color: '#10b981', text: data.products },
                { title: 'Services', icon: '👥', color: '#8b5cf6', text: data.services },
              ].map(card => (
                <div key={card.title} className="card" style={{ padding: 20, borderTop: `3px solid ${card.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{card.icon}</div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>{card.title}</p>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{card.text}</p>
                </div>
              ))}
            </div>

            {/* Key Financials */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: '0 0 16px' }}>Key Financials</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                {data.financials.map((f: any, i: number) => (
                  <div key={i} style={{ background: 'var(--card-bg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: ['#eff6ff','#f0fdf4','#fffbeb','#f5f3ff'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{f.label}</p>
                      <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', margin: 0 }}>{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Strategy */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🎯</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: '0 0 8px' }}>Business Strategy</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{data.strategy}</p>
                </div>
              </div>
            </div>

            {/* Competitive Landscape */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Competitive Landscape</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-primary)' }}>
                    {['Bank', 'Asset Size', 'Revenue', 'Efficiency Ratio'].map(col => (
                      <th key={col} style={{ textAlign: 'left', padding: '10px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.competitors.map((c: any, i: number) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <BankLogo name={c.name} size={28} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{c.assetSize}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{c.revenue}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{c.efficiency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Business Segments */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {data.segments.map((seg: any) => (
                <div key={seg.title} className="card" style={{ padding: 20, borderTop: `3px solid ${seg.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${seg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{seg.icon}</div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>{seg.title}</p>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{seg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SIGNALS TAB ── */}
        {activeTab === 'Signals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📄</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: '0 0 8px' }}>Business Summary</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{data.signalSummary}</p>
                </div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Signal Inventory</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {data.signals.map((sig: any, i: number) => (
                <div key={i} className="card" style={{ padding: 20, borderLeft: `3px solid ${sig.color}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${sig.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{sig.icon}</div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>{sig.title}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${sig.relevanceColor}15`, color: sig.relevanceColor, flexShrink: 0 }}>{sig.relevance}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{sig.desc}</p>
                  <button style={{ alignSelf: 'flex-start', padding: '7px 16px', borderRadius: 20, background: '#2563eb', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>View details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── OPPORTUNITIES TAB ── */}
        {activeTab === 'Opportunities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', margin: '0 0 4px' }}>Opportunity Landscape - {selected.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Ranked revenue plays derived from outside-in business, technology and stakeholder signals.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { label: 'Total opportunities', value: data.opportunities.total, color: '#10b981' },
                { label: 'Opportunity range', value: data.opportunities.range, color: '#2563eb' },
                { label: 'Top service line themes', value: data.opportunities.themes, color: '#f59e0b' },
                { label: 'Stakeholders', value: data.opportunities.stakeholders, color: '#8b5cf6' },
              ].map(k => (
                <div key={k.label} className="card" style={{ padding: 16, borderLeft: `3px solid ${k.color}` }}>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '0 0 4px' }}>{k.label}</p>
                  <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', margin: 0 }}>{k.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.opportunities.list.map((opp: any, i: number) => {
                const isExpanded = expandedOpp === i;
                return (
                  <div key={i} className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: priorityColors[opp.priority], color: 'white' }}>{opp.priority}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, border: `1px solid ${statusColors[opp.status]}`, color: statusColors[opp.status] }}>{opp.status}</span>
                        </div>
                        <button onClick={() => setExpandedOpp(isExpanded ? null : i)} style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {isExpanded ? 'Hide details ↑' : 'View details →'}
                        </button>
                      </div>
                      <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', margin: '0 0 16px' }}>{opp.title}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[{ label: 'DEAL SIZE', val: opp.dealSize }, { label: 'TIMELINE', val: opp.timeline }, { label: 'BUYER', val: opp.buyer }].map(f => (
                          <div key={f.label}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 3px', letterSpacing: '0.05em' }}>{f.label}</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{f.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                          <div className="card" style={{ padding: 16 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Project Scope</p>
                            <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                              {opp.projectScope.map((s: string, j: number) => (
                                <li key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="card" style={{ padding: 16 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Business Driver</p>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{opp.businessDriver}</p>
                          </div>
                          <div className="card" style={{ padding: 16 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Technology Stack Intelligence</p>
                            {[{ label: 'CONFIRMED', val: opp.techStack.confirmed, bg: '#dcfce7', color: '#15803d' }, { label: 'INFERRED', val: opp.techStack.inferred, bg: '#dbeafe', color: '#1d4ed8' }, { label: 'UNKNOWNS', val: opp.techStack.unknowns, bg: '#fef9c3', color: '#a16207' }].map(ts => (
                              <div key={ts.label} style={{ marginBottom: 8 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: ts.bg, color: ts.color }}>{ts.label}</span>
                                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>{ts.val}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <button style={{ padding: '10px 24px', borderRadius: 20, background: '#2563eb', color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View details →</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {data.opportunities.list.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Opportunity data will be available once connected to backend.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ORGANIZATION TAB ── */}
        {activeTab === 'Organization' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏗️</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: '0 0 8px' }}>Overview of the Organization</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{data.org.summary}</p>
                </div>
              </div>
            </div>
            {data.org.levels.map((lvl: any) => (
              <div key={lvl.level} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>{lvl.level}</p>
                  {lvl.level === 'CXO' && <button style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer' }}>View CXO-1</button>}
                </div>
                {lvl.people.map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < lvl.people.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                        {p.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>{p.name}</p>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, flex: 1, paddingLeft: 40 }}>{p.role}</p>
                    <button style={{ fontSize: 11, fontWeight: 600, padding: '6px 16px', borderRadius: 20, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>{p.btn}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── NEWS TAB ── */}
        {activeTab === 'News' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {data.news.summary && (
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📰</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: '0 0 8px' }}>News Summary</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{data.news.summary}</p>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              {/* Industry News */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>Key Banking and Wealth Management Industry News <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 400 }}>(Last 4 Weeks)</span></h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {data.news.industry.map((n: any, i: number) => (
                    <div key={i} style={{ padding: 16, borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none', borderRight: i % 2 === 0 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)', margin: '0 0 2px' }}>{n.title}</p>
                          <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '0 0 6px' }}>{n.source} · {n.date}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{n.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>Key Regulatory Updates</h3>
                </div>
                {data.news.regulatory.map((r: any, i: number) => (
                  <div key={i} style={{ padding: 16, borderBottom: i < data.news.regulatory.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>{r.title}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: r.tag === 'Regulatory' ? '#dbeafe' : r.tag === 'Watchlist' ? '#fef9c3' : '#dcfce7', color: r.tag === 'Regulatory' ? '#1d4ed8' : r.tag === 'Watchlist' ? '#a16207' : '#15803d', flexShrink: 0 }}>{r.tag}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank News */}
            {data.news.bankNews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>Latest {selected.name} News</h3>
                  </div>
                  {data.news.bankNews.map((n: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 16, padding: 16, borderBottom: i < data.news.bankNews.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: '#2563eb', margin: 0, textTransform: 'uppercase' }}>{n.month}</p>
                        <p style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 20, color: '#2563eb', margin: 0 }}>{n.day}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', margin: '0 0 4px' }}>{n.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{n.desc}</p>
                      </div>
                      <div style={{ flexShrink: 0, alignSelf: 'center' }}>›</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>CXO Blogs / Thought Leadership</h3>
                  </div>
                  {data.news.cxoBlogs.map((b: any, i: number) => (
                    <div key={i} style={{ padding: 14, borderBottom: i < data.news.cxoBlogs.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {b.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '0 0 2px' }}>{b.name} · {b.role}</p>
                          <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '0 0 4px' }}>{b.date}</p>
                          <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)', margin: '0 0 3px' }}>{b.title}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{b.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {data.news.events.length > 0 && (
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>Upcoming Banking Events <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 400 }}>(Next 3 Months)</span></h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
                  {data.news.events.map((ev: any, i: number) => (
                    <div key={i} style={{ padding: 16, borderRight: i < 3 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>{ev.icon}</div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: '0 0 2px' }}>{ev.name}</p>
                      <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, margin: '0 0 2px' }}>{ev.dates} · {ev.location}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
