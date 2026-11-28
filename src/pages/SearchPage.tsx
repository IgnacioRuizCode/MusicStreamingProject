import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Music, Disc, User, Globe } from 'lucide-react';
import { getAll, search } from '../services/storageServices';
import { searchItunesSongs } from '../services/musicApiService';
import { usePlayerContext } from '../context/PlayerContext';
import { ArtistCard } from '../components/ArtistCard/ArtistCard';
import { CardPlaylist } from '../components/cardplaylist/CardPlaylist';
import type { Artist, Song } from '../types/types';
import './SearchPage.css';

interface SearchSongRowProps {
  song: Song;
  queue: Song[];
  artistName: string;
  onPlay: (song: Song, queue: Song[]) => void;
}

const SearchSongRow = memo(function SearchSongRow({
  song,
  queue,
  artistName,
  onPlay,
}: SearchSongRowProps) {
  return (
    <div className="search-song-row" onClick={() => onPlay(song, queue)}>
      <div className="search-song-row__left">
        <div className="search-song-row__cover-box">
          <img
            src={song.cover}
            alt={song.title}
            className="search-song-row__cover"
            loading="lazy"
            decoding="async"
          />
          <span className="search-song-row__play-overlay">
            <Play size={16} fill="currentColor" />
          </span>
        </div>
        <div className="search-song-row__meta">
          <strong>{song.title}</strong>
          <span>{artistName}</span>
        </div>
      </div>
      <span className="search-song-row__duration">
        {formatDuration(song.duration)}
      </span>
    </div>
  );
});

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const deferredQuery = useDeferredValue(query);
  const trimmedQuery = deferredQuery.trim();

  const [onlineState, setOnlineState] = useState<{
    term: string;
    songs: Song[];
  }>({ term: '', songs: [] });

  const { playSong } = usePlayerContext();

  const artists = useMemo(() => getAll('artists'), []);
  const allSongs = useMemo(() => getAll('songs'), []);
  const allPlaylists = useMemo(() => getAll('playlists'), []);
  const artistNameById = useMemo(
    () => new Map<string, string>(artists.map((artist: Artist) => [artist.id, artist.name])),
    [artists],
  );
  const results = useMemo(() => search(deferredQuery), [deferredQuery]);

  const handlePlayArtist = useCallback(
    (artistId: string, songIds?: string[]) => {
      const artistSongs = songIds?.length
        ? allSongs.filter((song) => songIds.includes(song.id))
        : allSongs.filter((song) => song.artistId === artistId);

      if (artistSongs.length > 0) {
        playSong(artistSongs[0], artistSongs);
      }
    },
    [allSongs, playSong],
  );

  const handlePlayPlaylist = useCallback(
    (playlistId: string) => {
      const playlist = allPlaylists.find((item) => item.id === playlistId);
      if (!playlist) return;

      const playlistSongs = playlist.songIds
        .map((songId) => allSongs.find((song) => song.id === songId))
        .filter((song): song is Song => Boolean(song));

      if (playlistSongs.length > 0) {
        playSong(playlistSongs[0], playlistSongs);
      }
    },
    [allPlaylists, allSongs, playSong],
  );

  const isSearchingOnline =
    trimmedQuery.length > 0 && onlineState.term !== trimmedQuery;
  const onlineSongs =
    trimmedQuery.length > 0 && onlineState.term === trimmedQuery
      ? onlineState.songs
      : [];

  useEffect(() => {
    if (!trimmedQuery) return;

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      const tracks = await searchItunesSongs(trimmedQuery, 8);
      if (!cancelled) {
        setOnlineState({ term: trimmedQuery, songs: tracks });
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [trimmedQuery]);

  const getArtistName = (artistId: string) =>
    artistNameById.get(artistId) ?? artistId;

  const hasQuery = trimmedQuery.length > 0;
  const noResults =
    hasQuery &&
    !isSearchingOnline &&
    results.songs.length === 0 &&
    results.artists.length === 0 &&
    results.playlists.length === 0 &&
    onlineSongs.length === 0;

  return (
    <main className="search-page">
      {!hasQuery ? (
        <section className="search-page__explore">
          <h2 className="search-page__section-title">Explorar playlists</h2>
          <div className="search-page__grid">
            {allPlaylists.map((playlist) => (
              <CardPlaylist
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                description={playlist.description}
                image={playlist.cover}
                songCount={playlist.songIds.length}
                onPlay={handlePlayPlaylist}
              />
            ))}
          </div>
        </section>
      ) : noResults ? (
        <div className="search-page__empty">
          <p>No se encontraron resultados para "{query}".</p>
          <span>Probá buscando otro título, artista o playlist.</span>
        </div>
      ) : (
        <div className="search-page__results">
          {results.songs.length > 0 && (
            <section className="search-page__section">
              <h2 className="search-page__section-title">
                <Music size={18} /> En tu catálogo
              </h2>
              <div className="search-songs-list">
                {results.songs.map((song) => (
                  <SearchSongRow
                    key={song.id}
                    song={song}
                    queue={results.songs}
                    artistName={getArtistName(song.artistId)}
                    onPlay={playSong}
                  />
                ))}
              </div>
            </section>
          )}

          {(isSearchingOnline || onlineSongs.length > 0) && (
            <section className="search-page__section">
              <h2 className="search-page__section-title">
                <Globe size={18} /> Resultados globales (Previews 30s)
              </h2>
              {isSearchingOnline ? (
                <p className="search-page__loading-text">Buscando canciones...</p>
              ) : (
                <div className="search-songs-list">
                  {onlineSongs.map((song) => (
                    <SearchSongRow
                      key={song.id}
                      song={song}
                      queue={onlineSongs}
                      artistName={song.artistId}
                      onPlay={playSong}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {results.artists.length > 0 && (
            <section className="search-page__section">
              <h2 className="search-page__section-title">
                <User size={18} /> Artistas
              </h2>
              <div className="search-page__grid">
                {results.artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    id={artist.id}
                    name={artist.name}
                    image={artist.image}
                    monthlyListeners={artist.monthlyListeners}
                    songIds={artist.songIds}
                    onPlay={handlePlayArtist}
                  />
                ))}
              </div>
            </section>
          )}

          {results.playlists.length > 0 && (
            <section className="search-page__section">
              <h2 className="search-page__section-title">
                <Disc size={18} /> Playlists
              </h2>
              <div className="search-page__grid">
                {results.playlists.map((playlist) => (
                  <CardPlaylist
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    description={playlist.description}
                    image={playlist.cover}
                    songCount={playlist.songIds.length}
                    onPlay={handlePlayPlaylist}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}