import { type Playlist } from '../types/types';

export const SEED_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    title: 'Top Hits 2026',
    description: 'The biggest tracks right now across all genres.',
    cover: 'https://picsum.photos/seed/pl1/400/400',
    creatorId: 'user-admin',
    songIds: ['song-1', 'song-5', 'song-17', 'song-29', 'song-13', 'song-9'],
  },
  {
    id: 'pl-2',
    title: 'Late Night Coding',
    description: 'Synthwave and lo-fi beats to stay focused.',
    cover: 'https://picsum.photos/seed/pl2/400/400',
    creatorId: 'user-admin',
    songIds: ['song-2', 'song-3', 'song-21', 'song-22', 'song-23', 'song-25'],
  },
  {
    id: 'pl-3',
    title: 'Workout Energy',
    description: 'High BPM tracks to push through your training.',
    cover: 'https://picsum.photos/seed/pl3/400/400',
    creatorId: 'user-admin',
    songIds: ['song-10', 'song-11', 'song-17', 'song-18', 'song-19', 'song-30'],
  },
  {
    id: 'pl-4',
    title: 'Chill Vibes',
    description: 'Relaxing melodies for a slow afternoon.',
    cover: 'https://picsum.photos/seed/pl4/400/400',
    creatorId: 'user-demo',
    songIds: ['song-6', 'song-14', 'song-15', 'song-21', 'song-24', 'song-32'],
  },
  {
    id: 'pl-5',
    title: 'Space Odyssey',
    description: 'Atmospheric electronic music for deep focus.',
    cover: 'https://picsum.photos/seed/pl5/400/400',
    creatorId: 'user-admin',
    songIds: ['song-7', 'song-8', 'song-25', 'song-26', 'song-27', 'song-28'],
  },
  {
    id: 'pl-6',
    title: 'Road Trip Classics',
    description: 'Turn up the volume and hit the highway.',
    cover: 'https://picsum.photos/seed/pl6/400/400',
    creatorId: 'user-demo',
    songIds: ['song-1', 'song-4', 'song-12', 'song-16', 'song-20', 'song-31'],
  },
];