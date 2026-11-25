import { useMemo } from 'react';
import { Pause, Play } from 'lucide-react';
import { usePlayerContext } from '../context/PlayerContext';
import {
  getAll,
  getArtistSongs,
  getPlaylistSongs,
} from '../services/storageServices';
import type { Artist, Playlist, Song } from '../types/types';
import './HomePage.css';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function HomePage() {
  const songs = useMemo(() => getAll('songs'), []);
  const playlists = useMemo(() => getAll('playlists'), []);
  const artists = useMemo(() => getAll('artists'), []);

  const artistNameById = useMemo(() => {
    const map = new Map<string, string>();
    artists.forEach((artist: Artist) => map.set(artist.id, artist.name));
    return map;
  }, [artists]);

  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerContext();

  const handlePlaySong = (song: Song, customQueue: Song[] = songs) => {
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }
    playSong(song, customQueue);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    const playlistTracks = getPlaylistSongs(playlist.id);
    if (playlistTracks.length === 0) return;

    const isPlaylistCurrent = playlistTracks.some(
      (track) => track.id === currentSong?.id
    );
    if (isPlaylistCurrent && currentSong) {
      togglePlay();
      return;
    }
    playSong(playlistTracks[0], playlistTracks);
  };

  const handlePlayArtist = (artist: Artist) => {
    const artistTracks = getArtistSongs(artist.id);
    if (artistTracks.length === 0) return;

    const isArtistCurrent = artistTracks.some(
      (track) => track.id === currentSong?.id
    );
    if (isArtistCurrent && currentSong) {
      togglePlay();
      return;
    }
    playSong(artistTracks[0], artistTracks);
  };

  return (
    <div className="home-page">
      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Playlists destacadas</h2>
        </div>

        <div className="home-grid">
          {playlists.map((playlist) => {
            const isActivePlaylist =
              isPlaying &&
              currentSong !== null &&
              playlist.songIds.includes(currentSong.id);

            return (
              <article
                key={playlist.id}
                className="home-card"
                onClick={() => handlePlayPlaylist(playlist)}
              >
                <div className="home-card__media-wrap">
                  <div className="home-card__media">
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="home-card__img"
                    />
                  </div>
                  <button
                    type="button"
                    className={`home-card__play-btn ${
                      isActivePlaylist ? 'home-card__play-btn--active' : ''
                    }`}
                    aria-label={
                      isActivePlaylist
                        ? `Pausar ${playlist.title}`
                        : `Reproducir ${playlist.title}`
                    }
                  >
                    {isActivePlaylist ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>

                <h3 className="home-card__title">{playlist.title}</h3>
                <p className="home-card__subtitle">{playlist.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Artistas populares</h2>
        </div>

        <div className="home-grid">
          {artists.map((artist) => {
            const isActiveArtist =
              isPlaying && currentSong?.artistId === artist.id;

            return (
              <article
                key={artist.id}
                className="home-card"
                onClick={() => handlePlayArtist(artist)}
              >
                <div className="home-card__media-wrap">
                  <div className="home-card__media home-card__media--round">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="home-card__img"
                    />
                  </div>
                  <button
                    type="button"
                    className={`home-card__play-btn ${
                      isActiveArtist ? 'home-card__play-btn--active' : ''
                    }`}
                    aria-label={`Reproducir canciones de ${artist.name}`}
                  >
                    {isActiveArtist ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>

                <h3 className="home-card__title">{artist.name}</h3>
                <p className="home-card__subtitle">
                  {artist.monthlyListeners.toLocaleString('es-AR')} oyentes
                  mensuales
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Canciones para vos</h2>
        </div>

        <div className="home-songs">
          {songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            const artistName =
              artistNameById.get(song.artistId) ?? 'Artista desconocido';

            return (
              <div
                key={song.id}
                className={`home-song-row ${
                  isCurrent ? 'home-song-row--active' : ''
                }`}
                onClick={() => handlePlaySong(song)}
              >
                <span className="home-song-row__index">{index + 1}</span>

                <img
                  src={song.cover}
                  alt={song.title}
                  className="home-song-row__cover"
                />

                <div className="home-song-row__info">
                  <div className="home-song-row__title">{song.title}</div>
                  <div className="home-song-row__artist">{artistName}</div>
                </div>

                <span className="home-song-row__duration">
                  {formatDuration(song.duration)}
                </span>

                <button
                  type="button"
                  className="home-song-row__btn"
                  aria-label={
                    isCurrent && isPlaying
                      ? `Pausar ${song.title}`
                      : `Reproducir ${song.title}`
                  }
                >
                  {isCurrent && isPlaying ? (
                    <Pause size={15} />
                  ) : (
                    <Play size={15} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}