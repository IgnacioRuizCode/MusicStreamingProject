import type { IconType } from 'react-icons';

export type TeamRole = 'tech-leader' | 'scrum-master' | 'dev';

export interface Integrante {
  id: string;
  nombre: string;
  rol: TeamRole;
  descripcion: string;
  color: string;
  foto?: string;
}

export interface RolInfo {
  rol: TeamRole;
  etiqueta: string;
  descripcion: string;
}

export interface Tecnologia {
  nombre: string;
  icono: IconType;
}
