import { useMemo, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Play, Music, Disc, User, Globe } from 'lucide-react';
import { getAll, search } from '../services/storageServices';
import { searchItunesSongs } from '../services/musicApiService';
import { usePlayerContext } from '../context/PlayerContext';
import type { Song } from '../types/types';
import './SearchPage.css';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [onlineState, setOnlineState] = useState<{
    term: string;
    songs: Song[];
  }>({ term: '', songs: [] });

  const { playSong } = usePlayerContext();

  const artists = useMemo(() => getAll('artists'), []);
  const allPlaylists = useMemo(() => getAll('playlists'), []);
  const results = useMemo(() => search(query), [query]);

  const trimmedQuery = query.trim();
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
    artists.find((a) => a.id === artistId)?.name ?? artistId;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="search-card"
              >
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="search-card__cover"
                />
                <strong className="search-card__title">{playlist.title}</strong>
                <span className="search-card__subtitle">
                  {playlist.description}
                </span>
              </Link>
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
                  <div
                    key={song.id}
                    className="search-song-row"
                    onClick={() => playSong(song, results.songs)}
                  >
                    <div className="search-song-row__left">
                      <div className="search-song-row__cover-box">
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="search-song-row__cover"
                        />
                        <span className="search-song-row__play-overlay">
                          <Play size={16} fill="currentColor" />
                        </span>
                      </div>
                      <div className="search-song-row__meta">
                        <strong>{song.title}</strong>
                        <span>{getArtistName(song.artistId)}</span>
                      </div>
                    </div>
                    <span className="search-song-row__duration">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
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
                <p className="search-card__subtitle">Buscando canciones...</p>
              ) : (
                <div className="search-songs-list">
                  {onlineSongs.map((song) => (
                    <div
                      key={song.id}
                      className="search-song-row"
                      onClick={() => playSong(song, onlineSongs)}
                    >
                      <div className="search-song-row__left">
                        <div className="search-song-row__cover-box">
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="search-song-row__cover"
                          />
                          <span className="search-song-row__play-overlay">
                            <Play size={16} fill="currentColor" />
                          </span>
                        </div>
                        <div className="search-song-row__meta">
                          <strong>{song.title}</strong>
                          <span>{song.artistId}</span>
                        </div>
                      </div>
                      <span className="search-song-row__duration">
                        {formatDuration(song.duration)}
                      </span>
                    </div>
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
                  <Link
                    key={artist.id}
                    to={`/artista/${artist.id}`}
                    className="search-card search-card--artist"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="search-card__cover search-card__cover--round"
                    />
                    <strong className="search-card__title">{artist.name}</strong>
                    <span className="search-card__subtitle">Artista</span>
                  </Link>
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
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="search-card"
                  >
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="search-card__cover"
                    />
                    <strong className="search-card__title">
                      {playlist.title}
                    </strong>
                    <span className="search-card__subtitle">
                      {playlist.description}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
