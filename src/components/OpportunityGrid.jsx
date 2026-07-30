import { useEffect, useMemo, useRef, useState } from 'react';
import OpportunityCard from './OpportunityCard';
import './OpportunityGrid.css';

const PRIORITY_ORDER = {
  critical: 0,
  hot: 1,
  high: 2,
  'medium-high': 3,
  medium: 4,
  low: 5,
};
const TYPE_ORDER = {
  'Confirmed Opportunity': 0,
  Confirmed: 0,
  'Confirmed / Inferred': 1,
  'Inferred Opportunity': 2,
  Inferred: 2,
  'Strategic Hypothesis': 3,
  Watchlist: 4,
  'Strategic Hypothesis / Watchlist': 4,
};

function sortOpportunities(opportunities) {
  return [...opportunities].sort((a, b) => {
    const pa = PRIORITY_ORDER[String(a.priority ?? '').trim().toLowerCase()] ?? 99;
    const pb = PRIORITY_ORDER[String(b.priority ?? '').trim().toLowerCase()] ?? 99;
    if (pa !== pb) return pa - pb;

    const ta = TYPE_ORDER[a.opportunityType] ?? 99;
    const tb = TYPE_ORDER[b.opportunityType] ?? 99;
    return ta - tb;
  });
}

function OpportunityCardSkeleton() {
  return (
    <div className="opportunity-card-skeleton" aria-hidden>
      <div className="opportunity-card-skeleton__row">
        <div className="opportunity-card-skeleton__badges">
          <div className="opportunity-card-skeleton__block opportunity-card-skeleton__block--pill" />
          <div className="opportunity-card-skeleton__block opportunity-card-skeleton__block--pill" />
        </div>
        <div className="opportunity-card-skeleton__block opportunity-card-skeleton__block--link" />
      </div>
      <div className="opportunity-card-skeleton__block opportunity-card-skeleton__block--title" />
      <div className="opportunity-card-skeleton__meta">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="opportunity-card-skeleton__block opportunity-card-skeleton__block--label" />
            <div className="opportunity-card-skeleton__block opportunity-card-skeleton__block--value" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OpportunityGrid({ opportunities = [], isLoading = false, accountId }) {
  const [expandedId, setExpandedId] = useState(null);
  const pendingExpandIdRef = useRef(null);
  const switchTimerRef = useRef(null);
  const sorted = useMemo(() => sortOpportunities(opportunities), [opportunities]);

  const handleToggle = (id) => {
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }

    if (expandedId === id) {
      pendingExpandIdRef.current = null;
      setExpandedId(null);
      return;
    }

    if (!expandedId) {
      pendingExpandIdRef.current = null;
      setExpandedId(id);
      return;
    }

    // Two-step switch: collapse current first, then expand target.
    pendingExpandIdRef.current = id;
    setExpandedId(null);
    switchTimerRef.current = window.setTimeout(() => {
      if (pendingExpandIdRef.current) {
        setExpandedId(pendingExpandIdRef.current);
      }
      pendingExpandIdRef.current = null;
      switchTimerRef.current = null;
    }, 180);
  };

  useEffect(() => () => {
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
    }
  }, []);

  if (isLoading) {
    return (
      <div
        className="opportunity-grid opportunity-grid--loading"
        aria-busy="true"
        aria-label="Loading opportunities"
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="opportunity-grid__cell">
            <OpportunityCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!opportunities.length) {
    return (
      <div className="opportunity-grid opportunity-grid--empty">
        <div className="opportunity-grid__empty">
          <svg
            className="opportunity-grid__empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="opportunity-grid__empty-title">No opportunities found</h3>
          <p className="opportunity-grid__empty-text">
            There are no ranked revenue plays for this account yet. Check back after signals are
            processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="opportunity-grid">
      {sorted.map((opportunity) => (
        <div key={opportunity.id} className="opportunity-grid__cell">
          <OpportunityCard
            opportunity={opportunity}
            accountId={accountId}
            isExpanded={expandedId === opportunity.id}
            onToggle={handleToggle}
          />
        </div>
      ))}
    </div>
  );
}
