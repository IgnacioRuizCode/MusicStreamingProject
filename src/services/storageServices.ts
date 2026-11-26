
import { STORAGE_KEYS, type StorageKey } from './storageKeys';
import {
  type Artist,
  type CollectionMap,
  type CollectionName,
  type Playlist,
  type SessionUser,
  type Song,
  type User,
} from '../types/types';
import { SEED_DATA } from '../seed';

export function read<T>(key: StorageKey, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(
      `[Storage] Corrupted data in "${key}". Restoring default value.`,
      error
    );
    save(key, defaultValue);
    return defaultValue;
  }
}

export function save<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Error saving "${key}":`, error);
  }
}

export function remove(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Error removing "${key}":`, error);
  }
}

export function initializeData(): void {
  const collections: CollectionName[] = [
    'users',
    'songs',
    'artists',
    'playlists',
    'plans',
  ];

  collections.forEach((col) => {
    const key = STORAGE_KEYS[col];
    const exists = localStorage.getItem(key);

    if (exists === null) {
      save(key, SEED_DATA[col]);
    } else {
      read(key, SEED_DATA[col]);

      if (col === 'songs') {
        const storedSongs = read<Song[]>(key, SEED_DATA.songs);

        const audioSongIds = [
          'song-1',
          'song-2',
          'song-3',
          'song-4',
          'song-5',
          'song-13',
          'song-17',
          'song-29',
        ];

        const updatedSongs = storedSongs.map((song) => {
          if (!audioSongIds.includes(song.id)) {
            return song;
          }

          const seedSong = SEED_DATA.songs.find(
            (seed) => seed.id === song.id
          );

          if (!seedSong) return song;

          return {
            ...song,
            title: seedSong.title,
            url: seedSong.url,
          };
        });

        save(key, updatedSongs);
      }
    }
  });
}

export function resetData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => remove(key));
  initializeData();
  console.info('[Storage] Data reset to initial seed.');
}

export function getAll<K extends CollectionName>(
  collection: K
): CollectionMap[K][] {
  return read<CollectionMap[K][]>(
    STORAGE_KEYS[collection],
    SEED_DATA[collection] as CollectionMap[K][]
  );
}

export function getById<K extends CollectionName>(
  collection: K,
  id: string
): CollectionMap[K] | undefined {
  const list = getAll(collection);
  return list.find((item) => item.id === id);
}

export function add<K extends CollectionName>(
  collection: K,
  newItem: Omit<CollectionMap[K], 'id'>
): CollectionMap[K] {
  const list = getAll(collection);
  const itemWithId = {
    ...newItem,
    id: crypto.randomUUID(),
  } as CollectionMap[K];

  save(STORAGE_KEYS[collection], [...list, itemWithId]);
  return itemWithId;
}

export function update<K extends CollectionName>(
  collection: K,
  id: string,
  changes: Partial<Omit<CollectionMap[K], 'id'>>
): CollectionMap[K] | null {
  const list = getAll(collection);
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const updated = { ...list[index], ...changes };
  list[index] = updated;
  save(STORAGE_KEYS[collection], list);
  return updated;
}

export function deleteById<K extends CollectionName>(
  collection: K,
  id: string
): boolean {
  const list = getAll(collection);
  const filtered = list.filter((item) => item.id !== id);

  if (filtered.length === list.length) return false;

  save(STORAGE_KEYS[collection], filtered);
  return true;
}

export function getSession(): SessionUser | null {
  return read<SessionUser | null>(STORAGE_KEYS.session, null);
}

export function saveSession(user: User | SessionUser): void {
  const safeUser = { ...user };
  delete (safeUser as Partial<User>).password;
  save<SessionUser>(STORAGE_KEYS.session, safeUser);
}

export function clearSession(): void {
  remove(STORAGE_KEYS.session);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getAll('users');
  return users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function getPlaylistSongs(playlistId: string): Song[] {
  const playlist = getById('playlists', playlistId);
  if (!playlist) return [];

  const allSongs = getAll('songs');
  return playlist.songIds
    .map((id) => allSongs.find((s) => s.id === id))
    .filter((s): s is Song => Boolean(s));
}

export function getArtistSongs(artistId: string): Song[] {
  const songs = getAll('songs');
  return songs.filter((s) => s.artistId === artistId);
}

export function getUserPlaylists(userId: string): Playlist[] {
  const user = getById('users', userId);
  const allPlaylists = getAll('playlists');

  return allPlaylists.filter(
    (p) =>
      p.creatorId === userId ||
      (user?.savedPlaylists.includes(p.id) ?? false)
  );
}

export function search(term: string): {
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
} {
  const query = term.trim().toLowerCase();
  if (!query) return { songs: [], artists: [], playlists: [] };

  const songs = getAll('songs').filter((s) =>
    s.title.toLowerCase().includes(query)
  );

  const artists = getAll('artists').filter((a) =>
    a.name.toLowerCase().includes(query)
  );

  const playlists = getAll('playlists').filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );

  return { songs, artists, playlists };
}
