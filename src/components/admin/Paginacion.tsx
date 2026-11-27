interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  return (
    <nav className="admin-pagination" aria-label="Paginación">
      <button
        type="button"
        className="btn btn--secondary btn--sm"
        disabled={paginaActual <= 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
      >
        Anterior
      </button>
      <span className="admin-pagination__label">
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        type="button"
        className="btn btn--secondary btn--sm"
        disabled={paginaActual >= totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
