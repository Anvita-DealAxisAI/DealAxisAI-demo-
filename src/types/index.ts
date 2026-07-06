export type Theme = 'light' | 'dark' | 'corporate';

export interface Account {
  id: string;
  name: string;
  fit: string;
  value: string;
  urgency: string;
  entry: string;
  relationship: string;
  signals: string;
  status: string;
  heatScore: number;
  strategicFit: string;
  tags: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low' | 'Emerging';
  status: 'Confirmed' | 'Validated' | 'Watch' | 'Emerging';
  dealSize: string;
  timeline: string;
  buyer: string;
  businessDriver: string;
  technicalDriver: string;
  whyNow: string;
  nextAction: string;
  positioningMessage: string;
  primaryBuyer: string;
  influencers: string;
  likelyObjection: string;
  counterStrategy: string;
  confidence: string;
  entryEase: string;
}

export interface BubblePoint {
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface KpiCard {
  label: string;
  value: string | number;
  subtitle: string;
  color: string;
}
