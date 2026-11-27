import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, type PlanFormData } from '../../schemas/planSchema';
import type { Plan } from '../../types/types';
import './PlanForm.css';

interface FormularioPlanProps {
  valoresIniciales?: Plan | null;
  onGuardar: (data: Omit<Plan, 'id'>) => void;
  onCancelar: () => void;
}

export function PlanForm({
  valoresIniciales,
  onGuardar,
  onCancelar,
}: FormularioPlanProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: valoresIniciales?.name ?? '',
      price: valoresIniciales?.price ?? 0,
      featured: valoresIniciales?.featured ?? false,
      benefits: valoresIniciales?.benefits.length
        ? valoresIniciales.benefits.map((b) => ({ value: b }))
        : [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  useEffect(() => {
    reset({
      name: valoresIniciales?.name ?? '',
      price: valoresIniciales?.price ?? 0,
      featured: valoresIniciales?.featured ?? false,
      benefits: valoresIniciales?.benefits.length
        ? valoresIniciales.benefits.map((b) => ({ value: b }))
        : [{ value: '' }],
    });
  }, [valoresIniciales, reset]);

  const onSubmit = (data: PlanFormData) => {
    onGuardar({
      name: data.name,
      price: data.price,
      featured: data.featured,
      benefits: data.benefits.map((b) => b.value),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formulario-plan">
      <div>
        <label htmlFor="plan-name">Nombre del plan</label>
        <input
          id="plan-name"
          type="text"
          {...register('name')}
          className="formulario-plan__input"
        />
        {errors.name && (
          <span className="formulario-plan__error">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="plan-price">Precio</label>
        <input
          id="plan-price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          className="formulario-plan__input"
        />
        {errors.price && (
          <span className="formulario-plan__error">{errors.price.message}</span>
        )}
      </div>

      <label className="formulario-plan__checkbox">
        <input type="checkbox" {...register('featured')} />
        Plan destacado
      </label>

      <div>
        <div className="formulario-plan__beneficios-header">
          <label>Beneficios</label>
          <button type="button" onClick={() => append({ value: '' })}>
            + Agregar beneficio
          </button>
        </div>

        <div className="formulario-plan__beneficios-lista">
          {fields.map((field, index) => (
            <div key={field.id} className="formulario-plan__beneficio-item">
              <div className="formulario-plan__beneficio-campo">
                <input
                  type="text"
                  placeholder={`Beneficio ${index + 1}`}
                  {...register(`benefits.${index}.value`)}
                  className="formulario-plan__input"
                />
                {errors.benefits?.[index]?.value && (
                  <span className="formulario-plan__error--small">
                    {errors.benefits[index]?.value?.message}
                  </span>
                )}
              </div>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)}>
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.benefits?.root && (
          <span className="formulario-plan__error">
            {errors.benefits.root.message}
          </span>
        )}
      </div>

      <div className="formulario-plan__acciones">
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting}>
          {valoresIniciales ? 'Guardar cambios' : 'Crear plan'}
        </button>
      </div>
    </form>
  );
}