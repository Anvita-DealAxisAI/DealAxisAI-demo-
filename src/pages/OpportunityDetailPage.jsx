import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOpportunity } from '../api/client';
import './OpportunityDetailPage.css';

function DetailBlock({ label, children }) {
  return (
    <div className="detail-block">
      <h3 className="detail-block__heading">{label}</h3>
      <div className="detail-block__body">{children}</div>
    </div>
  );
}

function BulletList({ items, className = '', itemClassName = '' }) {
  return (
    <ul className={`detail-list ${className}`.trim()}>
      {items.map((item, i) => (
        <li key={i} className={`detail-list__item ${itemClassName}`.trim()}>{item}</li>
      ))}
    </ul>
  );
}

function BuyerTable({ rows }) {
  return (
    <div className="buyer-table">
      {rows.map(({ role, contact }) => (
        <div key={role} className="buyer-table__row">
          <span className="buyer-table__role">{role}</span>
          <span className="buyer-table__contact">{contact}</span>
        </div>
      ))}
    </div>
  );
}

function TechStackGrid({ stack }) {
  const rows = [
    { key: 'confirmed',    label: 'Confirmed'    },
    { key: 'inferred',     label: 'Inferred'     },
    { key: 'unknowns',     label: 'Unknowns'     },
    { key: 'notConfirmed', label: 'Do Not Claim' },
  ];
  return (
    <div className="tech-stack">
      {rows.map(({ key, label }) =>
        stack[key] ? (
          <div key={key} className={`tech-stack__row tech-stack__row--${key}`}>
            <span className="tech-stack__label">{label}</span>
            <span className="tech-stack__value">{stack[key]}</span>
          </div>
        ) : null
      )}
    </div>
  );
}

