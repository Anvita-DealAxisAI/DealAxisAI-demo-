import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OpportunitiesIcon, DealRangeIcon, StakeholdersIcon } from '../components/icons/AppIcons';
import { BankLogo } from '../components/SvgIcons';
import { fetchAccountsList } from '../api/accounts';
import hotAccountsIcon from '../../logo/icons/hot-accounts.svg';
import './AccountsPage.css';

function accountNumberSortKey(id) {
  const value = String(id ?? '').trim();
  const match = value.match(/(\d+)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number.parseInt(match[1], 10);
}

function AccountCard({ account }) {
  const navigate = useNavigate();
  const { id, name, status, summary } = account;
  const accountOverviewPath = `/accounts/${id}?from=accounts`;
  const accountOpportunitiesPath = `/accounts/${id}?tab=Opportunities&from=accounts`;
  const isHot = String(status ?? '').trim().toLowerCase() === 'hot';

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
          {isHot ? (
            <span className="account-card__hot-badge" aria-label="Hot account" title="Hot account">
              <img src={hotAccountsIcon} alt="" className="account-card__hot-badge-icon" aria-hidden />
              <span className="account-card__hot-badge-label">Hot</span>
            </span>
          ) : null}
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
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const rows = await fetchAccountsList();
        if (!cancelled) setAccounts(rows ?? []);
      } catch (err) {
        console.error('Failed to load accounts', err);
        if (!cancelled) setAccounts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleAccounts = [...accounts]
    .sort((a, b) => {
      const aKey = accountNumberSortKey(a.id);
      const bKey = accountNumberSortKey(b.id);
      if (aKey !== bKey) return aKey - bKey;
      return String(a.id ?? '').localeCompare(String(b.id ?? ''), undefined, { numeric: true });
    })
    .map((account) => ({
      id: account.id,
      name: account.name,
      status: account.status,
      summary: {
        totalOpportunities: account.summary?.totalOpportunities ?? account.opportunities?.length ?? 0,
        opportunityRange: account.summary?.opportunityRange ?? '—',
        stakeholdersCount: account.summary?.stakeholdersCount ?? 0,
      },
    }));

  return (
    <div className="accounts-page animate-fade">
      <header className="page-header">
        <h1 className="page-header__title">Accounts</h1>
        <p className="page-header__subtitle">Select an account to explore its ranked revenue opportunities.</p>
      </header>
      {isLoading ? <p className="account-page__loading">Loading accounts...</p> : null}
      <div className="accounts-page__grid">
        {visibleAccounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
