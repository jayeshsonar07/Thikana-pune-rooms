import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Heart, PlusCircle, Edit3, Trash2,
  MapPin, Eye, LogOut, Phone, Mail, Settings
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserListings, listenAuthState, logoutUser, deleteListing, updateListing } from '../services/db';
import logo from '../assets/logo.png';

const SAVED = [];

/* ── Vacancy toggle ─────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange?.(!value)}
      className="toggle-track" style={{ flexShrink: 0 }}
      data-on={value}>
      <div className="toggle-thumb" />
    </button>
  );
}

/* ── My Listings tab ────────────────────────── */
function MyListings({ navigate, userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserListings(userId).then(data => {
        setItems(data);
        setLoading(false);
      });
    }
  }, [userId]);

  const handleToggle = async (id, val) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, available: val } : p));
    try {
      await updateListing(id, { available: val });
    } catch (e) {
      setItems(prev => prev.map(p => p.id === id ? { ...p, available: !val } : p));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this listing?')) {
      try {
        await deleteListing(id);
        setItems(prev => prev.filter(p => p.id !== id));
      } catch (e) {
        alert('Failed to delete listing');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading your properties...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: '#718096' }}>{items.length} active listings</p>
        <button onClick={() => navigate('/add-listing')} className="btn-primary text-sm gap-1.5 flex items-center">
          <PlusCircle size={14} /> Add Listing
        </button>
      </div>

      {/* Stats mini row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: items.length, color: '#1B3A8C' },
          { label: 'Active', value: items.filter(l => l.available).length, color: '#0F9D58' },
          { label: 'Views', value: items.reduce((s, l) => s + l.views, 0).toLocaleString('en-IN'), color: '#D97706' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card rounded-xl p-4 text-center">
            <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{label}</p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card rounded-2xl text-center py-16">
          <Building2 size={42} color="#CBD5E0" className="mx-auto mb-3" />
          <p className="font-semibold" style={{ color: '#4A5568' }}>No listings yet</p>
          <button onClick={() => navigate('/add-listing')} className="btn-primary mt-4">Post First Listing</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(listing => (
            <div key={listing.id} className="card rounded-2xl overflow-hidden group">
              {/* Image */}
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img src={listing.coverImage} alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Vacancy toggle */}
                <div className="absolute bottom-3 left-3 bg-white/95 rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <Toggle value={listing.available} onChange={val => handleToggle(listing.id, val)} />
                  <span className="text-xs font-bold" style={{ color: listing.available ? '#0F9D58' : '#A0AEC0' }}>
                    {listing.available ? 'Available' : 'Full'}
                  </span>
                </div>
                {/* Views */}
                <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Eye size={10} />{listing.views}
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#1B3A8C' }}>{listing.type}</p>
                <h3 className="font-bold text-sm leading-snug line-clamp-1 mb-1" style={{ color: '#1A202C' }}>{listing.title}</h3>
                <div className="flex items-center gap-1 mb-3" style={{ color: '#718096' }}>
                  <MapPin size={11} /><span className="text-xs">{listing.area}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-extrabold" style={{ color: '#1A202C' }}>
                    ₹{listing.rent.toLocaleString('en-IN')}<span className="text-xs font-normal ml-0.5" style={{ color: '#A0AEC0' }}>/mo</span>
                  </span>
                </div>
                <div className="divider mb-3" />
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/edit-listing/${listing.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all"
                    style={{ color: '#1B3A8C', borderColor: '#C5D9FF' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EBF2FF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Edit3 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(listing.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all"
                    style={{ color: '#DC2626', borderColor: '#FECACA' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Trash2 size={12} /> Delete
                  </button>
                  <button onClick={() => navigate(`/listing/${listing.id}`)}
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold text-white"
                    style={{ background: '#1B3A8C' }}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Saved tab ──────────────────────────────── */
function SavedListings({ navigate }) {
  const [saved, setSaved] = useState(SAVED);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {saved.map(l => (
        <div key={l.id} className="card rounded-xl overflow-hidden group cursor-pointer"
          onClick={() => navigate(`/listing/${l.id}`)}>
          <div className="h-32 overflow-hidden bg-gray-100">
            <img src={l.coverImage} alt={l.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60'; }} />
          </div>
          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm" style={{ color: '#1B3A8C' }}>{l.title}</p>
              <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{l.area}</p>
              <p className="text-sm font-extrabold mt-1" style={{ color: '#1A202C' }}>₹{l.rent.toLocaleString('en-IN')}/mo</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setSaved(s => s.filter(x => x.id !== l.id)); }}>
              <Heart size={18} className="fill-red-400 text-red-400" />
            </button>
          </div>
        </div>
      ))}
      {saved.length === 0 && (
        <div className="col-span-full card rounded-2xl text-center py-14">
          <Heart size={36} color="#CBD5E0" className="mx-auto mb-3" />
          <p className="font-semibold" style={{ color: '#4A5568' }}>No saved properties</p>
          <button onClick={() => navigate('/home')} className="btn-primary mt-4">Explore Properties</button>
        </div>
      )}
    </div>
  );
}

/* ── Main ProfilePage ───────────────────────── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenAuthState(setUser);
    return () => unsubscribe();
  }, []);

  if (!user) return null; // Wait for redirect handled by App.jsx ProtectedRoute

  const userProfile = { 
    name: user.displayName || 'User', 
    email: user.email, 
    phone: '', 
    role: 'Owner' 
  };

  const TABS = [
    { key: 'listings', label: 'My Listings', icon: Building2 },
    { key: 'saved',    label: 'Saved',        icon: Heart },
    { key: 'settings', label: 'Settings',     icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      <Navbar />

      {/* ── Profile hero ─────────────────────── */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #1B3A8C, #2557C2)' }}>
              {userProfile.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>{userProfile.name}</h1>
                <span className="badge bg-blue-50 text-blue-700 border-blue-200">{userProfile.role}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#718096' }}>
                  <Mail size={13} />{userProfile.email}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { logoutUser(); navigate('/home'); }} className="btn-ghost gap-1.5 flex items-center text-sm" style={{ color: '#E53E3E' }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-screen-xl mx-auto px-6 flex border-t" style={{ borderColor: '#E2E8F0' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderBottomColor: activeTab === key ? '#1B3A8C' : 'transparent',
                color: activeTab === key ? '#1B3A8C' : '#718096',
              }}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ───────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 py-6 w-full flex-1">
        {activeTab === 'listings'  && <MyListings navigate={navigate} userId={user.uid} />}
        {activeTab === 'saved'     && <SavedListings navigate={navigate} />}
        {activeTab === 'settings'  && (
          <div className="card rounded-2xl p-6 max-w-md space-y-5">
            <h2 className="text-lg font-bold" style={{ color: '#1A202C' }}>Account Settings</h2>
            {[
              { label: 'Full Name',    value: userProfile.name,  type: 'text' },
              { label: 'Email',        value: userProfile.email, type: 'email' },
            ].map(({ label, value, type }) => (
              <div key={label}>
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} defaultValue={value} />
              </div>
            ))}
            <button className="btn-primary w-full">Save Changes</button>
            <div className="divider" />
            <button className="w-full text-sm font-semibold py-2.5 rounded-lg border transition-all"
              style={{ color: '#DC2626', borderColor: '#FECACA' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Delete Account
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
