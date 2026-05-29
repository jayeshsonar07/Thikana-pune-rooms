import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, ExternalLink, CheckCircle2, XCircle,
  MessageCircle, Heart, Share2, ChevronLeft, ChevronRight,
  Wifi, Waves, Droplets, Shirt, Car, UtensilsCrossed,
  Zap, Shield, Wind, BookOpen, Phone, Calendar, Eye
} from 'lucide-react';
import { getListingById } from '../services/db';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
];

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function loadListing() {
      const data = await getListingById(id);
      setListing(data);
      setLoading(false);
    }
    loadListing();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mb-3"></div>
        <p className="font-semibold" style={{ color: '#4A5568' }}>Loading property details...</p>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: '#1A202C' }}>Listing not found</p>
          <button onClick={() => navigate('/home')} className="btn-primary mt-4">Back to Search</button>
        </div>
      </div>
    </div>
  );

  const {
    title, address, mapsUrl, rent, deposit, brokerage, amenities, rules,
    contact, ownerName, description, roomTypes, foodIncluded,
    images, coverImage, available, type, area, gender, views, postedDate
  } = listing;

  const imgs = (images?.length > 0 ? images : []).concat(PLACEHOLDER_IMGS).slice(0, 4);
  const whatsappMsg = encodeURIComponent(`Hi! I found "${title}" on Thikana. Is it available?`);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-2 text-sm" style={{ color: '#718096' }}>
          <button onClick={() => navigate('/home')} className="hover:text-brand flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} />
            Search Results
          </button>
          <span>›</span>
          <span style={{ color: '#1A202C', fontWeight: 600 }}>{title}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Main content (2/3) ─────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image Gallery */}
            <div className="card rounded-xl overflow-hidden">
              <div className="relative" style={{ height: 320 }}>
                <img
                  key={imgIdx}
                  src={imgs[imgIdx]}
                  alt={title}
                  className="w-full h-full object-cover anim-fade"
                  onError={e => { e.target.src = PLACEHOLDER_IMGS[0]; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Availability */}
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {available ? '✓ Available' : '✗ Fully Occupied'}
                  </span>
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setLiked(l => !l)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white">
                    <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white">
                    <Share2 size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Prev/Next */}
                {imgs.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setImgIdx(i => Math.min(imgs.length - 1, i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 p-3 bg-white">
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className="w-16 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all"
                    style={{ borderColor: i === imgIdx ? '#1B3A8C' : '#E2E8F0' }}>
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={e => { e.target.src = PLACEHOLDER_IMGS[0]; }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Address */}
            <div className="card rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1B3A8C' }}>
                    {type} · {area}
                  </span>
                  <h1 className="text-2xl font-extrabold mt-1" style={{ color: '#1A202C' }}>{title}</h1>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>
                    ₹{rent.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs" style={{ color: '#718096' }}>per month</p>
                </div>
              </div>
              <a href={mapsUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 group hover:underline"
                style={{ color: '#1B3A8C' }}>
                <MapPin size={14} />
                <span className="text-sm">{address}</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: '#A0AEC0' }}>
                <span className="flex items-center gap-1"><Eye size={12} />{views} views</span>
                <span className="flex items-center gap-1"><Calendar size={12} />Posted {new Date(postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Financial strip */}
            <div className="card rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 divide-x" style={{ divideColor: '#E2E8F0' }}>
                {[
                  { label: 'Security Deposit', value: `₹${deposit.toLocaleString('en-IN')}`, color: '#1A202C' },
                  { label: 'Brokerage',        value: brokerage ? 'Required' : 'None ✓',     color: brokerage ? '#DC2626' : '#0F9D58' },
                  { label: 'Food',             value: foodIncluded ? 'Included ✓' : 'Not Included', color: foodIncluded ? '#0F9D58' : '#718096' },
                ].map((item, i) => (
                  <div key={item.label} className="p-4 text-center bg-white" style={{ borderRight: i < 2 ? '1px solid #E2E8F0' : 'none' }}>
                    <p className="text-xs mb-1" style={{ color: '#718096' }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card rounded-xl p-5">
              <h2 className="text-base font-bold mb-3" style={{ color: '#1A202C' }}>About this Property</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#4A5568' }}>{description}</p>
              {roomTypes?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#718096' }}>Room Options</p>
                  <div className="flex flex-wrap gap-2">
                    {roomTypes.map(r => (
                      <span key={r} className="text-sm px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: '#EBF2FF', color: '#1B3A8C', border: '1px solid #C5D9FF' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="card rounded-xl p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: '#1A202C' }}>Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map(item => (
                  <div key={item} className="flex items-center gap-2.5 p-2.5 rounded-lg"
                    style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <CheckCircle2 size={15} color="#0F9D58" className="shrink-0" />
                    <span className="text-xs font-medium" style={{ color: '#166534' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="card rounded-xl p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: '#1A202C' }}>House Rules</h2>
              <div className="space-y-2">
                {rules.map(rule => (
                  <div key={rule} className="flex items-start gap-2.5 p-2.5 rounded-lg"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <XCircle size={15} color="#DC2626" className="shrink-0 mt-0.5" />
                    <span className="text-xs font-medium" style={{ color: '#991B1B' }}>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar (1/3) ─────────────── */}
          <div className="space-y-4">

            {/* WhatsApp CTA */}
            <div className="card rounded-xl p-5 sticky top-20">
              {/* Owner */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold"
                  style={{ background: '#1B3A8C' }}>
                  {ownerName[0]}
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#718096' }}>Property Owner</p>
                  <p className="text-sm font-bold" style={{ color: '#1A202C' }}>{ownerName}</p>
                </div>
              </div>

              <div className="divider" />

              <a href={`https://wa.me/91${contact}?text=${whatsappMsg}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3 shadow hover:shadow-md active:scale-[0.99] transition-all"
                style={{ background: '#25D366' }}>
                <MessageCircle size={18} fill="white" strokeWidth={0} />
                Chat on WhatsApp
              </a>
              <button className="btn-secondary w-full text-sm gap-2 flex">
                <Phone size={15} />
                Request Callback
              </button>

              <div className="divider" />

              {/* Quick facts */}
              <div className="space-y-2">
                {[
                  { label: 'Monthly Rent', value: `₹${rent.toLocaleString('en-IN')}` },
                  { label: 'Deposit',      value: `₹${deposit.toLocaleString('en-IN')}` },
                  { label: 'For',          value: gender },
                  { label: 'Brokerage',    value: brokerage ? 'Yes' : 'None' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span style={{ color: '#718096' }}>{label}</span>
                    <span className="font-semibold" style={{ color: '#1A202C' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
