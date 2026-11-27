import { type Plan } from '../../types/types';

export const SEED_PLANS: Plan[] = [
  {
    id: 'plan-individual',
    nombre: 'Individual',
    precio: 9.99,
    beneficios: [
      'Música sin anuncios',
      'Descargas para escuchar sin conexión',
      'Audio de alta calidad',
      'Cancelá cuando quieras',
    ],
    destacado: true,
  },
  {
    id: 'plan-duo',
    nombre: 'Dúo',
    precio: 12.99,
    beneficios: [
      '2 cuentas Premium',
      'Música sin anuncios',
      'Reproducción sin conexión',
      'Playlist Dúo Mix',
    ],
    destacado: false,
  },
  {
    id: 'plan-familiar',
    nombre: 'Familiar',
    precio: 15.99,
    beneficios: [
      'Hasta 6 cuentas Premium',
      'Bloqueo de contenido explícito',
      'Música sin anuncios',
      'Reproducción sin conexión',
    ],
    destacado: false,
  },
  {
    id: 'plan-estudiante',
    nombre: 'Estudiante',
    precio: 4.99,
    beneficios: [
      'Música sin anuncios',
      'Descargas para escuchar sin conexión',
      'Audio de alta calidad',
      'Verificación estudiantil',
    ],
    destacado: false,
  },
];
