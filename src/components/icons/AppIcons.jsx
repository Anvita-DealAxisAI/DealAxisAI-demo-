/**
 * AppIcons — standardized icon set for dealaxisAI.
 *
 * Outline style, 2px stroke (matches the existing inline SVG convention
 * already used in Layout.tsx / OpportunityGrid.jsx). Each icon defaults to
 * a brand hex color sampled directly from the dealaxisAI logo:
 *
 *   Navy  #021846
 *   Blue  #126BD3
 *   Teal  #0099B8
 *   Green #2FA84F
 *
 * Every icon accepts the same three props — size, color, className — so any
 * icon can be reused elsewhere in the app with the same calling convention:
 *
 *   <BankIcon />                  // default size + brand color
 *   <BankIcon size={32} />        // custom size
 *   <BankIcon color="#000000" />  // override color (rare)
 */

const BRAND = {
  navy: '#021846',
  blue: '#126BD3',
  teal: '#0099B8',
  green: '#2FA84F',
};

/** Bank / institution building outline. Fallback for the account card
 * identity slot — only renders when an account has no real logo on file. */
export function BankIcon({ size = 24, color = BRAND.navy, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21h18" strokeLinecap="round" />
      <path d="M4 21V10M9 21V10M15 21V10M20 21V10" strokeLinecap="round" />
      <path d="M2 10l10-6 10 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10h10" strokeLinecap="round" />
    </svg>
  );
}

/** Trending up — opportunities count on each account card. */
export function OpportunitiesIcon({ size = 16, color = BRAND.green, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
  );
}

/** Handshake — deal range on each account card. */
export function DealRangeIcon({ size = 16, color = BRAND.teal, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </svg>
  );
}

/** Users — stakeholder count on each account card. */
export function StakeholdersIcon({ size = 16, color = BRAND.blue, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

/** ── Account Overview Page icons ─────────────────────────────────────────
 *  One icon per semantic concept used in the Overview tab.
 *  All follow the same 24x24 viewBox / 2px stroke / outline convention.
 * ─────────────────────────────────────────────────────────────────────── */

/** Classical column building — About Bank / institution identity */
export function AboutBankIcon({ size = 20, color = BRAND.blue, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <path d="M2 10l10-6 10 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10v8M8 10v8M12 10v8M16 10v8M20 10v8" strokeLinecap="round" />
      <path d="M2 18h20" strokeLinecap="round" />
      <path d="M2 10h20" strokeLinecap="round" />
    </svg>
  );
}

/** Grid of squares — Products catalogue */
export function ProductsIcon({ size = 20, color = BRAND.green, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/** Headset — customer-facing Services */
export function ServicesIcon({ size = 20, color = BRAND.blue, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <path d="M3 11a9 9 0 0118 0" strokeLinecap="round" />
      <rect x="2" y="11" width="4" height="6" rx="2" />
      <rect x="18" y="11" width="4" height="6" rx="2" />
      <path d="M21 17v1a4 4 0 01-4 4h-2" strokeLinecap="round" />
    </svg>
  );
}

/** Stack of coins — Asset Size financial metric */
export function AssetSizeIcon({ size = 20, color = BRAND.navy, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <ellipse cx="12" cy="7" rx="8" ry="3" />
      <path d="M4 7v4c0 1.66 3.58 3 8 3s8-1.34 8-3V7" strokeLinecap="round" />
      <path d="M4 11v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" strokeLinecap="round" />
    </svg>
  );
}

/** Rising bar chart — Revenue metric */
export function RevenueIcon({ size = 20, color = BRAND.green, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="14" width="4" height="7" rx="1" />
      <rect x="10" y="9" width="4" height="12" rx="1" />
      <rect x="17" y="4" width="4" height="17" rx="1" />
    </svg>
  );
}

/** Percentage symbol — NIM / Net Interest Margin metric */
export function NimIcon({ size = 20, color = BRAND.teal, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="16" r="2.5" />
      <path d="M5.5 18.5l13-13" strokeLinecap="round" />
    </svg>
  );
}

/** Lightning bolt — Efficiency Ratio metric */
export function EfficiencyIcon({ size = 20, color = BRAND.blue, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H13L13 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Compass / target with crosshair — Business Strategy */
export function StrategyIcon({ size = 22, color = BRAND.blue, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
    </svg>
  );
}

/** Mobile / device — Retail Bank segment */
export function RetailBankIcon({ size = 20, color = BRAND.blue, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M10 18h4" strokeLinecap="round" />
      <path d="M9 6h6" strokeLinecap="round" />
    </svg>
  );
}

/** Building with dollar accent — Commercial Bank segment */
export function CommercialBankIcon({ size = 20, color = BRAND.green, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M3 9l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6v.01" strokeLinecap="round" />
    </svg>
  );
}

/** Diamond — Wealth Bank segment (premium/value) */
export function WealthBankIcon({ size = 20, color = BRAND.blue, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className} aria-hidden="true">
      <path d="M12 2l4 5H8l4-5z" strokeLinejoin="round" />
      <path d="M8 7l4 13 4-13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 7h20" strokeLinecap="round" />
      <path d="M2 7l4.5 5.5M21.5 7L17 12.5" strokeLinecap="round" />
    </svg>
  );
}

/** Target with a closing-in accent dot — a single opportunity worth pursuing,
 * distinct from OpportunitiesIcon's trend-line glyph (which represents the
 * count/metric, not the concept). Designed fresh for dealaxisAI; not part of
 * the original icon-set reference. Not yet wired into a nav item or route —
 * drop in anywhere an "opportunity" needs a glyph. */
export function OpportunityIcon({ size = 24, color = BRAND.teal, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5.4" />
      <circle cx="12" cy="12" r="2.3" fill={color} stroke="none" />
      <circle cx="16.24" cy="7.76" r="1.15" fill={color} stroke="none" />
    </svg>
  );
}

/** Standard magnifying glass. Same meaning as the previous gray icon,
 * restyled to brand teal. */
export function SearchIcon({ size = 18, color = BRAND.teal, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

/** Document/clipboard outline — standard "nothing here yet" symbol. Shown
 * when an account has zero ranked opportunities. */
export function EmptyStateIcon({ size = 48, color = BRAND.blue, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Three horizontal bars — universal hamburger menu icon. Shown when the
 * sidebar is collapsed. */
export function MenuIcon({ size = 18, color = BRAND.green, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

/** X / cross mark — standard close icon. The other half of the same toggle
 * button as MenuIcon, shown when the sidebar is expanded. */
export function CloseIcon({ size = 18, color = BRAND.green, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
