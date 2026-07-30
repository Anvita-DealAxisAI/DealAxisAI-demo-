import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Icon } from '../../components/SvgIcons';
import logoUrl from '../../../logo/AccountSignalAI-full-color-dark-41.0.png';
import { GradientDots } from '../../components/ui/GradientDots';
import { supabase } from '../../lib/supabase';
import { fetchPublicInvite } from '../../api/client';

const DEMO_EMAIL = (import.meta.env.VITE_DEMO_EMAIL as string | undefined)?.trim() || 'demo@accountsignal.ai';
const DEMO_PASSWORD = (import.meta.env.VITE_DEMO_PASSWORD as string | undefined)?.trim() || 'demo123';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const inviteCode = useMemo(
    () => new URLSearchParams(location.search).get('invite')?.trim() ?? '',
    [location.search],
  );

  const [mode, setMode] = useState<'signin' | 'invite'>(inviteCode ? 'invite' : 'signin');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<null | {
    inviteCode: string;
    clientName?: string;
    inviteEmail?: string | null;
  }>(null);

  useEffect(() => {
    setMode(inviteCode ? 'invite' : 'signin');
    setError('');
    setMessage('');
    setNeedsEmailConfirmation(false);
    setInviteInfo(null);
    if (!inviteCode) {
      return;
    }

    let cancelled = false;
    const loadInvite = async () => {
      setInviteLoading(true);
      try {
        const data = await fetchPublicInvite(inviteCode);
        if (cancelled) return;
        const invite = data?.invite ?? null;
        setInviteInfo(invite);
        if (invite?.inviteEmail) {
          setEmail(invite.inviteEmail);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Invite is invalid or expired.');
      } finally {
        if (!cancelled) setInviteLoading(false);
      }
    };
    void loadInvite();
    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setNeedsEmailConfirmation(false);

    if (!email) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (mode === 'invite' && !inviteCode) { setError('A valid invite link is required.'); return; }
    if (mode === 'invite' && !inviteInfo) { setError('Invite details are still loading.'); return; }
    if (mode === 'invite' && !firstName.trim()) { setError('First name is required.'); return; }
    if (mode === 'invite' && !lastName.trim()) { setError('Last name is required.'); return; }

    setLoading(true);
    const result = mode === 'signin'
      ? await login(email.trim(), password)
      : await signup({
          email: (inviteInfo?.inviteEmail || email).trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          title: title.trim(),
          inviteCode,
        });
    setLoading(false);

    if (result.success) {
      if (result.message) {
        setMessage(result.message);
        setMode('signin');
      } else {
        navigate('/');
      }
      return;
    }

    const rawMessage = result.message || 'Authentication failed. Please try again.';
    const normalized = rawMessage.toLowerCase();
    if (mode === 'signin' && normalized.includes('invalid login credentials')) {
      setError('Invalid email or password. Please try again.');
      return;
    }
    if (mode === 'signin' && normalized.includes('email not confirmed')) {
      setNeedsEmailConfirmation(true);
      setError('Your email is not confirmed yet. Check your inbox or resend the confirmation link.');
      return;
    }
    setError(rawMessage);
  };

  const handleResendConfirmation = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      setError('Supabase is not configured. Check your environment variables.');
      return;
    }
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
    });
    setLoading(false);
    if (resendError) {
      setError(resendError.message);
      return;
    }
    setMessage('Confirmation email sent. Please verify your email, then sign in.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px', background: '#0d1b2e', position: 'relative', overflow: 'hidden' }}>
        <GradientDots backgroundColor="#0d1b2e" style={{ pointerEvents: 'none', opacity: 0.75 }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(8,18,32,0.55) 0%, rgba(8,18,32,0.65) 50%, rgba(8,18,32,0.72) 100%)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.45)' }}>
          <img src={logoUrl} alt="AccountSignal AI" style={{ height: 60, width: 'auto', maxWidth: 370, objectFit: 'contain', display: 'block', marginBottom: 28, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))' }} />
          <p style={{ fontSize: 32, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>AI intelligence that connects signals to sales success.</p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', marginBottom: 40, lineHeight: 1.7 }}>Prioritize accounts, surface opportunities, and drive revenue with AI-powered portfolio intelligence.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: 'efficiency', text: 'Real-time account heat scoring' },
              { icon: 'target', text: 'AI-ranked opportunity signals' },
              { icon: 'revenue', text: 'Executive portfolio command center' },
              { icon: 'globe', text: 'CRM-ready integration layer' },
            ].map((f) => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={f.icon} size={16} color="#ffffff" />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>© 2026 AccountSignal AI. All rights reserved.</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 40px', background: '#f4f6f9' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 26, color: '#0d1b2e', margin: '0 0 8px' }}>
              {mode === 'signin' ? 'Welcome back' : 'Accept your invite'}
            </h2>
            <p style={{ fontSize: 14, color: '#6b7a99', margin: 0 }}>
              {mode === 'signin'
                ? 'Sign in to your AccountSignal AI workspace'
                : `Create your account${inviteInfo?.clientName ? ` for ${inviteInfo.clientName}` : ''}`}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 16, gap: 8, background: 'white', padding: 6, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <button type="button" onClick={() => { setMode('signin'); setError(''); setMessage(''); setNeedsEmailConfirmation(false); }} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: mode === 'signin' ? '#2563eb' : 'transparent', color: mode === 'signin' ? '#fff' : '#4b5563', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
            <button
              type="button"
              onClick={() => {
                if (!inviteCode) {
                  setError('Use a valid invite link to create an account.');
                  return;
                }
                setMode('invite');
                setError('');
                setMessage('');
                setNeedsEmailConfirmation(false);
              }}
              style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: mode === 'invite' ? '#2563eb' : 'transparent', color: mode === 'invite' ? '#fff' : '#4b5563', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Accept Invite
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>{error}</div>}
            {message && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: 13 }}>{message}</div>}
            {mode === 'invite' && inviteCode && (
              <div style={{ padding: '10px 12px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 12 }}>
                {inviteLoading
                  ? 'Validating invite...'
                  : inviteInfo
                    ? `Invite verified${inviteInfo.clientName ? ` for ${inviteInfo.clientName}` : ''}.`
                    : 'Invite is required to create an account.'}
              </div>
            )}
            {needsEmailConfirmation && (
              <button type="button" onClick={handleResendConfirmation} disabled={loading} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fff7ed', color: '#9a3412', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Resend confirmation email'}
              </button>
            )}
            {mode === 'invite' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }} />
                </div>
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Work Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" readOnly={mode === 'invite' && Boolean(inviteInfo?.inviteEmail)} style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: mode === 'invite' && inviteInfo?.inviteEmail ? '#f8fafc' : 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }} />
            </div>
            {mode === 'invite' && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title (Optional)</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Account Executive" style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }} />
              </div>
            )}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                <button type="button" style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }} />
                <button type="button" onClick={() => setShowPass((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13 }}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            {mode === 'signin' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#3b82f6' }} />
                <label htmlFor="remember" style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Remember me for 30 days</label>
              </div>
            )}
            <button type="submit" disabled={loading || (mode === 'invite' && inviteLoading)} style={{ padding: '12px', borderRadius: 8, border: 'none', background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.35)' }}>
              {loading
                ? mode === 'signin' ? 'Signing in...' : 'Creating account...'
                : mode === 'signin' ? 'Sign in to AccountSignal AI' : 'Create Account from Invite'}
            </button>
            {mode === 'signin' && (
              <>
                <div style={{ position: 'relative', textAlign: 'center', margin: '4px 0' }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e5e7eb' }} />
                  <span style={{ position: 'relative', background: '#f4f6f9', padding: '0 12px', fontSize: 12, color: '#9ca3af' }}>OR</span>
                </div>
                <button type="button" onClick={() => { setMode('signin'); setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setFirstName(''); setLastName(''); setTitle(''); }} style={{ padding: '11px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Use Demo Credentials
                </button>
              </>
            )}
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map((label) => (
              <button key={label} style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
