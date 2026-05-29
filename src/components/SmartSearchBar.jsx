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
  { value: 'default',  label: 'Most Relevant' },
  { value: 'rent-low', label: 'Rent: Low to High' },
  { value: 'rent-high',label: 'Rent: High to Low' },
  { value: 'views',    label: 'Most Viewed' },
  { value: 'newest',   label: 'Newest First' },
];

const AREAS = ['Katraj', 'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad', 'Pimpri', 'Baner', 'Hadapsar', 'Shivajinagar', 'Pimpri-Chinchwad'];

export default function SmartSearchBar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter, sortBy, setSortBy }) {
  const [showTypeDD, setShowTypeDD]       = useState(false);
  const [showSortDD, setShowSortDD]       = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const typeRef   = useRef(null);
  const sortRef   = useRef(null);
  const searchRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (typeRef.current   && !typeRef.current.contains(e.target))   setShowTypeDD(false);
      if (sortRef.current   && !sortRef.current.contains(e.target))   setShowSortDD(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = (searchQuery || '').length > 0
    ? AREAS.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    : AREAS.slice(0, 6);

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div style={{ background: '#F7F8FC', borderBottom: '1px solid #E2E8F0', padding: '12px 24px' }}>
      <div className="max-w-screen-xl mx-auto flex flex-col gap-3">

        {/* ── Main search row ────────────────────── */}
        {/* KEY FIX: overflow:visible so dropdowns aren't clipped */}
        <div
          className="flex items-stretch rounded-xl border bg-white"
          style={{
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 2px 12px rgba(27,58,140,0.07)',
            overflow: 'visible',         // ← was 'hidden' which clipped dropdowns
            position: 'relative',
            minHeight: 52,
          }}
        >
          {/* Search input */}
          <div ref={searchRef} className="flex items-center gap-2.5 flex-1 px-4" style={{ position: 'relative' }}>
            <Search size={17} color="#1B3A8C" style={{ flexShrink: 0 }} />
            <input
              value={searchQuery || ''}
              onChange={e => { setSearchQuery?.(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search by area, PG name, type..."
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: '#1A202C' }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery?.(''); setShowSuggestions(false); }} style={{ flexShrink: 0, color: '#A0AEC0' }}>
                <X size={14} />
              </button>
            )}

            {/* ── Area suggestions dropdown ── */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 6,
                  background: 'white',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 12,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  zIndex: 9999,
                  overflow: 'hidden',
                }}
              >
                <p className="text-xs font-semibold px-3 pt-3 pb-1" style={{ color: '#A0AEC0' }}>
                  📍 Suggested areas in Pune
                </p>
                {suggestions.map(s => (
                  <button key={s}
                    onMouseDown={() => { setSearchQuery?.(s); setShowSuggestions(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                    style={{ color: '#2D3748' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EBF2FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <MapPin size={13} color="#1B3A8C" />
                    <span className="text-sm font-medium">{s}</span>
                    <span className="text-xs ml-auto" style={{ color: '#A0AEC0' }}>Pune</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: '#E2E8F0', margin: '10px 0' }} />

          {/* Location */}
          <div className="flex items-center gap-2 px-3" style={{ minWidth: 140 }}>
            <MapPin size={15} color="#A0AEC0" style={{ flexShrink: 0 }} />
            <input
              placeholder="Pune, Maharashtra"
              className="text-sm outline-none bg-transparent flex-1"
              style={{ color: '#4A5568', minWidth: 0 }}
            />
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: '#E2E8F0', margin: '10px 0' }} />

          {/* Type dropdown */}
          <div ref={typeRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowTypeDD(d => !d); setShowSortDD(false); setShowSuggestions(false); }}
              className="flex items-center gap-2 px-4 h-full text-sm font-semibold transition-colors"
              style={{
                color: activeFilter && activeFilter !== 'All Types' ? '#1B3A8C' : '#4A5568',
                whiteSpace: 'nowrap',
                background: showTypeDD ? '#EBF2FF' : 'transparent',
              }}
            >
              <span>{activeFilter || 'All Types'}</span>
              <ChevronDown size={13} style={{ transform: showTypeDD ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showTypeDD && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                background: 'white',
                border: '1.5px solid #E2E8F0',
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                minWidth: 210,
                zIndex: 9999,
                overflow: 'hidden',
              }}>
                {PROPERTY_TYPES.map(t => (
                  <button key={t}
                    onClick={() => { setActiveFilter?.(t); setShowTypeDD(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors"
                    style={{ color: activeFilter === t ? '#1B3A8C' : '#2D3748', fontWeight: activeFilter === t ? 700 : 500 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EBF2FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {t}
                    {activeFilter === t && <span style={{ color: '#1B3A8C' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            className="btn-primary text-sm font-bold px-6 rounded-none"
            style={{ borderRadius: '0 10px 10px 0', minWidth: 90 }}
            onClick={() => setShowSuggestions(false)}
          >
            Search
          </button>
        </div>

        {/* ── Filter pills + sort ─────────────────── */}
        <div className="flex items-center justify-between gap-3">
          {/* Quick filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {PROPERTY_TYPES.slice(1).map(t => (
              <button key={t}
                onClick={() => setActiveFilter?.(activeFilter === t ? 'All Types' : t)}
                className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background:   activeFilter === t ? '#1B3A8C' : 'white',
                  color:        activeFilter === t ? 'white'   : '#4A5568',
                  borderColor:  activeFilter === t ? '#1B3A8C' : '#E2E8F0',
                  flexShrink: 0,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div ref={sortRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => { setShowSortDD(d => !d); setShowTypeDD(false); setShowSuggestions(false); }}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-all"
              style={{ background: 'white', color: '#2D3748', borderColor: '#E2E8F0', whiteSpace: 'nowrap' }}
            >
              <SlidersHorizontal size={13} color="#1B3A8C" />
              {currentSort.label}
              <ChevronDown size={11} style={{ transform: showSortDD ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showSortDD && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                background: 'white',
                border: '1.5px solid #E2E8F0',
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                minWidth: 190,
                zIndex: 9999,
                overflow: 'hidden',
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setSortBy?.(opt.value); setShowSortDD(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors"
                    style={{ color: sortBy === opt.value ? '#1B3A8C' : '#2D3748', fontWeight: sortBy === opt.value ? 700 : 500 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EBF2FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
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
