import './PortfolioKpiCard.css';
import accountsIcon from '../../logo/icons/accounts.svg';
import hotAccountsIcon from '../../logo/icons/hot-accounts.svg';
import highValueIcon from '../../logo/icons/crown.svg';
import opportunityValueIcon from '../../logo/icons/opportunity-value.svg';

type PortfolioKpiVariant = 'accounts' | 'hot' | 'high-value' | 'opportunity-value';

export type PortfolioKpi = {
  label: string;
  value?: string;
  sub: string;
  variant: PortfolioKpiVariant;
  icon?: string;
};

const CARD_ICONS: Record<PortfolioKpiVariant, string> = {
  accounts: accountsIcon,
  hot: hotAccountsIcon,
  'high-value': highValueIcon,
  'opportunity-value': opportunityValueIcon,
};

export default function PortfolioKpiCard({
  kpi,
  style,
  onClick,
}: {
  kpi: PortfolioKpi;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const interactive = Boolean(onClick);

  return (
    <div
      className={`portfolio-kpi-card portfolio-kpi-card--${kpi.variant} animate-slide${interactive ? ' portfolio-kpi-card--clickable' : ''}`}
      style={style}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `View ${kpi.label}` : undefined}
    >
      <div className="portfolio-kpi-card__inset">
        <p className={`portfolio-kpi-card__label portfolio-kpi-card__label--${kpi.variant}`}>
          <span className="portfolio-kpi-card__label-icon">
            <img src={kpi.icon ?? CARD_ICONS[kpi.variant]} alt="" aria-hidden />
          </span>
          <span className="portfolio-kpi-card__label-text">{kpi.label}</span>
        </p>
      </div>
      <div className={`portfolio-kpi-card__body${kpi.value ? '' : ' portfolio-kpi-card__body--overview'}`}>
        {kpi.value ? <p className="portfolio-kpi-card__value">{kpi.value}</p> : null}
        <p className={`portfolio-kpi-card__sub${kpi.value ? '' : ' portfolio-kpi-card__sub--overview'}`}>{kpi.sub}</p>
      </div>
    </div>
  );
}
