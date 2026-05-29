import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import logo from '../assets/logo.png';

const ADMIN_PASSWORD = 'YUVAX2026';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin password. Access denied.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 50%, #1B3A8C 100%)' }}>

      {/* Decorative rings */}
      <div className="absolute w-96 h-96 rounded-full opacity-5 border-2 border-white" style={{ top: '10%', left: '10%' }} />
      <div className="absolute w-64 h-64 rounded-full opacity-5 border border-white" style={{ bottom: '15%', right: '15%' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Thikana" style={{ height: 48, margin: '0 auto 16px', filter: 'brightness(0) invert(1)' }} />
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(27,58,140,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Shield size={28} color="white" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Admin Panel</h1>
            <p className="text-sm mt-1" style={{ color: '#90CDF4' }}>Developer access only</p>
          </div>

          <div className="mb-4 p-3 rounded-lg flex items-start gap-2"
            style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <AlertTriangle size={14} color="#F59E0B" className="shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: '#FCD34D' }}>
              This panel is restricted to authorized developers only.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(220,38,38,0.15)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#CBD5E0' }}>
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                  }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
              style={{ background: loading ? '#2557C2' : '#1B3A8C', opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Verifying...' : 'Enter Admin Panel'}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Unauthorized access is prohibited
          </p>
        </div>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/home')} className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            ← Back to Thikana
          </button>
        </div>
      </div>
    </div>
  );
}
