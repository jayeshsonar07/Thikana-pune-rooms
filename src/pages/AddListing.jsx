import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Plus, X,
  Wifi, Car, Wind, Waves, Droplets, Shirt,
  UtensilsCrossed, Zap, Shield, MonitorSpeaker, BookOpen,
  MapPin, Camera, Info
} from 'lucide-react';
import PhotoUploadZone from '../components/PhotoUploadZone';
import { listings } from '../data/mockListings';
import { addListing } from '../services/db';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

/* ── Amenity options ────────────────────────── */
const PRESET_AMENITIES = [
  { key: 'wifi',    label: 'High-Speed WiFi',   icon: Wifi },
  { key: 'ac',      label: 'AC Room',            icon: Wind },
  { key: 'geyser',  label: 'Geyser',             icon: Waves },
  { key: 'ro',      label: 'RO Water',           icon: Droplets },
  { key: 'laundry', label: 'Washing Machine',    icon: Shirt },
  { key: 'parking', label: 'Parking',            icon: Car },
  { key: 'food',    label: 'Food Included',      icon: UtensilsCrossed },
  { key: 'power',   label: 'Power Backup',       icon: Zap },
  { key: 'cctv',    label: 'CCTV Security',      icon: Shield },
  { key: 'tv',      label: 'TV / Entertainment', icon: MonitorSpeaker },
  { key: 'study',   label: 'Study Room',         icon: BookOpen },
];

const STEPS = [
  { label: 'Basic Info',  icon: Info },
  { label: 'Amenities',  icon: Check },
  { label: 'Photos & Location', icon: Camera },
];

