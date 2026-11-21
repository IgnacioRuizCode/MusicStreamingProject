interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmationModal({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Eliminar',
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  if (!abierto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-surface, #11111a)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--text-primary, #fff)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>{titulo}</h3>
        <p style={{ color: 'var(--text-secondary, #a1a1aa)', marginBottom: '1.5rem' }}>
          {mensaje}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}