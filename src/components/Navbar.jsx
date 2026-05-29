import { Search, PlusCircle, User, LogIn, Menu, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { listenAuthState, logoutUser } from '../services/db';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { label: 'Find a Room', path: '/home' },
  ];
  if (user) {
    navLinks.push({ label: 'Profile', path: '/profile' });
  }

  const active = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-40 bg-white"
      style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(27,58,140,0.08)' }}
    >
      <div className="max-w-screen-xl mx-auto px-5">
        <div className="flex items-center h-[62px] gap-5">

          {/* ── LOGO — Large & polished ────────────── */}
          <button
            onClick={() => navigate('/home')}
            className="shrink-0 flex items-center"
            aria-label="Thikana Home"
          >
            <img
              src={logo}
              alt="Thikana"
              style={{
                height: 52,            /* bigger */
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 8px rgba(27,58,140,0.18))',
              }}
            />
          </button>

          {/* ── Center nav ─────────────────────────── */}
          <nav className="hidden md:flex items-center flex-1 justify-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{
                  color:      active(link.path) ? '#1B3A8C' : '#2D3748',
                  background: active(link.path) ? '#EBF2FF' : 'transparent',
                }}
                onMouseEnter={e => { if (!active(link.path)) { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.color = '#1B3A8C'; }}}
                onMouseLeave={e => { if (!active(link.path)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2D3748'; }}}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ── Right actions ───────────────────────── */}
          <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
            {!user ? (
              <>
                <button onClick={() => navigate('/login')} className="btn-ghost text-sm gap-1.5 flex items-center">
                  <LogIn size={15} /> Log in
                </button>
                <button onClick={() => navigate('/register')} className="btn-secondary text-sm gap-1.5 flex items-center">
                  <User size={15} /> Register
                </button>
              </>
            ) : (
              <button onClick={() => { logoutUser(); navigate('/home'); }} className="btn-ghost text-sm gap-1.5 flex items-center" style={{ color: '#E53E3E' }}>
                <LogOut size={15} /> Logout
              </button>
            )}
            <button onClick={() => navigate('/add-listing')} className="btn-primary text-sm gap-1.5 flex items-center">
              <PlusCircle size={15} /> Post Property
            </button>
          </div>

          {/* ── Mobile hamburger ───────────────────── */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button onClick={() => navigate('/add-listing')} className="btn-primary text-xs px-3 py-2">+ Post</button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-lg"
              style={{ background: '#F7F8FC' }}
            >
              {mobileOpen ? <X size={20} color="#1B3A8C" /> : <Menu size={20} color="#1B3A8C" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-5 py-3 flex flex-col gap-1" style={{ borderColor: '#E2E8F0' }}>
          {navLinks.map(link => (
            <button key={link.path}
              onClick={() => { navigate(link.path); setMobileOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold"
              style={{ color: active(link.path) ? '#1B3A8C' : '#2D3748', background: active(link.path) ? '#EBF2FF' : 'transparent' }}>
              {link.label}
            </button>
          ))}
          <div className="border-t mt-1 pt-2 flex gap-2 flex-col" style={{ borderColor: '#E2E8F0' }}>
            {!user ? (
              <div className="flex gap-2">
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="flex-1 btn-ghost text-sm">Log in</button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="flex-1 btn-secondary text-sm">Register</button>
              </div>
            ) : (
              <button onClick={() => { logoutUser(); navigate('/home'); setMobileOpen(false); }} className="w-full btn-ghost text-sm flex justify-center items-center gap-2" style={{ color: '#E53E3E' }}>
                <LogOut size={15} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
