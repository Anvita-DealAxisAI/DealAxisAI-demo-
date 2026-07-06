import './StatCard.css';

export default function StatCard({ label, value, accent, valueVariant = 'default' }) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__inset">
        <p className={`stat-card__label stat-card__label--${accent}`}>{label}</p>
      </div>
      <div className="stat-card__body">
        <p className={`stat-card__value stat-card__value--${valueVariant}`}>{value}</p>
      </div>
    </article>
  );
}
