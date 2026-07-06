import { bankLogos } from './bankLogosData';

interface BankLogoProps {
  name: string;
  size?: number;
  shape?: 'circle' | 'rounded';
}

// Normalize bank names - handles both short and full names
const normalizeName = (name: string): string => {
  const map: Record<string, string> = {
    'Citizens Bank':    'Citizens',
    'Regions Bank':     'Regions',
    'Commerce Bank':    'Commerce Bank',
    'Fifth Third Bank': 'Fifth Third',
    'M&T':              'M&T Bank',
  };
  return map[name] || name;
};

const fallbacks: Record<string, { bg: string; color: string; abbr: string }> = {
  'Citizens':     { bg: '#006747', color: '#fff', abbr: 'CI' },
  'Synovus':      { bg: '#c8102e', color: '#fff', abbr: 'SY' },
  'BECU':         { bg: '#d0021b', color: '#fff', abbr: 'BE' },
  'PNC':          { bg: '#f58025', color: '#fff', abbr: 'PN' },
  'US Bank':      { bg: '#0a1f44', color: '#fff', abbr: 'US' },
  'M&T Bank':     { bg: '#007a53', color: '#fff', abbr: 'MT' },
  'Truist':       { bg: '#2d1b69', color: '#fff', abbr: 'TR' },
  'Fifth Third':  { bg: '#003087', color: '#fff', abbr: '53' },
  'Regions':      { bg: '#5a9e32', color: '#fff', abbr: 'RE' },
  'KeyBank':      { bg: '#cc0000', color: '#fff', abbr: 'KE' },
  'Commerce Bank':{ bg: '#004B87', color: '#fff', abbr: 'CO' },
};

export default function BankLogo({ name, size = 36, shape = 'rounded' }: BankLogoProps) {
  const key = normalizeName(name);
  const logo = bankLogos[key];
  const fb = fallbacks[key] || fallbacks[name] || { bg: '#475569', color: '#fff', abbr: name.slice(0, 2).toUpperCase() };
  const borderRadius = shape === 'circle' ? '50%' : 8;

  if (logo && logo.img) {
    return (
      <div style={{
        width: size, height: size, borderRadius, flexShrink: 0,
        background: logo.bg, border: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', boxSizing: 'border-box' as const,
        padding: logo.pad, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <img
          src={logo.img}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius, flexShrink: 0,
      background: fb.bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: fb.color, fontWeight: 700,
      fontSize: size * 0.3, fontFamily: 'Inter,sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }}>
      {fb.abbr}
    </div>
  );
}
