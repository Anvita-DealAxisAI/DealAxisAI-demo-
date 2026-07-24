import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoLightUrl from '/AccountSignalAI-full-color-4.1.png';
import { MenuIcon, CloseIcon } from './icons/AppIcons';
import './Sidebar.css';

export default function Sidebar({ items = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="sidebar__toggle"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
      </button>

      <aside className={`legacy-app-sidebar ${open ? 'legacy-app-sidebar--open' : ''}`}>
        <NavLink to="/accounts" className="sidebar__logo-wrap" aria-label="Home">
          <img
            src={logoLightUrl}
            alt="AccountSignal AI"
            className="sidebar__logo"
          />
        </NavLink>

        <nav className="sidebar__nav" aria-label="Main">
          {items.map((item) => (
            item.path && item.path !== '#' ? (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/accounts'}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.id}
                className="sidebar__link sidebar__link--disabled"
              >
                {item.label}
              </span>
            )
          ))}
        </nav>
        <div className="sidebar__version">MVP v1.0</div>
      </aside>

      {open && (
        <div
          role="presentation"
          className="sidebar__backdrop"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
