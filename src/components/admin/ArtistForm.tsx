import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistSchema, type Artist, type ArtistFormData } from '../../schemas/artistSchema';
import { ImagePreview } from './ImagePreview';
import './ArtistForm.css';

interface FormularioArtistaProps {
  valoresIniciales?: Artist | null;
  onGuardar: (data: ArtistFormData) => void;
  onCancelar: () => void;
}

export function ArtistForm({
  valoresIniciales,
  onGuardar,
  onCancelar,
}: FormularioArtistaProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: valoresIniciales?.name ?? '',
      image: valoresIniciales?.image ?? '',
      monthlyListeners: valoresIniciales?.monthlyListeners ?? 0,
    },
  });

  const nombre = useWatch({ control, name: 'name' });
  const imagen = useWatch({ control, name: 'image' });

  useEffect(() => {
    reset({
      name: valoresIniciales?.name ?? '',
      image: valoresIniciales?.image ?? '',
      monthlyListeners: valoresIniciales?.monthlyListeners ?? 0,
    });
  }, [valoresIniciales, reset]);

  return (
    <form onSubmit={handleSubmit(onGuardar)} className="admin-form">
      <div className="admin-form__preview">
        <ImagePreview src={imagen} alt={nombre || 'Artista'} redonda grande />
        <div className="admin-form__preview-text">
          <strong>{nombre || 'Nombre del artista'}</strong>
          <span>La foto se actualiza al instante</span>
        </div>
      </div>

      <div className="admin-form__grid">
        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="artista-nombre">
            Nombre
          </label>
          <input
            id="artista-nombre"
            type="text"
            className="admin-input"
            placeholder="Ej. Daft Punk"
            minLength={3}
            maxLength={20}
            {...register('name')}
          />
          {errors.name && (
            <span className="admin-form__error">{errors.name.message}</span>
          )}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="artista-imagen">
            Imagen
          </label>
          <input
            id="artista-imagen"
            type="text"
            className="admin-input"
            placeholder="https://... o /ruta-local.jpg"
            {...register('image')}
          />
          {errors.image && (
            <span className="admin-form__error">{errors.image.message}</span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="artista-oyentes">
            Oyentes mensuales
          </label>
          <input
            id="artista-oyentes"
            type="number"
            min="0"
            className="admin-input"
            {...register('monthlyListeners', { valueAsNumber: true })}
          />
          {errors.monthlyListeners && (
            <span className="admin-form__error">{errors.monthlyListeners.message}</span>
          )}
        </div>
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {valoresIniciales ? 'Guardar cambios' : 'Crear artista'}
        </button>
      </div>
    </form>
  );
}
