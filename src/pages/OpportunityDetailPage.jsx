import { useParams, useNavigate } from 'react-router-dom';
import { getDemoOpportunityAccount } from '../data/demoOpportunityData';
import './OpportunityDetailPage.css';

const ACCOUNT_ID_TO_NAME = {
  A001: 'Citizens',
  A002: 'Synovus',
  A003: 'BECU',
  A004: 'PNC',
  A005: 'US Bank',
  A006: 'M&T Bank',
  A007: 'Truist',
  A008: 'Fifth Third',
  A009: 'Regions',
  A010: 'KeyBank',
};

function DetailBlock({ label, children }) {
  return (
    <div className="detail-block">
      <h3 className="detail-block__heading">{label}</h3>
      <div className="detail-block__body">{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="detail-list">
      {items.map((item, i) => (
        <li key={i} className="detail-list__item">{item}</li>
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

  const accountName = ACCOUNT_ID_TO_NAME[accountId];
  const account = getDemoOpportunityAccount(accountId, accountName);
  const opportunity = account?.opportunities?.find(o => o.id === opportunityId)
    ?? account?.opportunities?.[0];

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
    siEntryWedge, firstMeetingTheme, firstThirtyDays,
    solutionTeam, keyIntegrationAreas,
  } = opportunity;

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
            {typeof technologyStack === 'object'
              ? <TechStackGrid stack={technologyStack} />
              : <p className="detail-text">{technologyStack}</p>}
          </DetailBlock>
        )}

        {buyerMap && buyerMap.length > 0 && (
          <DetailBlock label="Buyer Map">
            <BuyerTable rows={buyerMap} />
          </DetailBlock>
        )}

        {(siEntryWedge || firstMeetingTheme) && (
          <DetailBlock label="Entry Approach">
            <div className="detail-combined-quote">
              {siEntryWedge && (
                <div className="detail-combined-quote__item">
                  <p className="detail-text">
                    <span className="detail-block__label detail-block__label--subsection detail-block__label--inline">SI Entry Wedge :</span>
                    {siEntryWedge}
                  </p>
                </div>
              )}
              {firstMeetingTheme && (
                <div className="detail-combined-quote__item">
                  <p className="detail-text">
                    <span className="detail-block__label detail-block__label--subsection detail-block__label--inline">First Meeting Theme :</span>
                    {firstMeetingTheme}
                  </p>
                </div>
              )}
            </div>
          </DetailBlock>
        )}

        {firstThirtyDays && firstThirtyDays.length > 0 && (
          <DetailBlock label="First 30-Day Action">
            <BulletList items={firstThirtyDays} />
          </DetailBlock>
        )}

        {solutionTeam && (
          <DetailBlock label="Solution Team Preparation">
            <p className="detail-text">{solutionTeam}</p>
          </DetailBlock>
        )}

        {keyIntegrationAreas && (
          <DetailBlock label="Key Integration Areas">
            <p className="detail-text">{keyIntegrationAreas}</p>
          </DetailBlock>
        )}

      </div>
    </div>
  );
}
