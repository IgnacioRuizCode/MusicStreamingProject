import type { Integrante } from '../../types/aboutUs';
import { Avatar } from './Avatar';

interface TeamMemberCardProps {
  integrante: Integrante;
  etiquetaRol: string;
}

export function TeamMemberCard({ integrante, etiquetaRol }: TeamMemberCardProps) {
  return (
    <article className="team-card" data-reveal>
      <Avatar nombre={integrante.nombre} color={integrante.color} foto={integrante.foto} />
      <h3 className="team-card__name">{integrante.nombre}</h3>
      <p className={`team-card__role team-card__role--${integrante.rol}`}>{etiquetaRol}</p>
      <p className="team-card__description">{integrante.descripcion}</p>
    </article>
  );
}
