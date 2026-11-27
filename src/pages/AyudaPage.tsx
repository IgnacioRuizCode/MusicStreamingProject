import { PagePlaceholder } from '../components/PagePlaceholder';

export function AyudaPage() {
  return (
    <PagePlaceholder
      title="Ayuda"
      description="¿Necesitás una mano? Revisá estas respuestas rápidas."
    >
      <ul className="page-placeholder__details">
        <li>Usá la barra superior para buscar canciones, artistas y playlists.</li>
        <li>Iniciá sesión para guardar favoritos y acceder a tu biblioteca.</li>
        <li>Los administradores pueden gestionar el catálogo desde el panel de administración.</li>
      </ul>
    </PagePlaceholder>
  );
}
