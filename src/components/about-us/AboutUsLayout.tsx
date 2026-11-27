import { Link, Outlet, useLocation } from 'react-router-dom';
import './AboutUsLayout.css';

export function AboutUsLayout() {
  const ubicacion = useLocation();
  const enNosotros = ubicacion.pathname === '/nosotros';

  return (
    <div className="about-layout">
      <header className="about-layout__navbar">
        <Link className="about-layout__brand" to="/">CODIFY</Link>
        <nav aria-label="Navegación principal">
          <ul className="about-layout__nav-list">
            <li><Link to="/" aria-current={enNosotros ? undefined : 'page'}>Inicio</Link></li>
            <li><Link to="/nosotros" aria-current={enNosotros ? 'page' : undefined}>Acerca de</Link></li>
          </ul>
        </nav>
      </header>

      <aside className="about-layout__sidebar" aria-label="Barra lateral">
        <p className="about-layout__sidebar-title">Tu música</p>
        <ul className="about-layout__sidebar-list">
          <li><Link to="/" aria-current={enNosotros ? undefined : 'page'}>Inicio</Link></li>
          <li><Link to="/nosotros" aria-current={enNosotros ? 'page' : undefined}>Acerca de</Link></li>
        </ul>
      </aside>

      <main className="about-layout__main" id="main-content">
        <Outlet />
        <footer className="about-layout__footer">
          <p>© CODIFY · Rolling Code School</p>
          <nav aria-label="Enlaces del pie de página">
            <Link to="/nosotros">Acerca de</Link>
          </nav>
        </footer>
      </main>

      <div className="about-layout__player" role="region" aria-label="Reproductor">
        <span className="about-layout__player-title">CODIFY Player</span>
        <div className="about-layout__player-bar" aria-hidden="true" />
        <span className="about-layout__player-time">01:24 / 03:40</span>
      </div>
    </div>
  );
}
