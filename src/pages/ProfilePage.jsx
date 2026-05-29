import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Eye, Edit3, LogOut, MapPin, Phone, Mail, Star, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ownerListings } from '../data/mockListings';

const SAVED = [
  { id: 1, title: "Rakhumai Girls' Hostel", area: 'Katraj', rent: 5000, available: true },
  { id: 5, title: 'Viman Heights – Studio',  area: 'Viman Nagar', rent: 12000, available: true },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const user = { name: 'Rekha Patil', email: 'rekha@email.com', phone: '9876543210', role: 'Owner', joined: '2026-04-10', avatar: 'R' };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      <Navbar />

      {/* Profile hero */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #1B3A8C, #2557C2)' }}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>{user.name}</h1>
                <span className="badge bg-blue-50 text-blue-700 border-blue-200">{user.role}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#718096' }}>
                  <Mail size={13} />{user.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#718096' }}>
                  <Phone size={13} />+91 {user.phone}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#718096' }}>
                  Member since {new Date(user.joined).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary gap-1.5 flex text-sm"><Edit3 size={14} />Edit Profile</button>
              <button onClick={() => navigate('/login')} className="btn-ghost gap-1.5 flex text-sm"><LogOut size={14} />Logout</button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mt-6">
            {[
              { label: 'Listings', value: ownerListings.length },
              { label: 'Total Views', value: ownerListings.reduce((s, l) => s + l.views, 0).toLocaleString('en-IN') },
              { label: 'Active', value: ownerListings.filter(l => l.available).length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-extrabold" style={{ color: '#1B3A8C' }}>{value}</p>
                <p className="text-xs" style={{ color: '#718096' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-screen-xl mx-auto px-6 flex gap-0 border-t" style={{ borderColor: '#E2E8F0' }}>
          {[
            { key: 'listings', label: 'My Listings', icon: Building2 },
            { key: 'saved',    label: 'Saved',        icon: Heart },
          ].map(({ key, label, icon: Icon }) => (
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

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-6 w-full flex-1">
        {activeTab === 'listings' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerListings.map(l => (
              <div key={l.id} className="card rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/listing/${l.id}`)}>
                <div className="h-36 overflow-hidden bg-gray-100">
                  <img src={l.coverImage} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60'; }} />
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm" style={{ color: '#1B3A8C' }}>{l.title}</p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#718096' }}><MapPin size={11} />{l.area}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-extrabold" style={{ color: '#1A202C' }}>₹{l.rent.toLocaleString('en-IN')}</span>
                    <span className={`badge ${l.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {l.available ? 'Available' : 'Full'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAVED.map(l => (
              <div key={l.id} className="card rounded-xl p-4 cursor-pointer hover:shadow-card-hover transition-shadow"
                onClick={() => navigate(`/listing/${l.id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1B3A8C' }}>{l.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{l.area}</p>
                    <p className="text-base font-extrabold mt-1.5" style={{ color: '#1A202C' }}>₹{l.rent.toLocaleString('en-IN')}/mo</p>
                  </div>
                  <Heart size={18} className="fill-red-400 text-red-400" />
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
