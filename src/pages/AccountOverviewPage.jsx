import React, { useState } from 'react';
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
import { SYNOVUS_SIGNALS, SYNOVUS_ORG, SYNOVUS_NEWS, SYNOVUS_OPPORTUNITIES } from '../data/staticData';
import OpportunitiesContent from '../components/OpportunitiesContent';
import { getAccountById } from '../data/mockData';

/* ─── Static account data ─────────────────────────────────────────── */
const ACCOUNTS = {
  A001: { name:'Citizens',    logo:'/banks/citizens.png',   sector:'Banking', color:'#16a34a' },
  A002: { name:'Synovus',     logo:'/banks/synovus.jpg',    sector:'Banking', color:'#dc2626' },
  A003: { name:'BECU',        logo:'/banks/becu.png',       sector:'Banking', color:'#1d4ed8' },
  A004: { name:'PNC',         logo:'/banks/pnc.png',        sector:'Banking', color:'#ea580c' },
  A005: { name:'US Bank',     logo:'/banks/usbank.png',     sector:'Banking', color:'#dc2626' },
  A006: { name:'M&T Bank',    logo:'/banks/mtb.png',        sector:'Banking', color:'#0f766e' },
  A007: { name:'Truist',      logo:'/banks/truist.png',     sector:'Banking', color:'#7c3aed' },
  A008: { name:'Fifth Third', logo:'/banks/fifththird.png', sector:'Banking', color:'#1d4ed8' },
  A009: { name:'Regions',     logo:'/banks/regions.png',    sector:'Banking', color:'#16a34a' },
  A010: { name:'KeyBank',     logo:'/banks/keybank.png',    sector:'Banking', color:'#dc2626' },
};

const TABS = ['Overview','Signals','Opportunities','Organization','News & Events'];

