import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { crearPlaylistSchema, type CrearPlaylistValues } from '../schemas/perfilSchema';
import { createUserPlaylist } from '../services/storageServices';
import { ImagePicker } from './ImagePicker';
import './CrearPlaylistModal.css';

interface CrearPlaylistModalProps {
  abierto: boolean;
  userId: string;
  onClose: () => void;
  onCreated?: (playlistId: string) => void;
}

export function CrearPlaylistModal({
  abierto,
  userId,
  onClose,
  onCreated,
}: CrearPlaylistModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CrearPlaylistValues>({
    resolver: zodResolver(crearPlaylistSchema),
    defaultValues: {
      title: '',
      description: '',
      cover: '',
    },
  });

  const coverPreview = useWatch({ control, name: 'cover' });

  if (!abierto) return null;

  const onSubmit = (values: CrearPlaylistValues) => {
    const nueva = createUserPlaylist(userId, values);
    toast.success(`Playlist "${nueva.title}" creada`);
    reset();
    onCreated?.(nueva.id);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crear-playlist-title"
      className="playlist-modal__backdrop"
      onClick={handleClose}
    >
      <div className="playlist-modal__dialog" onClick={(e) => e.stopPropagation()}>
        <div className="playlist-modal__header">
          <h3 id="crear-playlist-title" className="playlist-modal__title">
            Nueva playlist
          </h3>
          <button
            type="button"
            className="playlist-modal__close"
            aria-label="Cerrar modal"
            onClick={handleClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="playlist-modal__form" noValidate>
          <div className="playlist-modal__field">
            <label htmlFor="pl-title" className="playlist-modal__label">
              Nombre de la playlist *
            </label>
            <input
              id="pl-title"
              type="text"
              className="playlist-modal__input"
              placeholder="Ej. Mis favoritas para entrenar"
              minLength={3}
              maxLength={20}
              {...register('title')}
            />
            {errors.title && (
              <span className="playlist-modal__error">{errors.title.message}</span>
            )}
          </div>

          <div className="playlist-modal__field">
            <label htmlFor="pl-desc" className="playlist-modal__label">
              Descripción (opcional)
            </label>
            <textarea
              id="pl-desc"
              rows={3}
              className="playlist-modal__textarea"
              placeholder="Contá de qué va esta lista..."
              minLength={3}
              maxLength={20}
              {...register('description')}
            />
            {errors.description && (
              <span className="playlist-modal__error">{errors.description.message}</span>
            )}
          </div>

          <div className="playlist-modal__field">
            <label htmlFor="pl-cover-file" className="playlist-modal__label">
              Portada (opcional)
            </label>
            <ImagePicker
              id="pl-cover"
              variant="cover"
              value={coverPreview ?? ''}
              onChange={(value) =>
                setValue('cover', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            {errors.cover && (
              <span className="playlist-modal__error">{errors.cover.message}</span>
            )}
          </div>

          <div className="playlist-modal__actions">
            <button type="button" className="btn btn--secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              Crear playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}