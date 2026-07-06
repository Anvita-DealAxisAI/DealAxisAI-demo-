/**
 * Static overview widgets not yet in the DB schema (Synovus MVP).
 */
import { ACCOUNT_SYNOVUS } from './ids.js';

export const accountOverviewsById = {
  [ACCOUNT_SYNOVUS]: {
    subtitle: 'Regional banking · Strategic account intelligence view',
    about:
      'Synovus is a financial services company headquartered in Columbus, Georgia, focused on relationship-led banking across retail, commercial, and wealth segments throughout the Southeast.',
    products:
      'Offers a comprehensive suite of products including deposits, lending, treasury management, payments, mortgages, and digital banking solutions tailored to individuals and businesses.',
    services:
      'Provides retail banking, commercial banking, treasury management, wealth advisory, and digital servicing backed by personalized support and innovative technology.',
    financials: [
      { label: 'Asset Size', value: '$60B+', icon: '🏦' },
      { label: 'Revenue', value: '$2.3B', icon: '📈' },
      { label: 'NIM', value: '3.2%', icon: '%' },
      { label: 'Efficiency Ratio', value: '61%', icon: '⚡' },
    ],
    strategy:
      'Synovus is committed to disciplined growth through deep client relationships and strategic market focus. The bank invests in digital modernization to enhance customer experience and operational efficiency while expanding relationship-based commercial banking and wealth management capabilities. Synovus prioritizes strong credit quality, risk management, and profitable growth to deliver sustainable shareholder value.',
    competitors: [
      { name: 'Regions', assetSize: '$152B', revenue: '$7.5B', efficiency: '60%' },
      { name: 'Truist', assetSize: '$545B', revenue: '$20.1B', efficiency: '62%' },
      { name: 'Fifth Third', assetSize: '$214B', revenue: '$7.8B', efficiency: '59%' },
      { name: 'KeyBank', assetSize: '$187B', revenue: '$6.7B', efficiency: '63%' },
    ],
    segments: [
      {
        title: 'Retail Bank',
        icon: '🛒',
        color: '#2563eb',
        desc: 'Focused on deepening digital engagement, growing core deposits, optimizing branch network, and enhancing customer experience to drive loyalty and lifetime value.',
      },
      {
        title: 'Commercial Bank',
        icon: '💼',
        color: '#10b981',
        desc: 'Driving commercial lending growth, expanding treasury and payments solutions, strengthening middle-market relationships, and maintaining strong credit quality and risk discipline.',
      },
      {
        title: 'Wealth Bank',
        icon: '👤',
        color: '#8b5cf6',
        desc: 'Growing advisory assets, acquiring affluent clients, delivering comprehensive portfolio services, and leveraging integrated relationship coverage across the enterprise.',
      },
    ],
    snapshot: {
      description:
        'Synovus Financial Corp is a $65B regional bank undergoing a major systems conversion following its merger with FCB Financial. Active modernization signals across core conversion, digital banking, treasury, lending, AI, and data.',
      tags: ['Core Conversion', 'AI Adoption', 'Data Quality', 'Treasury Modernization'],
    },
    valueHypothesis: {
      potentialValue: '$19M–$65M',
      primaryEntry: 'Core Conversion & Client Experience',
      recommendedMove: 'Conversion readiness discovery',
    },
    signalTimeline: [
      { timing: 'Now', label: 'Conversion readiness & client-experience assurance' },
      { timing: 'Next', label: 'AI / data enablement and treasury optimization' },
      { timing: 'Later', label: 'App rationalization & cyber resilience' },
    ],
    serviceLineThemes: ['Core Conversion', 'Digital', 'Treasury', 'AI', 'Data'],
    stakeholdersCount: 12,
  },
};

export function getAccountOverview(accountId) {
  return accountOverviewsById[accountId] ?? null;
}
