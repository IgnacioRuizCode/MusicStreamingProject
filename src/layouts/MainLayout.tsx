import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navbar/navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Player } from '../components/player/Player';
import { RouteFallback } from '../components/RouteFallback';
import { usePlayerContext } from '../context/PlayerContext';
import './MainLayout.css';

export function MainLayout() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isFloating } = usePlayerContext();
  const isPlayerFloating =
    isFloating || pathname.startsWith('/search') || pathname.startsWith('/buscar');

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
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

      <button
        type="button"
        className="layout-sidebar-overlay"
        aria-label="Cerrar menú"
        onClick={() => setSidebarOpen(false)}
      />

      <main className="layout-content" ref={contentRef}>
        <div className="layout-page">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
        <footer className="layout-footer">
          {/* Placeholder: reemplazar por <Footer /> */}
          <p>Footer</p>
        </footer>
      </main>

      <div
        className="layout-player"
        style={isPlayerFloating ? { height: 0, minHeight: 0, padding: 0, border: 'none' } : undefined}
      >
        <Player />
      </div>

      <nav className="layout-bottom-nav">
        {/* TODO: reemplazar por <NavInferior /> si no viene incluido en el ticket de Navbar */}
        <span>Inicio</span>
        <span>Buscar</span>
        <span>Biblioteca</span>
      </nav>
    </div>
  );
}
