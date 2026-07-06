import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import type { Theme } from '../../types';
import { Icon } from '../../components/SvgIcons';

function SettingsNavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const ProfileIcon = () => (
  <SettingsNavIcon>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SettingsNavIcon>
);

const AppearanceIcon = () => (
  <SettingsNavIcon>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a7 7 0 1 0 10 10" />
  </SettingsNavIcon>
);

const NotificationsIcon = () => (
  <SettingsNavIcon>
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
  </SettingsNavIcon>
);

const SecurityIcon = () => (
  <SettingsNavIcon>
    <path d="m10.929 14.467-.383.924" />
    <path d="M10.929 8.923 10.546 8" />
    <path d="M13.225 8.923 13.608 8" />
    <path d="m13.607 15.391-.382-.924" />
    <path d="m14.849 10.547.923-.383" />
    <path d="m14.849 12.843.923.383" />
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9.305 10.547-.923-.383" />
    <path d="m9.305 12.843-.923.383" />
    <circle cx="12.077" cy="11.695" r="3" />
  </SettingsNavIcon>
);

const IntegrationsIcon = () => (
  <SettingsNavIcon>
    <circle cx="9" cy="9" r="7" />
    <circle cx="15" cy="15" r="7" />
  </SettingsNavIcon>
);

const TeamIcon = () => (
  <SettingsNavIcon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </SettingsNavIcon>
);

const TABS = [
  { id:'profile',       label:'Profile',        icon:<ProfileIcon /> },
  { id:'appearance',    label:'Appearance',     icon:<AppearanceIcon /> },
  { id:'notifications', label:'Notifications',  icon:<NotificationsIcon /> },
  { id:'security',      label:'Security',       icon:<SecurityIcon /> },
  { id:'integrations',  label:'Integrations',   icon:<IntegrationsIcon /> },
  { id:'team',          label:'Team',           icon:<TeamIcon /> },
];

const THEMES: { value: Theme; label: string; desc: string; colors: string[] }[] = [
  { value:'light',     label:'Light',         desc:'Clean white canvas — ideal for daytime presentations', colors:['#ffffff','#f1f5f9','#0a1628'] },
  { value:'corporate', label:'Industry Blue', desc:'Deep navy branding — executive board-ready',           colors:['#ffffff','#e8edf5','#1a3560'] },
];

