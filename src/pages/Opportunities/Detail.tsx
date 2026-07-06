import { useParams, useNavigate } from 'react-router-dom';
import { opportunities } from '../../mockData';

const driverColors = ['#ef4444', '#2563eb', '#f59e0b', '#10b981'];

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const opp = opportunities.find(o => o.id === id) || opportunities[0];

  const drivers = [
    { label: 'Business Driver', text: opp.businessDriver },
    { label: 'Technical Driver', text: opp.technicalDriver },
    { label: 'Why Now', text: opp.whyNow },
    { label: 'Suggested Next Action', text: opp.nextAction },
  ];

  const gtm = [
    { label: 'Positioning Message', value: opp.positioningMessage },
    { label: 'Primary Buyer', value: opp.primaryBuyer },
    { label: 'Influencers', value: opp.influencers },
    { label: 'Likely Objection', value: opp.likelyObjection },
    { label: 'Counter Strategy', value: opp.counterStrategy },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>{opp.title}</h1>
              <span className="text-sm font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: '#ef4444' }}>High Urgency</span>
              <span className="text-sm font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: '#10b981' }}>Confirmed</span>
              <span className="text-sm font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: '#8b5cf6' }}>Confidence {opp.confidence}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Recommended entry path: data validation and audit-ready reporting workflow modernization.
            </p>
          </div>
          <button
            onClick={() => navigate('/opportunities')}
            className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-80"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Left: Drivers */}
        <div className="col-span-3 space-y-3">
          {drivers.map((d, i) => (
            <div key={d.label} className="card rounded-xl p-4 flex gap-3">
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: driverColors[i] }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{d.label}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: GTM */}
        <div className="col-span-2 rounded-2xl p-6" style={{ background: '#0f172a' }}>
          <h3 className="font-display font-bold text-xl mb-5 text-white">GTM Strategy Panel</h3>
          <div className="space-y-4">
            {gtm.map(row => (
              <div key={row.label} className="grid grid-cols-2 gap-3">
                <p className="text-sm" style={{ color: '#60a5fa' }}>{row.label}</p>
                <p className="text-sm text-white">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Deal Size', value: opp.dealSize, color: '#10b981' },
          { label: 'Timeline', value: opp.timeline, color: '#f59e0b' },
          { label: 'Entry Ease', value: opp.entryEase, color: '#2563eb' },
        ].map(c => (
          <div key={c.label} className="card rounded-xl p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl" style={{ background: c.color }} />
            <p className="text-xs mb-1 pl-2" style={{ color: 'var(--text-secondary)' }}>{c.label}</p>
            <p className="font-display font-bold text-3xl pl-2" style={{ color: 'var(--text-primary)' }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
