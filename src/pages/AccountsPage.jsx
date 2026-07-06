import { useNavigate } from 'react-router-dom';
import { OpportunitiesIcon, DealRangeIcon, StakeholdersIcon } from '../components/icons/AppIcons';
import { BankLogo } from '../components/SvgIcons';
import { useAuth } from '../store/AuthContext';
import { getDemoAccountsSubset } from '../data/staticData';
import './AccountsPage.css';

const STATIC_ACCOUNTS = [
  { id:'A002', name:'Synovus',     logo:'/banks/synovus.jpg',     sector:'Banking', summary:{ totalOpportunities:10, opportunityRange:'$19M–$65M',  stakeholdersCount:12 } },
  { id:'A001', name:'Citizens',    logo:'/banks/citizens.png',    sector:'Banking', summary:{ totalOpportunities:8,  opportunityRange:'$6M–$12M',   stakeholdersCount:9  } },
  { id:'A003', name:'BECU',        logo:'/banks/becu.png',        sector:'Banking', summary:{ totalOpportunities:10, opportunityRange:'$8M–$16M',   stakeholdersCount:11 } },
  { id:'A004', name:'PNC',         logo:'/banks/pnc.png',         sector:'Banking', summary:{ totalOpportunities:7,  opportunityRange:'$4M–$9M',    stakeholdersCount:8  } },
  { id:'A005', name:'US Bank',     logo:'/banks/usbank.png',      sector:'Banking', summary:{ totalOpportunities:6,  opportunityRange:'$3M–$7M',    stakeholdersCount:7  } },
  { id:'A006', name:'M&T Bank',    logo:'/banks/mtb.png',         sector:'Banking', summary:{ totalOpportunities:5,  opportunityRange:'$3M–$6M',    stakeholdersCount:6  } },
  { id:'A007', name:'Truist',      logo:'/banks/truist.png',      sector:'Banking', summary:{ totalOpportunities:4,  opportunityRange:'$2M–$5M',    stakeholdersCount:5  } },
  { id:'A008', name:'Fifth Third', logo:'/banks/fifththird.png',  sector:'Banking', summary:{ totalOpportunities:3,  opportunityRange:'$1M–$3M',    stakeholdersCount:4  } },
];

function AccountCard({ account }) {
  const navigate = useNavigate();
  const { id, name, summary } = account;
  const accountOverviewPath = `/accounts/${id}?from=accounts`;
  const accountOpportunitiesPath = `/accounts/${id}?tab=Opportunities&from=accounts`;

  return (
    <article
      className="account-card"
      onClick={() => navigate(accountOverviewPath)}
      onKeyDown={e => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(accountOverviewPath);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${name} overview`}
    >
      <div className="account-card__body">
        <div className="account-card__header">
          <div className="account-card__identity">
            <div className="account-card__icon" aria-hidden>
              <BankLogo name={name} size={44} />
            </div>
            <div className="account-card__name-group">
              <h2 className="account-card__name">{name}</h2>
            </div>
          </div>
        </div>
        <div className="account-card__stats">
          <div className="account-card__stat-chip account-card__stat-chip--green">
            <span className="account-card__chip-value">{summary.totalOpportunities}</span>
            <span className="account-card__chip-label">
              <OpportunitiesIcon size={13} color="#16a34a" className="account-card__chip-label-icon" />
              <span className="account-card__chip-label-text">Opportunities</span>
            </span>
          </div>
          <div className="account-card__stat-chip account-card__stat-chip--blue">
            <span className="account-card__chip-value">{summary.opportunityRange}</span>
            <span className="account-card__chip-label">
              <DealRangeIcon size={13} color="#2563eb" className="account-card__chip-label-icon" />
              <span className="account-card__chip-label-text">Deal range</span>
            </span>
          </div>
          <div className="account-card__stat-chip account-card__stat-chip--purple">
            <span className="account-card__chip-value">{summary.stakeholdersCount}</span>
            <span className="account-card__chip-label">
              <StakeholdersIcon size={13} color="#7c3aed" className="account-card__chip-label-icon" />
              <span className="account-card__chip-label-text">Stakeholders</span>
            </span>
          </div>
        </div>
      </div>
      <div className="account-card__footer">
        <span className="account-card__footer-label">Opportunity Landscape</span>
        <button
          type="button"
          className="account-card__cta"
          onClick={(e) => {
            e.stopPropagation();
            navigate(accountOpportunitiesPath);
          }}
          aria-label={`View plays for ${name}`}
        >
          View plays →
        </button>
      </div>
    </article>
  );
}

export default function AccountsPage() {
  const { user } = useAuth();
  // Same experimental subset used on the Portfolio Overview page, so
  // demo1..demo10 see a consistent set of subscribed banks everywhere.
  // Official accounts (ajay@, demo@) are unaffected and always see all 10.
  const visibleIds = new Set(getDemoAccountsSubset(user?.bankCount).map(a => a.id));
  const visibleAccounts = STATIC_ACCOUNTS.filter(a => visibleIds.has(a.id));

  return (
    <div className="accounts-page animate-fade">
      <header className="page-header">
        <h1 className="page-header__title">Accounts</h1>
        <p className="page-header__subtitle">Select an account to explore its ranked revenue opportunities.</p>
      </header>
      <div className="accounts-page__grid">
        {visibleAccounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
