import { useState, useMemo, useEffect, useRef, type MouseEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';
import { Icon, BankLogo } from '../../components/SvgIcons';
import PortfolioKpiCard, { type PortfolioKpi } from '../../components/PortfolioKpiCard';
import hotAccountsIcon from '../../../logo/icons/hot-accounts.svg';
import { fetchPortfolioAccounts } from '../../api/accounts';
import { fetchWorkspace } from '../../api/client';
import {
  MATRIX_CAPABILITY_COLORS,
  MATRIX_CAPABILITY_FILTERS,
  buildPrioritizationMatrix,
  capabilityDisplayLabel,
  filterMatrixByCapability,
  getTopAccountCapabilities,
  totalValueToY,
  bubbleRadiusFromValue,
} from '../../utils/prioritizationMatrix';
import './Portfolio.css';

type RealAccount = {
  id: string;
  name: string;
  status?: string | null;
  capabilities?: string | null;
  updatedAt?: string | null;
  summary?: {
    totalOpportunities?: number;
    opportunityRange?: string;
    topServiceLineThemes?: string;
  };
  opportunities?: Array<{
    title?: string;
    priority?: string;
    dealSize?: string | null;
    capabilities?: string[] | string | null;
  }>;
  matrixLayout?: {
    easeX: number;
    matrixY: number;
    valueMid: number;
    color: string;
    valueLabel: string;
  };
};

type PortfolioAccountRow = {
  id: string;
  name: string;
  opps: number;
  value: string;
  valueMid: number;
  minValue: number;
  capabilities: string[];
  updatedAtLabel: string;
  updatedAtTime: number;
  status: 'Hot' | 'Active' | 'Monitor';
};

type AccountSortOption =
  | 'opportunities-desc'
  | 'opportunities-asc'
  | 'value-desc'
  | 'value-asc'
  | 'updated-latest'
  | 'updated-earliest';

const DEFAULT_ACCOUNT_SORT: AccountSortOption = 'opportunities-desc';
const ACCOUNT_STATUSES = ['All', 'Hot', 'Active', 'Monitor'];

function getUpdatedAtTime(updatedAt: string | null | undefined) {
  if (!updatedAt) return 0;
  const time = Date.parse(updatedAt);
  return Number.isFinite(time) ? time : 0;
}

function formatUpdatedAt(updatedAt: string | null | undefined) {
  const time = getUpdatedAtTime(updatedAt);
  if (!time) return '—';
  return new Date(time).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseRangeValues(rangeText: string | undefined) {
  if (!rangeText) return [];
  const numericMatches = rangeText.match(/(\d+(?:\.\d+)?)\s*M/gi);
  if (!numericMatches?.length) return [];
  return numericMatches
    .map((match) => Number(match.replace(/[^0-9.]/g, '')))
    .filter((value) => Number.isFinite(value));
}

function parseRangeMidpoint(rangeText: string | undefined) {
  const values = parseRangeValues(rangeText);
  if (!values.length) return 0;
  if (values.length === 1) return values[0];
  return (Math.min(...values) + Math.max(...values)) / 2;
}

function parseRangeMin(rangeText: string | undefined) {
  const values = parseRangeValues(rangeText);
  if (!values.length) return 0;
  return Math.min(...values);
}

function parseAmountToMillions(raw: string | undefined | null) {
  if (!raw) return 0;
  const normalized = raw.replace(/,/g, '').trim();
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*([kmb])?/i);
  if (!match) return 0;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;
  const unit = (match[2] ?? 'm').toLowerCase();
  if (unit === 'b') return value * 1000;
  if (unit === 'k') return value / 1000;
  return value;
}

function includesTwoMillionOrMore(dealSize: string | undefined | null) {
  if (!dealSize) return false;
  const parts = dealSize.split(/[–-]/);
  const minValue = parseAmountToMillions(parts[0] ?? null);
  const maxValue = parseAmountToMillions(parts[1] ?? parts[0] ?? null);
  return maxValue >= 2 && maxValue >= minValue;
}

function formatMidpointValue(midpoint: number) {
  if (!midpoint) return '$0M';
  const rounded = Number.isInteger(midpoint) ? String(midpoint) : midpoint.toFixed(1).replace(/\.0$/, '');
  return `$${rounded}M`;
}

function deriveStatus(account: RealAccount): 'Hot' | 'Active' | 'Monitor' {
  const explicitStatus = String(account.status ?? '').trim().toLowerCase();
  if (explicitStatus === 'hot') return 'Hot';
  if (explicitStatus === 'active') return 'Active';
  if (explicitStatus === 'monitor') return 'Monitor';

  const priorities = (account.opportunities ?? []).map((opportunity) => opportunity.priority?.toLowerCase());
  if (priorities.some((priority) => priority === 'high' || priority === 'medium-high')) return 'Hot';
  if (priorities.some((priority) => priority === 'medium')) return 'Active';
  return 'Monitor';
}

function buildPortfolioRows(accounts: RealAccount[]): PortfolioAccountRow[] {
  return accounts.map((account) => {
    const valueMid = parseRangeMidpoint(account.summary?.opportunityRange);
    const minValue = parseRangeMin(account.summary?.opportunityRange);
    return {
      id: account.id,
      name: account.name,
      opps: account.summary?.totalOpportunities ?? account.opportunities?.length ?? 0,
      value: account.summary?.opportunityRange ?? formatMidpointValue(valueMid),
      valueMid,
      minValue,
      capabilities: getTopAccountCapabilities(account, 4),
      updatedAtLabel: formatUpdatedAt(account.updatedAt),
      updatedAtTime: getUpdatedAtTime(account.updatedAt),
      status: deriveStatus(account),
    };
  });
}

function buildPortfolioKpis(
  accountRows: PortfolioAccountRow[],
  rawAccounts: RealAccount[],
  isLoading: boolean,
): PortfolioKpi[] {
  if (isLoading) {
    return [
      { label: 'Accounts', value: '...', sub: 'Strategic accounts tracked', variant: 'accounts' },
      { label: 'Hot Accounts', value: '...', sub: 'Accounts requiring focus', variant: 'hot' },
      { label: 'High Value Opportunities', value: '...', sub: 'Oppurtunities above $2M', variant: 'high-value' },
      { label: 'Opportunity Value', value: '...', sub: 'Estimated portfolio value', variant: 'opportunity-value' },
    ];
  }

  const hotAccounts = accountRows.filter((a) => a.status === 'Hot').length;
  const highValueOpps = rawAccounts.reduce((sum, account) => {
    const accountHighValueCount = (account.opportunities ?? []).filter(
      (opportunity) => includesTwoMillionOrMore(opportunity.dealSize),
    ).length;
    return sum + accountHighValueCount;
  }, 0);
  const totalValue = accountRows.reduce((sum, a) => sum + a.minValue, 0);

  return [
    {
      label: 'Accounts',
      value: String(accountRows.length),
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
      sub: 'Oppurtunities above $2M',
      variant: 'high-value',
    },
    {
      label: 'Opportunity Value',
      value: `$${totalValue}M +`,
      sub: 'Estimated portfolio value',
      variant: 'opportunity-value',
    },
  ];
}

const CAP_COLORS: Record<string,string> = {
  'Data':                    '#dbeafe',  'AI':                     '#ede9fe',
  'QE':                      '#dcfce7',  'Reg Rpt':                '#fef9c3',
  'Cloud':                   '#cffafe',  'Infra':                  '#e0f2fe',
  'Core':                    '#fce7f3',  'Digital':                '#f3e8ff',
  'Cybersecurity':           '#fef3c7',
  'Enterprise Integration':  '#ccfbf1',  'Product Architecture':   '#e0e7ff',
  'Payments Platforms':      '#ffedd5',
};
const CAP_TEXT: Record<string,string> = {
  'Data':'#1e40af','AI':'#6d28d9','QE':'#15803d','Reg Rpt':'#854d0e',
  'Cloud':'#0e7490','Infra':'#0369a1','Core':'#9d174d','Digital':'#7e22ce','Cybersecurity':'#92400e',
  'Enterprise Integration':'#0f766e','Product Architecture':'#3730a3','Payments Platforms':'#c2410c',
};

const STATUS_ICON = {
  Hot:     <><img src={hotAccountsIcon} alt="" aria-hidden style={{ width: 11, height: 11, display: 'block', flexShrink: 0 }} /> Hot</>,
  Active:  <><span style={{width:7,height:7,borderRadius:'50%',background:'#16a34a',display:'inline-block',marginRight:4}}/>Active</>,
  Monitor: <><Icon name="search" size={11} color="#2563eb"/> Monitor</>,
};
const STATUS_CLASS: Record<string,string> = { Hot:'asi-badge--hot', Active:'asi-badge--active', Monitor:'asi-badge--monitor' };

// Bubble shape converter — used per-render via visibleBubbles below

const CustomDot = (props: any) => {
  const { cx, cy, payload, onNavigate } = props;
  const accountId = payload?.accountId ?? payload?.id;
  const labelSide = payload?.labelSide ?? ((payload?.x ?? 0) > 70 ? 'left' : 'right');
  const labelOffsetY = payload?.labelOffsetY ?? 0;
  const placeLabelLeft = labelSide === 'left';
  const labelX = placeLabelLeft ? cx - payload.r - 6 : cx + payload.r + 6;
  const labelAnchor = placeLabelLeft ? 'end' : 'start';
  const labelY = cy + labelOffsetY;

  const goToAccount = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
    if (!accountId) return;
    onNavigate(`/accounts/${accountId}?tab=Opportunities`);
  };

  return (
    <g
      role="link"
      tabIndex={0}
      aria-label={payload?.name ? `Open ${payload.name} opportunities` : 'Open account opportunities'}
      onClick={goToAccount}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          goToAccount(event);
        }
      }}
      style={{ cursor: accountId ? 'pointer' : 'default' }}
    >
      <circle cx={cx} cy={cy} r={payload.r} fill={payload.color} fillOpacity={0.85} stroke="#fff" strokeWidth={1.5} />
      <text x={labelX} y={labelY - 3} textAnchor={labelAnchor} fontSize={11} fontWeight={600} fill="#0f172a" fontFamily="Inter">{payload.name}</text>
      <text x={labelX} y={labelY + 11} textAnchor={labelAnchor} fontSize={11} fill="#64748b" fontFamily="Inter">{payload.value}</text>
    </g>
  );
};

