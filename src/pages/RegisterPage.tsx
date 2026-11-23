import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema, type RegisterValues } from '../schemas/auth';
import { useAuth } from '../hooks/useAuth';
import { FormField } from '../components/auth/FormField';
import { PasswordField } from '../components/auth/PasswordField';
import './LoginPage.css';

export function RegisterPage() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
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

  useEffect(() => {
    if (user && !isSubmitSuccessful) {
      navigate('/', { replace: true });
    }
  }, [user, isSubmitSuccessful, navigate]);

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

    toast.success('¡Cuenta creada con éxito! Elegí tu plan para comenzar.');
    navigate('/planes', { replace: true });
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
          <input
            id="register-birthdate"
            type="date"
            autoComplete="bday"
            max={new Date().toISOString().split('T')[0]}
            aria-invalid={Boolean(errors.birthDate)}
            aria-describedby={errors.birthDate ? 'register-birthdate-error' : undefined}
            className={`auth-form__input${errors.birthDate ? ' auth-form__input--error' : ''}`}
            {...register('birthDate')}
          />
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