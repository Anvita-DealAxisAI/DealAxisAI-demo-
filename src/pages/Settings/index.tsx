import { useEffect, useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { THEME_OPTIONS } from '../../store/themeOptions';
import { Icon } from '../../components/SvgIcons';
import { createTeamInvite, fetchMe, fetchTeam } from '../../api/client';
import { supabase } from '../../lib/supabase';

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

const s = (base: object, hover?: object) => ({ ...base, cursor:'pointer', transition:'all 0.15s', ...(hover||{}) });

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    team: '',
    company: '',
    phone: '',
    timezone: '',
    avatar: '',
    status: '',
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [notifs, setNotifs] = useState({ email:true, browser:true, weekly:false, signals:true });
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  }>>([]);
  const [teamInvites, setTeamInvites] = useState<Array<{
    id: string;
    inviteEmail: string;
    inviteRole: string;
    expiresAt: string | null;
    inviteUrl: string;
  }>>([]);
  const [teamSeats, setTeamSeats] = useState<{ limit: number; used: number; remaining: number } | null>(null);
  const [canInviteMembers, setCanInviteMembers] = useState(false);
  const [teamInviteEmail, setTeamInviteEmail] = useState('');
  const [teamInviteRole, setTeamInviteRole] = useState<'member' | 'owner'>('member');
  const [teamInviteLoading, setTeamInviteLoading] = useState(false);
  const [teamInviteError, setTeamInviteError] = useState('');
  const [teamInviteSuccess, setTeamInviteSuccess] = useState('');
  const [teamClientName, setTeamClientName] = useState<string | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    if (tab !== 'profile') return;
    let cancelled = false;
    const load = async () => {
      setProfileLoading(true);
      setProfileError('');

      const sessionResult = await (supabase?.auth.getSession() ?? Promise.resolve({ data: { session: null } }));
      if (cancelled) return;

      const sessionUser = sessionResult?.data?.session?.user ?? null;
      const metadata = sessionUser?.user_metadata ?? {};
      const jobTitle =
        (typeof metadata.job_title === 'string' && metadata.job_title.trim())
        || (typeof metadata.title === 'string' && metadata.title.trim())
        || '';
      const metaName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '';

      const fallbackProfile = {
        name: metaName || user?.name || '',
        email: sessionUser?.email || user?.email || '',
        role: jobTitle || user?.role || '',
        team: '',
        company: user?.company || '',
        phone: '',
        timezone: '',
        avatar: user?.avatar || '',
        status: '',
      };

      try {
        const { profile: apiProfile } = await fetchMe();
        if (cancelled) return;

        setProfile({
          name: apiProfile?.name || fallbackProfile.name,
          email: apiProfile?.email || fallbackProfile.email,
          role: jobTitle || apiProfile?.role || fallbackProfile.role,
          team: '',
          company: apiProfile?.company || fallbackProfile.company,
          phone: '',
          timezone: '',
          avatar: apiProfile?.avatar || fallbackProfile.avatar,
          status: apiProfile?.status || '',
        });
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load profile from API, using session data', err);
        // Session/auth data is enough for this read-only profile view.
        setProfile(fallbackProfile);
        setProfileError('');
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [tab, user?.avatar, user?.company, user?.email, user?.name, user?.role]);

  useEffect(() => {
    if (tab !== 'team') return;
    let cancelled = false;
    const load = async () => {
      setTeamLoading(true);
      setTeamError('');
      try {
        const data = await fetchTeam();
        if (cancelled) return;
        setTeamClientName(data?.client?.name ?? null);
        setTeamMembers(data?.members ?? []);
        setTeamInvites(data?.invites ?? []);
        setTeamSeats(data?.seats ?? null);
        setCanInviteMembers(Boolean(data?.canInviteMembers));
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load team members', err);
        setTeamMembers([]);
        setTeamInvites([]);
        setTeamSeats(null);
        setCanInviteMembers(false);
        setTeamClientName(null);
        setTeamError(err instanceof Error ? err.message : 'Failed to load team members');
      } finally {
        if (!cancelled) setTeamLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleSendTeamInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamInviteError('');
    setTeamInviteSuccess('');
    const email = teamInviteEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setTeamInviteError('Enter a valid work email.');
      return;
    }
    setTeamInviteLoading(true);
    try {
      const data = await createTeamInvite({ email, role: teamInviteRole, expiresInDays: 7 });
      const invite = data?.invite;
      if (invite) {
        setTeamInvites((prev) => [invite, ...prev]);
      }
      setTeamInviteEmail('');
      setTeamInviteRole('member');
      setTeamInviteSuccess('Invite sent successfully.');
      if (teamSeats) {
        setTeamSeats((prev) => (prev
          ? { ...prev, remaining: Math.max(prev.remaining - 1, 0) }
          : prev));
      }
    } catch (err) {
      setTeamInviteError(err instanceof Error ? err.message : 'Failed to send invite.');
    } finally {
      setTeamInviteLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const currentPassword = passwordForm.currentPassword;
    const newPassword = passwordForm.newPassword;
    const confirmPassword = passwordForm.confirmPassword;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from your current password.');
      return;
    }
    if (!supabase) {
      setPasswordError('Authentication is not configured.');
      return;
    }
    if (!user?.email) {
      setPasswordError('Unable to verify your account email.');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (verifyError) {
        setPasswordError('Current password is incorrect.');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        setPasswordError(updateError.message || 'Failed to update password.');
        return;
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('Password updated successfully.');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const card: React.CSSProperties = { background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:'24px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', marginBottom:16 };
  const label: React.CSSProperties = { display:'block', fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 };
  const input: React.CSSProperties = { width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #e2e8f0', fontSize:13, color:'#0f172a', background:'#f8fafc', outline:'none', boxSizing:'border-box' };
  const displayValue = (value: string) => value?.trim() ? value : '—';

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
                {profileLoading ? (
                  <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Loading profile…</p>
                ) : (
                  <>
                    {profileError && (
                      <p style={{ fontSize:13, color:'#dc2626', margin:'0 0 16px' }}>{profileError}</p>
                    )}
                    {/* Avatar row */}
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, paddingBottom:20, borderBottom:'1px solid #f1f5f9' }}>
                      <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'white', flexShrink:0 }}>
                        {profile.avatar || '—'}
                      </div>
                      <div>
                        <p style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{displayValue(profile.name)}</p>
                        <p style={{ fontSize:13, color:'#64748b', margin:0 }}>
                          {[profile.role, profile.company].filter((part) => part?.trim()).join(' · ') || '—'}
                        </p>
                      </div>
                    </div>

                    <h3 style={{ fontSize:13, fontWeight:600, color:'#0f172a', marginBottom:16 }}>Personal Information</h3>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                      {[
                        { label:'Full Name',  key:'name' },
                        { label:'Work Email', key:'email' },
                        { label:'Job Title',  key:'role' },
                        { label:'Company',    key:'company' },
                      ].map((f) => (
                        <div key={f.key}>
                          <label style={label}>{f.label}</label>
                          <input
                            type="text"
                            value={displayValue(profile[f.key as keyof typeof profile])}
                            readOnly
                            disabled
                            style={{ ...input, cursor:'default', color: profile[f.key as keyof typeof profile]?.trim() ? '#0f172a' : '#94a3b8' }}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ── APPEARANCE / THEME ── */}
          {tab==='appearance' && (
            <div style={card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 4px' }}>Appearance</h2>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>Choose how AccountSignal AI looks. Changes apply instantly across the app.</p>

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {THEME_OPTIONS.map(t => (
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
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 4px' }}>Change Password</h2>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>
                Update your password to keep your account secure.
              </p>

              <form onSubmit={handleChangePassword} style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:420 }}>
                {[
                  { key:'currentPassword' as const, label:'Current Password', showKey:'current' as const },
                  { key:'newPassword' as const, label:'New Password', showKey:'next' as const },
                  { key:'confirmPassword' as const, label:'Confirm New Password', showKey:'confirm' as const },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={label}>{field.label}</label>
                    <div style={{ position:'relative' }}>
                      <input
                        type={showPasswords[field.showKey] ? 'text' : 'password'}
                        value={passwordForm[field.key]}
                        onChange={(e) => {
                          setPasswordError('');
                          setPasswordSuccess('');
                          setPasswordForm((prev) => ({ ...prev, [field.key]: e.target.value }));
                        }}
                        autoComplete={field.key === 'currentPassword' ? 'current-password' : 'new-password'}
                        style={{ ...input, paddingRight:56 }}
                        onFocus={(e) => { e.target.style.borderColor='#2563eb'; }}
                        onBlur={(e) => { e.target.style.borderColor='#e2e8f0'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, [field.showKey]: !prev[field.showKey] }))}
                        style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', color:'#94a3b8', cursor:'pointer', padding:0, fontSize:12, fontWeight:600 }}
                      >
                        {showPasswords[field.showKey] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                ))}

                {passwordError && (
                  <p style={{ fontSize:13, color:'#dc2626', margin:0 }}>{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p style={{ fontSize:13, color:'#16a34a', margin:0, display:'inline-flex', alignItems:'center', gap:6 }}>
                    <Icon name="check" size={14} color="#16a34a" /> {passwordSuccess}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    style={{
                      padding:'9px 20px',
                      borderRadius:8,
                      border:'none',
                      background: passwordLoading ? '#93c5fd' : '#2563eb',
                      color:'white',
                      fontSize:13,
                      fontWeight:600,
                      cursor: passwordLoading ? 'default' : 'pointer',
                    }}
                  >
                    {passwordLoading ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
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
                  <p style={{ fontSize:13, color:'#64748b', margin:0 }}>
                    {teamClientName
                      ? `Team members from ${teamClientName} who have access to this platform.`
                      : 'Team members from your company who have access to this platform.'}
                  </p>
                </div>
                {teamSeats && (
                  <span style={{ fontSize:12, fontWeight:600, color:'#475569' }}>
                    Seats used: {teamSeats.used}/{teamSeats.limit}
                  </span>
                )}
              </div>

              {teamLoading && (
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Loading team…</p>
              )}
              {!teamLoading && teamError && (
                <p style={{ fontSize:13, color:'#dc2626', margin:0 }}>{teamError}</p>
              )}
              {!teamLoading && !teamError && teamMembers.length === 0 && (
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>
                  No team members yet. This account is not mapped to a client.
                </p>
              )}
              {!teamLoading && !teamError && canInviteMembers && (
                <div style={{ marginBottom: 16, padding: 12, border: '1px solid #dbeafe', borderRadius: 10, background: '#f8fbff' }}>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: '#1e3a8a', fontWeight: 600 }}>
                    Invite team members (invite-only signup)
                  </p>
                  <form onSubmit={handleSendTeamInvite} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      value={teamInviteEmail}
                      onChange={(e) => setTeamInviteEmail(e.target.value)}
                      placeholder="member@company.com"
                      style={{ flex: 1, minWidth: 220, padding: '9px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                    />
                    <select
                      value={teamInviteRole}
                      onChange={(e) => setTeamInviteRole(e.target.value as 'member' | 'owner')}
                      style={{ padding: '9px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                    >
                      <option value="member">Member</option>
                      <option value="owner">Owner</option>
                    </select>
                    <button
                      type="submit"
                      disabled={teamInviteLoading}
                      style={{ padding: '9px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: 'white', fontSize: 12, fontWeight: 600, cursor: teamInviteLoading ? 'default' : 'pointer' }}
                    >
                      {teamInviteLoading ? 'Sending...' : 'Send Invite'}
                    </button>
                  </form>
                  {teamInviteError && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#dc2626' }}>{teamInviteError}</p>}
                  {teamInviteSuccess && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#15803d' }}>{teamInviteSuccess}</p>}
                </div>
              )}
              {!teamLoading && !teamError && !canInviteMembers && (
                <p style={{ fontSize:12, color:'#64748b', margin:'0 0 14px' }}>
                  Only workspace owners can send team invites.
                </p>
              )}
              {!teamLoading && !teamError && teamMembers.map((member, i) => (
                <div key={member.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i < teamMembers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>{member.avatar}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:'#0f172a', margin:'0 0 1px' }}>{member.name}</p>
                    <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{member.email}</p>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background: member.role==='Admin' || member.role==='Owner' ? '#eff6ff' : '#f8fafc', color: member.role==='Admin' || member.role==='Owner' ? '#2563eb' : '#64748b', border:'1px solid #e2e8f0' }}>{member.role}</span>
                </div>
              ))}
              {!teamLoading && !teamError && teamInvites.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#0f172a' }}>Pending Invites</p>
                  {teamInvites.map((invite) => (
                    <div key={invite.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#0f172a' }}>{invite.inviteEmail}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
                          {String(invite.inviteRole).charAt(0).toUpperCase() + String(invite.inviteRole).slice(1)} · Expires {invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : 'soon'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(invite.inviteUrl)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white', color: '#334155', fontSize: 11, cursor: 'pointer' }}
                      >
                        Copy Link
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
