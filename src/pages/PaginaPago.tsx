import { useState } from 'react';
import { Check, CheckCircle2, Mail } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import logoCodify from '../assets/codify-logo-claro.png';
import { FormularioPago } from '../components/FormularioPago';
import { useAuth } from '../hooks/useAuth';
import { getPlanById } from '../services/storageServices';
import type { Plan, ResumenPago } from '../types/types';
import './PaginaPago.css';

interface Confirmacion {
  plan: Plan;
  resumen: ResumenPago;
  numeroOperacion: string;
  fechaOperacion: string;
  proximoCobro: string;
}

function generarNumeroOperacion(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0');
  return `COD-${random}`;
}

function formatearFecha(fecha?: string): string {
  if (!fecha) return 'No aplica';

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}

export function PaginaPago() {
  const { planId } = useParams<{ planId: string }>();
  const { user, suscribirse } = useAuth();
  const navigate = useNavigate();
  const [confirmacion, setConfirmacion] = useState<Confirmacion | null>(null);

  const plan = planId ? getPlanById(planId) : undefined;

  if (!plan) {
    return (
      <section className="pago-page pago-page--vacio">
        <h1>Plan no encontrado</h1>
        <p>El plan que querés contratar no existe o ya no está disponible.</p>
        <Link to="/planes" className="pago-page__link">
          Volver a los planes
        </Link>
      </section>
    );
  }

  const handleSuccess = (resumen: ResumenPago) => {
    const resultado = suscribirse(plan.id, resumen);

    if (!resultado.success) {
      toast.error(resultado.error);
      return;
    }

    const ahora = new Date();
    const proximoCobro = new Date(ahora);
    proximoCobro.setDate(proximoCobro.getDate() + 30);

    setConfirmacion({
      plan,
      resumen,
      numeroOperacion: generarNumeroOperacion(),
      fechaOperacion: ahora.toISOString(),
      proximoCobro: proximoCobro.toISOString(),
    });
    toast.success('¡Suscripción confirmada!');
  };

  if (confirmacion) {
    return (
      <section className="pago-page pago-page--confirmacion">
        <article className="ticket" aria-label="Comprobante de suscripción">
          <header className="ticket__header">
            <img src={logoCodify} alt="Codify" className="ticket__logo" />
            <div className="ticket__status">
              <CheckCircle2
                size={40}
                className="ticket__status-icon"
                aria-hidden="true"
              />
              <h1 className="ticket__title">¡Pago confirmado!</h1>
            </div>
            <p className="ticket__operation">
              Operación <strong>{confirmacion.numeroOperacion}</strong>
            </p>
          </header>

          <div className="ticket__perforation" aria-hidden="true" />

          <div className="ticket__body">
            <div className="ticket__row">
              <span className="ticket__label">Plan contratado</span>
              <strong className="ticket__value">
                {confirmacion.plan.nombre}
              </strong>
              <ul className="ticket__benefits">
                {confirmacion.plan.beneficios.map((beneficio, index) => (
                  <li key={`${confirmacion.plan.id}-${index}`}>
                    <Check size={14} aria-hidden="true" />
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ticket__row">
              <span className="ticket__label">Cuenta / Titular</span>
              <div className="ticket__value">
                <strong>{user?.username ?? '—'}</strong>
                <span>{user?.email ?? '—'}</span>
              </div>
            </div>

            <div className="ticket__row">
              <span className="ticket__label">Método de pago</span>
              <strong className="ticket__value">
                {confirmacion.resumen.marca} ••••{' '}
                {confirmacion.resumen.ultimos4}
              </strong>
            </div>

            <div className="ticket__dates">
              <div className="ticket__date">
                <span className="ticket__label">Fecha de operación</span>
                <strong>{formatearFecha(confirmacion.fechaOperacion)}</strong>
              </div>
              <div className="ticket__date">
                <span className="ticket__label">Próximo cobro</span>
                <strong>{formatearFecha(confirmacion.proximoCobro)}</strong>
              </div>
            </div>
          </div>

          <div className="ticket__total">
            <span>Total abonado</span>
            <strong>
              ${confirmacion.plan.precio.toFixed(2)} <small>/ mes</small>
            </strong>
          </div>

          <div className="ticket__perforation" aria-hidden="true" />

          <div className="ticket__mail">
            <Mail size={18} aria-hidden="true" />
            <p>
              Enviamos una copia de este comprobante y los detalles del cobro a
              tu correo: <strong>{user?.email ?? '—'}</strong>
            </p>
          </div>

          <div className="ticket__actions">
            <Link to="/" className="ticket__action ticket__action--primary">
              Empezar a escuchar
            </Link>
            <Link
              to="/perfil"
              className="ticket__action ticket__action--secondary"
            >
              Ver mi suscripción
            </Link>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="pago-page" aria-labelledby="pago-page-title">
      <button
        type="button"
        className="pago-page__volver"
        onClick={() => navigate('/planes')}
      >
        Volver a los planes
      </button>

      <header className="pago-page__header">
        <p className="pago-page__eyebrow">Suscripción</p>
        <h1 id="pago-page-title">Finalizá tu suscripción</h1>
        <p>Completá los datos de pago para activar tu plan.</p>
      </header>

      <div className="pago-page__contenido">
        <aside className="pago-page__plan" aria-label="Resumen del plan">
          <div className="pago-page__plan-info">
            <h2>{plan.nombre}</h2>
            <p className="pago-page__precio">
              ${plan.precio.toFixed(2)}
              <span>/mes</span>
            </p>
          </div>
          <ul>
            {plan.beneficios.map((beneficio, index) => (
              <li key={`${plan.id}-${index}`}>
                <Check size={16} aria-hidden="true" />
                <span>{beneficio}</span>
              </li>
            ))}
          </ul>
        </aside>

        <FormularioPago plan={plan} onSuccess={handleSuccess} />
      </div>
    </section>
  );
}