/* ─── OVERVIEW TAB ────────────────────────────────────────────────── */
function OverviewTab({ acct }) {
  return (
    <div className="animate-in">
      {/* Info cards */}
      <div className="portfolio-kpi-grid portfolio-kpi-grid--3">
        {[
          {
            label: 'About Bank',
            variant: 'accounts',
            sub: `${acct.name} is a regional financial-services organization focused on relationship-led banking across retail, commercial and wealth segments.`,
          },
          {
            label: 'Products',
            variant: 'opportunity-value',
            icon: briefcaseIcon,
            sub: 'Consumer and commercial lending, treasury management, payments, mortgages, digital banking, wealth and advisory services.',
          },
          {
            label: 'Services',
            variant: 'high-value',
            icon: monitorCogIcon,
            sub: 'Retail banking, commercial banking, treasury, payments, private banking, wealth advisory, branch and digital servicing.',
          },
        ].map((kpi, i) => (
          <PortfolioKpiCard
            key={kpi.label}
            kpi={kpi}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          />
        ))}
      </div>

      {/* Key Financials */}
      <div style={{marginBottom:20}}>
        <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:12}}>Key Financials</h3>
        <div className="asi-financials">
          {[
            { label:'Asset Size',       value:'$60B+', icon: piggyBankIcon,  bg:'#fdf2f8', iconSize: 21 },
            { label:'Revenue',          value:'$2.3B', icon: revenueIcon,    bg:'#f0fdf4' },
            { label:'NIM',              value:'3.2%',  icon: percentIcon,    bg:'#fef9c3' },
            { label:'Efficiency Ratio', value:'61%',   icon: zapIcon,        bg:'#f5f3ff' },
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

      {/* Business Strategy */}
      <div className="asi-strategy">
        <div className="asi-strategy__icon"><img src={businessStrategyIcon} alt="" width={24} height={24} aria-hidden /></div>
        <div>
          <h3 className="asi-strategy__title">Business Strategy</h3>
          <p className="asi-strategy__text">{acct.name} is committed to disciplined growth through deep client relationships and strategic market focus. The bank invests in digital modernization to enhance customer experience and operational efficiency while expanding relationship-based commercial banking and wealth management capabilities. {acct.name} prioritizes strong credit quality, risk management, and profitable growth to deliver sustainable shareholder value.</p>
        </div>
      </div>

      {/* Competitive Landscape */}
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
              {[
                {name:'Regions',     asset:'$152B',rev:'$7.5B', eff:'60%'},
                {name:'Truist',      asset:'$545B',rev:'$20.1B',eff:'62%'},
                {name:'Fifth Third', asset:'$214B',rev:'$7.8B', eff:'59%'},
                {name:'KeyBank',     asset:'$187B',rev:'$6.7B', eff:'63%'},
              ].map(r=>(
                <tr key={r.name}>
                  <td><div style={{display:'flex',alignItems:'center',gap:10}}><BankLogo name={r.name} size={28}/><span style={{fontWeight:500}}>{r.name}</span></div></td>
                  <td style={{textAlign:'center'}}>{r.asset}</td>
                  <td style={{textAlign:'center'}}>{r.rev}</td>
                  <td style={{textAlign:'center'}}>{r.eff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Segments */}
      <div className="asi-info-grid">
        {[
          { title:'Retail Bank',       icon: shoppingCartIcon,   color:'blue',  bg:'#eff6ff',
            text:'Focused on deepening digital engagement, growing core deposits, optimizing branch and channel mix, and enhancing customer experience to drive loyalty and lifetime value.' },
          { title:'Commercial Bank',   icon: commercialBankIcon, color:'green', bg:'#f0fdf4',
            text:'Driving commercial lending growth, expanding treasury and payments solutions, strengthening middle-market relationships, and maintaining strong credit quality and risk discipline.' },
          { title:'Wealth Bank',       icon: walletIcon,         color:'purple',bg:'#f5f3ff',
            text:'Growing advisory assets, acquiring affluent clients, delivering comprehensive portfolio services, and leveraging integrated relationship coverage across the enterprise.' },
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
    </div>
  );
}

/* ─── SIGNALS TAB ─────────────────────────────────────────────────── */
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

function SignalsTab({ name }) {
  return (
    <div className="animate-in">
      {/* Business Summary */}
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
          <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:6}}>Business Summary</h3>
          <p style={{fontSize:13,color:'#334155',lineHeight:1.7}}>{name} is executing a disciplined growth strategy focused on deepening client relationships, expanding commercial and wealth capabilities, and optimizing the deposit franchise. The bank is investing in digital capabilities, simplifying operations, and modernizing core platforms to improve efficiency, enhance client experience, and drive sustainable shareholder value across the Southeast.</p>
        </div>
      </div>

      {/* Signal Inventory */}
      <h3 style={{fontSize:16,fontWeight:600,color:'#0f172a',marginBottom:14}}>Signal Inventory</h3>
      <div className="asi-signal-grid">
        {SYNOVUS_SIGNALS.map(sig=>{
          const col = SIG_COLORS[sig.color] || SIG_COLORS.blue;
          const iconSrc = SIG_ICON_ASSETS[sig.icon] || integrationsIcon;
          const relBg = sig.relevance==='High relevance'?'#f0fdf4':sig.relevance==='Active'?'#f5f3ff':'#f8fafc';
          const relColor = sig.relevance==='High relevance'?'#16a34a':sig.relevance==='Active'?'#7c3aed':'#64748b';
          return (
            <div key={sig.id} className={`asi-signal-card asi-signal-card--${sig.color}`}>
              <div className="asi-signal-card__head">
                <div className="asi-signal-card__icon" style={{background:col.bg}}>
                  <img src={iconSrc} alt="" width={20} height={20} aria-hidden />
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:relBg,color:relColor,whiteSpace:'nowrap'}}>{sig.relevance}</span>
              </div>
              <h4 className="asi-signal-card__title">{sig.title}</h4>
              <p className="asi-signal-card__desc">{sig.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── OPPORTUNITIES TAB ───────────────────────────────────────────── */
function OpportunitiesTab({ accountId }) {
  // Use the real account data from mockData (CSV-parsed) for Synovus
  // Fall back gracefully for other accounts
  const mockAccount = getAccountById('1') ?? getAccountById(accountId);
  return (
    <div className="animate-in">
      <OpportunitiesContent account={mockAccount} isLoading={false} />
    </div>
  );
}

/* ─── ORGANIZATION TAB ────────────────────────────────────────────── */
function OrganizationTab({ name }) {
  const [activeOrgTab, setActiveOrgTab] = React.useState(0);
  const [expandedOpp, setExpandedOpp] = React.useState(null);
  const tab = SYNOVUS_ORG.tabs[activeOrgTab];

  const stars = (n) => Array.from({length:5}, (_, i) => (
    <span key={i} style={{color: i < n ? '#f59e0b' : '#e2e8f0', fontSize:15}}>★</span>
  ));

  const kpis = [
    {
      label:'Total Stakeholders',
      value:SYNOVUS_ORG.kpis.totalStakeholders,
      sub:'Across all functions',
      icon: stakeholdersIcon,
      color:'#eff6ff',
      gradient:'linear-gradient(135deg, rgba(96, 176, 232, 0.03) 0%, rgba(37, 99, 235, 0.06) 35%, rgba(0, 89, 207, 0.09) 70%, rgba(0, 89, 207, 0.1) 100%)',
    },
    {
      label:'Executive Leaders',
      value:SYNOVUS_ORG.kpis.executiveLeaders,
      sub:'CxO / SVP / EVP',
      icon: userStarIcon,
      color:'#f0fdf4',
      gradient:'linear-gradient(135deg, rgba(204, 251, 196, 0.03) 0%, rgba(130, 209, 115, 0.06) 35%, rgba(36, 158, 70, 0.09) 70%, rgba(36, 158, 70, 0.1) 100%)',
    },
    {
      label:'Function Leaders',
      value:SYNOVUS_ORG.kpis.functionLeaders,
      sub:'Directors and above',
      icon: userPenIcon,
      color:'#faf5ff',
      gradient:'linear-gradient(135deg, rgba(237, 233, 254, 0.03) 0%, rgba(196, 181, 253, 0.06) 35%, rgba(139, 92, 246, 0.09) 70%, rgba(109, 40, 217, 0.1) 100%)',
    },
    {
      label:'Opportunity Owners',
      value:SYNOVUS_ORG.kpis.opportunityOwners,
      sub:'Mapped to opportunities',
      icon: teamIcon,
      color:'#fff7ed',
      gradient:'linear-gradient(135deg, rgba(254, 226, 226, 0.03) 0%, rgba(252, 165, 165, 0.06) 35%, rgba(239, 68, 68, 0.09) 70%, rgba(220, 38, 38, 0.1) 100%)',
    },
  ];

  const engagementColor = (e) => e==='Very High' ? '#16a34a' : e==='High' ? '#2563eb' : '#94a3b8';

  return (
    <div className="animate-in">

      {/* Subtitle line */}
      <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>Key decision makers and influencers across {name} Bank</p>

      {/* 4 KPI cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {kpis.map(k => (
          <div key={k.label} style={{background:k.gradient,borderRadius:12,padding:'20px 18px',boxShadow:'var(--card-shadow)',display:'flex',alignItems:'flex-start',gap:14}}>
            <div style={{width:48,height:48,borderRadius:10,background:k.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <img src={k.icon} alt="" width={24} height={24} aria-hidden />
            </div>
            <div>
              <p style={{fontSize:26,fontWeight:700,color:'#0f172a',lineHeight:1}}>{k.value}</p>
              <p style={{fontSize:13,fontWeight:600,color:'#0f172a',marginTop:4}}>{k.label}</p>
              <p style={{fontSize:12,color:'#64748b',marginTop:2}}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main stakeholder card */}
      <div style={{background:'white',borderRadius:12,boxShadow:'var(--card-shadow)',overflow:'hidden',marginBottom:24}}>
        {/* Tab bar */}
        <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',padding:'0 20px',gap:0}}>
          {SYNOVUS_ORG.tabs.map((t, idx) => (
            <button key={t.label} onClick={() => setActiveOrgTab(idx)} style={{
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
        <div style={{display:'grid',gridTemplateColumns:'240px 210px 170px 1fr 110px 100px',padding:'10px 20px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0'}}>
          {['Stakeholder','Title','Function','Key Focus Areas','Opportunities','Influence'].map((h,hi) => (
            <span key={h} style={{fontSize:11,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',textAlign:hi===4?'center':'left'}}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {tab.people.map((p, i) => (
          <div key={p.name} style={{
            display:'grid',gridTemplateColumns:'240px 210px 170px 1fr 110px 100px',
            alignItems:'center',padding:'14px 20px',
            borderBottom: i < tab.people.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:700,color:'#fff'}}>{p.initials}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:14,fontWeight:600,color:'#0f172a'}}>{p.name}</span>
              </div>
            </div>
            <span style={{fontSize:13,color:'#475569',lineHeight:1.4}}>{p.title}</span>
            <span style={{fontSize:13,color:'#64748b'}}>{p.function}</span>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {p.focus.map(a => (
                <span key={a} style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#eff6ff',color:'#2563eb',fontWeight:500,whiteSpace:'nowrap'}}>{a}</span>
              ))}
              {p.extraFocus > 0 && <span style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#f1f5f9',color:'#64748b'}}>+{p.extraFocus}</span>}
            </div>
            <span style={{fontSize:14,fontWeight:600,color:'#0f172a',textAlign:'center',display:'block'}}>{p.opps}</span>
            <div>{stars(p.stars)}</div>
          </div>
        ))}
        {/* View All link */}
        <div style={{padding:'14px 20px',borderTop:'1px solid #f1f5f9',textAlign:'center'}}>
          <span style={{fontSize:13,fontWeight:500,color:'#2563eb',cursor:'pointer'}}>{tab.viewAllLabel} →</span>
        </div>
      </div>

      {/* Top Opportunity Owners */}
      <div style={{marginBottom:12}}>
        <h3 style={{fontSize:15,fontWeight:600,color:'#0f172a',margin:0}}>Top Opportunity Owners</h3>
      </div>

      {/* Expanded card view */}
      {expandedOpp !== null && (
        <div style={{background:'white',borderRadius:12,boxShadow:'var(--card-shadow)',padding:24,marginBottom:20,border:'2px solid #2563eb'}}>
          {/* Back + header */}
          <button onClick={() => setExpandedOpp(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#2563eb',fontWeight:500,marginBottom:16,display:'flex',alignItems:'center',gap:4}}>
            ← Back to Organization
          </button>
          {(() => {
            const opp = SYNOVUS_ORG.topOpportunityOwners[expandedOpp];
            const priorityStyle = opp.priority==='High' ? {bg:'#fef2f2',color:'#dc2626'} : {bg:'#fff7ed',color:'#ea580c'};
            return (
              <>
                {/* Opportunity header */}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                      <span style={{width:28,height:28,borderRadius:'50%',background:'#eff6ff',color:'#2563eb',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>{opp.rank}</span>
                      <span style={{fontSize:18,fontWeight:700,color:'#0f172a'}}>{opp.title}</span>
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
        {SYNOVUS_ORG.topOpportunityOwners.map((opp, idx) => {
          const ps = opp.priority==='High' ? {bg:'#fef2f2',color:'#dc2626'} : {bg:'#fff7ed',color:'#ea580c'};
          const isOpen = expandedOpp === idx;
          return (
            <div key={opp.title}
              onClick={() => setExpandedOpp(isOpen ? null : idx)}
              style={{background:'white',borderRadius:12,padding:'16px',boxShadow:'var(--card-shadow)',cursor:'pointer',border: isOpen ? '2px solid #2563eb' : '2px solid transparent',transition:'border 0.15s'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:ps.bg,color:ps.color}}>{opp.priority}</span>
                <span style={{fontSize:10,color:'#94a3b8'}}>#{opp.rank}</span>
              </div>
              <p style={{fontSize:13,fontWeight:600,color:'#0f172a',lineHeight:1.4,marginBottom:14,minHeight:52}}>{opp.title}</p>
              <p style={{fontSize:11,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>Owner Cluster</p>
              <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:14}}>
                {opp.owners.map((o, oi) => (
                  <div key={oi} style={{width:28,height:28,borderRadius:'50%',background:o.bg,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid white',marginLeft:oi>0?-8:0,position:'relative',zIndex:opp.owners.length-oi}}>
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
    </div>
  );
}



/* ─── NEWS TAB ────────────────────────────────────────────────────── */
const NEWS_ICONS = { bank:'bank', mobile:'mobile', people:'people', payment:'payment', shield:'shield', globe:'globe', calendar:'calendar', people2:'people2' };
const REG_TAG_STYLES = {
  'Regulatory':     {bg:'#eff6ff',color:'#2563eb'},
  'Watchlist':      {bg:'#fef9c3',color:'#854d0e'},
  'High relevance': {bg:'#f0fdf4',color:'#16a34a'},
};

function NewsTab({ name }) {
  const [activeNewsTab, setActiveNewsTab] = React.useState(0);

  const newsTabs = [
    { label:'Bank News',        icon:'bank'    },
    { label:'Industry Updates', icon:'trend'   },
    { label:'Upcoming Events',  icon:'calendar'},
  ];

  const CategoryPill = ({ label, color, bg }) => (
    <span style={{display:'inline-block',fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:bg,color:color,whiteSpace:'nowrap'}}>{label}</span>
  );

  const ExternalLink = ({ href }) => (
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:6,background:'#f1f5f9',color:'#2563eb',fontSize:14,cursor:'pointer',textDecoration:'none'}}
      >↗</a>
    ) : (
      <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:6,background:'#f1f5f9',color:'#2563eb',fontSize:14,cursor:'pointer'}}>↗</span>
    )
  );

  const ColHdr = ({ cols }) => (
    <div style={{display:'grid',gridTemplateColumns:cols.map(c=>c.w).join(' '),padding:'10px 20px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0'}}>
      {cols.map(c=>(
        <span key={c.label} style={{fontSize:11,fontWeight:700,color:'#475569'}}>{c.label}</span>
      ))}
    </div>
  );

  return (
    <div className="animate-in">
      {/* Tab bar — same style as Organization tab */}
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

        {/* ── Bank News ── */}
        {activeNewsTab === 0 && (
          <>
            <ColHdr cols={[
              {label:'Title',w:'2fr'},{label:'Date',w:'100px'},{label:'Source',w:'130px'},
              {label:'Category',w:'150px'},{label:'Relevance to Sales',w:'2fr'},{label:'Link',w:'60px'}
            ]}/>
            {SYNOVUS_NEWS.bankNews.map((item,i) => (
              <div key={item.title} style={{
                display:'grid',gridTemplateColumns:'2fr 100px 130px 150px 2fr 60px',
                alignItems:'center',padding:'14px 20px',
                borderBottom: i < SYNOVUS_NEWS.bankNews.length-1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{fontSize:13,fontWeight:500,color:'#0f172a',lineHeight:1.4,paddingRight:12}}>{item.title}</span>
                <span style={{fontSize:12,color:'#64748b'}}>{item.date}</span>
                <span style={{fontSize:12,color:'#64748b'}}>{item.source}</span>
                <div><CategoryPill label={item.category} color={item.categoryColor} bg={item.categoryBg}/></div>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{item.relevance}</span>
                <ExternalLink href={item.link}/>
              </div>
            ))}
          </>
        )}

        {/* ── Industry Updates ── */}
        {activeNewsTab === 1 && (
          <>
            <ColHdr cols={[
              {label:'Title',w:'2fr'},{label:'Date',w:'90px'},{label:'Source',w:'120px'},
              {label:'Category',w:'160px'},{label:'Summary',w:'2fr'},{label:'Affected Domains',w:'180px'},{label:'Why it Matters',w:'1.5fr'}
            ]}/>
            {SYNOVUS_NEWS.industryUpdates.map((item,i) => (
              <div key={item.title} style={{
                display:'grid',gridTemplateColumns:'2fr 90px 120px 160px 2fr 180px 1.5fr',
                alignItems:'start',padding:'14px 20px',
                borderBottom: i < SYNOVUS_NEWS.industryUpdates.length-1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{fontSize:13,fontWeight:500,color:'#0f172a',lineHeight:1.4,paddingRight:12}}>{item.title}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{item.date}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{item.source}</span>
                <div style={{paddingTop:2}}><CategoryPill label={item.category} color={item.categoryColor} bg={item.categoryBg}/></div>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{item.summary}</span>
                <span style={{fontSize:12,color:'#64748b',lineHeight:1.4,paddingRight:12}}>{item.affectedDomains}</span>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4}}>{item.whyMatters}</span>
              </div>
            ))}
          </>
        )}

        {/* ── Upcoming Events ── */}
        {activeNewsTab === 2 && (
          <>
            <ColHdr cols={[
              {label:'Event Name',w:'2fr'},{label:'Date',w:'130px'},{label:'Location',w:'120px'},
              {label:'Category',w:'150px'},{label:'Audience',w:'2fr'},{label:'Why Relevant',w:'1.8fr'},{label:'Website',w:'70px'}
            ]}/>
            {SYNOVUS_NEWS.upcomingEvents.map((ev,i) => (
              <div key={ev.name} style={{
                display:'grid',gridTemplateColumns:'2fr 130px 120px 150px 2fr 1.8fr 70px',
                alignItems:'start',padding:'14px 20px',
                borderBottom: i < SYNOVUS_NEWS.upcomingEvents.length-1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{fontSize:13,fontWeight:500,color:'#0f172a',lineHeight:1.4,paddingRight:12}}>{ev.name}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{ev.date}</span>
                <span style={{fontSize:12,color:'#64748b',paddingTop:2}}>{ev.location}</span>
                <div style={{paddingTop:2}}><CategoryPill label={ev.category} color={ev.categoryColor} bg={ev.categoryBg}/></div>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{ev.audience}</span>
                <span style={{fontSize:12,color:'#475569',lineHeight:1.4,paddingRight:12}}>{ev.whyRelevant}</span>
                <ExternalLink/>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function AccountOverviewPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
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

  const acct = ACCOUNTS[accountId] || ACCOUNTS['A002'];

  return (
    <div className="animate-in">
      <button className="asi-back" onClick={()=>navigate(backPath)}>
        ← {backLabel}
      </button>

      {/* Bank Header */}
      <div className="asi-bank-header">
        <BankLogo name={acct.name} size={56} />
        <div>
          <h1 className="asi-bank-header__name">{acct.name} {activeTab === 'Overview' ? 'Overview' : activeTab}</h1>
          <p className="asi-bank-header__sub">
            {activeTab==='Overview' && 'Strategic account overview for portfolio review and expansion planning.'}
            {activeTab==='Signals' && 'Business and technology signals shaping account priorities and GTM timing.'}
            {activeTab==='Opportunities' && 'Ranked revenue plays derived from outside-in business, technology and stakeholder signals.'}
            {activeTab==='Organization' && 'Organization structure and leadership hierarchy shaping account access and buying influence.'}
            {activeTab==='News & Events' && 'Market, regulatory, company, thought-leadership, and event signals relevant to account strategy.'}
          </p>
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
      {activeTab==='Signals'       && <SignalsTab name={acct.name}/>}
      {activeTab==='Opportunities' && <OpportunitiesTab accountId={accountId}/>}
      {activeTab==='Organization'  && <OrganizationTab name={acct.name}/>}
      {activeTab==='News & Events'  && <NewsTab name={acct.name}/>}
    </div>
  );
}
