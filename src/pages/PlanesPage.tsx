import { useMemo } from 'react';
import { PagePlaceholder } from '../components/PagePlaceholder';
import { getAll } from '../services/storageServices';

export function PlanesPage() {
  const plans = useMemo(() => getAll('plans'), []);

  return (
    <PagePlaceholder
      title="Planes"
      description="Elegí el plan que mejor se adapte a vos."
    >
      <ul className="page-placeholder__details">
        {plans.map((plan) => (
          <li key={plan.id}>
            <strong>{plan.name}</strong> — {plan.price === 0 ? 'Gratis' : `$${plan.price}`} ·{' '}
            {plan.benefits.join(', ')}
          </li>
        ))}
      </ul>
    </PagePlaceholder>
  );
}