/* ── Step indicator ─────────────────────────── */
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map(({ label }, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: done ? '#0F9D58' : active ? '#1B3A8C' : '#E2E8F0',
                  color: done || active ? 'white' : '#A0AEC0',
                  boxShadow: active ? '0 0 0 4px rgba(27,58,140,0.15)' : 'none',
                }}
              >
                {done ? <Check size={15} /> : i + 1}
              </div>
              <span
                className="text-[11px] font-semibold whitespace-nowrap hidden sm:block"
                style={{ color: active ? '#1B3A8C' : done ? '#0F9D58' : '#A0AEC0' }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="step-connector"
                style={{ background: done ? '#0F9D58' : '#E2E8F0' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main component ─────────────────────────── */
export default function AddListing({ editMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = editMode ? listings.find(l => l.id === Number(id)) : null;

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Initial form state */
  const [form, setForm] = useState({
    title:       existing?.title       || '',
    type:        existing?.type        || 'Boys PG',
    area:        existing?.area        || '',
    address:     existing?.address     || '',
    rent:        existing?.rent        || '',
    deposit:     existing?.deposit     || '',
    brokerage:   existing?.brokerage   ?? false,
    gender:      existing?.gender      || 'Any',
    foodIncluded:existing?.foodIncluded ?? false,
    contact:     existing?.contact     || '',
    description: existing?.description || '',
    // Amenity toggles
    amenities: Object.fromEntries(PRESET_AMENITIES.map(a => [a.key, false])),
    // Custom amenities list
    customAmenities: [],
    // Location
    mapsUrl: existing?.mapsUrl || '',
    // Rules (one per line)
    rules: existing?.rules?.join('\n') || '',
    // Room types
    roomTypes: existing?.roomTypes?.join('\n') || '',
    // Vacancy
    totalRooms:  existing?.totalRooms  || '',
    notice:      existing?.notice      || '',
    petPolicy:   existing?.petPolicy   || 'No pets allowed',
  });

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleAmenity = (key) => upd('amenities', { ...form.amenities, [key]: !form.amenities[key] });

  const addCustomAmenity = () => {
    const val = customAmenity.trim();
    if (!val || form.customAmenities.includes(val)) return;
    upd('customAmenities', [...form.customAmenities, val]);
    setCustomAmenity('');
  };

  const removeCustom = (i) =>
    upd('customAmenities', form.customAmenities.filter((_, idx) => idx !== i));

  const selectedCount = Object.values(form.amenities).filter(Boolean).length + form.customAmenities.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return; // Only submit on last step
    
    setIsSubmitting(true);
    try {
      const selectedAmenities = Object.keys(form.amenities)
        .filter(k => form.amenities[k])
        .map(k => PRESET_AMENITIES.find(p => p.key === k)?.label);
        
      const allAmenities = [...selectedAmenities, ...form.customAmenities];

      const listingData = {
        title: form.title,
        type: form.type,
        area: form.area,
        address: form.address,
        rent: Number(form.rent),
        deposit: Number(form.deposit),
        brokerage: form.brokerage,
        gender: form.gender,
        foodIncluded: form.foodIncluded,
        contact: form.contact,
        description: form.description,
        amenities: allAmenities,
        rules: form.rules.split('\n').filter(Boolean),
        roomTypes: form.roomTypes.split('\n').filter(Boolean),
        mapsUrl: form.mapsUrl,
        available: true,
        views: 0,
        ownerName: 'Rekha Patil', // Mocked authenticated user
        coverImage: photos[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
        images: photos.map(p => p.url)
      };

      if (!editMode) {
        await addListing(listingData);
      }
      
      alert(editMode ? '✓ Listing updated!' : '✓ Listing published! It will appear in search soon.');
      navigate('/profile');
    } catch (error) {
      alert('Error saving listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Shared label component */
  const Label = ({ text, required, hint }) => (
    <div className="mb-1.5">
      <label className="form-label mb-0">
        {text}{required && <span style={{ color: '#DC2626' }} className="ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs mt-0.5" style={{ color: '#A0AEC0' }}>{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FC' }}>
      {/* ── Header ─────────────────────────────── */}
      <header className="bg-white sticky top-0 z-30"
        style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          <button onClick={() => navigate(editMode ? '/dashboard' : '/home')}
            className="flex items-center gap-1.5 text-sm font-semibold hover:underline"
            style={{ color: '#1B3A8C' }}>
            <ArrowLeft size={15} />
            {editMode ? 'Dashboard' : 'Cancel'}
          </button>
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Thikana"
              style={{ height: 46, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(27,58,140,0.12))' }} />
          </div>
          <div className="w-16 text-right">
            <span className="text-xs font-semibold" style={{ color: '#A0AEC0' }}>
              {step + 1} / {STEPS.length}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 w-full flex-1">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold" style={{ color: '#1A202C' }}>
            {editMode ? 'Edit Listing' : 'Post a Property'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#718096' }}>
            {editMode ? 'Update the details of your listing' : 'Fill in the details to list your PG, Hostel, or Flat on Thikana'}
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        <form onSubmit={handleSubmit}>
          {/* ══ STEP 1: Basic Info ══════════════════ */}
          {step === 0 && (
            <div className="card rounded-2xl p-6 mb-5 space-y-5 anim-fade-up">
              <h2 className="text-base font-bold pb-3" style={{ color: '#1A202C', borderBottom: '1px solid #E2E8F0' }}>
                Basic Property Information
              </h2>

              {/* Title */}
              <div>
                <Label text="Property Title" required />
                <input className="form-input" type="text" placeholder="e.g., Rakhumai Girls' Hostel"
                  value={form.title} onChange={e => upd('title', e.target.value)} required />
              </div>

              {/* Type + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label text="Property Type" required />
                  <select className="form-input" value={form.type} onChange={e => upd('type', e.target.value)}>
                    {['Boys PG', 'Girls PG', 'Boys Hostel', 'Girls Hostel', 'Flat / Apartment', 'Studio Flat', 'Co-living', 'Room'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label text="Allowed For" required />
                  <select className="form-input" value={form.gender} onChange={e => upd('gender', e.target.value)}>
                    {['Boys Only', 'Girls Only', 'Family / Any', 'Any'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Area + Address */}
              <div>
                <Label text="Area / Locality" required />
                <input className="form-input" type="text" placeholder="e.g., Katraj, Pune"
                  value={form.area} onChange={e => upd('area', e.target.value)} required />
              </div>
              <div>
                <Label text="Full Address" hint="This helps tenants find you easily" />
                <input className="form-input" type="text" placeholder="Building/Plot No., Street, Area, Pincode"
                  value={form.address} onChange={e => upd('address', e.target.value)} />
              </div>

              {/* Rent + Deposit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label text="Monthly Rent (₹)" required />
                  <input className="form-input" type="number" placeholder="5000"
                    value={form.rent} onChange={e => upd('rent', e.target.value)} required min={0} />
                </div>
                <div>
                  <Label text="Security Deposit (₹)" required />
                  <input className="form-input" type="number" placeholder="10000"
                    value={form.deposit} onChange={e => upd('deposit', e.target.value)} required min={0} />
                </div>
              </div>

              {/* Total rooms + Notice */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label text="Total Rooms" hint="How many rooms in total?" />
                  <input className="form-input" type="number" placeholder="10"
                    value={form.totalRooms} onChange={e => upd('totalRooms', e.target.value)} min={1} />
                </div>
                <div>
                  <Label text="Notice Period" />
                  <input className="form-input" type="text" placeholder="1 month"
                    value={form.notice} onChange={e => upd('notice', e.target.value)} />
                </div>
              </div>

              {/* Toggles row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'brokerage',    label: 'Brokerage Required', sub: 'Off = "No Brokerage" badge shown' },
                  { key: 'foodIncluded', label: 'Food Included',       sub: 'Meals provided to tenants' },
                ].map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between p-3.5 rounded-xl"
                    style={{ background: '#F7F8FC', border: '1px solid #E2E8F0' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#2D3748' }}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#A0AEC0' }}>{sub}</p>
                    </div>
                    <button type="button" onClick={() => upd(key, !form[key])}
                      className={`toggle-track ${form[key] ? 'on' : 'off'}`}>
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <Label text="Description" />
                <textarea className="form-input resize-none" rows={3}
                  placeholder="Describe your property — location, nearby landmarks, special features..."
                  value={form.description} onChange={e => upd('description', e.target.value)} />
              </div>

              {/* Room types */}
              <div>
                <Label text="Room Options (one per line)" hint="e.g., Single – ₹5,000 | Double – ₹3,500/person" />
                <textarea className="form-input resize-none" rows={2}
                  value={form.roomTypes} onChange={e => upd('roomTypes', e.target.value)}
                  placeholder={"Single Sharing – ₹5,000\nDouble Sharing – ₹3,500/person"} />
              </div>

              {/* House rules */}
              <div>
                <Label text="House Rules (one per line)" />
                <textarea className="form-input resize-none" rows={3}
                  value={form.rules} onChange={e => upd('rules', e.target.value)}
                  placeholder={"No smoking/drinking\nGuests allowed till 9PM\nGate closes at 11PM"} />
              </div>

              {/* WhatsApp */}
              <div>
                <Label text="Your WhatsApp Number" required />
                <div className="flex gap-0 overflow-hidden rounded-lg"
                  style={{ border: '1.5px solid #E2E8F0' }}>
                  <span className="flex items-center px-3 text-sm font-semibold shrink-0"
                    style={{ background: '#F7F8FC', color: '#4A5568', borderRight: '1px solid #E2E8F0' }}>+91</span>
                  <input type="tel" placeholder="9876543210" maxLength={10}
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                    value={form.contact} onChange={e => upd('contact', e.target.value)} required />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2: Amenities ══════════════════ */}
          {step === 1 && (
            <div className="card rounded-2xl p-6 mb-5 anim-fade-up">
              <h2 className="text-base font-bold pb-3 mb-4" style={{ color: '#1A202C', borderBottom: '1px solid #E2E8F0' }}>
                Amenities & Facilities
              </h2>
              <p className="text-sm mb-5" style={{ color: '#718096' }}>
                Properties with more amenities get significantly more inquiries. Select all that apply.
              </p>

              {/* Preset amenities grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                {PRESET_AMENITIES.map(({ key, label, icon: Icon }) => {
                  const checked = form.amenities[key];
                  return (
                    <button type="button" key={key} onClick={() => toggleAmenity(key)}
                      className="flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 text-left transition-all"
                      style={{
                        borderColor: checked ? '#1B3A8C' : '#E2E8F0',
                        background:  checked ? '#EBF2FF' : 'white',
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: checked ? '#1B3A8C' : '#F7F8FC' }}>
                        <Icon size={15} color={checked ? 'white' : '#A0AEC0'} />
                      </div>
                      <span className="text-xs font-semibold leading-tight"
                        style={{ color: checked ? '#1B3A8C' : '#4A5568' }}>
                        {label}
                      </span>
                      {checked && <Check size={13} color="#1B3A8C" className="ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom amenities */}
              <div>
                <Label text="Add Custom Amenity" hint="Anything not in the list above" />
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    className="form-input flex-1"
                    placeholder="e.g., Swimming Pool, Rooftop Terrace..."
                    value={customAmenity}
                    onChange={e => setCustomAmenity(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); }}}
                  />
                  <button type="button" onClick={addCustomAmenity}
                    className="btn-secondary flex items-center gap-1.5 shrink-0">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {form.customAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.customAmenities.map((item, i) => (
                      <span key={i}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: '#EBF2FF', color: '#1B3A8C', border: '1px solid #C5D9FF' }}>
                        {item}
                        <button type="button" onClick={() => removeCustom(i)}>
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Counter */}
              <div className="mt-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{ background: '#EBF2FF', color: '#1B3A8C', border: '1px solid #C5D9FF' }}>
                <Check size={16} />
                {selectedCount} amenit{selectedCount === 1 ? 'y' : 'ies'} selected
              </div>
            </div>
          )}

          {/* ══ STEP 3: Photos & Location ═══════════ */}
          {step === 2 && (
            <div className="space-y-4 anim-fade-up">
              {/* Photos card */}
              <div className="card rounded-2xl p-6">
                <h2 className="text-base font-bold pb-3 mb-2" style={{ color: '#1A202C', borderBottom: '1px solid #E2E8F0' }}>
                  Property Photos
                </h2>
                <p className="text-xs mb-4" style={{ color: '#718096' }}>
                  You can add up to <strong>6 photos</strong>. The first photo will be the cover shown in search.
                  High-quality photos get <strong>5× more inquiries</strong>.
                </p>
                <PhotoUploadZone photos={photos} setPhotos={setPhotos} maxPhotos={6} />
              </div>

              {/* Location card */}
              <div className="card rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold pb-3" style={{ color: '#1A202C', borderBottom: '1px solid #E2E8F0' }}>
                  Location Details
                </h2>

                <div>
                  <Label text="Google Maps Link" hint="Open Google Maps → find your property → share → copy link" />
                  <div className="flex gap-0 overflow-hidden rounded-lg" style={{ border: '1.5px solid #E2E8F0' }}>
                    <span className="flex items-center px-3 shrink-0" style={{ background: '#F7F8FC', borderRight: '1px solid #E2E8F0' }}>
                      <MapPin size={15} color="#1B3A8C" />
                    </span>
                    <input
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                      type="url"
                      placeholder="https://maps.google.com/?q=your+property"
                      value={form.mapsUrl}
                      onChange={e => upd('mapsUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label text="Pet Policy" />
                  <select className="form-input" value={form.petPolicy} onChange={e => upd('petPolicy', e.target.value)}>
                    {['No pets allowed', 'Small pets allowed', 'All pets welcome', 'Pets negotiable'].map(opt => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary card */}
              <div className="card rounded-2xl overflow-hidden">
                <div className="px-5 py-3" style={{ background: '#1B3A8C' }}>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Listing Summary</p>
                </div>
                <div className="divide-y" style={{ divideColor: '#F0F0F0' }}>
                  {[
                    { label: 'Title',      value: form.title || '—' },
                    { label: 'Type',       value: form.type  || '—' },
                    { label: 'Area',       value: form.area  || '—' },
                    { label: 'Rent',       value: form.rent  ? `₹${Number(form.rent).toLocaleString('en-IN')}/month` : '—', blue: true },
                    { label: 'Deposit',    value: form.deposit ? `₹${Number(form.deposit).toLocaleString('en-IN')}` : '—' },
                    { label: 'Amenities',  value: `${selectedCount} selected` },
                    { label: 'Photos',     value: `${photos.length} uploaded` },
                    { label: 'Contact',    value: form.contact ? `+91 ${form.contact}` : '—' },
                  ].map(({ label, value, blue }) => (
                    <div key={label} className="flex justify-between items-center px-5 py-3">
                      <span className="text-xs" style={{ color: '#718096' }}>{label}</span>
                      <span className="text-sm font-semibold" style={{ color: blue ? '#1B3A8C' : '#1A202C' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ───────────────── */}
          <div className="flex gap-3 mt-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="btn-secondary flex items-center gap-2">
                <ArrowLeft size={14} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(s => s + 1)}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next: {STEPS[step + 1].label} <ArrowRight size={14} />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                <Check size={15} />
                {isSubmitting ? 'Saving...' : editMode ? 'Save Changes' : 'Publish Listing'}
              </button>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
