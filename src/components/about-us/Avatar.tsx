import type { CSSProperties } from 'react';
import { obtenerIniciales } from '../../utils/obtenerIniciales';

interface AvatarProps {
  nombre: string;
  color: string;
  foto?: string;
}

export function Avatar({ nombre, color, foto }: AvatarProps) {
  const estilo = { '--avatar-color': color } as CSSProperties;

  return (
    <span className="about-avatar" style={estilo} aria-hidden="true">
      {foto ? (
        <img className="about-avatar__image" src={foto} alt="" />
      ) : (
        <span className="about-avatar__initials">{obtenerIniciales(nombre)}</span>
      )}
    </span>
  );
}
