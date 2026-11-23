import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../componets/navbar/navbar';
import './MainLayout.css';

export function MainLayout() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const handleToggleSidebar = () => {
    console.log('Toggle sidebar');
  };

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="layout-principal">
      <header className="layout-navbar">
        <Navbar onToggleSidebar={handleToggleSidebar} />
      </header>

      <aside className="layout-sidebar">
        {/* Placeholder: reemplazar por <Sidebar /> */}
        <p>Sidebar</p>
      </aside>

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