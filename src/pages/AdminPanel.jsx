import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Settings, LogOut,
  Eye, TrendingUp, Home, CheckCircle, XCircle, Edit3,
  BarChart3, Bell, Globe, PenLine, Save, Plus, Trash2
} from 'lucide-react';
import { listings } from '../data/mockListings';
import logo from '../assets/logo.png';

/* ── Auth guard ─────────────────────────────── */
function useAdminAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') navigate('/admin/login');
  }, [navigate]);
}

/* ── Sidebar ────────────────────────────────── */
const NAV = [
  { icon: LayoutDashboard, label: 'Overview',    path: '/admin/dashboard' },
  { icon: Building2,       label: 'Listings',    path: '/admin/listings' },
  { icon: Users,           label: 'Users',       path: '/admin/users' },
  { icon: Globe,           label: 'Site Content',path: '/admin/content' },
  { icon: Settings,        label: 'Settings',    path: '/admin/settings' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => { sessionStorage.removeItem('adminAuth'); navigate('/admin/login'); };

  return (
    <aside className="admin-sidebar flex flex-col" style={{ minWidth: 220, maxWidth: 220 }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <img src={logo} alt="Thikana" style={{ height: 36, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        <p className="text-xs mt-1.5" style={{ color: '#718096' }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)}
              className={`admin-nav-item w-full ${active ? 'active' : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button onClick={logout}
          className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

/* ── Overview Page ──────────────────────────── */
function Overview() {
  useAdminAuth();
  const total = listings.length;
  const active = listings.filter(l => l.available).length;
  const full   = listings.filter(l => !l.available).length;
  const views  = listings.reduce((s, l) => s + l.views, 0);

  const statCards = [
    { label: 'Total Listings',    value: total,  icon: Building2,  color: '#1B3A8C', bg: '#EBF2FF' },
    { label: 'Active / Available',value: active, icon: CheckCircle, color: '#0F9D58', bg: '#F0FDF4' },
    { label: 'Full / Unavailable',value: full,   icon: XCircle,    color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Total Views',       value: views,  icon: Eye,        color: '#D97706', bg: '#FFFBEB' },
  ];

  const recentListings = [...listings].sort((a,b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Dashboard Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#718096' }}>Platform analytics & quick actions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <TrendingUp size={14} color="#A0AEC0" />
            </div>
            <p className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>{value.toLocaleString('en-IN')}</p>
            <p className="text-xs mt-1" style={{ color: '#718096' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Recent listings table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-base font-bold" style={{ color: '#1A202C' }}>Recent Listings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0' }}>
                {['Property', 'Type', 'Area', 'Rent', 'Status', 'Views'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#718096' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentListings.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < recentListings.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1B3A8C' }}>{l.title}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#4A5568' }}>{l.type}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#4A5568' }}>{l.area}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1A202C' }}>₹{l.rent.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${l.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {l.available ? 'Available' : 'Full'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: '#718096' }}>{l.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Listings Management ────────────────────── */
function ListingsAdmin() {
  useAdminAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState(listings);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Manage Listings</h1>
          <p className="text-sm mt-0.5" style={{ color: '#718096' }}>{items.length} total properties</p>
        </div>
        <button onClick={() => navigate('/add-listing')} className="btn-primary gap-2 flex">
          <Plus size={15} /> Add New
        </button>
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0' }}>
                {['#', 'Title', 'Owner', 'Rent', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#718096' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <td className="px-4 py-3 text-xs" style={{ color: '#A0AEC0' }}>{l.id}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1B3A8C' }}>{l.title}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#4A5568' }}>{l.ownerName}</td>
                  <td className="px-4 py-3 font-semibold">₹{l.rent.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${l.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {l.available ? '● Active' : '● Full'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 rounded border transition-colors hover:bg-blue-50"
                        style={{ color: '#1B3A8C', borderColor: '#C5D9FF' }}>
                        <Edit3 size={12} />
                      </button>
                      <button onClick={() => setItems(prev => prev.filter(x => x.id !== l.id))}
                        className="text-xs px-2 py-1 rounded border transition-colors hover:bg-red-50"
                        style={{ color: '#DC2626', borderColor: '#FECACA' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Site Content Editor ────────────────────── */
function ContentEditor() {
  useAdminAuth();
  const [content, setContent] = useState({
    heroTitle: 'Find your perfect stay in Pune',
    heroSubtitle: 'PGs · Hostels · Flats · Studios — connect directly with owners, no broker',
    stat1Label: 'Properties in Pune', stat1Value: '500+',
    stat2Label: 'Happy Tenants',       stat2Value: '2,000+',
    stat3Label: 'Areas Covered',       stat3Value: '20+',
    stat4Label: 'Daily Inquiries',     stat4Value: '100+',
    footerCredit: 'Developed by Jayesh Sonar',
  });
  const [saved, setSaved] = useState(false);

  const upd = (k, v) => setContent(c => ({ ...c, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Site Content</h1>
        <p className="text-sm mt-0.5" style={{ color: '#718096' }}>Edit homepage text and stats dynamically</p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg text-sm font-semibold"
          style={{ background: '#F0FDF4', color: '#0F9D58', border: '1px solid #BBF7D0' }}>
          ✓ Changes saved successfully!
        </div>
      )}

      {[
        { section: 'Hero Section', fields: [
          { key: 'heroTitle',    label: 'Main Headline', type: 'text' },
          { key: 'heroSubtitle', label: 'Subtitle',      type: 'textarea' },
        ]},
        { section: 'Quick Stats', fields: [
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
        <div key={section} className="card rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#718096' }}>{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, type }) => (
              <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="form-label">{label}</label>
                {type === 'textarea' ? (
                  <textarea className="form-input resize-none" rows={2}
                    value={content[key]} onChange={e => upd(key, e.target.value)} />
                ) : (
                  <input className="form-input" type="text"
                    value={content[key]} onChange={e => upd(key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} className="btn-primary gap-2 flex">
        <Save size={15} /> Save Changes
      </button>
    </div>
  );
}

/* ── Users page ─────────────────────────────── */
function UsersAdmin() {
  useAdminAuth();
  const mockUsers = [
    { id: 1, name: 'Rekha Patil',   email: 'rekha@email.com', role: 'Owner',  listings: 3, joined: '2026-04-10' },
    { id: 2, name: 'Suresh Desai',  email: 'suresh@email.com',role: 'Owner',  listings: 1, joined: '2026-04-20' },
    { id: 3, name: 'Amit Kulkarni', email: 'amit@email.com',  role: 'Tenant', listings: 0, joined: '2026-05-01' },
    { id: 4, name: 'Priya Sharma',  email: 'priya@email.com', role: 'Owner',  listings: 2, joined: '2026-05-15' },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Users</h1>
      <div className="card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0' }}>
              {['Name', 'Email', 'Role', 'Listings', 'Joined'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#718096' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < mockUsers.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
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
                <td className="px-4 py-3 text-xs" style={{ color: '#718096' }}>{new Date(u.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Settings ───────────────────────────────── */
function SettingsAdmin() {
  useAdminAuth();
  const [settings, setSettings] = useState({
    siteName: 'Thikana',
    maintenanceMode: false,
    allowRegistrations: true,
    maxPhotosPerListing: 4,
  });
  const upd = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  return (
    <div className="space-y-5 max-w-lg">
      <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>Settings</h1>
      <div className="card rounded-xl p-5 space-y-5">
        {[
          { key: 'siteName', label: 'Site Name', type: 'text' },
          { key: 'maxPhotosPerListing', label: 'Max Photos Per Listing', type: 'number' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="form-label">{label}</label>
            <input className="form-input" type={type} value={settings[key]}
              onChange={e => upd(key, type === 'number' ? Number(e.target.value) : e.target.value)} />
          </div>
        ))}
        {[
          { key: 'maintenanceMode',    label: 'Maintenance Mode',    desc: 'Take site offline for maintenance' },
          { key: 'allowRegistrations', label: 'Allow Registrations', desc: 'Allow new users to register' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F7F8FC', border: '1px solid #E2E8F0' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2D3748' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{desc}</p>
            </div>
            <button type="button" onClick={() => upd(key, !settings[key])}
              className={`toggle-track ${settings[key] ? 'on' : 'off'}`}>
              <div className="toggle-thumb" />
            </button>
          </div>
        ))}
        <button className="btn-primary gap-2 flex"><Save size={15} /> Save Settings</button>
      </div>
    </div>
  );
}

/* ── Admin Panel Shell ──────────────────────── */
export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') navigate('/admin/login');
  }, [navigate]);

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F8FC' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#718096' }}>Thikana</p>
            <p className="text-sm font-bold" style={{ color: '#1A202C' }}>
              {NAV.find(n => n.path === location.pathname)?.label || 'Admin Panel'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost p-2 relative">
              <Bell size={18} color="#718096" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold"
                style={{ background: '#1B3A8C' }}>A</div>
              <span className="text-sm font-semibold" style={{ color: '#1A202C' }}>Developer</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="listings"  element={<ListingsAdmin />} />
            <Route path="users"     element={<UsersAdmin />} />
            <Route path="content"   element={<ContentEditor />} />
            <Route path="settings"  element={<SettingsAdmin />} />
            <Route path="*"         element={<Overview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
