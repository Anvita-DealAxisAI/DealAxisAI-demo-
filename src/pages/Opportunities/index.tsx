import { useState } from 'react';
import { opportunities } from '../../mockData';

const priorityColors: Record<string, string> = {
  High: '#ef4444', Medium: '#f59e0b', Low: '#10b981', Emerging: '#8b5cf6',
};
const statusColors: Record<string, string> = {
  Confirmed: '#2563eb', Validated: '#10b981', Watch: '#f59e0b', Emerging: '#8b5cf6',
};
const driverColors = ['#ef4444', '#2563eb', '#f59e0b', '#10b981'];

export default function Opportunities() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          Opportunity Landscape - Citizens Bank
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Ranked revenue plays derived from outside-in business, technology and stakeholder signals.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total opportunity range', value: '$8M-$15M', color: '#10b981' },
          { label: 'Top play', value: 'Reg Reporting', color: '#2563eb' },
          { label: 'Best entry', value: 'Data Valid.', color: '#f59e0b' },
          { label: 'Confidence', value: '4.5/5', color: '#8b5cf6' },
        ].map(c => (
          <div key={c.label} className="card rounded-xl p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: c.color }} />
            <p className="text-xs mb-1 pl-1" style={{ color: 'var(--text-secondary)' }}>{c.label}</p>
            <p className="font-display font-bold text-2xl pl-1" style={{ color: 'var(--text-primary)' }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Opportunity Cards — expandable */}
      <div className="grid grid-cols-2 gap-4">
        {opportunities.map(opp => {
          const isOpen = expandedId === opp.id;
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
            <div
              key={opp.id}
              className={`card rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'col-span-2' : ''}`}
            >
              {/* Card Header — always visible */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg"
                      style={{ background: priorityColors[opp.priority] }}>
                      {opp.priority}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg border"
                      style={{ borderColor: statusColors[opp.status], color: statusColors[opp.status] }}>
                      {opp.status}
                    </span>
                  </div>
                  <button
                    onClick={() => toggle(opp.id)}
                    className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg transition"
                    style={{
                      color: isOpen ? 'white' : '#2563eb',
                      background: isOpen ? '#2563eb' : 'rgba(37,99,235,0.08)',
                    }}
                  >
                    {isOpen ? '▲ Collapse' : '▼ View details'}
                  </button>
                </div>

                <h3 className="font-display font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                  {opp.title}
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Deal Size</p>
                    <p className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{opp.dealSize}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Timeline</p>
                    <p className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{opp.timeline}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Buyer</p>
                    <p className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{opp.buyer}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Detail Section */}
              {isOpen && (
                <div className="border-t px-5 pb-5 pt-4 space-y-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white px-3 py-1 rounded-lg" style={{ background: '#ef4444' }}>High Urgency</span>
                    <span className="text-xs font-bold text-white px-3 py-1 rounded-lg" style={{ background: '#10b981' }}>{opp.status}</span>
                    <span className="text-xs font-bold text-white px-3 py-1 rounded-lg" style={{ background: '#8b5cf6' }}>Confidence {opp.confidence}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left — Drivers */}
                    <div className="space-y-3">
                      {drivers.map((d, i) => (
                        <div key={d.label} className="card rounded-xl p-4 flex gap-3">
                          <div className="w-1 rounded-full flex-shrink-0" style={{ background: driverColors[i] }} />
                          <div>
                            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{d.label}</p>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.text}</p>
                          </div>
                        </div>
                      ))}

                      {/* Bottom summary */}
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {[
                          { label: 'Deal Size', value: opp.dealSize, color: '#10b981' },
                          { label: 'Timeline', value: opp.timeline, color: '#f59e0b' },
                          { label: 'Entry Ease', value: opp.entryEase, color: '#2563eb' },
                        ].map(s => (
                          <div key={s.label} className="card rounded-xl p-3 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: s.color }} />
                            <p className="text-xs pl-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                            <p className="font-bold text-base pl-1 mt-0.5" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right — GTM Panel */}
                    <div className="rounded-2xl p-5" style={{ background: '#0f172a' }}>
                      <h4 className="font-display font-bold text-base mb-4 text-white">GTM Strategy Panel</h4>
                      <div className="space-y-3">
                        {gtm.map(row => (
                          <div key={row.label}>
                            <p className="text-xs mb-0.5" style={{ color: '#60a5fa' }}>{row.label}</p>
                            <p className="text-sm text-white">{row.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
