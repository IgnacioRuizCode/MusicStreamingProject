import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminSearch } from '../../components/admin/AdminSearch';
import { ImagePreview } from '../../components/admin/ImagePreview';
import { SongForm } from '../../components/admin/SongForm';
import { useDebounce } from '../../hooks/useDebounce';
import type { AdminSongFormData } from '../../schemas/adminSongSchema';
import type { Artist, Playlist, Song } from '../../types/types';
import {
  getAll,
  update,
  addSongWithSync,
  deleteSongWithCascade,
} from '../../services/storageServices';

const FILAS_POR_PAGINA = 10;

function formatearDuracion(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${minutos}:${resto.toString().padStart(2, '0')}`;
}

export function AdminCanciones() {
  const [canciones, setCanciones] = useState<Song[]>(() => getAll('songs'));
  const [artistas, setArtistas] = useState<Artist[]>(() => getAll('artists'));
  const [playlists, setPlaylists] = useState<Playlist[]>(() => getAll('playlists'));
  const [busqueda, setBusqueda] = useState('');
  const [filtroArtista, setFiltroArtista] = useState('');
  const [pagina, setPagina] = useState(1);
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [cancionEditando, setCancionEditando] = useState<Song | null>(null);
  const [cancionAEliminar, setCancionAEliminar] = useState<Song | null>(null);

  const busquedaDebounced = useDebounce(busqueda, 300);

  const artistasPorId = useMemo(
    () => new Map(artistas.map((artista) => [artista.id, artista])),
    [artistas]
  );

  const playlistsPorCancion = useMemo(() => {
    const mapa = new Map<string, number>();
    playlists.forEach((playlist) => {
      playlist.songIds.forEach((songId) => {
        mapa.set(songId, (mapa.get(songId) ?? 0) + 1);
      });
    });
    return mapa;
  }, [playlists]);

  const filtrados = useMemo(() => {
    const q = busquedaDebounced.trim().toLowerCase();
    return canciones.filter((cancion) => {
      if (filtroArtista && cancion.artistId !== filtroArtista) return false;
      if (!q) return true;
      const artista = artistasPorId.get(cancion.artistId)?.name ?? '';
      return (
        cancion.title.toLowerCase().includes(q) ||
        artista.toLowerCase().includes(q)
      );
    });
  }, [canciones, busquedaDebounced, filtroArtista, artistasPorId]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice(
    (paginaSegura - 1) * FILAS_POR_PAGINA,
    paginaSegura * FILAS_POR_PAGINA
  );

  const refrescar = () => {
    setCanciones(getAll('songs'));
    setArtistas(getAll('artists'));
    setPlaylists(getAll('playlists'));
  };

  const abrirCrear = () => {
    setCancionEditando(null);
    setModalFormAbierto(true);
  };

  const abrirEditar = (cancion: Song) => {
    setCancionEditando(cancion);
    setModalFormAbierto(true);
  };

  const cerrarFormulario = () => {
    setModalFormAbierto(false);
    setCancionEditando(null);
  };

  const sincronizarArtista = (artistId: string, songId: string, agregar: boolean) => {
    const artista = artistasPorId.get(artistId);
    if (!artista) return;
    const songIds = agregar
      ? Array.from(new Set([...artista.songIds, songId]))
      : artista.songIds.filter((id) => id !== songId);
    update('artists', artistId, { songIds });
  };

  const handleGuardar = (data: AdminSongFormData) => {
    try {
      if (cancionEditando) {
        update('songs', cancionEditando.id, data);
        if (cancionEditando.artistId !== data.artistId) {
          sincronizarArtista(cancionEditando.artistId, cancionEditando.id, false);
          sincronizarArtista(data.artistId, cancionEditando.id, true);
        }
        toast.success('Canción actualizada correctamente');
      } else {
        addSongWithSync(data);
        toast.success('Canción creada correctamente');
      }
      refrescar();
      cerrarFormulario();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar la canción');
    }
  };

  const handleConfirmarEliminar = () => {
    if (!cancionAEliminar) return;
    try {
      const { playlistsUpdated } = deleteSongWithCascade(cancionAEliminar.id);
      refrescar();
      toast.success(
        playlistsUpdated > 0
          ? `Canción eliminada y quitada de ${playlistsUpdated} playlist(s)`
          : 'Canción eliminada correctamente'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la canción');
    } finally {
      setCancionAEliminar(null);
    }
  };

  const playlistsAfectadas = cancionAEliminar
    ? (playlistsPorCancion.get(cancionAEliminar.id) ?? 0)
    : 0;

  const columnas: ColumnaTabla<Song>[] = [
    {
      key: 'title',
      header: 'Canción',
      render: (cancion) => (
        <span className="admin-song-cell">
          <ImagePreview src={cancion.cover} alt={cancion.title} />
          <span className="admin-song-cell__info">
            <strong>{cancion.title}</strong>
            <span>{artistasPorId.get(cancion.artistId)?.name ?? 'Sin artista'}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'duration',
      header: 'Duración',
      render: (cancion) => formatearDuracion(cancion.duration),
    },
    {
      key: 'playlists',
      header: 'Playlists',
      render: (cancion) => (
        <span className="admin-badge">
          {playlistsPorCancion.get(cancion.id) ?? 0}
        </span>
      ),
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Canciones</h1>
          <p className="admin-page__subtitle">
            Administrá el catálogo completo y su relación con artistas y playlists.
          </p>
        </div>
        <div className="admin-page__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={abrirCrear}
            disabled={artistas.length === 0}
          >
            + Nueva canción
          </button>
        </div>
      </header>

      {artistas.length === 0 && (
        <div className="admin-panel">
          <p className="admin-panel__text">
            Necesitás crear al menos un artista antes de cargar canciones.
          </p>
          <Link to="/admin/artistas" className="btn btn--secondary btn--sm">
            Ir a artistas
          </Link>
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-toolbar__group">
          <AdminSearch
            value={busqueda}
            onChange={(value) => {
              setBusqueda(value);
              setPagina(1);
            }}
            placeholder="Buscar por canción o artista..."
          />
          <select
            className="admin-select"
            value={filtroArtista}
            aria-label="Filtrar por artista"
            onChange={(event) => {
              setFiltroArtista(event.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos los artistas</option>
            {artistas.map((artista) => (
              <option key={artista.id} value={artista.id}>
                {artista.name}
              </option>
            ))}
          </select>
        </div>
        <span className="admin-count">
          {filtrados.length} de {canciones.length} canciones
        </span>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda || filtroArtista
            ? 'No se encontraron canciones con esos filtros.'
            : 'Todavía no hay canciones cargadas.'
        }
        accionVacio={
          !busqueda &&
          !filtroArtista && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={abrirCrear}
              disabled={artistas.length === 0}
            >
              Crear primera canción
            </button>
          )
        }
        renderAcciones={(cancion) => (
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => abrirEditar(cancion)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => setCancionAEliminar(cancion)}
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
          titulo={cancionEditando ? 'Editar canción' : 'Nueva canción'}
          onCerrar={cerrarFormulario}
          tamano="lg"
        >
          <SongForm
            artistas={artistas}
            valoresIniciales={cancionEditando}
            onGuardar={handleGuardar}
            onCancelar={cerrarFormulario}
          />
        </AdminModal>
      )}

      <ConfirmationModal
        abierto={Boolean(cancionAEliminar)}
        titulo="Eliminar canción"
        mensaje={
          playlistsAfectadas > 0
            ? `¿Seguro que querés eliminar "${cancionAEliminar?.title}"? También se quitará de ${playlistsAfectadas} playlist(s).`
            : `¿Seguro que querés eliminar "${cancionAEliminar?.title}"? Esta acción no se puede deshacer.`
        }
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setCancionAEliminar(null)}
      />
    </section>
  );
}
