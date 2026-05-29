import { MapPin, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const genderBadge = {
  'Girls Only':   { bg: '#FDF2F8', color: '#9D174D', border: '#FBCFE8' },
  'Boys Only':    { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  'Family / Any': { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  'Any':          { bg: '#F9FAFB', color: '#374151', border: '#E5E7EB' },
};

export default function ListingCard({ listing, isActive, onClick }) {
  const navigate = useNavigate();
  const { id, title, area, rent, tags, gender, available, views, type, brokerage, coverImage } = listing;
  const badge = genderBadge[gender] || genderBadge['Any'];

  const handleVisit = (e) => {
    e.stopPropagation();
    navigate(`/listing/${id}`);
  };

  return (
    <div
      onClick={onClick}
      className={`listing-card border-b px-4 py-4 ${isActive ? 'active' : ''}`}
      style={{ borderBottomColor: '#E2E8F0' }}
    >
      {/* Thumbnail + title row */}
      <div className="flex gap-3 mb-2.5">
        {/* Mini thumbnail */}
        <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          <img
            src={coverImage || `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&q=60`}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=60'; }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm font-bold leading-snug pr-1"
              style={{ color: '#1B3A8C', cursor: 'pointer' }}
              onClick={handleVisit}
            >
              {title}
            </h3>
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {available ? '● Available' : '● Full'}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{type}</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 mb-2">
        <MapPin size={11} color="#718096" />
        <span className="text-xs" style={{ color: '#4A5568' }}>{area}</span>
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-extrabold" style={{ color: '#1A202C' }}>
            ₹{rent.toLocaleString('en-IN')}
          </span>
          <span className="text-xs" style={{ color: '#718096' }}>/mo</span>
          {!brokerage && (
            <span className="ml-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              No Brokerage
            </span>
          )}
        </div>
        <div className="flex items-center gap-1" style={{ color: '#A0AEC0' }}>
          <Eye size={11} />
          <span className="text-xs">{views}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <span className="badge" style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}>
          {gender}
        </span>
        {tags.filter(t => t !== gender).slice(0, 2).map(tag => (
          <span key={tag} className="badge" style={{ background: '#F7F8FC', color: '#4A5568', borderColor: '#E2E8F0' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Visit button */}
      <button
        onClick={handleVisit}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-blue-50"
        style={{ color: '#1B3A8C', borderColor: '#C5D9FF', background: '#EBF2FF' }}
      >
        <ExternalLink size={12} />
        View Full Details
      </button>
    </div>
  );
}
