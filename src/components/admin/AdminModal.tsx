import { useEffect, type ReactNode } from 'react';
import './AdminModal.css';

interface AdminModalProps {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  tamano?: 'sm' | 'md' | 'lg';
}

export function AdminModal({
  titulo,
  onCerrar,
  children,
  tamano = 'md',
}: AdminModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCerrar();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="admin-modal__backdrop"
      onClick={onCerrar}
    >
      <div
        className={`admin-modal__dialog admin-modal__dialog--${tamano}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-modal__header">
          <h2 className="admin-modal__title">{titulo}</h2>
          <button
            type="button"
            className="admin-modal__close"
            aria-label="Cerrar"
            onClick={onCerrar}
          >
            ×
          </button>
        </header>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}
