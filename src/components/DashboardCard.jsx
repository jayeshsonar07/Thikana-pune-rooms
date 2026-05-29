import { MapPin, Eye, Edit3, Trash2 } from 'lucide-react';
import VacancyToggle from './VacancyToggle';
import { useNavigate } from 'react-router-dom';

export default function DashboardCard({ listing, onToggle, onDelete }) {
  const navigate = useNavigate();
  const { id, title, area, rent, available, views, coverImage, type, brokerage } = listing;

  return (
    <div className="bg-white border border-[#d4d2d0] rounded shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Vacancy toggle */}
        <div className="absolute bottom-2 left-2 bg-white/95 rounded px-2.5 py-1.5">
          <VacancyToggle available={available} onChange={val => onToggle(id, val)} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs font-semibold text-[#2557a7] uppercase tracking-wider mb-1">{type}</p>
        <h3 className="font-semibold text-[#2d2d2d] text-sm mb-1 leading-snug line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1 text-[#767676] mb-3">
          <MapPin size={12} />
          <span className="text-xs">{area}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-base font-bold text-[#2d2d2d]">₹{rent.toLocaleString('en-IN')}</span>
            <span className="text-xs text-[#767676]">/mo</span>
          </div>
          <div className="flex items-center gap-1 text-[#767676]">
            <Eye size={12} />
            <span className="text-xs">{views} views</span>
          </div>
        </div>

        <div className="indeed-divider" />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/edit-listing/${id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2557a7] border border-[#2557a7] py-2 rounded hover:bg-[#e7f0fe] transition-colors"
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#cc1f1a] border border-[#cc1f1a] py-2 rounded hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
