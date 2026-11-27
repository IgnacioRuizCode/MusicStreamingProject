import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema, type RegisterValues } from '../schemas/auth';
import { useAuth } from '../hooks/useAuth';
import { FormField } from '../components/auth/FormField';
import { PasswordField } from '../components/auth/PasswordField';
import { SESSION_KEYS } from '../services/storageKeys';
import './AuthPages.css';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function RegisterPage() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [birthParts, setBirthParts] = useState({ day: '', month: '', year: '' });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: currentYear - 1900 + 1 }, (_, index) =>
        String(currentYear - index),
      ),
    [currentYear],
  );

  const days = useMemo(() => {
    const year = Number(birthParts.year) || 2000;
    const month = Number(birthParts.month) || 1;
    const totalDays = new Date(year, month, 0).getDate();
    return Array.from({ length: totalDays }, (_, index) =>
      String(index + 1).padStart(2, '0'),
    );
  }, [birthParts.year, birthParts.month]);

  const handleBirthPartChange = (
    part: 'day' | 'month' | 'year',
    value: string,
  ) => {
    const next = { ...birthParts, [part]: value };

    if (part === 'month' || part === 'year') {
      const year = Number(next.year) || 2000;
      const month = Number(next.month) || 1;
      const maxDay = new Date(year, month, 0).getDate();
      if (next.day && Number(next.day) > maxDay) {
        next.day = String(maxDay).padStart(2, '0');
      }
    }

    setBirthParts(next);

    const isComplete = Boolean(next.day && next.month && next.year);
    setValue(
      'birthDate',
      isComplete ? `${next.year}-${next.month}-${next.day}` : '',
      {
        shouldDirty: true,
        shouldValidate: isComplete,
      },
    );

    if (!isComplete) {
      clearErrors('birthDate');
    }
  };

  useEffect(() => {
    if (!user) return;

    const pendingPlanId = sessionStorage.getItem(SESSION_KEYS.pendingPlanId);
    if (pendingPlanId) {
      sessionStorage.removeItem(SESSION_KEYS.pendingPlanId);
      navigate(`/pago/${pendingPlanId}`, { replace: true });
      return;
    }

    navigate('/planes', { replace: true });
  }, [user, navigate]);

  const onSubmit = (data: RegisterValues) => {
    const result = registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
    });

    if (!result.success) {
      setError('email', {
        type: 'duplicate',
        message: 'Este correo ya está registrado',
      });
      return;
    }

    const pendingPlanId = sessionStorage.getItem(SESSION_KEYS.pendingPlanId);

    toast.success(
      pendingPlanId
        ? '¡Cuenta creada con éxito! Completá el pago de tu plan.'
        : '¡Cuenta creada con éxito! Elegí tu plan para comenzar.',
    );
  };

  return (
    <section className="auth-card" aria-labelledby="register-title">
      <header className="auth-card__header">
        <h1 id="register-title" className="auth-card__title">
          Crear cuenta
        </h1>
        <p className="auth-card__subtitle">
          Registrate gratis para empezar a escuchar música
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        <FormField
          id="register-username"
          label="Nombre de usuario"
          error={errors.username?.message}
        >
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            placeholder="ej. musiclover"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'register-username-error' : undefined}
            className={`auth-form__input${errors.username ? ' auth-form__input--error' : ''}`}
            {...register('username')}
          />
        </FormField>

        <div className="auth-form__field">
          <label htmlFor="register-email" className="auth-form__label">
            Correo electrónico
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="ejemplo@streaming.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <span id="register-email-error" className="auth-form__error" role="alert">
              {errors.email.message}
              {errors.email.type === 'duplicate' && (
                <Link to="/login" className="auth-form__inline-link">
                  Iniciá sesión acá
                </Link>
              )}
            </span>
          )}
        </div>

        <FormField
          id="register-birthdate"
          label="Fecha de nacimiento"
          error={errors.birthDate?.message}
        >
          <input type="hidden" {...register('birthDate')} />
          <div className="auth-date" role="group" aria-label="Fecha de nacimiento">
            <select
              id="register-birthdate"
              value={birthParts.day}
              autoComplete="bday-day"
              aria-label="Día"
              aria-invalid={Boolean(errors.birthDate)}
              aria-describedby={errors.birthDate ? 'register-birthdate-error' : undefined}
              className={`auth-form__select${errors.birthDate ? ' auth-form__select--error' : ''}`}
              onChange={(event) => handleBirthPartChange('day', event.target.value)}
            >
              <option value="">Día</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <select
              value={birthParts.month}
              autoComplete="bday-month"
              aria-label="Mes"
              aria-invalid={Boolean(errors.birthDate)}
              aria-describedby={errors.birthDate ? 'register-birthdate-error' : undefined}
              className={`auth-form__select${errors.birthDate ? ' auth-form__select--error' : ''}`}
              onChange={(event) => handleBirthPartChange('month', event.target.value)}
            >
              <option value="">Mes</option>
              {MESES.map((month, index) => {
                const value = String(index + 1).padStart(2, '0');
                return (
                  <option key={value} value={value}>
                    {month}
                  </option>
                );
              })}
            </select>

            <select
              value={birthParts.year}
              autoComplete="bday-year"
              aria-label="Año"
              aria-invalid={Boolean(errors.birthDate)}
              aria-describedby={errors.birthDate ? 'register-birthdate-error' : undefined}
              className={`auth-form__select${errors.birthDate ? ' auth-form__select--error' : ''}`}
              onChange={(event) => handleBirthPartChange('year', event.target.value)}
            >
              <option value="">Año</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </FormField>

        <PasswordField
          id="register-password"
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres, letra y número"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordField
          id="register-confirm-password"
          label="Confirmar contraseña"
          autoComplete="new-password"
          placeholder="Repetí tu contraseña"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="auth-form__checkbox-group">
          <label htmlFor="register-terms" className="auth-form__checkbox-label">
            <input
              id="register-terms"
              type="checkbox"
              className="auth-form__checkbox"
              aria-invalid={Boolean(errors.acceptTerms)}
              aria-describedby={errors.acceptTerms ? 'register-terms-error' : undefined}
              {...register('acceptTerms')}
            />
            <span>Acepto los términos y condiciones de uso y la política de privacidad.</span>
          </label>
          {errors.acceptTerms && (
            <span id="register-terms-error" className="auth-form__error" role="alert">
              {errors.acceptTerms.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn--md auth-form__submit"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <footer className="auth-card__footer">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="auth-card__link">
          Iniciá sesión
        </Link>
      </footer>
    </section>
  );
}