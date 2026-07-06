import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Icon } from '../../components/SvgIcons';
import logoUrl from '/accountsignal-logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/');
    else setError('Invalid credentials. Please try again.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Left Panel */}
      <div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px', background: 'linear-gradient(145deg, #0d1b2e 0%, #1a3a6e 60%, #0d1b2e 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', top: 80, right: -40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 100, left: -40, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            background: '#ffffff',
            borderRadius: 12,
            padding: '10px 14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <img
              src={logoUrl}
              alt="AccountSignal AI"
              style={{ height: 36, width: 'auto', maxWidth: 220, objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 32, fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>AI intelligence that connects signals to sales success.</p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.7 }}>Prioritize accounts, surface opportunities, and drive revenue with AI-powered portfolio intelligence.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: 'efficiency', text: 'Real-time account heat scoring' },
              { icon: 'target', text: 'AI-ranked opportunity signals' },
              { icon: 'revenue', text: 'Executive portfolio command center' },
              { icon: 'globe', text: 'CRM-ready integration layer' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={f.icon} size={16} color="rgba(255,255,255,0.85)" />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 AccountSignal AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 40px', background: '#f4f6f9' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 26, color: '#0d1b2e', margin: '0 0 8px' }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: '#6b7a99', margin: 0 }}>Sign in to your AccountSignal AI workspace</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>{error}</div>}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Work Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                <button type="button" style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' as const }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13 }}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#3b82f6' }} />
              <label htmlFor="remember" style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Remember me for 30 days</label>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 8, border: 'none', background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.35)' }}>
              {loading ? 'Signing in...' : 'Sign in to AccountSignal AI'}
            </button>
            <div style={{ position: 'relative', textAlign: 'center', margin: '4px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e5e7eb' }} />
              <span style={{ position: 'relative', background: '#f4f6f9', padding: '0 12px', fontSize: 12, color: '#9ca3af' }}>OR</span>
            </div>
            <button type="button" onClick={() => { setEmail('demo@accountsignal.ai'); setPassword('demo123'); }} style={{ padding: '11px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Use Demo Credentials
            </button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map(l => (
              <button key={l} style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
