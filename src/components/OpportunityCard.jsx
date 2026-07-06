import { useNavigate } from 'react-router-dom';
import './OpportunityCard.css';

function priorityClass(priority) {
  if (priority === 'High') return 'opportunity-card__badge--high';
  if (priority === 'Medium-High') return 'opportunity-card__badge--medium-high';
  if (priority === 'Medium') return 'opportunity-card__badge--medium-orange';
  return '';
}

function typeBadgeClass(opportunityType) {
  if (opportunityType === 'Emerging') return 'opportunity-card__badge--type-emerging';
  if (opportunityType === 'Strategic Hypothesis') return 'opportunity-card__badge--type-hypothesis';
  if (
    opportunityType === 'Strategic Hypothesis / Watchlist'
    || opportunityType === 'Watchlist'
  ) return 'opportunity-card__badge--type-watchlist';
  if (opportunityType === 'Confirmed Opportunity' || opportunityType === 'Confirmed') {
    return 'opportunity-card__badge--type';
  }
  if (opportunityType === 'Inferred Opportunity' || opportunityType === 'Inferred') {
    return 'opportunity-card__badge--type-emerging';
  }
  return 'opportunity-card__badge--type';
}

export default function OpportunityCard({
  opportunity,
  accountId,
  isExpanded = false,
  onToggle,
}) {
  const navigate = useNavigate();
  const {
    id,
    title,
    priority,
    opportunityType,
    dealSize,
    timeline,
    buyer,
    projectScope,
    businessDriver,
    technologyStack,
  } = opportunity;

  const showTypeAsLabel = !priority && opportunityType === 'Emerging';
  const detailsId = `opportunity-details-${id}`;

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
    technologyStack && typeof technologyStack === 'object'
      ? technologyStack.confirmed
      : technologyStack;

  const expandedSections = [
    {
      label: 'Project scope',
      items: Array.isArray(projectScope) ? projectScope : projectScope ? [projectScope] : [],
    },
    { label: 'Business driver', value: businessDriver },
    { label: 'Technology stack', value: techPreview },
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
        <div className="opportunity-card__header">
          <div className="opportunity-card__badges">
            {priority && (
              <span className={`opportunity-card__badge ${priorityClass(priority)}`}>
                {priority}
              </span>
            )}
            {opportunityType && !showTypeAsLabel && (
              <span className={`opportunity-card__badge ${typeBadgeClass(opportunityType)}`}>
                {opportunityType}
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
