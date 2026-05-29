import { Search, MapPin, PlusCircle, User, Building2, LogIn, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Find a Room', path: '/home' },
    { label: 'Dashboard',   path: '/dashboard' },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-white"
      style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center h-16 gap-6">

          {/* ── LOGO ── big & polished ─────────── */}
          <button
            onClick={() => navigate('/home')}
            className="shrink-0 flex items-center"
            aria-label="Thikana Home"
          >
            <img
              src={logo}
              alt="Thikana"
              style={{
                height: 46,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 6px rgba(27,58,140,0.15))',
              }}
            />
          </button>

          {/* ── Center nav ─────────────────────── */}
          <nav className="hidden md:flex items-center flex-1 justify-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                  style={{
                    color:      active ? '#1B3A8C' : '#2D3748',
                    background: active ? '#EBF2FF' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.color = '#1B3A8C'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2D3748'; }}}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ── Right actions ───────────────────── */}
          <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
            <button onClick={() => navigate('/login')} className="btn-ghost text-sm gap-1.5 flex">
              <LogIn size={15} />
              Log in
            </button>
            <button onClick={() => navigate('/register')} className="btn-secondary text-sm gap-1.5 flex">
              <User size={15} />
              Register
            </button>
            <button
              onClick={() => navigate('/add-listing')}
              className="btn-primary text-sm gap-1.5 flex"
            >
              <PlusCircle size={15} />
              Post Property
            </button>
          </div>

          {/* ── Mobile ─────────────────────────── */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2">
              <Building2 size={20} color="#1B3A8C" />
            </button>
            <button onClick={() => navigate('/add-listing')} className="btn-primary text-xs px-3 py-2">
              + Post
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
