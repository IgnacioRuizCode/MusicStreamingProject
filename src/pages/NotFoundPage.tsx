import { Link } from 'react-router-dom';
import { PagePlaceholder } from '../components/PagePlaceholder';

export function NotFoundPage() {
  return (
    <PagePlaceholder
      title="404 - Página no encontrada"
      description="La ruta que buscás no existe o fue movida."
    >
      <Link to="/" className="page-placeholder__back">
        Volver al inicio
      </Link>
    </PagePlaceholder>
  );
}
