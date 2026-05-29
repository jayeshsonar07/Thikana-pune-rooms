import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'tenant' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      <header className="bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/home')}>
            <img src={logo} alt="Thikana" style={{ height: 40, objectFit: 'contain' }} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#EBF2FF' }}>
                <User size={28} color="#1B3A8C" />
              </div>
              <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Create Account</h1>
              <p className="text-sm mt-1" style={{ color: '#718096' }}>Join Thikana — find or list rooms</p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl" style={{ background: '#F7F8FC', border: '1px solid #E2E8F0' }}>
              {['tenant', 'owner'].map(role => (
                <button key={role} type="button"
                  onClick={() => upd('role', role)}
                  className="py-2.5 rounded-lg text-sm font-bold capitalize transition-all"
                  style={{
                    background: form.role === role ? '#1B3A8C' : 'transparent',
                    color: form.role === role ? 'white' : '#718096',
                  }}>
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
                <div className="flex gap-0 border border-[#E2E8F0] rounded-lg overflow-hidden focus-within:border-brand focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="flex items-center px-3 text-sm font-medium" style={{ background: '#F7F8FC', color: '#4A5568', borderRight: '1px solid #E2E8F0' }}>+91</span>
                  <input type="tel" placeholder="9876543210" maxLength={10}
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                    value={form.phone} onChange={e => upd('phone', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input className="form-input pr-10" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
                    value={form.password} onChange={e => upd('password', e.target.value)} required minLength={8} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A0AEC0' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="divider mt-6" />
            <p className="text-sm text-center" style={{ color: '#718096' }}>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: '#1B3A8C' }}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
