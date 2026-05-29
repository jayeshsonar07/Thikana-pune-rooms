import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../services/db';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await loginUser(form.email, form.password);
      navigate('/profile');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to log in. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      <header className="bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 h-[62px] flex items-center">
          <button onClick={() => navigate('/home')}>
            <img src={logo} alt="Thikana" style={{ height: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(27,58,140,0.15))' }} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card rounded-2xl overflow-hidden">
            <div className="flex flex-col items-center py-8 px-6"
              style={{ background: 'linear-gradient(135deg, #0F2460 0%, #1B3A8C 100%)' }}>
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <img src={logo} alt="Thikana" style={{ height: 60, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <h1 className="text-xl font-extrabold text-white">Welcome back</h1>
              <p className="text-sm text-blue-200 mt-1">Sign in to your Thikana account</p>
            </div>

            <div className="p-7">
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
                  className="btn-primary w-full py-3 text-base font-bold mt-1"
                  style={{ opacity: loading ? 0.75 : 1 }}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div className="divider mt-5" />
              <p className="text-sm text-center" style={{ color: '#718096' }}>
                Don't have an account?{' '}
                <button onClick={() => navigate('/register')} className="font-bold" style={{ color: '#1B3A8C' }}>
                  Create one free
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
