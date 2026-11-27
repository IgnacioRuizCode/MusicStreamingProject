import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ImagePreview } from '../../components/admin/ImagePreview';
import { getAll } from '../../services/storageServices';

interface Kpi {
  label: string;
  value: number;
  meta: string;
  to: string;
  icon: ReactNode;
}

function IconSongs() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function IconArtists() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function IconPlaylists() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h11M4 12h11M4 18h7" />
      <circle cx="18" cy="16" r="3" />
      <path d="M21 16V7l-4 1" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.5a3.5 3.5 0 0 1 0 7" />
      <path d="M18 14.5a6 6 0 0 1 3.5 5.5" />
    </svg>
  );
}

function IconPlans() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </svg>
  );
}

export function AdminDashboard() {
  const canciones = useMemo(() => getAll('songs'), []);
  const artistas = useMemo(() => getAll('artists'), []);
  const playlists = useMemo(() => getAll('playlists'), []);
  const usuarios = useMemo(() => getAll('users'), []);
  const planes = useMemo(() => getAll('plans'), []);

  const admins = usuarios.filter((usuario) => usuario.role === 'admin').length;
  const usuariosConPlan = usuarios.filter((usuario) => usuario.planId).length;

  const kpis: Kpi[] = [
    {
      label: 'Canciones',
      value: canciones.length,
      meta: 'En el catálogo',
      to: '/admin/canciones',
      icon: <IconSongs />,
    },
    {
      label: 'Artistas',
      value: artistas.length,
      meta: 'Perfiles activos',
      to: '/admin/artistas',
      icon: <IconArtists />,
    },
    {
      label: 'Playlists',
      value: playlists.length,
      meta: 'Colecciones creadas',
      to: '/admin/playlists',
      icon: <IconPlaylists />,
    },
    {
      label: 'Usuarios',
      value: usuarios.length,
      meta: `${admins} admin(s) · ${usuariosConPlan} con plan`,
      to: '/admin/usuarios',
      icon: <IconUsers />,
    },
    {
      label: 'Planes',
      value: planes.length,
      meta: 'Opciones de suscripción',
      to: '/admin/planes',
      icon: <IconPlans />,
    },
  ];

  const usuariosRecientes = [...usuarios]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 5);

  const playlistsRecientes = [...playlists].slice(-5).reverse();

  const topArtistas = [...artistas]
    .sort((a, b) => b.songIds.length - a.songIds.length)
    .slice(0, 5);

  const usuariosPorId = new Map(usuarios.map((usuario) => [usuario.id, usuario]));

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Panel de administración</h1>
          <p className="admin-page__subtitle">
            Resumen en vivo del catálogo, las playlists y las cuentas de Codify.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link to="/admin/canciones" className="btn btn--primary">
            Gestionar catálogo
          </Link>
        </div>
      </header>

      <div className="admin-kpi-grid">
        {kpis.map((kpi) => (
          <Link key={kpi.to} to={kpi.to} className="admin-kpi">
            <div className="admin-kpi__top">
              <span className="admin-kpi__label">{kpi.label}</span>
              <span className="admin-kpi__icon">{kpi.icon}</span>
            </div>
            <span className="admin-kpi__value">{kpi.value}</span>
            <span className="admin-kpi__meta">{kpi.meta}</span>
          </Link>
        ))}
      </div>

      <div className="admin-grid-two">
        <section className="admin-panel">
          <header className="admin-panel__header">
            <h2 className="admin-panel__title">Usuarios recientes</h2>
            <Link to="/admin/usuarios" className="btn btn--ghost btn--sm">
              Ver todos
            </Link>
          </header>
          {usuariosRecientes.length === 0 ? (
            <p className="admin-panel__text">Todavía no hay usuarios registrados.</p>
          ) : (
            <ul className="admin-recent-list">
              {usuariosRecientes.map((usuario) => (
                <li key={usuario.id} className="admin-recent-item">
                  <ImagePreview
                    src={usuario.avatar}
                    alt={usuario.username}
                    redonda
                  />
                  <span className="admin-recent-item__info">
                    <strong>{usuario.username}</strong>
                    <span>{usuario.email}</span>
                  </span>
                  <span
                    className={
                      usuario.role === 'admin'
                        ? 'admin-badge admin-badge--admin'
                        : 'admin-badge'
                    }
                  >
                    {usuario.role === 'admin' ? 'Admin' : 'Usuario'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <header className="admin-panel__header">
            <h2 className="admin-panel__title">Playlists recientes</h2>
            <Link to="/admin/playlists" className="btn btn--ghost btn--sm">
              Ver todas
            </Link>
          </header>
          {playlistsRecientes.length === 0 ? (
            <p className="admin-panel__text">Todavía no hay playlists creadas.</p>
          ) : (
            <ul className="admin-recent-list">
              {playlistsRecientes.map((playlist) => (
                <li key={playlist.id} className="admin-recent-item">
                  <ImagePreview src={playlist.cover} alt={playlist.title} />
                  <span className="admin-recent-item__info">
                    <strong>{playlist.title}</strong>
                    <span>
                      {usuariosPorId.get(playlist.creatorId)?.username ??
                        'Usuario eliminado'}{' '}
                      · {playlist.songIds.length} canción(es)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="admin-grid-two">
        <section className="admin-panel">
          <header className="admin-panel__header">
            <h2 className="admin-panel__title">Artistas con más canciones</h2>
            <Link to="/admin/artistas" className="btn btn--ghost btn--sm">
              Ver artistas
            </Link>
          </header>
          {topArtistas.length === 0 ? (
            <p className="admin-panel__text">Todavía no hay artistas cargados.</p>
          ) : (
            <ul className="admin-recent-list">
              {topArtistas.map((artista) => (
                <li key={artista.id} className="admin-recent-item">
                  <ImagePreview src={artista.image} alt={artista.name} redonda />
                  <span className="admin-recent-item__info">
                    <strong>{artista.name}</strong>
                    <span>
                      {artista.monthlyListeners.toLocaleString('es-AR')} oyentes
                    </span>
                  </span>
                  <span className="admin-badge">{artista.songIds.length}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <header className="admin-panel__header">
            <h2 className="admin-panel__title">Accesos rápidos</h2>
          </header>
          <div className="admin-quick-links">
            <Link to="/admin/canciones" className="admin-quick-link">
              <span>Agregar canciones</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/admin/playlists" className="admin-quick-link">
              <span>Crear playlist</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/admin/artistas" className="admin-quick-link">
              <span>Nuevo artista</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/admin/usuarios" className="admin-quick-link">
              <span>Revisar usuarios</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
