import { Suspense, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, LibraryBig, Search } from 'lucide-react';
import { Navbar } from '../components/navbar/navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Player } from '../components/player/Player';
import { GuestBanner } from '../components/player/GuestBanner';
import { RouteFallback } from '../components/RouteFallback';
import { Footer } from '../components/footer/Footer';
import { usePlayerContext } from '../context/PlayerContext';
import { useAuth } from '../hooks/useAuth';
import './MainLayout.css';

export function MainLayout() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { isFloating } = usePlayerContext();
  const isPlayerFloating =
    Boolean(user) &&
    (isFloating || pathname.startsWith('/search') || pathname.startsWith('/buscar'));

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className={`layout-principal${sidebarOpen ? ' sidebar-open' : ''}`}>
      <header className="layout-navbar">
        <Navbar onToggleSidebar={() => setSidebarOpen((value) => !value)} />
      </header>

      <aside
        className={`layout-sidebar${sidebarOpen ? ' is-open' : ''}`}
        onClick={(event) => {
          if ((event.target as Element).closest('a')) {
            setSidebarOpen(false);
          }
        }}
      >
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="layout-sidebar-overlay"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="layout-content" ref={contentRef}>
        <div className="layout-page">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
        <footer className="layout-footer">
          <Footer />
        </footer>
      </main>

      <div
        className={`layout-player${isPlayerFloating ? ' layout-player--floating' : ''}`}
      >
        {user ? <Player /> : <GuestBanner />}
      </div>

      <nav className="layout-bottom-nav" aria-label="Navegación móvil">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `layout-bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <Home size={20} aria-hidden="true" />
          <span>Inicio</span>
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => `layout-bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <Search size={20} aria-hidden="true" />
          <span>Buscar</span>
        </NavLink>
        <NavLink
          to="/biblioteca"
          className={({ isActive }) => `layout-bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <LibraryBig size={20} aria-hidden="true" />
          <span>Biblioteca</span>
        </NavLink>
      </nav>
    </div>
  );
}