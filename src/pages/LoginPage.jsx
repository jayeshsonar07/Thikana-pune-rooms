import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1000));
    if (form.email && form.password) {
      navigate('/dashboard');
    } else {
      setError('Please fill in all fields.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      {/* Header */}
      <header className="bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/home')}>
            <img src={logo} alt="Thikana" style={{ height: 40, objectFit: 'contain' }} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#EBF2FF' }}>
                <MapPin size={28} color="#1B3A8C" />
              </div>
              <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Welcome back</h1>
              <p className="text-sm mt-1" style={{ color: '#718096' }}>Sign in to manage your listings</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm font-medium"
                style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Email address</label>
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0">Password</label>
                  <button type="button" className="text-xs font-semibold" style={{ color: '#1B3A8C' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input className="form-input pr-10" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A0AEC0' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider mt-6" />
            <p className="text-sm text-center" style={{ color: '#718096' }}>
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="font-semibold" style={{ color: '#1B3A8C' }}>
                Create one
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
