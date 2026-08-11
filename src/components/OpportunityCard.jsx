import { useNavigate } from 'react-router-dom';
import './OpportunityCard.css';

function priorityClass(priority) {
  const key = String(priority ?? '').trim().toLowerCase();
  if (key === 'critical') return 'opportunity-card__badge--critical';
  if (key === 'hot') return 'opportunity-card__badge--hot';
  if (key === 'high') return 'opportunity-card__badge--hot';
  if (key === 'medium-high') return 'opportunity-card__badge--medium-high';
  if (key === 'medium') return 'opportunity-card__badge--medium-orange';
  if (key === 'watchlist') return 'opportunity-card__badge--watchlist-priority';
  return '';
}

function classificationBadgeClass(opportunityClassification) {
  const key = String(opportunityClassification ?? '').trim().toLowerCase();
  if (key === 'emerging') return 'opportunity-card__badge--type-emerging';
  if (key === 'strategic hypothesis' || key === 'strategic hypothesis opportunity') {
    return 'opportunity-card__badge--type-hypothesis';
  }
  if (
    key === 'strategic hypothesis / watchlist'
    || key === 'watchlist'
    || key === 'watchlist opportunity'
  ) return 'opportunity-card__badge--type-watchlist';
  if (key === 'confirmed opportunity' || key === 'confirmed') {
    return 'opportunity-card__badge--type';
  }
  if (key === 'inferred opportunity' || key === 'inferred') {
    return 'opportunity-card__badge--type-emerging';
  }
  return 'opportunity-card__badge--type';
}

/** Prefer opportunity_classification; only accept Confirmed/Inferred/Watchlist-style labels. */
function resolveClassificationLabel(opportunityClassification, opportunityType) {
  const candidates = [opportunityClassification, opportunityType];
  for (const value of candidates) {
    const key = String(value ?? '').trim().toLowerCase();
    if (!key) continue;
    if (
      key.includes('confirmed')
      || key.includes('inferred')
      || key.includes('watchlist')
      || key.includes('strategic hypothesis')
      || key === 'emerging'
    ) {
      return String(value).trim();
    }
  }
  return null;
}

export default function OpportunityCard({
  opportunity,
  rank,
  accountId,
  isExpanded = false,
  onToggle,
}) {
  const navigate = useNavigate();
  const {
    id,
    title,
    priority,
    opportunityClassification,
    opportunityType,
    dealSize,
    timeline,
    buyer,
    projectScope,
    businessDriver,
    technologyStack,
  } = opportunity;

  const classificationLabel = resolveClassificationLabel(opportunityClassification, opportunityType);
  const showTypeAsLabel = !priority && opportunityType === 'Emerging';
  const detailsId = `opportunity-details-${id}`;
  const displayRank = Number.isFinite(Number(rank)) ? Number(rank) : null;

  const handleToggle = () => onToggle?.(id);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/accounts/${accountId}/opportunities/${id}`);
  };

  // Tech stack preview: confirmed platforms only
  const techPreview =
    technologyStack && typeof technologyStack === 'object' && !Array.isArray(technologyStack)
      ? technologyStack.confirmed
      : technologyStack;

  const expandedSections = [
    {
      label: 'Project scope',
      items: Array.isArray(projectScope) ? projectScope : projectScope ? [projectScope] : [],
    },
    { label: 'Business driver', value: businessDriver },
    {
      label: 'Technology stack',
      items: Array.isArray(techPreview) ? techPreview : undefined,
      value: Array.isArray(techPreview) ? undefined : techPreview,
    },
  ];

  return (
    <article
      className={`opportunity-card ${isExpanded ? 'opportunity-card--expanded' : ''}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-controls={detailsId}
    >
      {/* ── Card summary (always visible) ── */}
      <div className="opportunity-card__summary">
        {displayRank !== null && (
          <span className="opportunity-card__rank-badge">{displayRank}</span>
        )}
        <div className="opportunity-card__header">
          <div className="opportunity-card__badges">
            {priority && (
              <span className={`opportunity-card__badge ${priorityClass(priority)}`}>
                {priority}
              </span>
            )}
            {classificationLabel && !showTypeAsLabel && (
              <span className={`opportunity-card__badge ${classificationBadgeClass(classificationLabel)}`}>
                {classificationLabel}
              </span>
            )}
          </div>
          <span className="opportunity-card__toggle-label">
            {isExpanded ? 'Hide details ↑' : 'Expand ↓'}
          </span>
        </div>

        <div className="opportunity-card__body">
          {showTypeAsLabel && (
            <span className="opportunity-card__type-label">{opportunityType}</span>
          )}
          <h3 className="opportunity-card__title">{title}</h3>
        </div>

        <div className="opportunity-card__meta">
          <div className="opportunity-card__meta-item">
            <p className="opportunity-card__meta-label">Deal Size</p>
            <p className="opportunity-card__meta-value">{dealSize}</p>
          </div>
          <div className="opportunity-card__meta-item">
            <p className="opportunity-card__meta-label">Timeline</p>
            <p className="opportunity-card__meta-value">{timeline}</p>
          </div>
          <div className="opportunity-card__meta-item">
            <p className="opportunity-card__meta-label">Buyer</p>
            <p className="opportunity-card__meta-value">{buyer}</p>
          </div>
        </div>
      </div>

      {/* ── Expanded preview (slides open) ── */}
      <div
        id={detailsId}
        className="opportunity-card__details"
        aria-hidden={!isExpanded}
      >
        <div className="opportunity-card__details-inner">
          <div className="opportunity-card__details-panel">
            {expandedSections.map(({ label, value, items }) => (
              <div key={label} className="opportunity-card__detail-block">
                <p className="opportunity-card__detail-label">{label}</p>
                {items ? (
                  <ul className="opportunity-card__detail-list">
                    {items.map((item, i) => (
                      <li key={i} className="opportunity-card__detail-list-item">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="opportunity-card__detail-value">{value || '—'}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Action bar ── */}
          <div className="opportunity-card__action-bar">
            <button
              className="opportunity-card__view-btn"
              onClick={handleViewDetails}
              aria-label={`View full details for ${title}`}
            >
              View details →
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
