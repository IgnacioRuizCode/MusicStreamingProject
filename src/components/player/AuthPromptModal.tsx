import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import type { PlayableSong } from '../../context/PlayerContext';
import './AuthPromptModal.css';

interface AuthPromptModalProps {
  song: PlayableSong | null;
  onClose: () => void;
}

export function AuthPromptModal({ song, onClose }: AuthPromptModalProps) {
  const primaryRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!song) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    primaryRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [song, onClose]);

  if (!song) return null;

  return (
    <div className="auth-prompt" onClick={onClose}>
      <div
        className="auth-prompt__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-prompt__cover">
          {song.cover ? (
            <img src={song.cover} alt={`Portada de ${song.title}`} />
          ) : (
            <Music2 size={36} aria-hidden="true" />
          )}
        </div>

        <h2 id="auth-prompt-title" className="auth-prompt__title">
          Empieza a escuchar con una cuenta de Codify gratis
        </h2>

        <div className="auth-prompt__actions">
          <Link
            ref={primaryRef}
            to="/register"
            className="auth-prompt__primary"
            onClick={onClose}
          >
            Registrate gratis
          </Link>

          <Link to="/login" className="auth-prompt__secondary" onClick={onClose}>
            ¿Ya tenés cuenta? Iniciar sesión
          </Link>
        </div>
      </div>

      <button type="button" className="auth-prompt__close" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
}
