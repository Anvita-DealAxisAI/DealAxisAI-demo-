import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon, BankLogo } from '../../components/SvgIcons';
import PortfolioKpiCard, { type PortfolioKpi } from '../../components/PortfolioKpiCard';
import hotAccountsIcon from '../../../logo/icons/hot-accounts.svg';
import { PORTFOLIO_ACCOUNTS, getDemoAccountsSubset } from '../../data/staticData';
import { useAuth } from '../../store/AuthContext';
import './Portfolio.css';

type DemoAccount = (typeof PORTFOLIO_ACCOUNTS)[number];
type AccountSortOption =
  | 'opportunities-desc'
  | 'opportunities-asc'
  | 'value-desc'
  | 'value-asc'
  | 'monitoring-latest'
  | 'monitoring-earliest';

const DEFAULT_ACCOUNT_SORT: AccountSortOption = 'monitoring-latest';
const ACCOUNT_STATUSES = ['All', 'Hot', 'Active', 'Monitor'];

function getMonitoringStartTime(monStart: string) {
  const [month, year] = monStart.trim().split(/\s+/);
  if (!month || !year) return 0;
  const time = Date.parse(`${month} 1, ${year}`);
  return Number.isFinite(time) ? time : 0;
}

function getPinnedPriority(accountId: string) {
  if (accountId === 'A002') return 0; // Synovus
  if (accountId === 'A001') return 1; // Citizens
  return 2;
}

function buildDemoPortfolioKpis(accounts: DemoAccount[]): PortfolioKpi[] {
  const hotAccounts = accounts.filter((a) => a.status === 'Hot').length;
  const highValueOpps = accounts
    .filter((a) => a.valueMid >= 5)
    .reduce((sum, a) => sum + a.opps, 0);
  const totalValue = accounts.reduce((sum, a) => sum + a.valueMid, 0);

  return [
    {
      label: 'Accounts',
      value: String(accounts.length),
      sub: 'Strategic accounts tracked',
      variant: 'accounts',
    },
    {
      label: 'Hot Accounts',
      value: String(hotAccounts),
      sub: 'Accounts requiring focus',
      variant: 'hot',
    },
    {
      label: 'High Value Opportunities',
      value: String(highValueOpps),
      sub: 'Opportunities above $5M',
      variant: 'high-value',
    },
    {
      label: 'Opportunity Value',
      value: `$${totalValue}M`,
      sub: 'Estimated portfolio value',
      variant: 'opportunity-value',
    },
  ];
}

const CAP_COLORS: Record<string,string> = {
  'Data':          '#dbeafe',  'AI':           '#ede9fe',
  'QE':            '#dcfce7',  'Reg Rpt':      '#fef9c3',
  'Cloud':         '#cffafe',  'Infra':        '#e0f2fe',
  'Core':          '#fce7f3',  'Digital':      '#f3e8ff',
  'Cybersecurity': '#fef3c7',
};
const CAP_TEXT: Record<string,string> = {
  'Data':'#1e40af','AI':'#6d28d9','QE':'#15803d','Reg Rpt':'#854d0e',
  'Cloud':'#0e7490','Infra':'#0369a1','Core':'#9d174d','Digital':'#7e22ce','Cybersecurity':'#92400e',
};

const STATUS_ICON = {
  Hot:     <><img src={hotAccountsIcon} alt="" aria-hidden style={{ width: 11, height: 11, display: 'block', flexShrink: 0 }} /> Hot</>,
  Active:  <><span style={{width:7,height:7,borderRadius:'50%',background:'#16a34a',display:'inline-block',marginRight:4}}/>Active</>,
  Monitor: <><Icon name="search" size={11} color="#2563eb"/> Monitor</>,
};
const STATUS_CLASS: Record<string,string> = { Hot:'asi-badge--hot', Active:'asi-badge--active', Monitor:'asi-badge--monitor' };

