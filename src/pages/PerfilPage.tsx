import { PagePlaceholder } from '../components/PagePlaceholder';
import { useAuth } from '../hooks/useAuth';

export function PerfilPage() {
  const { user } = useAuth();

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
            <strong>Plan:</strong> {user.planId ?? 'Sin plan'}
          </li>
        </ul>
      )}
    </PagePlaceholder>
  );
}
