import { X } from 'lucide-react';
import DetailPane from './DetailPane';

export default function MobileDetailModal({ listing, onClose }) {
  if (!listing) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="bs-overlay"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="bs-sheet">
        {/* Handle bar row */}
        <div className="relative flex items-center justify-end px-4 pt-3 pb-2"
          style={{ borderBottom: '1px solid #E2E8F0' }}>
          {/* Drag handle */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-2 h-1 rounded-full"
            style={{ width: 40, background: '#CBD5E0' }}
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: '#F7F8FC' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EBF2FF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F7F8FC'; }}
          >
            <X size={15} color="#4A5568" />
          </button>
        </div>

        {/* Detail content */}
        <DetailPane listing={listing} />
      </div>
    </>
  );
}
