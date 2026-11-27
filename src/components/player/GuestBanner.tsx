import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import './GuestBanner.css';

export function GuestBanner() {
  return (
    <section className="guest-banner" aria-label="Muestra de Codify">
      <div className="guest-banner__info">
        <span className="guest-banner__icon" aria-hidden="true">
          <Music2 size={22} />
        </span>
        <p className="guest-banner__text">
          Muestra de Codify — Registrate para disfrutar de canciones y playlists
          sin límites
        </p>
      </div>

      <Link to="/register" className="guest-banner__cta">
        Registrate gratis
      </Link>
    </section>
  );
}
