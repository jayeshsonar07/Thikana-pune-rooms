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
      style={{ background: 'white' }}
    >
      {/* Logo */}
      <div className="splash-logo relative z-10 mb-6">
        <img
          src={logo}
          alt="Thikana"
          style={{ height: 160, width: 'auto', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(27,58,140,0.15))' }}
          draggable={false}
        />
      </div>

      {/* Loading dots */}
      {phase >= 1 && (
        <div className="anim-fade flex gap-2 mt-8 z-10">
          {DOTS.map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full"
              style={{ background: '#1B3A8C', opacity: 0.4 + i * 0.3, animation: `shimmerPulse 0.8s ease ${i * 0.2}s infinite` }} />
          ))}
        </div>
      )}

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: '#F7F8FC' }}>
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${progress}%`,
            background: '#1B3A8C',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}
