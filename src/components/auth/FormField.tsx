import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="auth-form__field">
      <label htmlFor={id} className="auth-form__label">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="auth-form__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}