import { STORAGE_KEYS, type StorageKey } from './storageKeys';
import {
 type Artist,
 type CollectionMap,
 type CollectionName,
  type Playlist,
  type Plan,
  type SessionUser,
  type Song,
  type User,
  type Role,
} from '../types/types';
import { SEED_DATA } from '../data/seed';



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


function isPlanCollection(value: unknown): value is Plan[] {
  if (!Array.isArray(value)) return false;

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const plan = item as Partial<Plan>;
    return (
      typeof plan.id === 'string' &&
      typeof plan.nombre === 'string' &&
      typeof plan.precio === 'number' &&
      Array.isArray(plan.beneficios) &&
      typeof plan.destacado === 'boolean'
    );
  });
}

const LEGACY_PLAN_IDS: Record<string, string | null> = {
  'plan-free': null,
  'plan-family': 'plan-familiar',
};

function migrateUserPlanIds(): void {
  const planes = getAll('plans');
  const idsValidos = new Set(planes.map((plan) => plan.id));
  const usuarios = getAll('users');
  let huboCambios = false;

  const migrados = usuarios.map((usuario) => {
    let planId = usuario.planId;

    if (planId && planId in LEGACY_PLAN_IDS) {
      planId = LEGACY_PLAN_IDS[planId];
    }
    if (planId && !idsValidos.has(planId)) {
      planId = null;
    }
    if (planId === usuario.planId) return usuario;

    huboCambios = true;
    return {
      ...usuario,
      planId,
      card: planId ? usuario.card : undefined,
      nextPaymentDate: planId ? usuario.nextPaymentDate : undefined,
    };
  });

  if (huboCambios) save(STORAGE_KEYS.users, migrados);
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

    if (col === 'plans') {
      const stored = read<unknown>(key, null);
      if (!isPlanCollection(stored)) save(key, SEED_DATA.plans);
      return;
    }

    const exists = localStorage.getItem(key);

    if (exists === null) {
      save(key, SEED_DATA[col]);
    } else {
      read(key, SEED_DATA[col]);
    }
  });

  migrateUserPlanIds();
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

export function getPlans(): Plan[] {
  return getAll('plans');
}

