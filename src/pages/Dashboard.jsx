import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, PlusCircle, Building2, Eye, AlertCircle,
  TrendingUp, Edit3, Trash2, MapPin
} from 'lucide-react';
import { ownerListings } from '../data/mockListings';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

function VacancyToggle({ available, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(!available)}
        className={`toggle-track ${available ? 'on' : 'off'}`}>
        <div className="toggle-thumb" />
      </button>
      <span className="text-xs font-bold" style={{ color: available ? '#0F9D58' : '#A0AEC0' }}>
        {available ? 'Available' : 'Full'}
      </span>
    </div>
  );
}

function StatsBar({ listings }) {
  const views  = listings.reduce((s, l) => s + (l.views || 0), 0);
  const active = listings.filter(l => l.available).length;
  const full   = listings.filter(l => !l.available).length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Total Views',       value: views.toLocaleString('en-IN'), icon: Eye,          color: '#1B3A8C', bg: '#EBF2FF' },
        { label: 'Active Listings',   value: active,                        icon: Building2,    color: '#0F9D58', bg: '#F0FDF4' },
        { label: 'Full Listings',     value: full,                          icon: AlertCircle,  color: '#DC2626', bg: '#FEF2F2' },
      ].map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
              <Icon size={19} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold" style={{ color: '#1A202C' }}>{value}</p>
              <p className="text-xs" style={{ color: '#718096' }}>{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(ownerListings);

  const handleToggle = (id, val) =>
    setProperties(prev => prev.map(p => p.id === id ? { ...p, available: val } : p));

  const handleDelete = (id) => {
    if (window.confirm('Delete this listing?'))
      setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      {/* Header */}
      <header className="bg-white sticky top-0 z-30"
        style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-sm font-semibold hover:underline mr-4"
            style={{ color: '#1B3A8C' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Thikana" style={{ height: 46, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(27,58,140,0.12))' }} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/profile')}
              className="btn-ghost text-sm gap-1.5 flex" style={{ color: '#1B3A8C' }}>
              Profile
            </button>
            <button onClick={() => navigate('/add-listing')} className="btn-primary text-sm gap-1.5 flex">
              <PlusCircle size={14} /> Add Listing
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-6 flex-1 w-full">
        {/* Welcome */}
        <div className="card rounded-2xl p-6 mb-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-5" style={{ background: '#1B3A8C' }} />
          <div className="absolute right-16 bottom-4 w-24 h-24 rounded-full opacity-5" style={{ background: '#2557C2' }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#718096' }}>Good morning 👋</p>
              <h1 className="text-2xl font-extrabold mt-0.5" style={{ color: '#1A202C' }}>Rekha Patil</h1>
              <p className="text-sm mt-1" style={{ color: '#4A5568' }}>Manage your Thikana properties</p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ background: '#EBF2FF' }}>
              <Building2 size={28} color="#1B3A8C" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsBar listings={properties} />

        {/* Section heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold" style={{ color: '#1A202C' }}>My Listings</h2>
            <p className="text-sm" style={{ color: '#718096' }}>{properties.length} properties</p>
          </div>
          <button onClick={() => navigate('/add-listing')} className="btn-secondary text-sm gap-1.5 flex">
            <PlusCircle size={14} /> New Listing
          </button>
        </div>

        {/* Grid */}
        {properties.length === 0 ? (
          <div className="card rounded-2xl text-center py-20">
            <Building2 size={44} color="#CBD5E0" className="mx-auto mb-4" />
            <p className="font-semibold text-base" style={{ color: '#4A5568' }}>No listings yet</p>
            <p className="text-sm mt-1 mb-6" style={{ color: '#A0AEC0' }}>Post your first property to start receiving inquiries</p>
            <button onClick={() => navigate('/add-listing')} className="btn-primary">Post First Listing</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map(listing => (
              <div key={listing.id} className="card rounded-2xl overflow-hidden group">
                {/* Image */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img src={listing.coverImage} alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Toggle overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/95 rounded-lg px-3 py-1.5">
                    <VacancyToggle available={listing.available} onChange={val => handleToggle(listing.id, val)} />
                  </div>
                  {/* Views badge */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Eye size={10} />{listing.views}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#1B3A8C' }}>{listing.type}</p>
                  <h3 className="font-bold text-sm leading-snug line-clamp-1 mb-1" style={{ color: '#1A202C' }}>{listing.title}</h3>
                  <div className="flex items-center gap-1 mb-3" style={{ color: '#718096' }}>
                    <MapPin size={11} />
                    <span className="text-xs">{listing.area}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-base font-extrabold" style={{ color: '#1A202C' }}>
                        ₹{listing.rent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs ml-1" style={{ color: '#A0AEC0' }}>/mo</span>
                    </div>
                  </div>
                  <div className="divider" style={{ margin: '0 0 12px' }} />
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-blue-50"
                      style={{ color: '#1B3A8C', borderColor: '#C5D9FF' }}>
                      <Edit3 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(listing.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                      style={{ color: '#DC2626', borderColor: '#FECACA' }}>
                      <Trash2 size={12} /> Delete
                    </button>
                    <button onClick={() => navigate(`/listing/${listing.id}`)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: '#1B3A8C', color: 'white' }}>
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
