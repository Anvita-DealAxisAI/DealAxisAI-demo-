import { useState, useRef, useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import type { Theme } from '../../types';
import logoUrl from '/AccountSignalAI-full-color-4.1.png';
import './Layout.css';

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
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

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
                color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
                background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition:'all 0.15s',
              })}>
              {item.icon}{item.label}
            </NavLink>
          ))}
        </nav>

        <p style={{ fontSize:10, color:'rgba(255,255,255,0.45)', padding:'12px 8px 0', marginTop:8, borderTop:'1px solid rgba(255,255,255,0.2)' }}>MVP v1.0</p>
      </aside>

      {/* ── Main area ── */}
      <div style={{ marginLeft:200, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Top bar — profile dropdown here only */}
        <header className="app-topbar">
          {/* Search */}
          <div style={{ position:'relative', flex:1, maxWidth:380 }}>
            <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="13" height="13" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search accounts, opportunities..." style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'6px 12px 6px 30px', fontSize:12, color:'white', outline:'none' }} />
          </div>

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            {/* Alerts bell */}
            <button style={{ position:'relative', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', color:'rgba(255,255,255,0.7)', cursor:'pointer' }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span style={{ position:'absolute', top:-2, right:-2, background:'#ef4444', color:'white', fontSize:9, fontWeight:700, width:14, height:14, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a1628' }}>3</span>
            </button>

            {/* Profile dropdown — top right only */}
            <div ref={profileRef} style={{ position:'relative' }}>
              <button onClick={() => setShowProfile(v => !v)}
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
                      {(['light','dark','corporate'] as Theme[]).map(t => (
                        <button key={t} onClick={() => setTheme(t)} style={{ flex:1, padding:'5px 2px', borderRadius:6, fontSize:10, fontWeight:500, cursor:'pointer', border: theme===t ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0', background: theme===t ? '#eff6ff' : 'white', color: theme===t ? '#2563eb' : '#64748b' }}>
                          {t==='corporate'?'Corp':t.charAt(0).toUpperCase()+t.slice(1)}
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

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
