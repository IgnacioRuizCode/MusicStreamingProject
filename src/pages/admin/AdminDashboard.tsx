import { Link } from 'react-router-dom';
import { PagePlaceholder } from '../../components/PagePlaceholder';

const ADMIN_LINKS = [
  { to: '/admin/artistas', label: 'Artistas' },
  { to: '/admin/canciones', label: 'Canciones' },
  { to: '/admin/playlists', label: 'Playlists' },
  { to: '/admin/planes', label: 'Planes' },
  { to: '/admin/usuarios', label: 'Usuarios' },
];

export function AdminDashboard() {
  return (
    <PagePlaceholder
      title="Panel de administración"
      description="Gestioná el catálogo y los usuarios de la plataforma."
    >
      <div className="page-placeholder__links">
        {ADMIN_LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    </PagePlaceholder>
  );
}
