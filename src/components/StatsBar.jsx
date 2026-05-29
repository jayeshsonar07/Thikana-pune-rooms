import { Eye, Building2, AlertCircle } from 'lucide-react';

export default function StatsBar({ listings }) {
  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);
  const active = listings.filter(l => l.available).length;
  const full = listings.filter(l => !l.available).length;

  const stats = [
    { label: 'Total Views',        value: totalViews.toLocaleString('en-IN'), icon: Eye,         color: '#2557a7', bg: '#e7f0fe', border: '#c7d7f0' },
    { label: 'Active Listings',    value: active,                             icon: Building2,   color: '#2d8653', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Full / Unavailable', value: full,                               icon: AlertCircle, color: '#cc1f1a', bg: '#fff1f0', border: '#fca5a5' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
        <div
          key={label}
          className="bg-white border border-[#d4d2d0] rounded p-4 flex items-center gap-3 shadow-card"
        >
          <div
            className="w-10 h-10 rounded flex items-center justify-center shrink-0"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <div>
            <p className="text-xl font-bold text-[#2d2d2d]">{value}</p>
            <p className="text-xs text-[#767676]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
