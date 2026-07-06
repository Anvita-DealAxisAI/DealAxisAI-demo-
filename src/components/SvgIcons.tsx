// All SVG icons used across AccountSignal AI — no emojis, no icon libraries
const s = { fill:'none', stroke:'currentColor', strokeWidth:'1.8', strokeLinecap:'round' as const, strokeLinejoin:'round' as const };

export const Icon = ({ name, size=20, color='currentColor', className='' }: { name:string; size?:number; color?:string; className?:string }) => {
  const p = { ...s, width:size, height:size, viewBox:'0 0 24 24', style:{color}, className };
  switch(name) {
    case 'bank':      return <svg {...p}><path d="M3 21h18M3 7v14M21 7v14M6 21V11M18 21V11M9 21v-4h6v4M12 3L2 9h20z"/></svg>;
    case 'fire':      return <svg {...p}><path d="M12 2c0 6-6 8-6 13a6 6 0 0012 0c0-5-6-7-6-13z"/><path d="M12 12c0 3-2 4-2 6a2 2 0 004 0c0-2-2-3-2-6z"/></svg>;
    case 'target':    return <svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>;
    case 'dollar':    return <svg {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
    case 'trend':     return <svg {...p}><path d="M3 17l5-5 4 4 7-8"/><path d="M15 8h4v4"/></svg>;
    case 'gear':      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case 'people':    return <svg {...p}><circle cx="9" cy="8" r="3"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="7" r="2.7"/><path d="M14.5 13.8c2.6.4 4.5 2.3 4.5 5.2"/></svg>;
    case 'brief':     return <svg {...p}><rect x="3" y="8" width="18" height="11" rx="2"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M3 13h18"/></svg>;
    case 'person':    return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
    case 'cloud':     return <svg {...p}><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>;
    case 'mobile':    return <svg {...p}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>;
    case 'payment':   return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
    case 'shield':    return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'globe':     return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
    case 'calendar':  return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case 'people2':   return <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case 'org':       return <svg {...p}><rect x="3" y="3" width="5" height="4" rx="1"/><rect x="10" y="10" width="5" height="4" rx="1"/><rect x="3" y="17" width="5" height="4" rx="1"/><rect x="17" y="17" width="5" height="4" rx="1"/><path d="M8 5h8a2 2 0 012 2v3M5.5 7v3M12.5 14v3M12.5 14v3"/><path d="M5.5 10v7M19.5 10v7M5.5 10h14"/></svg>;
    case 'doc':       return <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case 'search':    return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'arrow-right': return <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case 'chevron-right': return <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>;
    case 'filter':    return <svg {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case 'download':  return <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case 'info':      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case 'asset':     return <svg {...p}><ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v4c0 1.66 3.58 3 8 3s8-1.34 8-3V7"/><path d="M4 11v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/></svg>;
    case 'revenue':   return <svg {...p}><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>;
    case 'percent':   return <svg {...p}><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="16" r="2.5"/><line x1="5" y1="19" x2="19" y2="5"/></svg>;
    case 'efficiency':return <svg {...p}><path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H13z"/></svg>;
    case 'cart':      return <svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.57L23 6H6"/></svg>;
    case 'strategy':  return <svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>;
    case 'news-doc':  return <svg {...p}><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>;
    case 'check':     return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

import UiBankLogo from './ui/BankLogo';

export function BankLogo({ name, size = 28 }: { name: string; size?: number }) {
  return <UiBankLogo name={name} size={size} shape="circle" />;
}
