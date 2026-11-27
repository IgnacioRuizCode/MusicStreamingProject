import { useState } from 'react';
import { obtenerIniciales } from '../../utils/obtenerIniciales';

interface AvatarProps {
  nombre: string;
  color: string;
  foto?: string;
}

function getFallbackInitials(nombre: string): string {
  const fromUtil = obtenerIniciales(nombre)?.trim();
  if (fromUtil) return fromUtil;
  return nombre
    .replace(/,/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ nombre, color, foto }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(foto && foto.trim() !== '' && !imgFailed);

  return (
    <span
      className="about-avatar"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {showPhoto ? (
        <img
          className="about-avatar__image"
          src={foto}
          alt=""
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="about-avatar__initials">
          {getFallbackInitials(nombre)}
        </span>
      )}
    </span>
  );
}
