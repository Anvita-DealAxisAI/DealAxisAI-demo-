import { SearchIcon } from './icons/AppIcons';
import './TopNav.css';

export default function TopNav({ pageTitle = 'Opportunity Landscape', userName = 'User name' }) {
  return (
    <header className="top-nav">
      <span className="top-nav__page-title">{pageTitle}</span>

      <div className="top-nav__search-wrap">
        <SearchIcon size={16} className="top-nav__search-icon" />
        <input
          type="search"
          className="top-nav__search"
          placeholder="Search accounts, opportunities, stakeholders..."
          aria-label="Search"
        />
      </div>

      <div className="top-nav__actions">
        <button type="button" className="top-nav__btn-outline">
          Alerts
        </button>
        <button type="button" className="top-nav__btn-outline">
          Export
        </button>
        <button type="button" className="top-nav__avatar">
          {userName}
        </button>
      </div>
    </header>
  );
}