const s = (base: object, hover?: object) => ({ ...base, cursor:'pointer', transition:'all 0.15s', ...(hover||{}) });

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    role:     user?.role     || '',
    team:     user?.team     || '',
    company:  user?.company  || '',
    phone:    user?.phone    || '',
    timezone: user?.timezone || 'Asia/Kolkata (IST)',
  });
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email:true, browser:true, weekly:false, signals:true });

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const card: React.CSSProperties = { background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:'24px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', marginBottom:16 };
  const label: React.CSSProperties = { display:'block', fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 };
  const input: React.CSSProperties = { width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #e2e8f0', fontSize:13, color:'#0f172a', background:'white', outline:'none', boxSizing:'border-box' };

  return (
    <div style={{ maxWidth:900 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:'#0f172a', margin:'0 0 4px' }}>Settings</h1>
        <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Manage your profile, appearance and account preferences.</p>
      </div>

      <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

        {/* Sidebar nav — Google-style */}
        <div style={{ width:200, flexShrink:0, background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:8, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, border:'none', fontSize:13, fontWeight:500, textAlign:'left', marginBottom:2,
                background: tab===t.id ? '#eff6ff' : 'white',
                color: tab===t.id ? '#2563eb' : '#374151',
              }}
              onMouseOver={e => { if(tab!==t.id) e.currentTarget.style.background='#f8fafc'; }}
              onMouseOut={e => { if(tab!==t.id) e.currentTarget.style.background='white'; }}>
              <span style={{ color: tab===t.id ? '#2563eb' : '#94a3b8', flexShrink:0 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ flex:1 }}>

          {/* ── PROFILE ── */}
          {tab==='profile' && (
            <>
              <div style={card}>
                {/* Avatar row */}
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, paddingBottom:20, borderBottom:'1px solid #f1f5f9' }}>
                  <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'white', flexShrink:0 }}>
                    {user?.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{user?.name}</p>
                    <p style={{ fontSize:13, color:'#64748b', margin:'0 0 10px' }}>{user?.role} · {user?.company}</p>
                    <button style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid #e2e8f0', background:'white', fontSize:12, fontWeight:600, color:'#374151', cursor:'pointer' }}>
                      Change photo
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize:13, fontWeight:600, color:'#0f172a', marginBottom:16 }}>Personal Information</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  {[
                    { label:'Full Name',  key:'name',    type:'text',  placeholder:'Your full name' },
                    { label:'Work Email', key:'email',   type:'email', placeholder:'you@company.com' },
                    { label:'Job Title',  key:'role',    type:'text',  placeholder:'e.g. Sales Director' },
                    { label:'Team',       key:'team',    type:'text',  placeholder:'e.g. Strategic Accounts' },
                    { label:'Company',    key:'company', type:'text',  placeholder:'Your company name' },
                    { label:'Phone',      key:'phone',   type:'text',  placeholder:'+1 234 567 8900' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={label}>{f.label}</label>
                      <input type={f.type} value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder} style={input}
                        onFocus={e => e.target.style.borderColor='#2563eb'}
                        onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={label}>Timezone</label>
                  <select value={form.timezone} onChange={e => setForm(p => ({ ...p, timezone:e.target.value }))}
                    style={{ ...input, cursor:'pointer' }}>
                    {['Asia/Kolkata (IST)','America/New_York (EST)','America/Los_Angeles (PST)','Europe/London (GMT)','Europe/Berlin (CET)'].map(tz => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button onClick={handleSave} style={{ padding:'9px 20px', borderRadius:8, border:'none', background:'#2563eb', color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Save Changes
                  </button>
                  {saved && <span style={{ fontSize:13, fontWeight:500, color:'#10b981', display:'inline-flex', alignItems:'center', gap:5 }}><Icon name="check" size={14} color="#10b981"/> Profile updated</span>}
                </div>
              </div>
            </>
          )}

          {/* ── APPEARANCE / THEME ── */}
          {tab==='appearance' && (
            <div style={card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 4px' }}>Appearance</h2>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>Choose how AccountSignal AI looks. Changes apply instantly across the app.</p>

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {THEMES.map(t => (
                  <button key={t.value} onClick={() => setTheme(t.value)}
                    style={{ display:'flex', alignItems:'center', gap:16, padding:'16px', borderRadius:10, border: theme===t.value ? '2px solid #2563eb' : '1.5px solid #e2e8f0', background: theme===t.value ? '#eff6ff' : 'white', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                    {/* Colour swatches */}
                    <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                      {t.colors.map((c,i) => (
                        <div key={i} style={{ width:24, height:48, borderRadius:6, background:c, border:'1px solid #e2e8f0' }}/>
                      ))}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:'0 0 2px' }}>{t.label}</p>
                      <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{t.desc}</p>
                    </div>
                    {/* Radio indicator */}
                    <div style={{ width:20, height:20, borderRadius:'50%', border: theme===t.value ? '2px solid #2563eb' : '2px solid #d1d5db', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {theme===t.value && <div style={{ width:10, height:10, borderRadius:'50%', background:'#2563eb' }}/>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab==='notifications' && (
            <div style={card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 4px' }}>Notification Preferences</h2>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0:20px' }}>Control how and when you receive alerts from AccountSignal AI.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  { key:'email',   label:'Email Notifications',   desc:'Receive opportunity alerts and weekly digests via email' },
                  { key:'browser', label:'Browser Notifications',  desc:'Get real-time alerts when new signals are detected' },
                  { key:'signals', label:'Signal Alerts',          desc:'Notify me when a new high-priority signal is identified' },
                  { key:'weekly',  label:'Weekly Summary Report',  desc:'Receive a curated portfolio summary every Monday' },
                ].map((n, i) => (
                  <div key={n.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <p style={{ fontSize:14, fontWeight:500, color:'#0f172a', margin:'0 0 2px' }}>{n.label}</p>
                      <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{n.desc}</p>
                    </div>
                    <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                      style={{ width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s', background: notifs[n.key as keyof typeof notifs] ? '#2563eb' : '#e2e8f0', flexShrink:0 }}>
                      <div style={{ position:'absolute', top:2, transition:'left 0.2s', left: notifs[n.key as keyof typeof notifs] ? 22 : 2, width:20, height:20, borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {tab==='security' && (
            <div style={card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 20px' }}>Security</h2>
              {[
                { label:'Change Password', desc:'Update your password to keep your account secure', btn:'Update', btnStyle:{ background:'#2563eb', color:'white', border:'none' } },
                { label:'Two-Factor Authentication', desc:'Add an extra layer of security to your account', btn:'Enable 2FA', btnStyle:{ background:'white', color:'#0f172a', border:'1.5px solid #e2e8f0' } },
                { label:'Active Sessions', desc:'View and manage devices where you are signed in', btn:'View Sessions', btnStyle:{ background:'white', color:'#0f172a', border:'1.5px solid #e2e8f0' } },
              ].map((s, i) => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:500, color:'#0f172a', margin:'0 0 2px' }}>{s.label}</p>
                    <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{s.desc}</p>
                  </div>
                  <button style={{ padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', ...s.btnStyle }}>{s.btn}</button>
                </div>
              ))}
            </div>
          )}

          {/* ── INTEGRATIONS ── */}
          {tab==='integrations' && (
            <div style={card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 4px' }}>Integrations</h2>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>Connect AccountSignal AI with your existing tools and workflows.</p>
              {[
                { name:'Salesforce CRM',   desc:'Sync accounts, opportunities and contacts', status:'Connected',    statusColor:'#16a34a', statusBg:'#f0fdf4' },
                { name:'Slack',            desc:'Receive signal alerts in your team channels', status:'Connect',      statusColor:'#2563eb', statusBg:'#eff6ff' },
                { name:'Microsoft Teams',  desc:'Share opportunity briefings with your team', status:'Connect',      statusColor:'#2563eb', statusBg:'#eff6ff' },
                { name:'HubSpot',          desc:'Sync deal pipeline and contact intelligence', status:'Connect',      statusColor:'#2563eb', statusBg:'#eff6ff' },
              ].map((intg, i) => (
                <div key={intg.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:500, color:'#0f172a', margin:'0 0 2px' }}>{intg.name}</p>
                    <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{intg.desc}</p>
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:20, background:intg.statusBg, color:intg.statusColor, cursor:'pointer' }}>{intg.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── TEAM ── */}
          {tab==='team' && (
            <div style={card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 2px' }}>Team Members</h2>
                  <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Manage who has access to AccountSignal AI.</p>
                </div>
                <button style={{ padding:'8px 16px', borderRadius:8, background:'#2563eb', color:'white', border:'none', fontSize:12, fontWeight:600, cursor:'pointer' }}>+ Invite Member</button>
              </div>
              {[
                { name:'Ajay Kumar',    email:'ajay@accountsignal.ai',    role:'Admin',    avatar:'AJ' },
                { name:'Sarah Mitchell',email:'sarah@accountsignal.ai',   role:'Member',   avatar:'SM' },
                { name:'David Chen',    email:'david@accountsignal.ai',   role:'Member',   avatar:'DC' },
                { name:'Priya Nair',    email:'priya@accountsignal.ai',   role:'Viewer',   avatar:'PN' },
              ].map((member, i) => (
                <div key={member.email} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>{member.avatar}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:'#0f172a', margin:'0 0 1px' }}>{member.name}</p>
                    <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{member.email}</p>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background: member.role==='Admin' ? '#eff6ff' : '#f8fafc', color: member.role==='Admin' ? '#2563eb' : '#64748b', border:'1px solid #e2e8f0' }}>{member.role}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
