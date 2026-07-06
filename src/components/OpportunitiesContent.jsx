import StatCard from './StatCard';
import OpportunityGrid from './OpportunityGrid';
import RankedPlaysChart from './RankedPlaysChart';
import { buildSummaryStats } from '../data/mockData';
import './OpportunitiesContent.css';

export default function OpportunitiesContent({ account, isLoading = false }) {
  const stats       = account ? buildSummaryStats(account.summary) : [];
  const opportunities = account?.opportunities ?? [];
  const rankedPlays   = account?.overview?.rankedPlays ?? [];

  return (
    <div className="opps-content">

      {/* Stats row */}
      <section className="opps-content__stats" aria-label="Summary statistics">
        {isLoading
          ? [0,1,2,3].map(i => <div key={i} className="opps-content__stat-skeleton" />)
          : stats.map(stat => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                accent={stat.accent}
                valueVariant={stat.valueVariant}
              />
            ))}
      </section>

      {/* Opportunity cards — ABOVE the chart */}
      <section aria-label="Opportunities">
        <OpportunityGrid
          opportunities={opportunities}
          isLoading={isLoading}
          accountId={account?.id}
        />
      </section>

      {/* Opportunity Prioritisation chart — BOTTOM */}
      {rankedPlays.length > 0 && (
        <section className="opps-content__chart" aria-label="Opportunity prioritisation" style={{marginTop:32}}>
          <RankedPlaysChart plays={rankedPlays} />
        </section>
      )}

    </div>
  );
}
