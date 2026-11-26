import { getAll, save } from './storageServices';
import { STORAGE_KEYS } from './storageKeys';
import type { Artist, Song } from '../types/types';

interface ItunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl?: string;
}

const HYDRATED_FLAG_KEY = 'catalog_hydrated_v1';

export async function searchItunesSongs(term: string, limit = 12): Promise<Song[]> {
  if (!term.trim()) return [];

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`
    );
    if (!response.ok) return [];

    const data = await response.json();
    const tracks: ItunesTrack[] = data.results ?? [];

    return tracks
      .filter((t) => Boolean(t.previewUrl))
      .map((t) => ({
        id: `itunes-${t.trackId}`,
        title: t.trackName,
        artistId: t.artistName,
        cover: t.artworkUrl100.replace('100x100bb', '600x600bb'),
        url: t.previewUrl!,
        duration: 30,
      }));
  } catch {
    return [];
  }
}

export async function hydrateCatalogWithRealMedia(): Promise<void> {
  if (localStorage.getItem(HYDRATED_FLAG_KEY) === 'true') return;

  const songs = getAll('songs');
  const artists = getAll('artists');
  const artistMap = new Map<string, Artist>(artists.map((a) => [a.id, a]));

  const updatedSongs = await Promise.all(
    songs.map(async (song) => {
      const artist = artistMap.get(song.artistId);
      if (!artist) return song;

      try {
        const query = `${artist.name} ${song.title}`;
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`
        );
        if (!res.ok) return song;

        const data = await res.json();
        const match: ItunesTrack | undefined = data.results?.[0];
        if (!match?.previewUrl) return song;

        return {
          ...song,
          cover: match.artworkUrl100.replace('100x100bb', '600x600bb'),
          url: match.previewUrl,
          duration: 30,
        };
      } catch {
        return song;
      }
    })
  );

  save(STORAGE_KEYS.songs, updatedSongs);

  const updatedArtists = artists.map((artist) => {
    const firstSong = updatedSongs.find((s) => s.artistId === artist.id);
    return firstSong ? { ...artist, image: firstSong.cover } : artist;
  });
  save(STORAGE_KEYS.artists, updatedArtists);

  const playlists = getAll('playlists');
  const updatedPlaylists = playlists.map((pl) => {
    const firstTrack = updatedSongs.find((s) => s.id === pl.songIds[0]);
    return firstTrack ? { ...pl, cover: firstTrack.cover } : pl;
  });
  save(STORAGE_KEYS.playlists, updatedPlaylists);

  localStorage.setItem(HYDRATED_FLAG_KEY, 'true');
}