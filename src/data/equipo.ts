import {
  SiGithub,
  SiPnpm,
  SiReact,
  SiReacthookform,
  SiReactrouter,
  SiTrello,
  SiTypescript,
  SiVite,
  SiZod,
} from 'react-icons/si';
import type { Integrante, RolInfo, Tecnologia } from '../types/aboutUs';

export const REPOSITORIO_URL = 'https://github.com/IgnacioRuizCode/MusicStreamingProject';

export const fotosEquipo = {
  'ignacio-ruiz': new URL('../components/about-us/Ignacio Ruiz Teach Lead.jpeg', import.meta.url).href,
  'emilse-russo': new URL('../components/about-us/Emilse Russo Scrum Master.jpeg', import.meta.url).href,
  'juan-manuel-saravia': new URL('../components/about-us/Juan Manuel Saravia desarrollador 1.jpeg', import.meta.url).href,
  'samihel-nieva-corvalan': new URL('../components/about-us/samhiel corvalan desarrollador 2.png', import.meta.url).href,
} as const;

export const roles: RolInfo[] = [
  {
    rol: 'tech-leader',
    etiqueta: 'Tech Leader',
    descripcion:
      'Líder técnico; toma las decisiones de arquitectura, revisa el código y mantiene la calidad técnica del proyecto.',
  },
  {
    rol: 'scrum-master',
    etiqueta: 'Scrum Master',
    descripcion: 'Organiza el trabajo, facilita las reuniones y cuida el avance del tablero.',
  },
  {
    rol: 'dev',
    etiqueta: 'Desarrollador',
    descripcion: 'Construye y prueba las funcionalidades asignadas.',
  },
];

export const equipo: Integrante[] = [
  {
    id: 'ignacio-ruiz',
    nombre: 'Ruiz, Ignacio',
    rol: 'tech-leader',
    descripcion: 'Definió la arquitectura y revisó el código para mantener la calidad técnica.',
    color: '#1e14b8',
    foto: fotosEquipo['ignacio-ruiz'],
  },
  {
    id: 'emilse-russo',
    nombre: 'Russo, Emilse',
    rol: 'scrum-master',
    descripcion: 'Organizó el tablero, facilitó las reuniones y acompañó el avance del equipo.',
    color: '#C2185B',
    foto: fotosEquipo['emilse-russo'],
  },
  {
    id: 'juan-manuel-saravia',
    nombre: 'Saravia, Juan Manuel',
    rol: 'dev',
    descripcion: 'Construyó y probó funcionalidades clave de la aplicación.',
    color: '#E65100',
    foto: fotosEquipo['juan-manuel-saravia'],
  },
  {
    id: 'samihel-nieva-corvalan',
    nombre: 'Nieva Corvalan, Samihel',
    rol: 'dev',
    descripcion: 'Construyó y validó componentes e integraciones de la aplicación.',
    color: '#2E7D32',
    foto: fotosEquipo['samihel-nieva-corvalan'],
  },
];

export const tecnologias: Tecnologia[] = [
  { nombre: 'React', icono: SiReact },
  { nombre: 'TypeScript', icono: SiTypescript },
  { nombre: 'Vite', icono: SiVite },
  { nombre: 'React Router', icono: SiReactrouter },
  { nombre: 'React Hook Form', icono: SiReacthookform },
  { nombre: 'Zod', icono: SiZod },
  { nombre: 'pnpm', icono: SiPnpm },
  { nombre: 'GitHub', icono: SiGithub },
  { nombre: 'Trello', icono: SiTrello },
];
