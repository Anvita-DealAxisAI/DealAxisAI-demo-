interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  color: string;
}

export default function KpiCard({ label, value, subtitle, color }: KpiCardProps) {
  return (
    <div className="card rounded-xl p-5 flex-1 min-w-0 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: color }} />
      <p className="text-xs font-medium mb-1 pl-1" style={{ color: color }}>{label}</p>
      <p className="font-display font-bold text-3xl pl-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs mt-1 pl-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </div>
  );
}
