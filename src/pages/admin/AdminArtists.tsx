import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminSearch } from '../../components/admin/AdminSearch';
import { ImagePreview } from '../../components/admin/ImagePreview';
import { ArtistForm } from '../../components/admin/ArtistForm';
import { useDebounce } from '../../hooks/useDebounce';
import type { ArtistFormData } from '../../schemas/artistSchema';
import type { Artist } from '../../types/types';
import {
  getAll,
  add,
  update,
  getArtistSongs,
  deleteArtistWithCascade,
} from '../../services/storageServices';

const FILAS_POR_PAGINA = 10;

export function AdminArtists() {
  const [artistas, setArtistas] = useState<Artist[]>(() => getAll('artists'));
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [artistaEditando, setArtistaEditando] = useState<Artist | null>(null);
  const [artistaAEliminar, setArtistaAEliminar] = useState<Artist | null>(null);

  const busquedaDebounced = useDebounce(busqueda, 300);

  const filtrados = useMemo(() => {
    const q = busquedaDebounced.trim().toLowerCase();
    if (!q) return artistas;
    return artistas.filter((artista) => artista.name.toLowerCase().includes(q));
  }, [artistas, busquedaDebounced]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice(
    (paginaSegura - 1) * FILAS_POR_PAGINA,
    paginaSegura * FILAS_POR_PAGINA
  );

  const refrescar = () => setArtistas(getAll('artists'));

  const abrirCrear = () => {
    setArtistaEditando(null);
    setModalFormAbierto(true);
  };

  const abrirEditar = (artista: Artist) => {
    setArtistaEditando(artista);
    setModalFormAbierto(true);
  };

  const cerrarFormulario = () => {
    setModalFormAbierto(false);
    setArtistaEditando(null);
  };

  const handleGuardar = (data: ArtistFormData) => {
    try {
      if (artistaEditando) {
        update('artists', artistaEditando.id, data);
        toast.success('Artista actualizado correctamente');
      } else {
        add('artists', { ...data, songIds: [] });
        toast.success('Artista creado correctamente');
      }
      refrescar();
      cerrarFormulario();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar el artista');
    }
  };

  const handleConfirmarEliminar = () => {
    if (!artistaAEliminar) return;
    try {
      const { deletedSongsCount } = deleteArtistWithCascade(artistaAEliminar.id);
      refrescar();
      toast.success(
        deletedSongsCount > 0
          ? `Artista eliminado junto con ${deletedSongsCount} canción(es)`
          : 'Artista eliminado correctamente'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar el artista');
    } finally {
      setArtistaAEliminar(null);
    }
  };

  const cancionesAsociadas = artistaAEliminar
    ? getArtistSongs(artistaAEliminar.id).length
    : 0;

  const columnas: ColumnaTabla<Artist>[] = [
    {
      key: 'image',
      header: 'Imagen',
      render: (artista) => (
        <ImagePreview src={artista.image} alt={artista.name} redonda />
      ),
    },
    {
      key: 'name',
      header: 'Nombre',
      render: (artista) => <strong>{artista.name}</strong>,
    },
    {
      key: 'monthlyListeners',
      header: 'Oyentes mensuales',
      render: (artista) => artista.monthlyListeners.toLocaleString('es-AR'),
    },
    {
      key: 'songs',
      header: 'Canciones',
      render: (artista) => (
        <span className="admin-badge">{artista.songIds.length}</span>
      ),
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Artistas</h1>
          <p className="admin-page__subtitle">
            Gestioná los artistas del catálogo y sus canciones asociadas.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary" onClick={abrirCrear}>
            + Nuevo artista
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
            placeholder="Buscar artista..."
          />
        </div>
        <span className="admin-count">
          {filtrados.length} de {artistas.length} artistas
        </span>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda
            ? 'No se encontraron artistas con esa búsqueda.'
            : 'Todavía no hay artistas cargados.'
        }
        accionVacio={
          !busqueda && (
            <button type="button" className="btn btn--primary" onClick={abrirCrear}>
              Crear primer artista
            </button>
          )
        }
        renderAcciones={(artista) => (
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => abrirEditar(artista)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => setArtistaAEliminar(artista)}
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
          titulo={artistaEditando ? 'Editar artista' : 'Nuevo artista'}
          onCerrar={cerrarFormulario}
          tamano="md"
        >
          <ArtistForm
            valoresIniciales={artistaEditando}
            onGuardar={handleGuardar}
            onCancelar={cerrarFormulario}
          />
        </AdminModal>
      )}

      <ConfirmationModal
        abierto={Boolean(artistaAEliminar)}
        titulo="Eliminar artista"
        mensaje={
          cancionesAsociadas > 0
            ? `¿Seguro que querés eliminar a "${artistaAEliminar?.name}"? Tiene ${cancionesAsociadas} canción(es) asociada(s) que también se eliminarán de la plataforma y de todas las playlists.`
            : `¿Seguro que querés eliminar a "${artistaAEliminar?.name}"? Esta acción no se puede deshacer.`
        }
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setArtistaAEliminar(null)}
      />
    </section>
  );
}
