import { PagePlaceholder } from '../components/PagePlaceholder';
import { useAuth } from '../hooks/useAuth';
import { getPlanById } from '../services/storageServices';

export function PerfilPage() {
  const { user } = useAuth();
  const plan = user?.planId ? getPlanById(user.planId) : undefined;

  return (
    <PagePlaceholder
      title="Perfil"
      description="Administrá tus datos personales y tu suscripción."
    >
      {user && (
        <ul className="page-placeholder__details">
          <li>
            <strong>Usuario:</strong> {user.username}
          </li>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
          <li>
            <strong>Rol:</strong> {user.role}
          </li>
          <li>
            <strong>Plan:</strong> {plan?.nombre ?? 'Sin plan'}
          </li>
          {user.nextPaymentDate && (
            <li>
              <strong>Próximo cobro:</strong>{' '}
              {new Intl.DateTimeFormat('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date(user.nextPaymentDate))}
            </li>
          )}
          {user.card && (
            <li>
              <strong>Medio de pago:</strong> {user.card.brand} terminada en{' '}
              {user.card.last4}
            </li>
          )}
        </ul>
      )}
    </PagePlaceholder>
  );
}