export default function OpportunityDetailPage() {
  const { accountId, opportunityId } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { opportunity: row } = await fetchOpportunity(accountId, opportunityId);
        if (!cancelled) setOpportunity(row ?? null);
      } catch (err) {
        console.error('Failed to load opportunity detail', err);
        if (!cancelled) setOpportunity(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [accountId, opportunityId]);

  if (isLoading) {
    return (
      <div className="detail-page">
        <button className="detail-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <p>Loading opportunity...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="detail-page">
        <button className="detail-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <p>Opportunity not found.</p>
      </div>
    );
  }

  const {
    title, priority, opportunityType, dealSize, timeline, buyer,
    projectScope, businessDriver, technologyStack, buyerMap,
    siEntryWedge, rationale, firstMeetingTheme, firstThirtyDays,
    solutionElements,
    solutionTeam,
    capabilitiesToBring,
    referenceArchitectureToPrepare,
    deliveryAssetsOrAcceleratorsToPrepare,
  } = opportunity;

  const solutionItems = Array.isArray(solutionElements) && solutionElements.length
    ? solutionElements
    : typeof solutionTeam === 'string' && solutionTeam.trim()
      ? solutionTeam.split(/;\s*|\.\s+/).map((item) => item.trim()).filter(Boolean)
      : [];

  return (
    <div className="detail-page">

      <button className="detail-back-btn" onClick={() => navigate(-1)}>
        ← Back to Opportunities
      </button>

      <header className="detail-header">
        <div className="detail-header__badges">
          {priority && (
            <span className={`detail-badge detail-badge--${priority.toLowerCase()}`}>
              {priority}
            </span>
          )}
          {opportunityType && (
            <span className="detail-badge detail-badge--type">{opportunityType}</span>
          )}
        </div>
        <h1 className="detail-header__title">{title}</h1>
        <div className="detail-header__meta">
          <div className="detail-header__meta-item">
            <span className="detail-header__meta-label">Deal Size</span>
            <span className="detail-header__meta-value">{dealSize}</span>
          </div>
          <div className="detail-header__meta-divider" aria-hidden />
          <div className="detail-header__meta-item">
            <span className="detail-header__meta-label">Timeline</span>
            <span className="detail-header__meta-value">{timeline}</span>
          </div>
          <div className="detail-header__meta-divider" aria-hidden />
          <div className="detail-header__meta-item">
            <span className="detail-header__meta-label">Buyer</span>
            <span className="detail-header__meta-value">{buyer}</span>
          </div>
        </div>
      </header>

      <div className="detail-sections">

        {projectScope && (
          <DetailBlock label="Project Scope">
            {Array.isArray(projectScope)
              ? <BulletList items={projectScope} />
              : <p className="detail-text">{projectScope}</p>}
          </DetailBlock>
        )}

        {businessDriver && (
          <DetailBlock label="Business Driver">
            <p className="detail-text">{businessDriver}</p>
          </DetailBlock>
        )}

        {technologyStack && (
          <DetailBlock label="Technology Stack Intelligence">
            {Array.isArray(technologyStack)
              ? <BulletList items={technologyStack} />
              : typeof technologyStack === 'object'
                ? <TechStackGrid stack={technologyStack} />
                : <p className="detail-text">{technologyStack}</p>}
          </DetailBlock>
        )}

        {buyerMap && buyerMap.length > 0 && (
          <DetailBlock label="Buyer Map">
            <BuyerTable rows={buyerMap} />
          </DetailBlock>
        )}

        {(siEntryWedge || rationale || firstMeetingTheme || (firstThirtyDays && firstThirtyDays.length > 0)) && (
          <DetailBlock label="Entry Approach">
            <div className="detail-combined-quote">
              {siEntryWedge && (
                <div className="detail-combined-quote__item">
                  <p className="detail-text">
                    <span className="detail-block__label detail-block__label--subsection detail-block__label--inline">Entry wedge :</span>
                    {siEntryWedge}
                  </p>
                </div>
              )}
              {rationale && (
                <div className="detail-combined-quote__item">
                  <p className="detail-text">
                    <span className="detail-block__label detail-block__label--subsection detail-block__label--inline">Rationale :</span>
                    {rationale}
                  </p>
                </div>
              )}
              {firstMeetingTheme && (
                <div className="detail-combined-quote__item">
                  <p className="detail-text" style={{ whiteSpace: 'pre-line' }}>
                    <span className="detail-block__label detail-block__label--subsection detail-block__label--inline">First Meeting Theme :</span>
                    {firstMeetingTheme}
                  </p>
                </div>
              )}
              {firstThirtyDays && firstThirtyDays.length > 0 && (
                <div className="detail-combined-quote__item">
                  <p className="detail-text" style={{ whiteSpace: 'pre-line' }}>
                    <span className="detail-block__label detail-block__label--subsection detail-block__label--inline">First 30 day action :</span>
                    {firstThirtyDays.join('\n')}
                  </p>
                </div>
              )}
            </div>
          </DetailBlock>
        )}

        {solutionItems.length > 0 && (
          <DetailBlock label="Solution Elements">
            <BulletList items={solutionItems} />
          </DetailBlock>
        )}

        {(capabilitiesToBring
          || referenceArchitectureToPrepare
          || deliveryAssetsOrAcceleratorsToPrepare) && (
          <DetailBlock label="Solution Team Preparation">
            <div className="solution-prep-grid">
              {capabilitiesToBring?.length ? (
                <div className="solution-prep-section">
                  <p className="solution-prep-section__title">Capabilities to bring</p>
                  <BulletList
                    items={capabilitiesToBring}
                    className="detail-list--compact"
                    itemClassName="detail-list__item--compact"
                  />
                </div>
              ) : null}
              {referenceArchitectureToPrepare?.length ? (
                <div className="solution-prep-section">
                  <p className="solution-prep-section__title">Reference architecture to prepare</p>
                  <BulletList
                    items={referenceArchitectureToPrepare}
                    className="detail-list--compact"
                    itemClassName="detail-list__item--compact"
                  />
                </div>
              ) : null}
              {deliveryAssetsOrAcceleratorsToPrepare?.length ? (
                <div className="solution-prep-section">
                  <p className="solution-prep-section__title">Delivery assets or accelerators to prepare</p>
                  <BulletList
                    items={deliveryAssetsOrAcceleratorsToPrepare}
                    className="detail-list--compact"
                    itemClassName="detail-list__item--compact"
                  />
                </div>
              ) : null}
            </div>
          </DetailBlock>
        )}

      </div>
    </div>
  );
}
