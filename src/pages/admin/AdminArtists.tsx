import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
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
    return artistas.filter((a) => a.name.toLowerCase().includes(q));
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
      setModalFormAbierto(false);
      setArtistaEditando(null);
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
      render: (a) => (
        <img
          src={a.image}
          alt={a.name}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
      ),
    },
    { key: 'name', header: 'Nombre', render: (a) => a.name },
    {
      key: 'monthlyListeners',
      header: 'Oyentes mensuales',
      render: (a) => a.monthlyListeners.toLocaleString('es-AR'),
    },
  ];

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>Artistas</h1>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="search"
            placeholder="Buscar artista..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
          <button type="button" onClick={abrirCrear}>
            + Nuevo artista
          </button>
        </div>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda ? 'No se encontraron artistas con esa búsqueda.' : 'Todavía no hay artistas cargados.'
        }
        accionVacio={
          !busqueda && (
            <button type="button" onClick={abrirCrear}>
              Crear primer artista
            </button>
          )
        }
        renderAcciones={(artista) => (
          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => abrirEditar(artista)}>
              Editar
            </button>
            <button type="button" onClick={() => setArtistaAEliminar(artista)}>
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
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.5rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface, #11111a)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {artistaEditando ? 'Editar artista' : 'Nuevo artista'}
            </h2>
            <ArtistForm
              valoresIniciales={artistaEditando}
              onGuardar={handleGuardar}
              onCancelar={() => {
                setModalFormAbierto(false);
                setArtistaEditando(null);
              }}
            />
          </div>
        </div>
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