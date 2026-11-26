import { type User } from '../../types/types';

export const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@streaming.com',
    password: 'Admin123!',
    username: 'Admin',
    birthDate: '2001-04-20T00:00:00.000Z',
    role: 'admin',
    planId: 'plan-individual',
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
    planId: 'plan-free',
    card: { last4: '4242', brand: 'Visa' },
    savedPlaylists: ['pl-1', 'pl-3'],
    followedArtists: ['art-1', 'art-3', 'art-5'],
  },
];