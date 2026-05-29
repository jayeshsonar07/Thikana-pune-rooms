import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const DOTS = [0, 1, 2];

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=logo, 1=tagline, 2=done

  useEffect(() => {
    // Progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 100 / 26; // reaches 100 in ~2.6s
      });
    }, 100);

    // Phase transitions
    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => navigate('/home'), 3000);

    return () => { clearInterval(interval); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F2460 0%, #1B3A8C 50%, #2557C2 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'white', top: '-150px', left: '-150px' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: 'white', bottom: '-120px', right: '-120px' }} />
      <div className="absolute w-[200px] h-[200px] rounded-full opacity-5"
        style={{ background: 'white', top: '40%', left: '10%' }} />

      {/* Logo */}
      <div className="splash-logo relative z-10 mb-6">
        {/* Glow ring */}
        <div className="absolute inset-[-20px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }} />
        {/* White pill background */}
        <div className="px-10 py-6 rounded-3xl" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <img
            src={logo}
            alt="Thikana"
            style={{ height: 90, width: 'auto', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
            draggable={false}
          />
        </div>
      </div>

      {/* Tagline */}
      {phase >= 1 && (
        <div className="anim-fade-up z-10 text-center px-6">
          <p className="text-white text-lg font-medium tracking-wide mb-1 opacity-90">
            शोध संपला, 'ठिकाणा' मिळाला.
          </p>
          <p className="text-blue-200 text-sm tracking-widest uppercase">
            Rooms · PGs · Flats · Hostels
          </p>
        </div>
      )}

      {/* Loading dots */}
      {phase >= 2 && (
        <div className="anim-fade flex gap-2 mt-8 z-10">
          {DOTS.map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-white"
              style={{ opacity: 0.4 + i * 0.3, animation: `shimmerPulse 0.8s ease ${i * 0.2}s infinite` }} />
          ))}
        </div>
      )}

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.6), white)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}
