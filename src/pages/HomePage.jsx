import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SmartSearchBar from '../components/SmartSearchBar';
import ListingCard from '../components/ListingCard';
import DetailPane from '../components/DetailPane';
import MobileDetailModal from '../components/MobileDetailModal';
import Footer from '../components/Footer';
import { getListings, getSiteContent } from '../services/db';
import { Search, Home, Users, Building, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [mobileSelected, setMobileSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('default');
  const [cmsContent, setCmsContent] = useState({
    heroTitle: 'Find your perfect stay in Pune',
    heroSubtitle: 'PGs · Hostels · Flats · Studios — connect directly with owners, no broker',
    stat1Value: '500+', stat1Label: 'Properties in Pune',
    stat2Value: '2,000+', stat2Label: 'Happy Tenants',
    stat3Value: '20+', stat3Label: 'Areas Covered',
    stat4Value: '100+', stat4Label: 'Daily Inquiries',
  });

  useEffect(() => {
    async function loadData() {
      const [data, cms] = await Promise.all([
        getListings(),
        getSiteContent()
      ]);
      setListings(data);
      if (data.length > 0) setSelected(data[0]);
      if (cms) setCmsContent(cms);
      setLoading(false);
    }
    loadData();
  }, []);

  const currentStats = [
    { label: cmsContent?.stat1Label || 'Properties in Pune', value: cmsContent?.stat1Value || '500+', icon: Home },
    { label: cmsContent?.stat2Label || 'Happy Tenants', value: cmsContent?.stat2Value || '2,000+', icon: Users },
    { label: cmsContent?.stat3Label || 'Areas Covered', value: cmsContent?.stat3Value || '20+', icon: Building },
    { label: cmsContent?.stat4Label || 'Daily Inquiries', value: cmsContent?.stat4Value || '100+', icon: TrendingUp },
  ];

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
        (l.amenities || []).some(t => t.toLowerCase().includes(q))
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
                {(cmsContent?.heroTitle || 'Find your perfect stay in Pune').split('Pune').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <span style={{ color: '#1B3A8C' }}>Pune</span>}
                  </span>
                ))}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#718096' }}>
                {cmsContent?.heroSubtitle || 'PGs · Hostels · Flats · Studios — connect directly with owners, no broker'}
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
              {currentStats.map(({ label, value, icon: Icon }) => (
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
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mb-3"></div>
                <p className="font-semibold" style={{ color: '#4A5568' }}>Loading properties...</p>
              </div>
            ) : filtered.length === 0 ? (
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