// Bubble shape converter — used per-render via visibleBubbles below

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const navigate = useNavigate();
  const placeLabelLeft = payload?.name === 'M&T Bank' || payload?.name === 'Truist';
  const labelX = placeLabelLeft ? cx - payload.r - 4 : cx + payload.r + 4;
  const labelAnchor = placeLabelLeft ? 'end' : 'start';
  return (
    <g
      onClick={() => navigate(`/accounts/${payload.id}?tab=Opportunities`)}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={cx} cy={cy} r={payload.r} fill={payload.color} fillOpacity={0.82} />
      <text x={labelX} y={cy - 3} textAnchor={labelAnchor} fontSize={11} fontWeight={600} fill="#0f172a" fontFamily="Inter">{payload.name}</text>
      <text x={labelX} y={cy + 11} textAnchor={labelAnchor} fontSize={11} fill="#64748b" fontFamily="Inter">{payload.value}</text>
    </g>
  );
};

export default function Portfolio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [capFilter, setCapFilter] = useState('All Capabilities');
  const [statusFilter, setStatusFilter] = useState('All');
  const [accountSort, setAccountSort] = useState<AccountSortOption>(DEFAULT_ACCOUNT_SORT);
  const today = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

  // Experimental: demo1..demo10 accounts see a subset of banks (1-8) to
  // preview how the Prioritization Matrix looks with fewer/more accounts.
  // Official accounts (ajay@, demo@) are unaffected and always see all 10.
  const visibleAccounts = getDemoAccountsSubset(user?.bankCount);
  const portfolioKpis = useMemo(() => buildDemoPortfolioKpis(visibleAccounts), [visibleAccounts]);
  const accountPortfolioRows = useMemo(() => {
    return visibleAccounts
      .filter((account) => statusFilter === 'All' || account.status === statusFilter)
      .toSorted((a, b) => {
        const pinnedDiff = getPinnedPriority(a.id) - getPinnedPriority(b.id);
        if (pinnedDiff !== 0) return pinnedDiff;

        switch (accountSort) {
          case 'opportunities-asc':
            return a.opps - b.opps || a.name.localeCompare(b.name);
          case 'value-desc':
            return b.valueMid - a.valueMid || a.name.localeCompare(b.name);
          case 'value-asc':
            return a.valueMid - b.valueMid || a.name.localeCompare(b.name);
          case 'monitoring-latest':
            return getMonitoringStartTime(b.monStart) - getMonitoringStartTime(a.monStart) || a.name.localeCompare(b.name);
          case 'monitoring-earliest':
            return getMonitoringStartTime(a.monStart) - getMonitoringStartTime(b.monStart) || a.name.localeCompare(b.name);
          case 'opportunities-desc':
          default:
            return b.opps - a.opps || a.name.localeCompare(b.name);
        }
      });
  }, [accountSort, statusFilter, visibleAccounts]);
  const hasAccountFilterChanges = statusFilter !== 'All' || accountSort !== DEFAULT_ACCOUNT_SORT;
  const visibleBubbles = visibleAccounts.map(a => ({
    x: a.easeX, y: Math.min(95, a.valueMid * 7 + 15),
    name: a.name, value: a.value, color: a.color, r: Math.max(13, Math.sqrt(a.valueMid) * 11) * 0.75,
    id: a.id,
  }));

  return (
    <div className="animate-in portfolio-page">
      {/* Header */}
      <div className="portfolio-page__header">
        <div>
          <h1 className="asi-page-header__title">Portfolio Overview</h1>
          <p className="asi-page-header__sub">AI-powered insights to prioritize accounts and maximize revenue opportunities.</p>
        </div>
        <button className="asi-btn asi-btn--outline" style={{gap:6,fontSize:13}}>
          <Icon name="calendar" size={13} color="#64748b"/> As of {today}
        </button>
      </div>

      <div className="portfolio-kpi-grid">
        {portfolioKpis.map((kpi, i) => (
          <PortfolioKpiCard
            key={kpi.label}
            kpi={kpi}
            onClick={kpi.variant === 'accounts' ? () => navigate('/accounts') : undefined}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          />
        ))}
      </div>

      {/* Prioritization Matrix */}
      <div className="asi-card" style={{padding:24,marginBottom:24}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <h2 style={{fontSize:17,fontWeight:600,color:'#0f172a'}}>Prioritization Matrix</h2>
              <Icon name="info" size={16} color="#94a3b8"/>
            </div>
            <p style={{fontSize:13,color:'#64748b',marginTop:2}}>Opportunity Value vs Ease of Entry across accounts. Bubble size represents opportunity value.</p>
          </div>
          <select value={capFilter} onChange={e=>setCapFilter(e.target.value)}
            style={{fontSize:12,padding:'7px 12px',borderRadius:8,border:'1px solid #e2e8f0',background:'white',color:'#0f172a',outline:'none',cursor:'pointer'}}>
            <option>All Capabilities</option>
            {['Data & AI','Quality Engineering','Reg Reporting','Core Modernization','Cybersecurity','Cloud & Infra','Digital Experience'].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="portfolio-matrix__body">
          <div className="portfolio-matrix__chart">
            {/* Y-axis labels */}
            <div style={{display:'flex',gap:0}}>
              {/* Vertical "Opportunity Value" label */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:24,marginRight:4}}>
                <span style={{
                  fontSize:11, fontWeight:700, color:'#0f172a',
                  writingMode:'vertical-rl', transform:'rotate(180deg)',
                  whiteSpace:'nowrap', letterSpacing:'0.03em',
                }}>Opportunity Value ($)</span>
              </div>
              <div style={{width:64,display:'flex',flexDirection:'column',justifyContent:'space-between',paddingBottom:44,paddingTop:10}}>
                {['15M+', '5M-15M', '<5M'].map((range) => (
                  <div key={range} style={{textAlign:'right',paddingRight:8}}>
                    <p style={{fontSize:11,fontWeight:600,color:'#64748b',margin:0,whiteSpace:'nowrap'}}>{range}</p>
                  </div>
                ))}
              </div>
              <div style={{flex:1}}>
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart margin={{top:16,right:90,bottom:24,left:24}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis type="number" dataKey="x" domain={[-12,112]} hide/>
                    <YAxis type="number" dataKey="y" domain={[-12,112]} hide/>
                    <Tooltip cursor={false} content={({active,payload})=>{
                      if(!active||!payload?.length) return null;
                      const d=payload[0].payload;
                      return <div className="asi-card" style={{padding:'10px 14px',fontSize:12}}><p style={{fontWeight:600,color:'#0f172a',margin:'0 0 2px'}}>{d.name}</p><p style={{color:'#2563eb',fontWeight:600,margin:0}}>{d.value}</p></div>;
                    }}/>
                    <Scatter data={visibleBubbles} shape={CustomDot}/>
                  </ScatterChart>
                </ResponsiveContainer>
                {/* X-axis labels */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',paddingLeft:0,marginTop:-8}}>
                  {['Easy', 'Medium', 'Hard'].map((label) => (
                    <div key={label} style={{textAlign:'center'}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#64748b',margin:0}}>{label}</p>
                    </div>
                  ))}
                </div>
                <p style={{textAlign:'center',fontSize:11,fontWeight:700,color:'#0f172a',marginTop:4}}>Ease of Entry</p>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="portfolio-matrix__legend">
            <p style={{fontSize:12,fontWeight:600,color:'#0f172a',marginBottom:12}}>Capabilities</p>
            {[
              {c:'#3b82f6',l:'Data & AI'},     {c:'#f97316',l:'Quality Engineering'},
              {c:'#22c55e',l:'Reg Reporting'},   {c:'#8b5cf6',l:'Core Modernization'},
              {c:'#14b8a6',l:'Cybersecurity'},   {c:'#eab308',l:'Cloud & Infra'},
              {c:'#ec4899',l:'Digital Experience'},{c:'#94a3b8',l:'Other'},
            ].map(cap=>(
              <div key={cap.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                <div style={{width:11,height:11,borderRadius:'50%',background:cap.c,flexShrink:0}}/>
                <span style={{fontSize:12,color:'#64748b'}}>{cap.l}</span>
              </div>
            ))}
            <p style={{fontSize:11,color:'#94a3b8',marginTop:12,fontStyle:'italic'}}>Bubble size = Opportunity Value</p>
          </div>
        </div>
      </div>

      {/* Account Portfolio Table */}
      <div className="asi-card portfolio-table-wrap">
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,padding:'18px 20px',borderBottom:'1px solid #e2e8f0',flexWrap:'wrap'}}>
          <h2 style={{fontSize:17,fontWeight:600,color:'#0f172a',margin:0}}>Account Portfolio</h2>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end'}}>
            <label style={{display:'flex',flexDirection:'column',gap:5,fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.04em'}}>
              Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{minWidth:120,fontSize:12,padding:'7px 10px',borderRadius:8,border:'1px solid #e2e8f0',background:'white',color:'#0f172a',outline:'none',cursor:'pointer'}}
              >
                {ACCOUNT_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label style={{display:'flex',flexDirection:'column',gap:5,fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.04em'}}>
              Sort By
              <select
                value={accountSort}
                onChange={(e) => setAccountSort(e.target.value as AccountSortOption)}
                style={{minWidth:220,fontSize:12,padding:'7px 10px',borderRadius:8,border:'1px solid #e2e8f0',background:'white',color:'#0f172a',outline:'none',cursor:'pointer'}}
              >
                <option value="opportunities-desc">Opportunities: High to Low</option>
                <option value="opportunities-asc">Opportunities: Low to High</option>
                <option value="value-desc">Opportunity Value: High to Low</option>
                <option value="value-asc">Opportunity Value: Low to High</option>
                <option value="monitoring-latest">Monitoring Started: Newest</option>
                <option value="monitoring-earliest">Monitoring Started: Oldest First</option>
              </select>
            </label>
            {hasAccountFilterChanges && (
              <button
                className="asi-btn asi-btn--outline asi-btn--sm"
                onClick={() => {
                  setStatusFilter('All');
                  setAccountSort(DEFAULT_ACCOUNT_SORT);
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <table className="asi-table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th style={{textAlign:'center'}}>Opportunities</th>
              <th style={{textAlign:'center'}}>Opportunity Value</th>
              <th>Capabilities</th>
              <th style={{textAlign:'center'}}>Monitoring Started</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accountPortfolioRows.map(a=>(
              <tr key={a.id} onClick={()=>navigate(`/accounts/${a.id}`)} style={{cursor:'pointer'}}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <BankLogo name={a.name} size={28}/>
                    <span style={{fontWeight:500,color:'#0f172a'}}>{a.name}</span>
                  </div>
                </td>
                <td style={{textAlign:'center'}}>
                  <button
                    type="button"
                    className="portfolio-table__metric-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/accounts/${a.id}?tab=Opportunities`);
                    }}
                    aria-label={`View opportunities for ${a.name}`}
                  >
                    {a.opps}
                  </button>
                </td>
                <td style={{textAlign:'center'}}>
                  <button
                    type="button"
                    className="portfolio-table__metric-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/accounts/${a.id}?tab=Opportunities`);
                    }}
                    aria-label={`View opportunity value details for ${a.name}`}
                  >
                    {a.value}
                  </button>
                </td>
                <td>
                  {a.capabilities.map(c=>(
                    <span key={c} className="asi-cap-chip" style={{background:CAP_COLORS[c]||'#f1f5f9',color:CAP_TEXT[c]||'#475569'}}>{c}</span>
                  ))}
                </td>
                <td style={{textAlign:'center',color:'#64748b'}}>{a.monStart}</td>
                <td>
                  <span className={`asi-badge ${STATUS_CLASS[a.status]}`} style={{display:'inline-flex',alignItems:'center',gap:4}}>
                    {STATUS_ICON[a.status as keyof typeof STATUS_ICON]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
