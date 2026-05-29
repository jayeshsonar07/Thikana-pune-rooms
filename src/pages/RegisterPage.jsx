import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../services/db';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'tenant' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await registerUser(form.email, form.password, form.name);
      navigate('/profile');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
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

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="card rounded-2xl overflow-hidden">
            <div className="flex flex-col items-center py-7 px-6"
              style={{ background: 'linear-gradient(135deg, #0F2460 0%, #1B3A8C 100%)' }}>
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <img src={logo} alt="Thikana" style={{ height: 60, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <h1 className="text-xl font-extrabold text-white">Create Account</h1>
              <p className="text-sm text-blue-200 mt-1">Join Thikana — find or list rooms</p>
            </div>

            <div className="p-7">
              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm font-medium"
                  style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl" style={{ background: '#F7F8FC', border: '1px solid #E2E8F0' }}>
                {['tenant', 'owner'].map(role => (
                  <button key={role} type="button" onClick={() => upd('role', role)}
                    className="py-2.5 rounded-lg text-sm font-bold capitalize transition-all"
                    style={{ background: form.role === role ? '#1B3A8C' : 'transparent', color: form.role === role ? 'white' : '#718096' }}>
                    {role === 'tenant' ? '🏠 Looking for Room' : '🏢 I Have a Room'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="Jayesh Sonar"
                    value={form.name} onChange={e => upd('name', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Email address</label>
                  <input className="form-input" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => upd('email', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">WhatsApp Number</label>
                  <div className="flex overflow-hidden rounded-lg" style={{ border: '1.5px solid #E2E8F0' }}>
                    <span className="flex items-center px-3 text-sm font-semibold" style={{ background: '#F7F8FC', color: '#4A5568', borderRight: '1px solid #E2E8F0' }}>+91</span>
                    <input type="tel" placeholder="9876543210" maxLength={10}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                      value={form.phone} onChange={e => upd('phone', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <input className="form-input pr-10" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                      value={form.password} onChange={e => upd('password', e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A0AEC0' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-bold mt-1"
                  style={{ opacity: loading ? 0.75 : 1 }}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <div className="divider mt-5" />
              <p className="text-sm text-center" style={{ color: '#718096' }}>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-bold" style={{ color: '#1B3A8C' }}>Sign in</button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
