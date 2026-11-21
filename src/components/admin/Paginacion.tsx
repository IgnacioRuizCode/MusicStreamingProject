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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
      <button
        type="button"
        disabled={paginaActual <= 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
      >
        Anterior
      </button>
      <span>
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        type="button"
        disabled={paginaActual >= totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}