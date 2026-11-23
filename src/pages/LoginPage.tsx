import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, type LoginValues } from '../schemas/auth';
import { useAuth } from '../hooks/useAuth';
import { FormField } from '../components/auth/FormField';
import { PasswordField } from '../components/auth/PasswordField';
import './LoginPage.css';

interface LocationState {
  from?: { pathname?: string };
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as LocationState | null)?.from?.pathname;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = (data: LoginValues) => {
    const result = login(data.email, data.password);

    if (!result.success) {
      setError('root', { message: result.error });
      return;
    }

    toast.success(`¡Bienvenido, ${result.user?.username ?? 'de nuevo'}!`);

    if (fromPath && fromPath !== '/login') {
      navigate(fromPath, { replace: true });
    } else if (result.user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <header className="auth-card__header">
        <h1 id="login-title" className="auth-card__title">
          Iniciar sesión
        </h1>
        <p className="auth-card__subtitle">
          Ingresá tus datos para continuar escuchando música
        </p>
      </header>

      {errors.root?.message && (
        <div className="auth-form__banner-error" role="alert">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        <FormField id="login-email" label="Correo electrónico" error={errors.email?.message}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="ejemplo@streaming.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
            {...register('email')}
          />
        </FormField>

        <PasswordField
          id="login-password"
          label="Contraseña"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn--md auth-form__submit"
        >
          {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <footer className="auth-card__footer">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="auth-card__link">
          Registrate
        </Link>
      </footer>
    </section>
  );
}