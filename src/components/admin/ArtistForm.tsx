import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistSchema, type Artist, type ArtistFormData } from '../../schemas/artistSchema';

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
    formState: { errors, isSubmitting },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: valoresIniciales?.name ?? '',
      image: valoresIniciales?.image ?? '',
      monthlyListeners: valoresIniciales?.monthlyListeners ?? 0,
    },
  });

  useEffect(() => {
    reset({
      name: valoresIniciales?.name ?? '',
      image: valoresIniciales?.image ?? '',
      monthlyListeners: valoresIniciales?.monthlyListeners ?? 0,
    });
  }, [valoresIniciales, reset]);

  return (
    <form onSubmit={handleSubmit(onGuardar)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" type="text" {...register('name')} style={{ width: '100%' }} />
        {errors.name && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="image">Imagen (URL o ruta)</label>
        <input id="image" type="text" {...register('image')} style={{ width: '100%' }} />
        {errors.image && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{errors.image.message}</span>}
      </div>

      <div>
        <label htmlFor="monthlyListeners">Oyentes mensuales</label>
        <input id="monthlyListeners" type="number" {...register('monthlyListeners', {valueAsNumber: true})} style={{ width: '100%' }} />
        {errors.monthlyListeners && (
          <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{errors.monthlyListeners.message}</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting}>
          {valoresIniciales ? 'Guardar cambios' : 'Crear artista'}
        </button>
      </div>
    </form>
  );
}