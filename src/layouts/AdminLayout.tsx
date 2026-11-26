import { NavLink, Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

const ADMIN_LINKS = [
  { to: '/admin/artistas', label: 'Artists' },
  { to: '/admin/canciones', label: 'Songs' },
  { to: '/admin/playlists', label: 'Playlists' },
  { to: '/admin/planes', label: 'Plans' },
  { to: '/admin/usuarios', label: 'Users' },
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
        <Outlet />
      </main>
    </div>
  );
}