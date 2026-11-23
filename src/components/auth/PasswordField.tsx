import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormField } from './FormField';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  error?: string;
}

export function PasswordField({
  id,
  label,
  error,
  className = '',
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField id={id} label={label} error={error}>
      <div className="auth-form__password-wrapper">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`auth-form__input auth-form__input--password${
            error ? ' auth-form__input--error' : ''
          } ${className}`.trim()}
          {...inputProps}
        />
        <button
          type="button"
          className="auth-form__toggle-password"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </FormField>
  );
}