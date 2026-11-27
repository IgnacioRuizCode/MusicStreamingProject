import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminSearch } from '../../components/admin/AdminSearch';
import { ImagePreview } from '../../components/admin/ImagePreview';
import { PlaylistForm } from '../../components/admin/PlaylistForm';
import { useDebounce } from '../../hooks/useDebounce';
import type { Artist, Playlist, Song, User } from '../../types/types';
import { getAll, add, update, deleteById } from '../../services/storageServices';

const FILAS_POR_PAGINA = 10;

export function AdminPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => getAll('playlists'));
  const [usuarios, setUsuarios] = useState<User[]>(() => getAll('users'));
  const [canciones, setCanciones] = useState<Song[]>(() => getAll('songs'));
  const [artistas, setArtistas] = useState<Artist[]>(() => getAll('artists'));
  const [busqueda, setBusqueda] = useState('');
  const [filtroCreador, setFiltroCreador] = useState('');
  const [pagina, setPagina] = useState(1);
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [playlistEditando, setPlaylistEditando] = useState<Playlist | null>(null);
  const [playlistAEliminar, setPlaylistAEliminar] = useState<Playlist | null>(null);

  const busquedaDebounced = useDebounce(busqueda, 300);

  const usuariosPorId = useMemo(
    () => new Map(usuarios.map((usuario) => [usuario.id, usuario])),
    [usuarios]
  );

  const filtrados = useMemo(() => {
    const q = busquedaDebounced.trim().toLowerCase();
    return playlists.filter((playlist) => {
      if (filtroCreador && playlist.creatorId !== filtroCreador) return false;
      if (!q) return true;
      const creador = usuariosPorId.get(playlist.creatorId);
      return (
        playlist.title.toLowerCase().includes(q) ||
        (creador?.username.toLowerCase().includes(q) ?? false) ||
        (creador?.email.toLowerCase().includes(q) ?? false)
      );
    });
  }, [playlists, busquedaDebounced, filtroCreador, usuariosPorId]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice(
    (paginaSegura - 1) * FILAS_POR_PAGINA,
    paginaSegura * FILAS_POR_PAGINA
  );

  const refrescar = () => {
    setPlaylists(getAll('playlists'));
    setUsuarios(getAll('users'));
    setCanciones(getAll('songs'));
    setArtistas(getAll('artists'));
  };

  const abrirCrear = () => {
    setPlaylistEditando(null);
    setModalFormAbierto(true);
  };

  const abrirEditar = (playlist: Playlist) => {
    setPlaylistEditando(playlist);
    setModalFormAbierto(true);
  };

  const cerrarFormulario = () => {
    setModalFormAbierto(false);
    setPlaylistEditando(null);
  };

  const handleGuardar = (data: Omit<Playlist, 'id'>) => {
    try {
      if (playlistEditando) {
        update('playlists', playlistEditando.id, data);
        toast.success('Playlist actualizada correctamente');
      } else {
        add('playlists', data);
        toast.success('Playlist creada correctamente');
      }
      refrescar();
      cerrarFormulario();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar la playlist');
    }
  };

  const handleConfirmarEliminar = () => {
    if (!playlistAEliminar) return;
    try {
      const eliminada = deleteById('playlists', playlistAEliminar.id);
      if (!eliminada) throw new Error('Playlist no encontrada.');
      refrescar();
      toast.success('Playlist eliminada correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la playlist');
    } finally {
      setPlaylistAEliminar(null);
    }
  };

  const columnas: ColumnaTabla<Playlist>[] = [
    {
      key: 'title',
      header: 'Playlist',
      render: (playlist) => (
        <span className="admin-song-cell">
          <ImagePreview src={playlist.cover} alt={playlist.title} />
          <span className="admin-song-cell__info">
            <strong>{playlist.title}</strong>
            <span>{playlist.description}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'creator',
      header: 'Creador',
      render: (playlist) => {
        const creador = usuariosPorId.get(playlist.creatorId);
        return (
          <span className="admin-user-cell__info">
            <strong>{creador?.username ?? 'Usuario eliminado'}</strong>
            <span>{creador?.email ?? 'Sin correo'}</span>
          </span>
        );
      },
    },
    {
      key: 'songs',
      header: 'Canciones',
      render: (playlist) => (
        <span className="admin-badge">{playlist.songIds.length}</span>
      ),
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Playlists</h1>
          <p className="admin-page__subtitle">
            Creá colecciones, asigná un creador y elegí las canciones que las componen.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary" onClick={abrirCrear}>
            + Nueva playlist
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-toolbar__group">
          <AdminSearch
            value={busqueda}
            onChange={(value) => {
              setBusqueda(value);
              setPagina(1);
            }}
            placeholder="Buscar por playlist o creador..."
          />
          <select
            className="admin-select"
            value={filtroCreador}
            aria-label="Filtrar por creador"
            onChange={(event) => {
              setFiltroCreador(event.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos los creadores</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.username}
              </option>
            ))}
          </select>
        </div>
        <span className="admin-count">
          {filtrados.length} de {playlists.length} playlists
        </span>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda || filtroCreador
            ? 'No se encontraron playlists con esos filtros.'
            : 'Todavía no hay playlists cargadas.'
        }
        accionVacio={
          !busqueda &&
          !filtroCreador && (
            <button type="button" className="btn btn--primary" onClick={abrirCrear}>
              Crear primera playlist
            </button>
          )
        }
        renderAcciones={(playlist) => (
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => abrirEditar(playlist)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => setPlaylistAEliminar(playlist)}
            >
              Eliminar
            </button>
          </div>
        )}
      />

      <Paginacion
        paginaActual={paginaSegura}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
      />

      {modalFormAbierto && (
        <AdminModal
          titulo={playlistEditando ? 'Editar playlist' : 'Nueva playlist'}
          onCerrar={cerrarFormulario}
          tamano="lg"
        >
          <PlaylistForm
            usuarios={usuarios}
            canciones={canciones}
            artistas={artistas}
            valoresIniciales={playlistEditando}
            onGuardar={handleGuardar}
            onCancelar={cerrarFormulario}
          />
        </AdminModal>
      )}

      <ConfirmationModal
        abierto={Boolean(playlistAEliminar)}
        titulo="Eliminar playlist"
        mensaje={`¿Seguro que querés eliminar "${playlistAEliminar?.title}"? Esta acción no se puede deshacer.`}
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setPlaylistAEliminar(null)}
      />
    </section>
  );
}
