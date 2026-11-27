import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CardPlan } from '../components/CardPlan';
import { useAuth } from '../hooks/useAuth';
import { getPlans } from '../services/storageServices';
import { SESSION_KEYS } from '../services/storageKeys';
import type { Plan } from '../types/types';
import './PaginaPlanes.css';

function formatearFecha(fecha?: string): string | null {
  if (!fecha) return null;

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}

export function PaginaPlanes() {
  const { user, cancelarSuscripcion } = useAuth();
  const navigate = useNavigate();
  const planes = useMemo(() => getPlans(), []);

  const planActual = user?.planId
    ? planes.find((plan) => plan.id === user.planId)
    : undefined;
  const proximoCobro = formatearFecha(user?.nextPaymentDate);

  const handleElegir = (plan: Plan) => {
    if (!user) {
      sessionStorage.setItem(SESSION_KEYS.pendingPlanId, plan.id);
      navigate('/register');
      return;
    }

    if (plan.id === user.planId) return;
    navigate(`/pago/${plan.id}`);
  };

  const handleCancelar = () => {
    if (!user?.planId) return;

    const confirmado = window.confirm(
      `¿Querés cancelar tu suscripción al plan ${planActual?.nombre ?? 'actual'}?`,
    );
    if (!confirmado) return;

    const resultado = cancelarSuscripcion();
    if (!resultado.success) {
      toast.error(resultado.error);
      return;
    }

    toast.success('Tu suscripción fue cancelada.');
  };

  return (
    <section className="planes-page" aria-labelledby="planes-title">
      <header className="planes-page__header">
        <p className="planes-page__eyebrow">Suscripciones</p>
        <h1 id="planes-title" className="planes-page__title">
          Elegí tu plan
        </h1>
        <p className="planes-page__subtitle">
          Escuchá música sin anuncios, sin conexión y con la mejor calidad.
        </p>
      </header>

      {user?.planId && (
        <aside className="planes-page__actual" aria-label="Suscripción actual">
          <div>
            <span className="planes-page__actual-label">Tu plan actual</span>
            <strong className="planes-page__actual-nombre">
              {planActual?.nombre ?? user.planId}
            </strong>
            {proximoCobro && (
              <span className="planes-page__actual-detalle">
                Próximo cobro: {proximoCobro}
              </span>
            )}
            {user.card && (
              <span className="planes-page__actual-detalle">
                {user.card.brand} terminada en {user.card.last4}
              </span>
            )}
          </div>
          <button
            type="button"
            className="planes-page__cancelar"
            onClick={handleCancelar}
          >
            Cancelar suscripción
          </button>
        </aside>
      )}

      <div className="planes-page__grid">
        {planes.map((plan) => (
          <CardPlan
            key={plan.id}
            plan={plan}
            esPlanActual={plan.id === user?.planId}
            tienePlanActual={Boolean(user?.planId)}
            onElegir={handleElegir}
          />
        ))}
      </div>

      {!user && (
        <p className="planes-page__nota">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login">Iniciá sesión</Link> para contratar un plan.
        </p>
      )}
    </section>
  );
}
