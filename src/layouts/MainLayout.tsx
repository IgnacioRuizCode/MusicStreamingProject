import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../componets/navbar/navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './MainLayout.css';

export function MainLayout() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <Outlet />
        </div>
        <footer className="layout-footer">
          {/* Placeholder: reemplazar por <Footer /> */}
          <p>Footer</p>
        </footer>
      </main>

      <div className="layout-player">
        {/* Placeholder: reemplazar por <Reproductor /> */}
        <p style={{ margin: 0 }}>Reproductor</p>
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
