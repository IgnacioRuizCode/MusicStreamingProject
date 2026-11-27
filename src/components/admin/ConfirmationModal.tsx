import { useEffect } from 'react';
import './ConfirmationModal.css';

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
  useEffect(() => {
    if (!abierto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancelar();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="confirm-modal__backdrop"
      onClick={onCancelar}
    >
      <div
        className="confirm-modal__dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="confirm-modal__title">{titulo}</h3>
        <p className="confirm-modal__message">{mensaje}</p>
        <div className="confirm-modal__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
