import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const PROPERTY_TYPES = [
  'All Types',
  'Girls PG / Hostel',
  'Boys PG / Hostel',
  'Family / Any',
  'Flat / Studio',
  'No Brokerage',
  'Food Included',
  'Furnished',
];

const SORT_OPTIONS = [
  { value: 'default',     label: 'Most Relevant' },
  { value: 'rent-low',    label: 'Rent: Low to High' },
  { value: 'rent-high',   label: 'Rent: High to Low' },
  { value: 'views',       label: 'Most Viewed' },
  { value: 'newest',      label: 'Newest First' },
];

const AREAS = ['Katraj', 'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad', 'Pimpri', 'Baner', 'Hadapsar', 'Shivajinagar'];

export default function SmartSearchBar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter, sortBy, setSortBy }) {
  const [showTypeDD, setShowTypeDD] = useState(false);
  const [showSortDD, setShowSortDD] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const typeRef = useRef(null);
  const sortRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) setShowTypeDD(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDD(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = searchQuery.length > 0
    ? AREAS.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    : AREAS.slice(0, 5);

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0', padding: '12px 24px' }}>
      <div className="max-w-screen-xl mx-auto flex flex-col gap-3">

        {/* ── Main search row ──────────────────── */}
        <div className="smart-search" style={{ borderRadius: 12 }}>

          {/* Search icon + input */}
          <div className="smart-search-field flex-1" ref={searchRef} style={{ position: 'relative' }}>
            <Search size={18} color="#1B3A8C" style={{ flexShrink: 0 }} />
            <input
              value={searchQuery || ''}
              onChange={e => { setSearchQuery && setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search by area, PG name, type..."
              style={{ caretColor: '#1B3A8C' }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery && setSearchQuery(''); setShowSuggestions(false); }}
                style={{ flexShrink: 0, color: '#A0AEC0' }}>
                <X size={15} />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-card-hover z-50"
                style={{ borderRadius: '0 0 12px 12px', border: '1px solid #E2E8F0', borderTop: 'none', marginTop: 2 }}>
                <p className="text-xs font-semibold px-3 pt-2 pb-1" style={{ color: '#A0AEC0' }}>
                  Suggested areas in Pune
                </p>
                {suggestions.map(s => (
                  <button key={s}
                    onClick={() => { setSearchQuery && setSearchQuery(s); setShowSuggestions(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <MapPin size={13} color="#1B3A8C" />
                    <span className="text-sm text-gray-700">{s}</span>
                    <span className="text-xs ml-auto" style={{ color: '#A0AEC0' }}>Pune</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="smart-search-divider" />

          {/* Location input */}
          <div className="smart-search-field" style={{ minWidth: 150, maxWidth: 200 }}>
            <MapPin size={16} color="#718096" style={{ flexShrink: 0 }} />
            <input placeholder="Katraj, Pune..." style={{ fontSize: 14 }} />
          </div>

          <div className="smart-search-divider" />

          {/* Type dropdown */}
          <div ref={typeRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowTypeDD(d => !d); setShowSortDD(false); }}
              className="flex items-center gap-2 px-4 h-full text-sm font-semibold hover:bg-blue-50 transition-colors"
              style={{ color: activeFilter && activeFilter !== 'All Types' ? '#1B3A8C' : '#4A5568', whiteSpace: 'nowrap', borderRight: '1px solid #E2E8F0' }}
            >
              <span>{activeFilter || 'All Types'}</span>
              <ChevronDown size={14} style={{ transform: showTypeDD ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showTypeDD && (
              <div className="absolute top-full right-0 bg-white shadow-card-hover z-50 py-1"
                style={{ borderRadius: 10, border: '1px solid #E2E8F0', minWidth: 200, marginTop: 4 }}>
                {PROPERTY_TYPES.map(t => (
                  <button key={t}
                    onClick={() => { setActiveFilter && setActiveFilter(t); setShowTypeDD(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between"
                    style={{ color: activeFilter === t ? '#1B3A8C' : '#2D3748', fontWeight: activeFilter === t ? 700 : 500 }}
                  >
                    {t}
                    {activeFilter === t && <span style={{ color: '#1B3A8C', fontWeight: 700 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search CTA button */}
          <button className="btn-primary px-8 h-full"
            style={{ borderRadius: '0 10px 10px 0', fontSize: 15, fontWeight: 700 }}>
            Search
          </button>
        </div>

        {/* ── Filter row ────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          {/* Quick filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {PROPERTY_TYPES.slice(1).map(t => (
              <button key={t}
                onClick={() => setActiveFilter && setActiveFilter(activeFilter === t ? 'All Types' : t)}
                className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background: activeFilter === t ? '#1B3A8C' : 'white',
                  color: activeFilter === t ? 'white' : '#2D3748',
                  borderColor: activeFilter === t ? '#1B3A8C' : '#E2E8F0',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div ref={sortRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => { setShowSortDD(d => !d); setShowTypeDD(false); }}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-all"
              style={{ background: 'white', color: '#2D3748', borderColor: '#E2E8F0', whiteSpace: 'nowrap' }}
            >
              <SlidersHorizontal size={13} color="#1B3A8C" />
              {currentSort.label}
              <ChevronDown size={12} style={{ transform: showSortDD ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showSortDD && (
              <div className="absolute top-full right-0 bg-white shadow-card-hover z-50 py-1"
                style={{ borderRadius: 10, border: '1px solid #E2E8F0', minWidth: 180, marginTop: 4 }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setSortBy && setSortBy(opt.value); setShowSortDD(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between"
                    style={{ color: sortBy === opt.value ? '#1B3A8C' : '#2D3748', fontWeight: sortBy === opt.value ? 700 : 500 }}
                  >
                    {opt.label}
                    {sortBy === opt.value && <span style={{ color: '#1B3A8C' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
