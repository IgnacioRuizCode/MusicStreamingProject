import { useEffect, useState } from 'react';
import { Disc3 } from 'lucide-react';
import './SplashScreen.css';

export function SplashScreen() {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fadeTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 950);

    const unmountTimer = window.setTimeout(() => {
      setVisible(false);
    }, 1350);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`codify-splash${leaving ? ' is-leaving' : ''}`}
      aria-hidden="true"
    >
      <div className="codify-splash__glow" />
      <div className="codify-splash__brand">
        <div className="codify-splash__icon">
          <Disc3 size={40} strokeWidth={2.2} />
        </div>
        <span className="codify-splash__name">CODIFY</span>
        <div className="codify-splash__bars">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}