export default function Portfolio() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<RealAccount[]>([]);
  const [clientCapabilities, setClientCapabilities] = useState<string[]>([]);
  const [workspaceStatus, setWorkspaceStatus] = useState<'pending_setup' | 'active' | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [capabilityFilter, setCapabilityFilter] = useState('All Capabilities');
  const [accountSort, setAccountSort] = useState<AccountSortOption>(DEFAULT_ACCOUNT_SORT);
  const [isDownloadingMatrix, setIsDownloadingMatrix] = useState(false);
  const matrixExportRef = useRef<HTMLDivElement | null>(null);
  const today = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

  const handleDownloadMatrix = async () => {
    if (!matrixExportRef.current || isDownloadingMatrix) return;
    setIsDownloadingMatrix(true);
    try {
      const dataUrl = await toPng(matrixExportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;
          return node.dataset.noExport !== 'true';
        },
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'prioritization-matrix.png';
      link.click();
    } catch (error) {
      console.error('Failed to download prioritization matrix image', error);
      window.alert('Unable to download matrix image right now. Please try again.');
    } finally {
      setIsDownloadingMatrix(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [payload, workspacePayload] = await Promise.all([
          fetchPortfolioAccounts(),
          fetchWorkspace().catch(() => null),
        ]);
        if (!cancelled) {
          setAccounts((payload?.accounts ?? []) as RealAccount[]);
          setClientCapabilities(payload?.clientCapabilities ?? []);
          const workspace = workspacePayload?.workspace;
          setWorkspaceStatus(workspace?.status ?? null);
          setWorkspaceName(workspace?.clientName ?? '');
        }
      } catch (err) {
        console.error('Failed to load portfolio accounts', err);
        if (!cancelled) {
          setAccounts([]);
          setClientCapabilities([]);
          setWorkspaceStatus(null);
          setWorkspaceName('');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleAccounts = useMemo(
    () => buildPortfolioRows(accounts),
    [accounts]
  );
  const matrixRows = useMemo(
    () => buildPrioritizationMatrix(accounts, clientCapabilities, deriveStatus),
    [accounts, clientCapabilities],
  );
  const filteredMatrixRows = useMemo(
    () => filterMatrixByCapability(matrixRows, capabilityFilter),
    [matrixRows, capabilityFilter],
  );
  const portfolioKpis = useMemo(
    () => buildPortfolioKpis(visibleAccounts, accounts, isLoading),
    [visibleAccounts, accounts, isLoading],
  );
  const accountPortfolioRows = useMemo(() => {
    return [...visibleAccounts]
      .filter((account) => statusFilter === 'All' || account.status === statusFilter)
      .sort((a, b) => {
        switch (accountSort) {
          case 'opportunities-asc':
            return a.opps - b.opps || (a.name ?? '').localeCompare(b.name ?? '');
          case 'value-desc':
            return b.valueMid - a.valueMid || (a.name ?? '').localeCompare(b.name ?? '');
          case 'value-asc':
            return a.valueMid - b.valueMid || (a.name ?? '').localeCompare(b.name ?? '');
          case 'updated-latest':
            return b.updatedAtTime - a.updatedAtTime || (a.name ?? '').localeCompare(b.name ?? '');
          case 'updated-earliest':
            return a.updatedAtTime - b.updatedAtTime || (a.name ?? '').localeCompare(b.name ?? '');
          case 'opportunities-desc':
          default:
            return b.opps - a.opps || (a.name ?? '').localeCompare(b.name ?? '');
        }
      });
  }, [accountSort, statusFilter, visibleAccounts]);
  const hasAccountFilterChanges = statusFilter !== 'All' || accountSort !== DEFAULT_ACCOUNT_SORT;
  const visibleBubbles = useMemo(() => {
    const layoutById = new Map(
      accounts
        .filter((account) => account.matrixLayout)
        .map((account) => [account.id, account.matrixLayout!]),
    );

    const bubbles = filteredMatrixRows.map((row) => {
      const layout = layoutById.get(row.id);
      const valueMid = layout?.valueMid ?? row.totalValue;
      const x = layout?.easeX ?? row.easeX;
      const y = layout?.matrixY ?? totalValueToY(valueMid);
      return {
        x,
        y,
        name: row.name,
        value: layout?.valueLabel ?? row.valueLabel,
        color: layout?.color ?? row.color,
        r: Math.max(10, bubbleRadiusFromValue(valueMid)),
        accountId: row.id,
        opportunityCount: row.opportunityCount,
        weightedEase: layout ? Math.max(0, Math.min(100, 100 - layout.easeX)) : row.weightedEase,
        dominantCapability: row.dominantCapabilityLabel,
        topCapabilities: row.topCapabilities,
        highestValueOpportunity: row.highestValueOpportunity,
        status: row.status,
        labelSide: x >= 55 ? 'left' : 'right' as 'left' | 'right',
        labelOffsetY: 0,
      };
    });

    // Keep bubble centers from sitting on top of each other.
    for (let pass = 0; pass < 6; pass += 1) {
      for (let i = 0; i < bubbles.length; i += 1) {
        for (let j = i + 1; j < bubbles.length; j += 1) {
          const a = bubbles[i];
          const b = bubbles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const minDist = 16;
          if (dist >= minDist) continue;
          const push = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;
          a.x = Math.max(8, Math.min(92, a.x - ux * push));
          a.y = Math.max(8, Math.min(92, a.y - uy * push));
          b.x = Math.max(8, Math.min(92, b.x + ux * push));
          b.y = Math.max(8, Math.min(92, b.y + uy * push));
        }
      }
    }

    // Alternate label sides and stagger vertically when still close.
    const sorted = [...bubbles].sort((a, b) => a.y - b.y || a.x - b.x);
    sorted.forEach((bubble, index) => {
      bubble.labelSide = bubble.x >= 55 ? 'left' : 'right';
      if (index > 0) {
        const prev = sorted[index - 1];
        if (Math.abs(bubble.x - prev.x) < 22 && Math.abs(bubble.y - prev.y) < 14) {
          bubble.labelSide = prev.labelSide === 'left' ? 'right' : 'left';
          bubble.labelOffsetY = prev.labelOffsetY === 0 ? 14 : -14;
        }
      }
    });

    return bubbles;
  }, [accounts, filteredMatrixRows]);

  return (
    <div className="portfolio-page">
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
          />
        ))}
      </div>
      {!isLoading && workspaceStatus === 'pending_setup' && accounts.length === 0 && (
        <div className="asi-card" style={{ padding: 18, marginBottom: 24, borderColor: '#bfdbfe', background: '#f8fbff' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d4ed8', margin: '0 0 6px' }}>
            Your data is being prepared
          </h3>
          <p style={{ fontSize: 13, color: '#334155', margin: 0 }}>
            Data sync in progress{workspaceName ? ` for ${workspaceName}` : ''}. You can invite your team from Settings while provisioning completes.
          </p>
        </div>
      )}

      {/* Prioritization Matrix */}
      <div ref={matrixExportRef} className="asi-card" style={{padding:24,marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,gap:12,flexWrap:'wrap'}}>
          <h2 style={{fontSize:17,fontWeight:600,color:'#0f172a',margin:0}}>Prioritization Matrix</h2>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}} data-no-export="true">
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:600,color:'#64748b'}}>
              Capabilities
              <select
                value={capabilityFilter}
                onChange={(e) => setCapabilityFilter(e.target.value)}
                aria-label="Filter matrix by capability"
                style={{minWidth:160,fontSize:12,padding:'7px 10px',borderRadius:8,border:'1px solid #e2e8f0',background:'white',color:'#0f172a',outline:'none',cursor:'pointer'}}
              >
                {MATRIX_CAPABILITY_FILTERS.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap === 'All Capabilities' ? cap : capabilityDisplayLabel(cap)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="asi-btn asi-btn--outline asi-btn--sm"
              onClick={handleDownloadMatrix}
              disabled={isDownloadingMatrix}
              aria-label="Download prioritization matrix image"
            >
              Download PNG
            </button>
          </div>
        </div>
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '16px 16px 14px',
          }}
        >
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
                <div style={{width:72,display:'flex',flexDirection:'column',justifyContent:'space-between',paddingBottom:48,paddingTop:12}}>
                  {['100M+', '80-100M', '60-80M', '40-60M', '20-40M', '0-20M'].map((range) => (
                    <div key={range} style={{textAlign:'right',paddingRight:8}}>
                      <p style={{fontSize:11,fontWeight:600,color:'#64748b',margin:0,whiteSpace:'nowrap'}}>{range}</p>
                    </div>
                  ))}
                </div>
                <div style={{flex:1, minWidth: 0}}>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{top:28,right:120,bottom:32,left:12}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                      <XAxis type="number" dataKey="x" domain={[0,100]} hide/>
                      <YAxis type="number" dataKey="y" domain={[0,100]} hide/>
                      <Tooltip cursor={false} content={({active,payload})=>{
                        if(!active||!payload?.length) return null;
                        const d=payload[0].payload;
                        return (
                          <div className="asi-card" style={{padding:'10px 14px',fontSize:12,maxWidth:260}}>
                            <p style={{fontWeight:600,color:'#0f172a',margin:'0 0 6px'}}>{d.name}</p>
                            <p style={{color:'#64748b',margin:'0 0 2px'}}>Opportunities: <span style={{color:'#0f172a',fontWeight:600}}>{d.opportunityCount}</span></p>
                            <p style={{color:'#64748b',margin:'0 0 2px'}}>Total value: <span style={{color:'#2563eb',fontWeight:600}}>{d.value}</span></p>
                            <p style={{color:'#64748b',margin:'0 0 2px'}}>Ease match: <span style={{color:'#0f172a',fontWeight:600}}>{Math.round(d.weightedEase)}%</span></p>
                            <p style={{color:'#64748b',margin:'0 0 2px'}}>Dominant: <span style={{color:'#0f172a',fontWeight:600}}>{d.dominantCapability}</span></p>
                            {d.topCapabilities?.length ? (
                              <p style={{color:'#64748b',margin:'0 0 2px'}}>Top caps: <span style={{color:'#0f172a'}}>{d.topCapabilities.join(', ')}</span></p>
                            ) : null}
                            {d.highestValueOpportunity ? (
                              <p style={{color:'#64748b',margin:'0 0 2px'}}>Highest: <span style={{color:'#0f172a'}}>{d.highestValueOpportunity.title} ({d.highestValueOpportunity.value})</span></p>
                            ) : null}
                            <p style={{color:'#64748b',margin:0}}>Status: <span style={{color:'#0f172a',fontWeight:600}}>{d.status}</span></p>
                          </div>
                        );
                      }}/>
                      <Scatter
                        data={visibleBubbles}
                        isAnimationActive={false}
                        shape={(props: any) => <CustomDot {...props} onNavigate={navigate} />}
                        onClick={(data: any) => {
                          const accountId = data?.payload?.accountId ?? data?.accountId;
                          if (!accountId) return;
                          navigate(`/accounts/${accountId}?tab=Opportunities`);
                        }}
                      />
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
                {key: 'Data', c: MATRIX_CAPABILITY_COLORS.Data, l: 'Data'},
                {key: 'AI', c: MATRIX_CAPABILITY_COLORS.AI, l: 'AI'},
                {key: 'QE', c: MATRIX_CAPABILITY_COLORS.QE, l: 'Quality Engineering'},
                {key: 'Reg Rpt', c: MATRIX_CAPABILITY_COLORS['Reg Rpt'], l: 'Reg Reporting'},
                {key: 'AML', c: MATRIX_CAPABILITY_COLORS.AML, l: 'AML / Financial Crime'},
                {key: 'Core', c: MATRIX_CAPABILITY_COLORS.Core, l: 'Core Modernization'},
                {key: 'Cybersecurity', c: MATRIX_CAPABILITY_COLORS.Cybersecurity, l: 'Cybersecurity'},
                {key: 'Cloud', c: MATRIX_CAPABILITY_COLORS.Cloud, l: 'Cloud & Infra'},
                {key: 'Digital', c: MATRIX_CAPABILITY_COLORS.Digital, l: 'Digital Experience'},
                {key: 'Other', c: MATRIX_CAPABILITY_COLORS.Other, l: 'Other'},
              ].map(cap=>(
                <button
                  key={cap.l}
                  type="button"
                  className={`portfolio-matrix__legend-item${capabilityFilter === cap.key ? ' is-active' : ''}`}
                  onClick={() => setCapabilityFilter((prev) => (prev === cap.key ? 'All Capabilities' : cap.key))}
                  aria-pressed={capabilityFilter === cap.key}
                  data-no-export="true"
                >
                  <div style={{width:11,height:11,borderRadius:'50%',background:cap.c,flexShrink:0}}/>
                  <span style={{fontSize:12,color: capabilityFilter === cap.key ? '#0f172a' : '#64748b', fontWeight: capabilityFilter === cap.key ? 600 : 400}}>{cap.l}</span>
                </button>
              ))}
              <p style={{fontSize:11,color:'#94a3b8',marginTop:12,fontStyle:'italic'}}>Bubble size = Opportunity Value</p>
              {capabilityFilter !== 'All Capabilities' && visibleBubbles.length === 0 ? (
                <p style={{fontSize:12,color:'#64748b',marginTop:10}}>No accounts match this capability.</p>
              ) : null}
            </div>
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
                <option value="updated-latest">Updated At: Newest</option>
                <option value="updated-earliest">Updated At: Oldest First</option>
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
              <th style={{textAlign:'center'}}>Monitoring started</th>
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
                  {a.capabilities.length ? a.capabilities.map(c=>(
                    <span key={c} className="asi-cap-chip" style={{background:CAP_COLORS[c]||'#f1f5f9',color:CAP_TEXT[c]||'#475569'}}>{c}</span>
                  )) : <span style={{color:'#94a3b8'}}>—</span>}
                </td>
                <td style={{textAlign:'center',color:'#64748b'}}>{a.updatedAtLabel}</td>
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
