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
      nombre: valoresIniciales?.nombre ?? '',
      precio: valoresIniciales?.precio ?? 0,
      destacado: valoresIniciales?.destacado ?? false,
      beneficios: valoresIniciales?.beneficios.length
        ? valoresIniciales.beneficios.map((b) => ({ value: b }))
        : [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'beneficios',
  });

  useEffect(() => {
    reset({
      nombre: valoresIniciales?.nombre ?? '',
      precio: valoresIniciales?.precio ?? 0,
      destacado: valoresIniciales?.destacado ?? false,
      beneficios: valoresIniciales?.beneficios.length
        ? valoresIniciales.beneficios.map((b) => ({ value: b }))
        : [{ value: '' }],
    });
  }, [valoresIniciales, reset]);

  const onSubmit = (data: PlanFormData) => {
    onGuardar({
      nombre: data.nombre,
      precio: data.precio,
      destacado: data.destacado,
      beneficios: data.beneficios.map((b) => b.value),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formulario-plan">
      <div>
        <label htmlFor="plan-nombre">Nombre del plan</label>
        <input
          id="plan-nombre"
          type="text"
          {...register('nombre')}
          className="formulario-plan__input"
        />
        {errors.nombre && (
          <span className="formulario-plan__error">{errors.nombre.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="plan-precio">Precio</label>
        <input
          id="plan-precio"
          type="number"
          step="0.01"
          {...register('precio', { valueAsNumber: true })}
          className="formulario-plan__input"
        />
        {errors.precio && (
          <span className="formulario-plan__error">{errors.precio.message}</span>
        )}
      </div>

      <label className="formulario-plan__checkbox">
        <input type="checkbox" {...register('destacado')} />
        Plan destacado
      </label>

      <div>
        <div className="formulario-plan__beneficios-header">
          <label>Beneficios</label>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => append({ value: '' })}
          >
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
                  {...register(`beneficios.${index}.value`)}
                  className="formulario-plan__input"
                />
                {errors.beneficios?.[index]?.value && (
                  <span className="formulario-plan__error--small">
                    {errors.beneficios[index]?.value?.message}
                  </span>
                )}
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => remove(index)}
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.beneficios?.root && (
          <span className="formulario-plan__error">
            {errors.beneficios.root.message}
          </span>
        )}
      </div>

      <div className="formulario-plan__acciones">
        <button type="button" className="btn btn--secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {valoresIniciales ? 'Guardar cambios' : 'Crear plan'}
        </button>
      </div>
    </form>
  );
}
