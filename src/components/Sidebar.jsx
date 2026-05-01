import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/sectors', label: 'Sector Analysis' },
  { to: '/portfolio', label: 'Portfolio' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  const navClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-blue-500/15 text-blue-400'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    }`;

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 md:hidden"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-14 items-center border-b border-zinc-800 px-4 md:h-16">
          <span className="text-lg font-semibold tracking-tight text-white">
            Smart<span className="text-blue-500">Stocks</span>
          </span>
          <button
            type="button"
            className="ml-auto rounded-md p-2 text-zinc-400 md:hidden"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass} end={l.to === '/dashboard'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-zinc-800 p-3">
          <p className="truncate px-3 text-xs text-zinc-500">Signed in as</p>
          <p className="truncate px-3 text-sm font-medium text-zinc-200">{username || 'Guest'}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-blue-500/50 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
