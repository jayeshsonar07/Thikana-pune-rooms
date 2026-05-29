import {
  MapPin, ExternalLink, CheckCircle2, XCircle, MessageCircle,
  ChevronLeft, ChevronRight, Share2, Heart, Eye, Calendar
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
];

export default function DetailPane({ listing }) {
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!listing) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-8" style={{ background: '#F7F8FC' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#EBF2FF' }}>
          <MapPin size={32} color="#1B3A8C" />
        </div>
        <div className="text-center">
          <p className="font-bold text-base" style={{ color: '#2D3748' }}>Select a property</p>
          <p className="text-sm mt-1" style={{ color: '#A0AEC0' }}>Click any listing on the left to view details</p>
        </div>
      </div>
    );
  }

  const {
    id, title, address, mapsUrl, rent, deposit, brokerage,
    amenities, rules, contact, ownerName, description,
    roomTypes, foodIncluded, images, coverImage, available, type, area, views, postedDate
  } = listing;

  // Always have images — use placeholders if needed
  const imgs = [...(images || [coverImage].filter(Boolean)), ...PLACEHOLDER_IMGS].slice(0, 4);
  const whatsappMsg = encodeURIComponent(`Hi! I found "${title}" on Thikana. Is it available?`);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">

      {/* ── Image carousel ───────────────────── */}
      <div className="relative shrink-0 bg-gray-100 overflow-hidden" style={{ height: 240 }}>
        <img
          key={imgIdx}
          src={imgs[imgIdx]}
          alt={title}
          className="w-full h-full object-cover anim-fade"
          onError={e => { e.target.src = PLACEHOLDER_IMGS[0]; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Availability */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {available ? '✓ Available' : '✗ Full'}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button onClick={() => setLiked(l => !l)}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
            <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
            <Share2 size={13} className="text-gray-600" />
          </button>
        </div>

        {/* Prev/Next */}
        {imgs.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setImgIdx(i => Math.min(imgs.length - 1, i + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow">
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {imgs.map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === imgIdx ? 16 : 6, background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 px-4 py-2.5 border-b" style={{ borderColor: '#E2E8F0', background: '#FAFAFA' }}>
        {imgs.map((img, i) => (
          <button key={i} onClick={() => setImgIdx(i)}
            className="w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all"
            style={{ borderColor: i === imgIdx ? '#1B3A8C' : '#E2E8F0' }}>
            <img src={img} alt="" className="w-full h-full object-cover"
              onError={e => { e.target.src = PLACEHOLDER_IMGS[0]; }} />
          </button>
        ))}
      </div>

      {/* ── Content ──────────────────────────── */}
      <div className="flex-1 px-5 pt-4 pb-24 space-y-4">

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1B3A8C' }}>{type} · {area}</span>
              <h1 className="text-lg font-extrabold mt-0.5 leading-tight" style={{ color: '#1A202C' }}>{title}</h1>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-extrabold" style={{ color: '#1A202C' }}>₹{rent.toLocaleString('en-IN')}</p>
              <p className="text-xs" style={{ color: '#718096' }}>per month</p>
            </div>
          </div>

          <a href={mapsUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-1.5 hover:underline" style={{ color: '#1B3A8C' }}>
            <MapPin size={12} />
            <span className="text-xs">{address}</span>
            <ExternalLink size={10} />
          </a>

          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#A0AEC0' }}>
            <span className="flex items-center gap-1"><Eye size={11} />{views} views</span>
          </div>
        </div>

        {/* Financial strip */}
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border" style={{ borderColor: '#E2E8F0' }}>
          {[
            { label: 'Deposit', value: `₹${deposit.toLocaleString('en-IN')}`, color: '#1A202C' },
            { label: 'Brokerage', value: brokerage ? 'Required' : 'None ✓', color: brokerage ? '#DC2626' : '#0F9D58' },
            { label: 'Food', value: foodIncluded ? 'Included ✓' : 'Not Incl.', color: foodIncluded ? '#0F9D58' : '#718096' },
          ].map((item, i) => (
            <div key={item.label} className="p-3 text-center" style={{ background: '#FAFAFA', borderRight: i < 2 ? '1px solid #E2E8F0' : 'none' }}>
              <p className="text-[10px] mb-1" style={{ color: '#718096' }}>{item.label}</p>
              <p className="text-xs font-bold" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#718096' }}>About</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#4A5568' }}>{description}</p>
        </div>

        {/* Room types */}
        {roomTypes?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#718096' }}>Room Options</h2>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map(r => (
                <span key={r} className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: '#EBF2FF', color: '#1B3A8C', border: '1px solid #C5D9FF' }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Amenities */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#718096' }}>Amenities</h2>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map(item => (
              <div key={item} className="flex items-center gap-2 p-2 rounded-lg"
                style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <CheckCircle2 size={13} color="#0F9D58" />
                <span className="text-xs font-medium" style={{ color: '#166534' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Rules */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#718096' }}>House Rules</h2>
          <div className="space-y-1.5">
            {rules.map(rule => (
              <div key={rule} className="flex items-start gap-2 p-2 rounded-lg"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <XCircle size={13} color="#DC2626" className="shrink-0 mt-0.5" />
                <span className="text-xs font-medium" style={{ color: '#991B1B' }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Vacancy info (Telegram-style) */}
        {(listing.totalRooms || listing.nearbyLandmarks?.length > 0 || listing.notice) && (
          <>
            <div className="divider" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#718096' }}>
                Vacancy & Policy Info
              </h2>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#E2E8F0' }}>
                {listing.totalRooms && (
                  <div className="flex justify-between items-center px-4 py-3" style={{ borderBottom: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                    <span className="text-xs" style={{ color: '#718096' }}>Rooms Available</span>
                    <span className="text-xs font-bold" style={{ color: listing.vacantRooms > 0 ? '#0F9D58' : '#DC2626' }}>
                      {listing.vacantRooms} / {listing.totalRooms} rooms
                    </span>
                  </div>
                )}
                {listing.notice && (
                  <div className="flex justify-between items-center px-4 py-3" style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <span className="text-xs" style={{ color: '#718096' }}>Notice Period</span>
                    <span className="text-xs font-semibold" style={{ color: '#1A202C' }}>{listing.notice}</span>
                  </div>
                )}
                {listing.petPolicy && (
                  <div className="flex justify-between items-center px-4 py-3" style={{ borderBottom: listing.nearbyLandmarks?.length > 0 ? '1px solid #F0F0F0' : 'none' }}>
                    <span className="text-xs" style={{ color: '#718096' }}>Pet Policy</span>
                    <span className="text-xs font-semibold" style={{ color: '#1A202C' }}>{listing.petPolicy}</span>
                  </div>
                )}
                {listing.nearbyLandmarks?.length > 0 && (
                  <div className="px-4 py-3">
                    <span className="text-xs mb-2 block" style={{ color: '#718096' }}>Nearby Landmarks</span>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.nearbyLandmarks.map(lm => (
                        <span key={lm} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                          style={{ background: '#EBF2FF', color: '#1B3A8C', border: '1px solid #C5D9FF' }}>
                          📍 {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="divider" />

        {/* Owner */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F7F8FC', border: '1px solid #E2E8F0' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: '#1B3A8C' }}>{ownerName[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: '#718096' }}>Listed by</p>
            <p className="text-sm font-bold" style={{ color: '#1A202C' }}>{ownerName}</p>
          </div>
          <button onClick={() => navigate(`/listing/${id}`)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50"
            style={{ color: '#1B3A8C', borderColor: '#C5D9FF' }}>
            Full Details →
          </button>
        </div>
      </div>

      {/* ── Sticky CTA ───────────────────────── */}
      <div className="sticky bottom-0 bg-white px-4 py-3 border-t" style={{ borderColor: '#E2E8F0' }}>
        <a href={`https://wa.me/91${contact}?text=${whatsappMsg}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-white text-sm shadow hover:shadow-md active:scale-[0.99] transition-all"
          style={{ background: '#25D366' }}>
          <MessageCircle size={17} fill="white" strokeWidth={0} />
          Chat with Owner on WhatsApp
        </a>
      </div>
    </div>
  );
}
