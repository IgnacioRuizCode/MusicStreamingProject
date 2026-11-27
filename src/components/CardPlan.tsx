import { Check } from 'lucide-react';
import type { Plan } from '../types/types';
import './CardPlan.css';

interface CardPlanProps {
  plan: Plan;
  esPlanActual: boolean;
  tienePlanActual?: boolean;
  onElegir: (plan: Plan) => void;
}

export function CardPlan({
  plan,
  esPlanActual,
  tienePlanActual = false,
  onElegir,
}: CardPlanProps) {
  const textoBoton = esPlanActual
    ? 'Plan actual'
    : tienePlanActual
      ? 'Cambiar a este plan'
      : 'Elegir plan';

  return (
    <article
      className={`card-plan${plan.destacado ? ' card-plan--destacado' : ''}${
        esPlanActual ? ' card-plan--actual' : ''
      }`}
    >
      {plan.destacado && <span className="card-plan__badge">Más popular</span>}

      <header className="card-plan__header">
        <h3 className="card-plan__nombre">{plan.nombre}</h3>
        <p className="card-plan__precio">
          {plan.precio === 0 ? (
            <span>Gratis</span>
          ) : (
            <>
              <span>${plan.precio.toFixed(2)}</span>
              <small>/mes</small>
            </>
          )}
        </p>
      </header>

      <ul className="card-plan__beneficios">
        {plan.beneficios.map((beneficio, index) => (
          <li key={`${plan.id}-${index}`}>
            <Check size={16} aria-hidden="true" />
            <span>{beneficio}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="card-plan__boton"
        disabled={esPlanActual}
        onClick={() => onElegir(plan)}
      >
        {textoBoton}
      </button>
    </article>
  );
}
