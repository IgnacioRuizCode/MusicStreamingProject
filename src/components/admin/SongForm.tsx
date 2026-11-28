import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  adminSongSchema,
  type AdminSongFormData,
} from '../../schemas/adminSongSchema';
import type { Artist, Song } from '../../types/types';
import { ImagePreview } from './ImagePreview';

interface SongFormProps {
  artistas: Artist[];
  valoresIniciales?: Song | null;
  onGuardar: (data: AdminSongFormData) => void;
  onCancelar: () => void;
}

export function SongForm({
  artistas,
  valoresIniciales,
  onGuardar,
  onCancelar,
}: SongFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminSongFormData>({
    resolver: zodResolver(adminSongSchema),
    defaultValues: {
      title: valoresIniciales?.title ?? '',
      artistId: valoresIniciales?.artistId ?? '',
      cover: valoresIniciales?.cover ?? '',
      url: valoresIniciales?.url ?? '',
      duration: valoresIniciales?.duration ?? 180,
    },
  });

  const titulo = useWatch({ control, name: 'title' });
  const portada = useWatch({ control, name: 'cover' });
  const artistaId = useWatch({ control, name: 'artistId' });
  const artista = artistas.find((item) => item.id === artistaId);

  useEffect(() => {
    reset({
      title: valoresIniciales?.title ?? '',
      artistId: valoresIniciales?.artistId ?? '',
      cover: valoresIniciales?.cover ?? '',
      url: valoresIniciales?.url ?? '',
      duration: valoresIniciales?.duration ?? 180,
    });
  }, [valoresIniciales, reset]);

  return (
    <form onSubmit={handleSubmit(onGuardar)} className="admin-form">
      <div className="admin-form__preview">
        <ImagePreview src={portada} alt={titulo || 'Canción'} grande />
        <div className="admin-form__preview-text">
          <strong>{titulo || 'Título de la canción'}</strong>
          <span>{artista?.name ?? 'Seleccioná un artista'}</span>
        </div>
      </div>

      <div className="admin-form__grid">
        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="cancion-titulo">
            Título
          </label>
          <input
            id="cancion-titulo"
            type="text"
            className="admin-input"
            placeholder="Ej. Around the World"
            minLength={3}
            maxLength={20}
            {...register('title')}
          />
          {errors.title && (
            <span className="admin-form__error">{errors.title.message}</span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="cancion-artista">
            Artista
          </label>
          <select
            id="cancion-artista"
            className="admin-select admin-input"
            {...register('artistId')}
          >
            <option value="">Seleccionar artista</option>
            {artistas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.artistId && (
            <span className="admin-form__error">{errors.artistId.message}</span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="cancion-duracion">
            Duración (segundos)
          </label>
          <input
            id="cancion-duracion"
            type="number"
            min="30"
            max="3600"
            className="admin-input"
            {...register('duration', { valueAsNumber: true })}
          />
          {errors.duration && (
            <span className="admin-form__error">{errors.duration.message}</span>
          )}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="cancion-portada">
            Portada
          </label>
          <input
            id="cancion-portada"
            type="text"
            className="admin-input"
            placeholder="https://..."
            {...register('cover')}
          />
          {errors.cover && (
            <span className="admin-form__error">{errors.cover.message}</span>
          )}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="cancion-audio">
            Archivo de audio
          </label>
          <input
            id="cancion-audio"
            type="text"
            className="admin-input"
            placeholder="https://..."
            {...register('url')}
          />
          {errors.url && (
            <span className="admin-form__error">{errors.url.message}</span>
          )}
        </div>
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {valoresIniciales ? 'Guardar cambios' : 'Crear canción'}
        </button>
      </div>
    </form>
  );
}
