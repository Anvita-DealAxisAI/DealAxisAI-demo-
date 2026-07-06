interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  white?: boolean;
}

const sizes = {
  sm: { icon: 32, fontSize: 18, gap: 8 },
  md: { icon: 44, fontSize: 24, gap: 10 },
  lg: { icon: 64, fontSize: 36, gap: 14 },
  xl: { icon: 100, fontSize: 56, gap: 20 },
};

export default function DealAxisLogo({ size = 'md', showText = true, white = false }: LogoProps) {
  const s = sizes[size];
  const ic = s.icon;

  return (
    <div className="flex items-center" style={{ gap: s.gap }}>
      {/* Icon */}
      <svg width={ic} height={ic} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring - teal/green arc */}
        <circle cx="50" cy="50" r="44" stroke="url(#outerGrad)" strokeWidth="3" fill="none" strokeDasharray="200 76" strokeLinecap="round" />
        {/* Middle ring - blue arc */}
        <circle cx="50" cy="50" r="34" stroke="url(#midGrad)" strokeWidth="2.5" fill="none" strokeDasharray="160 54" strokeLinecap="round" strokeDashoffset="30" />
        {/* Inner dark circle */}
        <circle cx="50" cy="50" r="26" fill="url(#innerGrad)" />
        {/* Center glow */}
        <circle cx="50" cy="50" r="8" fill="white" fillOpacity="0.95" />
        <circle cx="50" cy="50" r="5" fill="url(#centerGrad)" />
        {/* Network lines */}
        <line x1="50" y1="50" x2="50" y2="26" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="50" y1="50" x2="72" y2="60" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="50" y1="50" x2="32" y2="65" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="50" y1="50" x2="28" y2="40" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="50" y1="50" x2="68" y2="35" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" />
        {/* Network dots */}
        <circle cx="50" cy="26" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="72" cy="60" r="2.5" fill="white" fillOpacity="0.8" />
        <circle cx="32" cy="65" r="2.5" fill="white" fillOpacity="0.8" />
        <circle cx="28" cy="40" r="2.5" fill="white" fillOpacity="0.7" />
        <circle cx="68" cy="35" r="2.5" fill="white" fillOpacity="0.7" />
        {/* Outer orbit dots */}
        <circle cx="50" cy="6" r="5.5" fill="#3bc47a" />
        <circle cx="50" cy="94" r="5.5" fill="#3bc47a" />
        <circle cx="6" cy="50" r="5.5" fill="#2563eb" />
        <circle cx="94" cy="50" r="4" fill="#60b0e8" />
        <circle cx="12" cy="25" r="3" fill="#2563eb" fillOpacity="0.6" />
        <circle cx="88" cy="75" r="3" fill="#2563eb" fillOpacity="0.6" />
        <defs>
          <linearGradient id="outerGrad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#3bc47a" />
            <stop offset="60%" stopColor="#2db8d0" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="midGrad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#60b0e8" />
          </linearGradient>
          <radialGradient id="innerGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#1e4080" />
            <stop offset="100%" stopColor="#0a1f44" />
          </radialGradient>
          <radialGradient id="centerGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#60b0e8" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
        </defs>
      </svg>

      {/* Wordmark */}
      {showText && (
        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: s.fontSize, lineHeight: 1, letterSpacing: '-0.02em' }}>
          {white ? (
            <span style={{ color: '#ffffff' }}>dealaxis</span>
          ) : (
            <>
              <span style={{ color: '#0a1f44' }}>deal</span>
              <span style={{ color: '#2563eb' }}>a</span>
              <span style={{ color: '#1a9e5c' }}>x</span>
              <span style={{ color: '#0a1f44' }}>is</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
