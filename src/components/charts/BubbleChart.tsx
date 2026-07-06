import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { BubblePoint } from '../../types';

interface Props { data: BubblePoint[] }

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const r = Math.sqrt(payload.z) * 0.9;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={payload.color} fillOpacity={0.85} />
      <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize={11} fill="var(--text-secondary)">{payload.name}</text>
    </g>
  );
};

export default function BubbleChart({ data }: Props) {
  return (
    <div className="card rounded-xl p-5">
      <h3 className="font-display font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
        Opportunity Value vs Ease of Entry
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Opportunity Value</p>

      <div className="relative">
        {/* Quadrant labels */}
        <div className="absolute top-2 left-8 text-xs font-medium px-2 py-0.5 rounded border" style={{ color: '#f59e0b', borderColor: '#f59e0b', background: 'transparent' }}>Big Bets</div>
        <div className="absolute top-2 right-16 text-xs font-medium px-2 py-0.5 rounded border" style={{ color: '#ef4444', borderColor: '#ef4444', background: 'transparent' }}>Strategic Pursuits</div>
        <div className="absolute bottom-12 left-8 text-xs font-medium px-2 py-0.5 rounded border" style={{ color: '#10b981', borderColor: '#10b981', background: 'transparent' }}>Quick Wins</div>
        <div className="absolute bottom-12 right-16 text-xs font-medium px-2 py-0.5 rounded border" style={{ color: '#6366f1', borderColor: '#6366f1', background: 'transparent' }}>Watchlist</div>

        <ResponsiveContainer width="100%" height={260}>
          <ScatterChart margin={{ top: 20, right: 60, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis type="number" dataKey="x" name="Ease of Entry" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
            <YAxis type="number" dataKey="y" name="Opportunity Value" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
              if (active && payload?.[0]) {
                const d = payload[0].payload as BubblePoint;
                return (
                  <div className="card rounded-lg p-2 text-xs">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Value: {d.y} | Entry: {d.x}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Scatter data={data} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-center text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Ease of Entry</p>
      </div>
    </div>
  );
}
