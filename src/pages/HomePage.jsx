import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SmartSearchBar from '../components/SmartSearchBar';
import ListingCard from '../components/ListingCard';
import DetailPane from '../components/DetailPane';
import MobileDetailModal from '../components/MobileDetailModal';
import Footer from '../components/Footer';
import { listings } from '../data/mockListings';
import { Search, Home, Users, Building, TrendingUp } from 'lucide-react';

const STATS = [
  { label: 'Properties in Pune',  value: '500+',   icon: Home },
  { label: 'Happy Tenants',        value: '2,000+', icon: Users },
  { label: 'Areas Covered',        value: '20+',    icon: Building },
  { label: 'Daily Inquiries',      value: '100+',   icon: TrendingUp },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(listings[0]);
  const [mobileSelected, setMobileSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    let r = [...listings];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter
    if (activeFilter && activeFilter !== 'All Types') {
      r = r.filter(l => {
        if (activeFilter === 'Girls PG / Hostel') return l.gender === 'Girls Only';
        if (activeFilter === 'Boys PG / Hostel')  return l.gender === 'Boys Only';
        if (activeFilter === 'Family / Any')       return l.gender === 'Family / Any';
        if (activeFilter === 'Flat / Studio')      return l.type.toLowerCase().includes('flat') || l.type.toLowerCase().includes('studio');
        if (activeFilter === 'No Brokerage')       return !l.brokerage;
        if (activeFilter === 'Food Included')      return l.foodIncluded;
        return true;
      });
    }

    // Sort
    if (sortBy === 'rent-low')  r.sort((a, b) => a.rent - b.rent);
    if (sortBy === 'rent-high') r.sort((a, b) => b.rent - a.rent);
    if (sortBy === 'views')     r.sort((a, b) => b.views - a.views);
    if (sortBy === 'newest')    r.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

    return r;
  }, [searchQuery, activeFilter, sortBy]);

  const handleCardClick = (listing) => {
    setSelected(listing);
    if (window.innerWidth < 768) setMobileSelected(listing);
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      <Navbar />

      {/* ── Hero strip ───────────────────────── */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ color: '#1A202C' }}>
                Find your perfect stay in{' '}
                <span style={{ color: '#1B3A8C' }}>Pune</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: '#718096' }}>
                PGs · Hostels · Flats · Studios — connect directly with owners, no broker
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-extrabold" style={{ color: '#1B3A8C' }}>{value}</p>
                  <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#718096' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Smart Search Bar ─────────────────── */}
      <SmartSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* ── Two-pane layout ───────────────────── */}
      <div className="flex flex-1 overflow-hidden max-w-screen-xl mx-auto w-full">

        {/* LEFT — listing cards */}
        <div
          className="w-full md:w-[38%] md:max-w-[480px] flex flex-col bg-white overflow-hidden"
          style={{ borderRight: '1px solid #E2E8F0' }}
        >
          {/* Count bar */}
          <div className="px-4 py-2.5 shrink-0 flex items-center justify-between"
            style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
            <p className="text-sm" style={{ color: '#4A5568' }}>
              <span className="font-bold" style={{ color: '#1A202C' }}>{filtered.length}</span> properties found
              {activeFilter && activeFilter !== 'All Types' && (
                <span className="ml-1 font-semibold" style={{ color: '#1B3A8C' }}>· {activeFilter}</span>
              )}
            </p>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
                <Search size={36} color="#CBD5E0" className="mb-3" />
                <p className="font-semibold" style={{ color: '#4A5568' }}>No properties found</p>
                <p className="text-sm mt-1" style={{ color: '#A0AEC0' }}>Try a different search or filter</p>
              </div>
            ) : (
              filtered.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isActive={selected?.id === listing.id}
                  onClick={() => handleCardClick(listing)}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT — detail pane (desktop) */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden" style={{ background: '#F7F8FC' }}>
          <div className="flex-1 overflow-hidden bg-white m-3 rounded-xl"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <DetailPane listing={selected} key={selected?.id} />
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {mobileSelected && (
        <MobileDetailModal listing={mobileSelected} onClose={() => setMobileSelected(null)} />
      )}
    </div>
  );
}
