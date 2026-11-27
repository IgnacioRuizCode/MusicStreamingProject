import { type User } from '../../types/types';

function proximoMes(): string {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() + 1);
  return fecha.toISOString();
}

export const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@streaming.com',
    password: 'Admin123!',
    username: 'Admin',
    birthDate: '2001-04-20T00:00:00.000Z',
    role: 'admin',
    planId: 'plan-individual',
    nextPaymentDate: proximoMes(),
    savedPlaylists: ['pl-1', 'pl-2'],
    followedArtists: ['art-1', 'art-2'],
  },
  {
    id: 'user-demo',
    email: 'demo@streaming.com',
    password: 'User123!',
    username: 'MusicLover',
    birthDate: '2001-04-20T00:00:00.000Z',
    role: 'user',
    planId: 'plan-individual',
    nextPaymentDate: proximoMes(),
    card: { last4: '4242', brand: 'Visa' },
    savedPlaylists: ['pl-1', 'pl-3'],
    followedArtists: ['art-1', 'art-3', 'art-5'],
  },
];
