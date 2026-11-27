import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  adminPlaylistSchema,
  type AdminPlaylistFormData,
} from '../../schemas/adminPlaylistSchema';
import type { Artist, Playlist, Song, User } from '../../types/types';
import { ImagePreview } from './ImagePreview';

interface PlaylistFormProps {
  usuarios: User[];
  canciones: Song[];
  artistas: Artist[];
  valoresIniciales?: Playlist | null;
  onGuardar: (data: Omit<Playlist, 'id'>) => void;
  onCancelar: () => void;
}

export function PlaylistForm({
  usuarios,
  canciones,
  artistas,
  valoresIniciales,
  onGuardar,
  onCancelar,
}: PlaylistFormProps) {
  const [songIds, setSongIds] = useState<string[]>(
    valoresIniciales?.songIds ?? []
  );
  const [busquedaCancion, setBusquedaCancion] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminPlaylistFormData>({
    resolver: zodResolver(adminPlaylistSchema),
    defaultValues: {
      title: valoresIniciales?.title ?? '',
      description: valoresIniciales?.description ?? '',
      cover: valoresIniciales?.cover ?? '',
      creatorId: valoresIniciales?.creatorId ?? '',
    },
  });

  const titulo = watch('title');
  const portada = watch('cover');

  const artistasPorId = useMemo(
    () => new Map(artistas.map((artista) => [artista.id, artista.name])),
    [artistas]
  );

  const cancionesFiltradas = useMemo(() => {
    const q = busquedaCancion.trim().toLowerCase();
    if (!q) return canciones;
    return canciones.filter((cancion) => {
      const artista = artistasPorId.get(cancion.artistId) ?? '';
      return (
        cancion.title.toLowerCase().includes(q) ||
        artista.toLowerCase().includes(q)
      );
    });
  }, [busquedaCancion, canciones, artistasPorId]);

  useEffect(() => {
    reset({
      title: valoresIniciales?.title ?? '',
      description: valoresIniciales?.description ?? '',
      cover: valoresIniciales?.cover ?? '',
      creatorId: valoresIniciales?.creatorId ?? '',
    });
    setSongIds(valoresIniciales?.songIds ?? []);
  }, [valoresIniciales, reset]);

  const toggleCancion = (songId: string) => {
    setSongIds((actuales) =>
      actuales.includes(songId)
        ? actuales.filter((id) => id !== songId)
        : [...actuales, songId]
    );
  };

  const onSubmit = (data: AdminPlaylistFormData) => {
    onGuardar({
      title: data.title.trim(),
      description: data.description?.trim() || 'Playlist curada por el equipo de Codify.',
      cover:
        data.cover?.trim() ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      creatorId: data.creatorId,
      songIds,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="admin-form__preview">
        <ImagePreview src={portada} alt={titulo || 'Playlist'} grande />
        <div className="admin-form__preview-text">
          <strong>{titulo || 'Título de la playlist'}</strong>
          <span>{songIds.length} canción(es) seleccionada(s)</span>
        </div>
      </div>

      <div className="admin-form__grid">
        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="playlist-titulo">
            Título
          </label>
          <input
            id="playlist-titulo"
            type="text"
            className="admin-input"
            placeholder="Ej. Éxitos del indie"
            {...register('title')}
          />
          {errors.title && (
            <span className="admin-form__error">{errors.title.message}</span>
          )}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="playlist-descripcion">
            Descripción
          </label>
          <textarea
            id="playlist-descripcion"
            className="admin-textarea"
            placeholder="Una descripción breve de la playlist"
            {...register('description')}
          />
          {errors.description && (
            <span className="admin-form__error">{errors.description.message}</span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="playlist-creador">
            Creador
          </label>
          <select
            id="playlist-creador"
            className="admin-select admin-input"
            {...register('creatorId')}
          >
            <option value="">Seleccionar usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.username} ({usuario.email})
              </option>
            ))}
          </select>
          {errors.creatorId && (
            <span className="admin-form__error">{errors.creatorId.message}</span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="playlist-portada">
            Portada
          </label>
          <input
            id="playlist-portada"
            type="text"
            className="admin-input"
            placeholder="https://... (opcional)"
            {...register('cover')}
          />
          {errors.cover && (
            <span className="admin-form__error">{errors.cover.message}</span>
          )}
        </div>
      </div>

      <div className="admin-form__section">
        <div className="admin-form__section-header">
          <h3 className="admin-form__section-title">Canciones</h3>
          <span className="admin-badge">{songIds.length} seleccionadas</span>
        </div>
        <input
          type="search"
          className="admin-input"
          placeholder="Filtrar canciones..."
          value={busquedaCancion}
          onChange={(event) => setBusquedaCancion(event.target.value)}
        />
        <div className="admin-song-picker__list">
          {cancionesFiltradas.length === 0 ? (
            <p className="admin-form__hint">No hay canciones que coincidan.</p>
          ) : (
            cancionesFiltradas.map((cancion) => (
              <label key={cancion.id} className="admin-song-picker__item">
                <input
                  type="checkbox"
                  checked={songIds.includes(cancion.id)}
                  onChange={() => toggleCancion(cancion.id)}
                />
                <span>
                  {cancion.title} · {artistasPorId.get(cancion.artistId) ?? 'Sin artista'}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {valoresIniciales ? 'Guardar cambios' : 'Crear playlist'}
        </button>
      </div>
    </form>
  );
}
