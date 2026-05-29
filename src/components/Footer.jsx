import { Code2, AtSign, Link, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#1A202C', color: '#CBD5E0', borderTop: '1px solid #2D3748' }}>
      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left: logo + credits */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Thikana"
              style={{ height: 28, filter: 'brightness(0) invert(1)', opacity: 0.8 }}
            />
            <div className="w-px h-5" style={{ background: '#2D3748' }} />
            <p className="text-xs" style={{ color: '#718096' }}>
              © {year} · Developed by{' '}
              <span className="font-semibold" style={{ color: '#90CDF4' }}>Jayesh Sonar</span>
            </p>
          </div>

          {/* Center: nav links */}
          <div className="flex items-center gap-5 text-xs font-medium" style={{ color: '#A0AEC0' }}>
            <button onClick={() => navigate('/home')}
              className="hover:text-white transition-colors">Home</button>
            <button onClick={() => navigate('/login')}
              className="hover:text-white transition-colors">Login</button>
            <button onClick={() => navigate('/register')}
              className="hover:text-white transition-colors">Register</button>
            <button onClick={() => navigate('/add-listing')}
              className="hover:text-white transition-colors">Post Property</button>
          </div>

          {/* Right: social icons + admin link */}
          <div className="flex items-center gap-2">
            {/* GitHub (Code2) */}
            <a href="https://github.com/jayeshsonar" target="_blank" rel="noreferrer"
              title="GitHub"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: '#718096' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Code2 size={15} />
            </a>

            {/* Instagram (AtSign) */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              title="Instagram"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: '#718096' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <AtSign size={15} />
            </a>

            {/* Portfolio */}
            <a href="https://jayeshsonar.dev" target="_blank" rel="noreferrer"
              title="Portfolio"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: '#718096' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Link size={15} />
            </a>

            <div className="w-px h-5 mx-1" style={{ background: '#2D3748' }} />

            {/* Admin panel */}
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{ color: '#718096', border: '1px solid #2D3748' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#CBD5E0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#718096'; }}
            >
              <Shield size={12} />
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
