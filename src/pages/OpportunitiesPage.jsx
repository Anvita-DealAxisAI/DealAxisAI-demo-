import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import OpportunityGrid from '../components/OpportunityGrid';
import { fetchAccountLandscape } from '../api/accounts';
import { navItems, userDisplayName } from '../data/mockData';
import './OpportunitiesPage.css';

export default function OpportunitiesPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState('');
  const [stats, setStats] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const { account, stats: nextStats, opportunities: nextOpps } =
        await fetchAccountLandscape(accountId);

      if (cancelled) return;

      setAccountName(account?.name ?? 'Unknown account');
      setStats(nextStats);
      setOpportunities(nextOpps);
      setIsLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return (
    <div className="app-shell">
      <TopNav pageTitle="Opportunity Landscape" userName={userDisplayName} />

      <div className="app-shell__body">
        <Sidebar items={navItems} />

        <main className="app-shell__main">
          <div className="opportunities-page">
            <button
              className="opportunities-page__back-btn"
              onClick={() => navigate('/accounts')}
              aria-label="Back to accounts"
            >
              ← All Accounts
            </button>

            <header className="opportunities-page__header">
              <h1 className="opportunities-page__title">
                {accountName}
              </h1>
              <p className="opportunities-page__subtitle">
                Ranked revenue plays derived from outside-in business, technology and
                stakeholder signals.
              </p>
            </header>

            <section className="opportunities-page__stats" aria-label="Summary statistics">
              {stats.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  accent={stat.accent}
                  valueVariant={stat.valueVariant}
                />
              ))}
            </section>

            <section className="opportunities-page__grid-section" aria-label="Opportunities">
              <OpportunityGrid opportunities={opportunities} isLoading={isLoading} accountId={accountId} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
