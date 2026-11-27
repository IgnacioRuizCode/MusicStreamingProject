import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/codify-logo-claro.png';
import { RouteFallback } from '../components/RouteFallback';
import './LayoutAuth.css';

export function LayoutAuth() {
  return (
    <div className="auth-layout">
      <Link to="/" className="auth-layout__brand" aria-label="Codify - Inicio">
        <img src={logo} alt="Codify" className="auth-layout__logo" />
      </Link>

      <main className="auth-layout__content">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <p className="auth-layout__footnote">Música sin límites, donde quieras.</p>
    </div>
  );
}
