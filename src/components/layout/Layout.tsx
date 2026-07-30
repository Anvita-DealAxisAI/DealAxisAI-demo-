import { useState, useRef, useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { THEME_OPTIONS } from '../../store/themeOptions';
import { CoreSpinLoader } from '../ui/CoreSpinLoader';
import { fetchNotifications, markNotificationsRead } from '../../api/client';
import {
  fetchPortfolioAccounts,
  fetchAccountOrganizationById,
  fetchAccountNewsById,
} from '../../api/accounts';
import logoUrl from '../../../logo/AccountSignalAI-full-color-dark-41.0.png';
import './Layout.css';

type AppNotification = {
  id: string;
  accountId: string;
  accountName?: string;
  opportunityId?: string | null;
  eventType: string;
  title: string;
  body?: string | null;
  createdAt: string;
  isRead: boolean;
};

type SearchResultKind = 'account' | 'opportunity' | 'stakeholder' | 'news';

type SearchResult = {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  path: string;
};

type SearchIndex = {
  accounts: SearchResult[];
  opportunities: SearchResult[];
  stakeholders: SearchResult[];
  news: SearchResult[];
};

function formatNotificationTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const PortfolioNavIcon = () => (
  <NavIcon>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </NavIcon>
);

const AccountsNavIcon = () => (
  <NavIcon>
    <path d="M10 18v-7" />
    <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
  </NavIcon>
);

const SettingsNavIcon = () => (
  <NavIcon>
    <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
    <circle cx="12" cy="12" r="3" />
  </NavIcon>
);

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, logout, workspaceLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchIndexReadyRef = useRef(false);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const trimmedSearch = searchQuery.trim().toLowerCase();

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const data = await fetchNotifications(20);
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  };

  const loadSearchIndex = async () => {
    if (searchIndexReadyRef.current || searchLoading) return;
    setSearchLoading(true);
    try {
      const payload = await fetchPortfolioAccounts();
      const accounts = Array.isArray(payload?.accounts) ? payload.accounts : [];

      const accountResults: SearchResult[] = accounts.map((account) => ({
        id: `account-${account.id}`,
        kind: 'account',
        title: account.name ?? 'Account',
        subtitle: `Account · ${account.summary?.totalOpportunities ?? account.opportunities?.length ?? 0} opportunities`,
        path: `/accounts/${account.id}`,
      }));

      const opportunityResults: SearchResult[] = [];
      for (const account of accounts) {
        for (const opp of account.opportunities ?? []) {
          const opportunityId = opp.id ? String(opp.id) : '';
          opportunityResults.push({
            id: `opportunity-${account.id}-${opportunityId || opp.title}`,
            kind: 'opportunity',
            title: opp.title ?? 'Opportunity',
            subtitle: `${account.name ?? 'Account'} · ${opp.priority ?? 'Priority TBD'} · ${opp.dealSize ?? 'Value TBD'}`,
            path: opportunityId
              ? `/accounts/${account.id}/opportunities/${opportunityId}`
              : `/accounts/${account.id}?tab=Opportunities`,
          });
        }
      }

      const extras = await Promise.all(
        accounts.map(async (account) => {
          try {
            const [organization, news] = await Promise.all([
              fetchAccountOrganizationById(account.id),
              fetchAccountNewsById(account.id),
            ]);
            return { account, organization, news };
          } catch (error) {
            console.error(`Failed to load search extras for ${account.id}`, error);
            return { account, organization: null, news: null };
          }
        }),
      );

      const stakeholderMap = new Map<
        string,
        { accountName: string; accountId: string; name: string; title: string; groups: Set<string> }
      >();
      const newsResults: SearchResult[] = [];

      for (const bundle of extras) {
        const accountId = bundle.account.id;
        const accountName = bundle.account.name ?? 'Account';
        for (const tab of bundle.organization?.tabs ?? []) {
          for (const person of tab.people ?? []) {
            const personName = person.name ?? 'Stakeholder';
            const key = `${accountId}::${person.id ?? personName.toLowerCase()}`;
            const existing = stakeholderMap.get(key);
            if (existing) {
              if (tab.label) existing.groups.add(tab.label);
            } else {
              stakeholderMap.set(key, {
                accountName,
                accountId,
                name: personName,
                title: person.title ?? '',
                groups: new Set(tab.label ? [tab.label] : []),
              });
            }
          }
        }

        const bankNews = bundle.news?.bankNews ?? [];
        const industryUpdates = bundle.news?.industryUpdates ?? [];
        for (const item of [...bankNews, ...industryUpdates]) {
          newsResults.push({
            id: `news-${accountId}-${item.news_item_id ?? item.id ?? item.title}`,
            kind: 'news',
            title: item.title ?? 'News item',
            subtitle: `${accountName} · ${item.source ?? item.category ?? 'News & Events'}`,
            path: `/accounts/${accountId}?tab=${encodeURIComponent('News & Events')}`,
          });
        }
      }

      const stakeholderResults: SearchResult[] = Array.from(stakeholderMap.entries()).map(
        ([key, value]) => {
          const groupText = Array.from(value.groups).join(', ');
          const detailParts = [value.title, groupText].filter(Boolean).join(' · ');
          return {
            id: `stakeholder-${key}`,
            kind: 'stakeholder',
            title: value.name,
            subtitle: `${value.accountName}${detailParts ? ` · ${detailParts}` : ''}`,
            path: `/accounts/${value.accountId}?tab=Organization`,
          };
        },
      );

      setSearchIndex({
        accounts: accountResults,
        opportunities: opportunityResults,
        stakeholders: stakeholderResults,
        news: newsResults,
      });
      searchIndexReadyRef.current = true;
    } catch (error) {
      console.error('Failed to load global search index', error);
      setSearchIndex({
        accounts: [],
        opportunities: [],
        stakeholders: [],
        news: [],
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const topMatches = (list: SearchResult[]) =>
    list
      .filter((result) => {
        if (!trimmedSearch) return false;
        const haystack = `${result.title} ${result.subtitle}`.toLowerCase();
        return haystack.includes(trimmedSearch);
      })
      .slice(0, 5);

  const groupedResults = {
    accounts: topMatches(searchIndex?.accounts ?? []),
    opportunities: topMatches(searchIndex?.opportunities ?? []),
    stakeholders: topMatches(searchIndex?.stakeholders ?? []),
    news: topMatches(searchIndex?.news ?? []),
  };

  const flatResults: SearchResult[] = [
    ...groupedResults.accounts,
    ...groupedResults.opportunities,
    ...groupedResults.stakeholders,
    ...groupedResults.news,
  ].slice(0, 20);

  useEffect(() => {
    if (workspaceLoading || !user) return undefined;
    void loadNotifications();
    const interval = setInterval(() => {
      void loadNotifications();
    }, 60_000);
    return () => clearInterval(interval);
  }, [workspaceLoading, user?.email]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isOpenShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isOpenShortcut) return;
      event.preventDefault();
      setShowSearchResults(true);
      void loadSearchIndex();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchLoading]);

  const openNotification = async (item: AppNotification) => {
    if (!item.isRead) {
      try {
        await markNotificationsRead({ ids: [item.id] });
        setNotifications((prev) =>
          prev.map((row) => (row.id === item.id ? { ...row, isRead: true } : row)),
        );
      } catch (err) {
        console.error('Failed to mark notification read', err);
      }
    }
    setShowNotifications(false);
    if (item.accountId && item.opportunityId) {
      navigate(`/accounts/${item.accountId}/opportunities/${item.opportunityId}`);
      return;
    }
    if (item.accountId) {
      navigate(`/accounts/${item.accountId}?tab=Opportunities`);
    }
  };

  const markAllRead = async () => {
    try {
      await markNotificationsRead({ all: true });
      setNotifications((prev) => prev.map((row) => ({ ...row, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    }
  };

  const openSearchResult = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(result.path);
  };

  const navItems = [
    { path: '/',         label: 'Portfolio', icon: <PortfolioNavIcon /> },
    { path: '/accounts', label: 'Accounts',  icon: <AccountsNavIcon /> },
    { path: '/settings', label: 'Settings',  icon: <SettingsNavIcon /> },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'Inter,sans-serif' }}>

      {/* ── Sidebar — NO profile at bottom ── */}
      <aside className="app-sidebar">

        {/* Logo */}
        <NavLink to="/" end className="app-brand">
          <div className="app-brand__box">
            <img src={logoUrl} alt="AccountSignal AI" className="app-brand__logo" />
          </div>
        </NavLink>

        {/* Nav links */}
        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
                borderRadius:8, fontSize:13, fontWeight:500, textDecoration:'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition:'all 0.15s',
              })}>
              {item.icon}{item.label}
            </NavLink>
          ))}
        </nav>

        <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', padding:'12px 8px 0', marginTop:8, borderTop:'1px solid rgba(255,255,255,0.06)' }}>MVP v1.0</p>
      </aside>

      {/* ── Main area ── */}
      <div style={{ marginLeft:200, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Top bar — profile dropdown here only */}
        <header className="app-topbar">
          {/* Search */}
          <div ref={searchRef} style={{ position:'relative', flex:1, maxWidth:420 }}>
            <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="13" height="13" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onFocus={() => {
                setShowSearchResults(true);
                void loadSearchIndex();
              }}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                if (!showSearchResults) setShowSearchResults(true);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setShowSearchResults(false);
                  return;
                }
                if (event.key === 'Enter' && flatResults.length > 0) {
                  event.preventDefault();
                  openSearchResult(flatResults[0]);
                }
              }}
              placeholder="Search accounts, opportunities, stakeholders..."
              style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'6px 12px 6px 30px', fontSize:12, color:'white', outline:'none' }}
            />
            <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:10, color:'rgba(255,255,255,0.45)' }}>
              {navigator.platform.toLowerCase().includes('mac') ? '⌘K' : 'Ctrl+K'}
            </span>

            {showSearchResults && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '100%',
                  maxHeight: 420,
                  overflowY: 'auto',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 220,
                }}
              >
                {searchLoading ? (
                  <p style={{ margin: 0, padding: '14px 12px', fontSize: 12, color: '#64748b' }}>Indexing search data…</p>
                ) : null}
                {!searchLoading && trimmedSearch.length < 2 ? (
                  <p style={{ margin: 0, padding: '14px 12px', fontSize: 12, color: '#64748b' }}>
                    Type at least 2 characters to search.
                  </p>
                ) : null}
                {!searchLoading && trimmedSearch.length >= 2 && flatResults.length === 0 ? (
                  <p style={{ margin: 0, padding: '14px 12px', fontSize: 12, color: '#64748b' }}>No matches found.</p>
                ) : null}

                {!searchLoading && trimmedSearch.length >= 2 && flatResults.length > 0 && (
                  <div>
                    {[
                      { label: 'Accounts', list: groupedResults.accounts },
                      { label: 'Opportunities', list: groupedResults.opportunities },
                      { label: 'Stakeholders', list: groupedResults.stakeholders },
                      { label: 'News & Events', list: groupedResults.news },
                    ].map((section) => (
                      section.list.length ? (
                        <div key={section.label} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <p style={{ margin: 0, padding: '8px 12px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {section.label}
                          </p>
                          {section.list.map((result) => (
                            <button
                              key={result.id}
                              type="button"
                              onClick={() => openSearchResult(result)}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                border: 'none',
                                background: 'white',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                borderTop: '1px solid #f8fafc',
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'white'; }}
                            >
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{result.title}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>{result.subtitle}</p>
                            </button>
                          ))}
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            {/* Alerts bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications((v) => !v);
                  setShowProfile(false);
                  if (!showNotifications) void loadNotifications();
                }}
                aria-label="Notifications"
                style={{ position:'relative', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', color:'rgba(255,255,255,0.7)', cursor:'pointer' }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unreadCount > 0 && (
                  <span style={{ position:'absolute', top:-2, right:-2, background:'#ef4444', color:'white', fontSize:9, fontWeight:700, minWidth:14, height:14, padding:'0 3px', borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a1628' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:360, maxHeight:420, background:'white', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                  <div style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                    <div>
                      <p style={{ margin:0, fontSize:13, fontWeight:600, color:'#0f172a' }}>Notifications</p>
                      <p style={{ margin:0, fontSize:11, color:'#64748b' }}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'You are up to date'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => void markAllRead()}
                        style={{ border:'none', background:'transparent', color:'#2563eb', fontSize:12, fontWeight:600, cursor:'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ overflowY:'auto' }}>
                    {notifLoading && notifications.length === 0 && (
                      <p style={{ margin:0, padding:20, fontSize:13, color:'#64748b', textAlign:'center' }}>Loading…</p>
                    )}
                    {!notifLoading && notifications.length === 0 && (
                      <p style={{ margin:0, padding:20, fontSize:13, color:'#64748b', textAlign:'center' }}>
                        No opportunity updates yet.
                      </p>
                    )}
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => void openNotification(item)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px 14px',
                          border: 'none',
                          borderBottom: '1px solid #f1f5f9',
                          background: item.isRead ? 'white' : '#eff6ff',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <div style={{ display:'flex', justifyContent:'space-between', gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:700, color: item.eventType === 'opportunity_updated' ? '#0059CF' : '#047857' }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize:11, color:'#94a3b8', whiteSpace:'nowrap' }}>
                            {formatNotificationTime(item.createdAt)}
                          </span>
                        </div>
                        <p style={{ margin:0, fontSize:12, color:'#334155', lineHeight:1.45 }}>{item.body}</p>
                        {!item.isRead && (
                          <span style={{ display:'inline-block', marginTop:6, width:7, height:7, borderRadius:'50%', background:'#2563eb' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown — top right only */}
            <div ref={profileRef} style={{ position:'relative' }}>
              <button onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px', background:'rgba(255,255,255,0.07)', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>
                  {user?.avatar || 'AJ'}
                </div>
                <span style={{ fontSize:13, fontWeight:500, color:'white' }}>{user?.name}</span>
                <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {showProfile && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:240, background:'white', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden' }}>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', flexShrink:0 }}>{user?.avatar}</div>
                      <div>
                        <p style={{ fontWeight:600, fontSize:13, color:'#0f172a', margin:0 }}>{user?.name}</p>
                        <p style={{ fontSize:11, color:'#64748b', margin:0 }}>{user?.role}</p>
                        <p style={{ fontSize:11, color:'#64748b', margin:0 }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding:'6px 8px', borderBottom:'1px solid #f1f5f9' }}>
                    <p style={{ fontSize:10, fontWeight:600, color:'#94a3b8', padding:'4px 6px', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>Theme</p>
                    <div style={{ display:'flex', gap:4, padding:'4px 0' }}>
                      {THEME_OPTIONS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setTheme(t.value)}
                          style={{
                            flex: 1,
                            padding: '5px 2px',
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: theme === t.value ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                            background: theme === t.value ? '#eff6ff' : 'white',
                            color: theme === t.value ? '#2563eb' : '#64748b',
                          }}
                        >
                          {t.shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                  {[
                    { label:'View Profile', action:() => { navigate('/settings'); setShowProfile(false); } },
                    { label:'Settings',     action:() => { navigate('/settings'); setShowProfile(false); } },
                    { label:'Help & Support', action:() => setShowProfile(false) },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ width:'100%', textAlign:'left', padding:'10px 16px', fontSize:13, color:'#0f172a', background:'white', border:'none', display:'block', cursor:'pointer', borderTop:'1px solid #f1f5f9' }}
                      onMouseOver={e => (e.currentTarget.style.background='#f8fafc')}
                      onMouseOut={e => (e.currentTarget.style.background='white')}>
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop:'1px solid #f1f5f9' }}>
                    <button onClick={() => { logout(); navigate('/login'); }}
                      style={{ width:'100%', textAlign:'left', padding:'10px 16px', fontSize:13, color:'#dc2626', background:'white', border:'none', cursor:'pointer' }}
                      onMouseOver={e => (e.currentTarget.style.background='#fef2f2')}
                      onMouseOut={e => (e.currentTarget.style.background='white')}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-main" style={workspaceLoading ? { background: '#ffffff', display: 'flex', padding: 0 } : undefined}>
          {workspaceLoading ? <CoreSpinLoader panel /> : children}
        </main>
      </div>
    </div>
  );
}
