import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Globe, Settings,
  LogOut, Eye, CheckCircle, XCircle, Edit3, Trash2,
  Bell, Save, Plus, TrendingUp, ArrowUpRight, Home,
  MapPin, ChevronRight
} from 'lucide-react';
import { getListings, getSiteContent, updateSiteContent } from '../services/db';
import logo from '../assets/logo.png';

const ADMIN_PASSWORD = 'YUVAX2026';

/* ─── Auth guard ──────────────────────────── */
function useAdminAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') navigate('/admin/login');
  }, [navigate]);
}

/* ─── Sidebar nav items ───────────────────── */
const NAV = [
  { icon: LayoutDashboard, label: 'Overview',     path: '/admin/dashboard' },
  { icon: Building2,       label: 'Listings',     path: '/admin/listings' },
  { icon: Users,           label: 'Users',        path: '/admin/users' },
  { icon: Globe,           label: 'Site Content', path: '/admin/content' },
  { icon: Settings,        label: 'Settings',     path: '/admin/settings' },
];

/* ─── Sidebar ─────────────────────────────── */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout   = () => { sessionStorage.removeItem('adminAuth'); navigate('/admin/login'); };

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{ width: 230, background: '#1A202C', minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <img src={logo} alt="Thikana" style={{ height: 38, filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
        <p className="text-xs mt-1.5" style={{ color: '#718096' }}>Admin Panel</p>
      </div>

      {/* ── Back to site button ── */}
      <div className="px-3 pt-3">
        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: '#90CDF4', border: '1px solid rgba(144,205,244,0.2)', background: 'rgba(144,205,244,0.05)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(144,205,244,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(144,205,244,0.05)'; }}
        >
          <Home size={15} />
          ← Back to Website
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin');
          return (
            <button key={path} onClick={() => navigate(path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
              style={{
                color:      active ? '#white' : '#A0AEC0',
                background: active ? '#1B3A8C' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0AEC0'; }}}
            >
              <Icon size={17} color={active ? 'white' : undefined} />
              <span style={{ color: active ? 'white' : undefined }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: '#FC8181' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(252,129,129,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}

/* ─── Top bar ─────────────────────────────── */
function TopBar({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between shrink-0"
      style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>Thikana Admin</p>
        <p className="text-base font-extrabold" style={{ color: '#1A202C' }}>{title}</p>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={18} color="#718096" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/admin/settings')}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: '#1B3A8C' }}>A</div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold" style={{ color: '#1A202C' }}>Developer</p>
            <p className="text-xs" style={{ color: '#A0AEC0' }}>Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Overview ────────────────────────────── */
function Overview() {
  useAdminAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  const total  = listings.length;
  const active = listings.filter(l => l.available).length;
  const full   = listings.filter(l => !l.available).length;
  const views  = listings.reduce((s, l) => s + l.views, 0);

  const stats = [
    { label: 'Total Listings',    value: total,  icon: Building2,   color: '#1B3A8C', bg: '#EBF2FF', delta: '+2 this week' },
    { label: 'Active / Available',value: active, icon: CheckCircle, color: '#0F9D58', bg: '#F0FDF4', delta: total ? `${Math.round(active/total*100)}% active` : '0% active' },
    { label: 'Full / Occupied',   value: full,   icon: XCircle,     color: '#DC2626', bg: '#FEF2F2', delta: total ? `${Math.round(full/total*100)}% full` : '0% full' },
    { label: 'Total Views',       value: views,  icon: Eye,         color: '#D97706', bg: '#FFFBEB', delta: '+48 today' },
  ];

  const recent = [...listings].sort((a,b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, delta }) => (
          <div key={label} className="card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={21} style={{ color }} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#0F9D58' }}>
                <TrendingUp size={11} />{delta.includes('+') ? delta : ''}
              </span>
            </div>
            <p className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>{value.toLocaleString('en-IN')}</p>
            <p className="text-xs mt-0.5 font-medium" style={{ color: '#718096' }}>{label}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#A0AEC0' }}>{delta}</p>
          </div>
        ))}
      </div>

      {/* Recent listings table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0' }}>
          <h2 className="text-base font-bold" style={{ color: '#1A202C' }}>Recent Listings</h2>
          <button onClick={() => navigate('/admin/listings')}
            className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#1B3A8C' }}>
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0' }}>
                {['Property', 'Type', 'Area', 'Rent', 'Status', 'Views'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < recent.length - 1 ? '1px solid #F7F8FC' : 'none' }}>
                  <td className="px-5 py-3">
                    <button onClick={() => navigate(`/listing/${l.id}`)}
                      className="font-semibold hover:underline" style={{ color: '#1B3A8C' }}>
                      {l.title}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#4A5568' }}>{l.type}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#4A5568' }}>{l.area}</td>
                  <td className="px-5 py-3 font-semibold" style={{ color: '#1A202C' }}>₹{l.rent.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${l.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {l.available ? '● Available' : '● Full'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-medium" style={{ color: '#718096' }}>{l.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Listings management ─────────────────── */
function ListingsAdmin() {
  useAdminAuth();
  const navigate = useNavigate();
  const [items, setItems]   = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getListings().then(setItems);
  }, []);

  const filtered = items.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.title.toLowerCase().includes(q) || l.area.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'active' && l.available) || (filter === 'full' && !l.available);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="form-input flex-1" style={{ maxWidth: 280 }}
          placeholder="Search by title or area…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {['all', 'active', 'full'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border capitalize transition-all"
              style={{
                background: filter === f ? '#1B3A8C' : 'white',
                color: filter === f ? 'white' : '#4A5568',
                borderColor: filter === f ? '#1B3A8C' : '#E2E8F0',
              }}>
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button onClick={() => navigate('/add-listing')} className="btn-primary gap-1.5 flex items-center text-sm">
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0' }}>
                {['#', 'Title', 'Owner', 'Area', 'Rent', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F7F8FC' : 'none' }}>
                  <td className="px-4 py-3 text-xs" style={{ color: '#A0AEC0' }}>{l.id}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => navigate(`/listing/${l.id}`)}
                      className="font-semibold hover:underline" style={{ color: '#1B3A8C' }}>
                      {l.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#4A5568' }}>{l.ownerName}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#4A5568' }}>{l.area}</td>
                  <td className="px-4 py-3 font-semibold">₹{l.rent.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${l.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {l.available ? '● Active' : '● Full'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => navigate(`/listing/${l.id}`)}
                        className="p-1.5 rounded-lg border text-xs transition-all"
                        style={{ color: '#1B3A8C', borderColor: '#C5D9FF' }}
                        title="View"
                        onMouseEnter={e => e.currentTarget.style.background = '#EBF2FF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Eye size={13} />
                      </button>
                      <button onClick={() => navigate(`/edit-listing/${l.id}`)}
                        className="p-1.5 rounded-lg border text-xs transition-all"
                        style={{ color: '#D97706', borderColor: '#FDE68A' }}
                        title="Edit"
                        onMouseEnter={e => e.currentTarget.style.background = '#FFFBEB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => { if (window.confirm('Delete this listing?')) setItems(prev => prev.filter(x => x.id !== l.id)); }}
                        className="p-1.5 rounded-lg border text-xs transition-all"
                        style={{ color: '#DC2626', borderColor: '#FECACA' }}
                        title="Delete"
                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: '#A0AEC0' }}>No listings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Users ───────────────────────────────── */
function UsersAdmin() {
  useAdminAuth();
  const [users, setUsers] = useState([
    { id: 1, name: 'Rekha Patil',   email: 'rekha@email.com',  role: 'Owner',  listings: 3, status: 'Active', joined: '2026-04-10' },
    { id: 2, name: 'Suresh Desai',  email: 'suresh@email.com', role: 'Owner',  listings: 1, status: 'Active', joined: '2026-04-20' },
    { id: 3, name: 'Amit Kulkarni', email: 'amit@email.com',   role: 'Tenant', listings: 0, status: 'Active', joined: '2026-05-01' },
    { id: 4, name: 'Priya Sharma',  email: 'priya@email.com',  role: 'Owner',  listings: 2, status: 'Suspended', joined: '2026-05-15' },
  ]);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));

  return (
    <div className="space-y-4">
      <input className="form-input" style={{ maxWidth: 280 }}
        placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
      <div className="card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0' }}>
              {['User', 'Email', 'Role', 'Listings', 'Status', 'Joined', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F7F8FC' : 'none' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: '#1B3A8C' }}>{u.name[0]}</div>
                    <span className="font-semibold" style={{ color: '#1A202C' }}>{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#4A5568' }}>{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.role === 'Owner' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1A202C' }}>{u.listings}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#718096' }}>
                  {new Date(u.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(u.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                    style={{
                      color: u.status === 'Active' ? '#DC2626' : '#0F9D58',
                      borderColor: u.status === 'Active' ? '#FECACA' : '#BBF7D0',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = u.status === 'Active' ? '#FEF2F2' : '#F0FDF4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {u.status === 'Active' ? 'Suspend' : 'Restore'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Content editor ──────────────────────── */
function ContentEditor() {
  useAdminAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({
    heroTitle:    'Find your perfect stay in Pune',
    heroSubtitle: 'PGs · Hostels · Flats · Studios — connect directly with owners, no broker',
    stat1Value: '500+', stat1Label: 'Properties in Pune',
    stat2Value: '2,000+', stat2Label: 'Happy Tenants',
    stat3Value: '20+', stat3Label: 'Areas Covered',
    stat4Value: '100+', stat4Label: 'Daily Inquiries',
    footerCredit: 'Developed by Jayesh Sonar',
  });

  useEffect(() => {
    getSiteContent().then(data => {
      if (data) setContent(data);
    });
  }, []);

  const upd = (k, v) => setContent(c => ({ ...c, [k]: v }));
  
  const handleSave = async () => { 
    setLoading(true);
    await updateSiteContent(content);
    setLoading(false);
    setSaved(true); 
    setTimeout(() => setSaved(false), 2500); 
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {saved && (
        <div className="p-3 rounded-xl text-sm font-semibold"
          style={{ background: '#F0FDF4', color: '#0F9D58', border: '1px solid #BBF7D0' }}>
          ✓ Changes saved successfully!
        </div>
      )}
      {[
        { section: 'Hero Section', fields: [
          { key: 'heroTitle',    label: 'Main Headline', type: 'text' },
          { key: 'heroSubtitle', label: 'Subtitle',      type: 'textarea' },
        ]},
        { section: 'Stats', fields: [
          { key: 'stat1Value', label: 'Stat 1 Value', type: 'text' },
          { key: 'stat1Label', label: 'Stat 1 Label', type: 'text' },
          { key: 'stat2Value', label: 'Stat 2 Value', type: 'text' },
          { key: 'stat2Label', label: 'Stat 2 Label', type: 'text' },
          { key: 'stat3Value', label: 'Stat 3 Value', type: 'text' },
          { key: 'stat3Label', label: 'Stat 3 Label', type: 'text' },
          { key: 'stat4Value', label: 'Stat 4 Value', type: 'text' },
          { key: 'stat4Label', label: 'Stat 4 Label', type: 'text' },
        ]},
        { section: 'Footer', fields: [
          { key: 'footerCredit', label: 'Developer Credit', type: 'text' },
        ]},
      ].map(({ section, fields }) => (
        <div key={section} className="card rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, type }) => (
              <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="form-label">{label}</label>
                {type === 'textarea' ? (
                  <textarea className="form-input resize-none" rows={2} value={content[key]} onChange={e => upd(key, e.target.value)} />
                ) : (
                  <input className="form-input" type="text" value={content[key]} onChange={e => upd(key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSave} disabled={loading} className="btn-primary gap-2 flex items-center" style={{ opacity: loading ? 0.7 : 1 }}>
        <Save size={15} /> {loading ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}

/* ─── Settings ────────────────────────────── */
function SettingsAdmin() {
  useAdminAuth();
  const [settings, setSettings] = useState({
    siteName: 'Thikana', maxPhotos: 6, allowReg: true, maintenance: false,
    newPassword: '', confirmPassword: '',
  });
  const [msg, setMsg] = useState('');
  const upd = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = () => {
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      setMsg('❌ Passwords do not match'); return;
    }
    setMsg('✓ Settings saved!');
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div className="space-y-5 max-w-lg">
      {msg && (
        <div className="p-3 rounded-xl text-sm font-semibold"
          style={{ background: msg.startsWith('✓') ? '#F0FDF4' : '#FEF2F2', color: msg.startsWith('✓') ? '#0F9D58' : '#DC2626', border: `1px solid ${msg.startsWith('✓') ? '#BBF7D0' : '#FECACA'}` }}>
          {msg}
        </div>
      )}

      <div className="card rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>General</h2>
        <div>
          <label className="form-label">Site Name</label>
          <input className="form-input" type="text" value={settings.siteName} onChange={e => upd('siteName', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Max Photos per Listing</label>
          <input className="form-input" type="number" value={settings.maxPhotos} onChange={e => upd('maxPhotos', +e.target.value)} min={1} max={10} />
        </div>
        {[
          { key: 'allowReg',    label: 'Allow New Registrations', desc: 'Let new users sign up' },
          { key: 'maintenance', label: 'Maintenance Mode',        desc: 'Show maintenance page to visitors' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: '#F7F8FC', border: '1px solid #E2E8F0' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2D3748' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#A0AEC0' }}>{desc}</p>
            </div>
            <button type="button" onClick={() => upd(key, !settings[key])}
              className={`toggle-track ${settings[key] ? 'on' : 'off'}`}>
              <div className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>

      <div className="card rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#A0AEC0' }}>Change Admin Password</h2>
        {[
          { key: 'newPassword',     label: 'New Password',      placeholder: 'New password' },
          { key: 'confirmPassword', label: 'Confirm Password',  placeholder: 'Confirm new password' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="form-label">{label}</label>
            <input className="form-input" type="password" placeholder={placeholder}
              value={settings[key]} onChange={e => upd(key, e.target.value)} />
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary gap-2 flex items-center">
        <Save size={15} /> Save Settings
      </button>
    </div>
  );
}

/* ─── Admin shell ─────────────────────────── */
export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') navigate('/admin/login');
  }, [navigate]);

  const currentTitle = NAV.find(n => location.pathname.startsWith(n.path))?.label || 'Overview';

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F8FC' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={currentTitle} subtitle="Thikana Admin Dashboard" />
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="listings"  element={<ListingsAdmin />} />
            <Route path="users"     element={<UsersAdmin />} />
            <Route path="content"   element={<ContentEditor />} />
            <Route path="settings"  element={<SettingsAdmin />} />
            <Route path="*"         element={<Overview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
