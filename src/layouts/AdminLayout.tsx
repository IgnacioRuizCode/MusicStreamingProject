import { Suspense } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { RouteFallback } from '../components/RouteFallback';
import './AdminLayout.css';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/artistas', label: 'Artists', end: false },
  { to: '/admin/canciones', label: 'Songs', end: false },
  { to: '/admin/playlists', label: 'Playlists', end: false },
  { to: '/admin/planes', label: 'Plans', end: false },
  { to: '/admin/usuarios', label: 'Users', end: false },
];

export function LayoutAdmin() {
  return (
    <div className="layout-admin">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Panel Admin</h2>
          <Link to="/" className="admin-back-link">
            ← Volver a la app
          </Link>
        </div>

        <nav className="admin-nav">
          {ADMIN_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}