export function getPlanById(planId: string): Plan | undefined {
  return getById('plans', planId);
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

export function deleteArtistWithCascade(artistId: string): {
  deletedSongsCount: number;
} {
  const deleted = deleteById('artists', artistId);
  if (!deleted) {
    throw new Error('Artista no encontrado');
  }

  const allSongs = getAll('songs');
  const artistSongIds = new Set(
    allSongs.filter((s) => s.artistId === artistId).map((s) => s.id)
  );

  if (artistSongIds.size > 0) {
    save(
      STORAGE_KEYS.songs,
      allSongs.filter((s) => s.artistId !== artistId)
    );

    const allPlaylists = getAll('playlists');
    const updatedPlaylists = allPlaylists.map((pl) => ({
      ...pl,
      songIds: pl.songIds.filter((songId) => !artistSongIds.has(songId)),
    }));
    save(STORAGE_KEYS.playlists, updatedPlaylists);
  }

  return { deletedSongsCount: artistSongIds.size };
}

export function countUsersByPlan(planId: string): number {
  return getAll('users').filter((u) => u.planId === planId).length;
}

export function deletePlanSafe(planId: string): void {
  const subscribedCount = countUsersByPlan(planId);
  if (subscribedCount > 0) {
    throw new Error(
      `No se puede eliminar este plan porque tiene ${subscribedCount} usuario(s) suscripto(s).`
    );
  }
  const deleted = deleteById('plans', planId);
  if (!deleted) throw new Error('Plan no encontrado.');
}

export function addSongWithSync(newSong: Omit<Song, 'id'>): Song {
  const created = add('songs', newSong);
  const artists = getAll('artists');
  const updatedArtists = artists.map((a) =>
    a.id === created.artistId
      ? { ...a, songIds: [...a.songIds, created.id] }
      : a
  );
  save(STORAGE_KEYS.artists, updatedArtists);
  return created;
}

export function deleteSongWithCascade(songId: string): { playlistsUpdated: number } {
  const deleted = deleteById('songs', songId);
  if (!deleted) throw new Error('Canción no encontrada.');

  const playlists = getAll('playlists');
  let playlistsUpdated = 0;
  const updatedPlaylists = playlists.map((pl) => {
    if (!pl.songIds.includes(songId)) return pl;
    playlistsUpdated++;
    return { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
  });
  if (playlistsUpdated > 0) {
    save(STORAGE_KEYS.playlists, updatedPlaylists);
  }

  const artists = getAll('artists');
  const updatedArtists = artists.map((a) =>
    a.songIds.includes(songId)
      ? { ...a, songIds: a.songIds.filter((id) => id !== songId) }
      : a
  );
  save(STORAGE_KEYS.artists, updatedArtists);

  return { playlistsUpdated };
}

export function updateUserAdmin(
  targetUserId: string,
  currentAdminId: string,
  changes: { role: Role; planId: string | null }
): User {
  if (targetUserId === currentAdminId && changes.role !== 'admin') {
    throw new Error('No podés quitarte tu propio rol de administrador.');
  }
  const updated = update('users', targetUserId, changes);
  if (!updated) throw new Error('Usuario no encontrado.');
  return updated;
}

export function deleteUserSafe(targetUserId: string, currentAdminId: string): void {
  if (targetUserId === currentAdminId) {
    throw new Error('No podés eliminar tu propia cuenta de administrador.');
  }
  const deleted = deleteById('users', targetUserId);
  if (!deleted) throw new Error('Usuario no encontrado.');
}

export function notifyStorageChange(): void {
  window.dispatchEvent(new Event('storage'));
}

export function createUserPlaylist(
  userId: string,
  data: { title: string; description?: string; cover?: string },
): Playlist {
  const defaultCover =
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';

  const created = add('playlists', {
    title: data.title.trim(),
    description: data.description?.trim() || 'Playlist creada por vos en Codify.',
    cover: data.cover?.trim() || defaultCover,
    creatorId: userId,
    songIds: [],
  });

  notifyStorageChange();
  return created;
}

export function deleteUserPlaylist(playlistId: string, userId: string): boolean {
  const playlist = getById('playlists', playlistId);
  if (!playlist || playlist.creatorId !== userId) return false;

  const deleted = deleteById('playlists', playlistId);
  if (deleted) notifyStorageChange();
  return deleted;
}

export function addSongToPlaylist(playlistId: string, songId: string): boolean {
  const playlist = getById('playlists', playlistId);
  if (!playlist || playlist.songIds.includes(songId)) return false;

  const updated = update('playlists', playlistId, {
    songIds: [...playlist.songIds, songId],
  });
  if (!updated) return false;

  notifyStorageChange();
  return true;
}

export function addSongsToPlaylist(
  playlistId: string,
  songIds: string[],
): Playlist | null {
  const playlist = getById('playlists', playlistId);
  if (!playlist) return null;

  const nuevos = songIds.filter((songId) => !playlist.songIds.includes(songId));
  if (nuevos.length === 0) return playlist;

  const updated = update('playlists', playlistId, {
    songIds: [...playlist.songIds, ...nuevos],
  });
  if (updated) notifyStorageChange();
  return updated;
}

export function removeSongFromPlaylist(
  playlistId: string,
  songId: string,
): boolean {
  const playlist = getById('playlists', playlistId);
  if (!playlist || !playlist.songIds.includes(songId)) return false;

  const updated = update('playlists', playlistId, {
    songIds: playlist.songIds.filter((id) => id !== songId),
  });
  if (!updated) return false;

  notifyStorageChange();
  return true;
}

export function importExternalSong(song: Song): Song | null {
  if (!song.url) return null;

  const existente = getAll('songs').find((item) => item.url === song.url);
  if (existente) return existente;

  const artistas = getAll('artists');
  const nombreArtista = song.artistId.trim();
  let artista = artistas.find(
    (item) => item.name.trim().toLowerCase() === nombreArtista.toLowerCase(),
  );

  if (!artista) {
    artista = add('artists', {
      name: nombreArtista,
      image: song.cover,
      monthlyListeners: 0,
      songIds: [],
    });
  }

  const created = add('songs', {
    title: song.title,
    artistId: artista.id,
    cover: song.cover,
    url: song.url,
    duration: song.duration,
  });

  const artistasActualizados = getAll('artists').map((item) =>
    item.id === artista?.id
      ? { ...item, songIds: [...item.songIds, created.id] }
      : item,
  );
  save(STORAGE_KEYS.artists, artistasActualizados);
  notifyStorageChange();

  return created;
}