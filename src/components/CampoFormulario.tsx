import type { ComponentPropsWithRef } from 'react';
import './CampoFormulario.css';

interface CampoFormularioProps extends ComponentPropsWithRef<'input'> {
  id: string;
  etiqueta: string;
  error?: string;
}

export function CampoFormulario({
  id,
  etiqueta,
  error,
  className = '',
  ref,
  ...inputProps
}: CampoFormularioProps) {
  const errorId = `${id}-error`;

  return (
    <div className="campo-formulario">
      <label htmlFor={id} className="campo-formulario__label">
        {etiqueta}
      </label>
      <input
        ref={ref}
        id={id}
        className={`campo-formulario__input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <span id={errorId} className="campo-formulario__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
