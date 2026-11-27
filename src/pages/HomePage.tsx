import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc3, ListPlus, Pause, Play, Users } from 'lucide-react';
import { usePlayerContext } from '../context/PlayerContext';
import { useAuth } from '../hooks/useAuth';
import {
  getAll,
  getArtistSongs,
  getPlaylistSongs,
} from '../services/storageServices';
import { AgregarAPlaylistModal } from '../components/AgregarAPlaylistModal';
import type { Artist, Playlist, Song } from '../types/types';
import './HomePage.css';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface HomePlaylistCardProps {
  playlist: Playlist;
  isActive: boolean;
  onOpen: (playlistId: string) => void;
  onPlay: (playlist: Playlist) => void;
}

const HomePlaylistCard = memo(function HomePlaylistCard({
  playlist,
  isActive,
  onOpen,
  onPlay,
}: HomePlaylistCardProps) {
  return (
    <article
      className={`home-flip-card${isActive ? ' is-playing' : ''}`}
      tabIndex={0}
      onClick={() => onOpen(playlist.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(playlist.id);
        }
      }}
    >
      <div className="home-flip-card__inner">
        <div className="home-flip-card__face home-flip-card__front">
          <div className="home-flip-card__media">
            <img
              src={playlist.cover}
              alt={playlist.title}
              className="home-flip-card__img"
              loading="lazy"
              decoding="async"
            />
          </div>
          <h3 className="home-flip-card__title">{playlist.title}</h3>
        </div>

        <div className="home-flip-card__face home-flip-card__back">
          <div className="home-flip-card__back-top">
            <span className="home-flip-card__badge">
              <Disc3 size={13} aria-hidden="true" />
              Playlist • {playlist.songIds.length} temas
            </span>
            <h3 className="home-flip-card__back-title">{playlist.title}</h3>
            <p className="home-flip-card__back-desc">
              {playlist.description || 'Selección curada para escuchar sin límites.'}
            </p>
          </div>

          <div className="home-flip-card__back-actions">
            <button
              type="button"
              className="home-flip-card__play-btn"
              onClick={(event) => {
                event.stopPropagation();
                onPlay(playlist);
              }}
              aria-label={isActive ? `Pausar ${playlist.title}` : `Reproducir ${playlist.title}`}
            >
              {isActive ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              <span>{isActive ? 'Pausar' : 'Reproducir'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

interface HomeArtistCardProps {
  artist: Artist;
  isActive: boolean;
  onOpen: (artistId: string) => void;
  onPlay: (artist: Artist) => void;
}

const HomeArtistCard = memo(function HomeArtistCard({
  artist,
  isActive,
  onOpen,
  onPlay,
}: HomeArtistCardProps) {
  return (
    <article
      className={`home-flip-card${isActive ? ' is-playing' : ''}`}
      tabIndex={0}
      onClick={() => onOpen(artist.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(artist.id);
        }
      }}
    >
      <div className="home-flip-card__inner">
        <div className="home-flip-card__face home-flip-card__front">
          <div className="home-flip-card__media home-flip-card__media--round">
            <img
              src={artist.image}
              alt={artist.name}
              className="home-flip-card__img"
              loading="lazy"
              decoding="async"
            />
          </div>
          <h3 className="home-flip-card__title home-flip-card__title--center">
            {artist.name}
          </h3>
        </div>

        <div className="home-flip-card__face home-flip-card__back">
          <div className="home-flip-card__back-top">
            <span className="home-flip-card__badge">
              <Users size={13} aria-hidden="true" />
              Artista verificado
            </span>
            <h3 className="home-flip-card__back-title">{artist.name}</h3>
            <p className="home-flip-card__back-desc">
              {artist.monthlyListeners.toLocaleString('es-AR')} oyentes mensuales
            </p>
          </div>

          <div className="home-flip-card__back-actions">
            <button
              type="button"
              className="home-flip-card__play-btn"
              onClick={(event) => {
                event.stopPropagation();
                onPlay(artist);
              }}
              aria-label={isActive ? `Pausar ${artist.name}` : `Reproducir canciones de ${artist.name}`}
            >
              {isActive ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              <span>{isActive ? 'Pausar' : 'Escuchar'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

interface HomeSongRowProps {
  song: Song;
  index: number;
  artistName: string;
  isCurrent: boolean;
  isPlaying: boolean;
  canAddToPlaylist: boolean;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

const HomeSongRow = memo(function HomeSongRow({
  song,
  index,
  artistName,
  isCurrent,
  isPlaying,
  canAddToPlaylist,
  onPlay,
  onAddToPlaylist,
}: HomeSongRowProps) {
  return (
    <div
      className={`home-song-row${isCurrent ? ' home-song-row--active' : ''}`}
      onClick={() => onPlay(song)}
    >
      <span className="home-song-row__index">{index + 1}</span>

      <img
        src={song.cover}
        alt={song.title}
        className="home-song-row__cover"
        loading="lazy"
        decoding="async"
      />

      <div className="home-song-row__info">
        <div className="home-song-row__title">{song.title}</div>
        <div className="home-song-row__artist">{artistName}</div>
      </div>

      {canAddToPlaylist && (
        <button
          type="button"
          className="home-song-row__add-btn"
          aria-label={`Agregar ${song.title} a una playlist`}
          title="Agregar a una playlist"
          onClick={(event) => {
            event.stopPropagation();
            onAddToPlaylist(song);
          }}
        >
          <ListPlus size={16} />
        </button>
      )}

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
        {isCurrent && isPlaying ? <Pause size={15} /> : <Play size={15} />}
      </button>
    </div>
  );
});

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [songForPlaylist, setSongForPlaylist] = useState<Song | null>(null);

  const songs = useMemo(() => getAll('songs'), []);
  const playlists = useMemo(() => getAll('playlists'), []);
  const artists = useMemo(() => getAll('artists'), []);

  const artistNameById = useMemo(() => {
    const map = new Map<string, string>();
    artists.forEach((artist: Artist) => map.set(artist.id, artist.name));
    return map;
  }, [artists]);

  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerContext();

  const handleOpenPlaylist = useCallback(
    (playlistId: string) => navigate(`/playlist/${playlistId}`),
    [navigate],
  );

  const handleOpenArtist = useCallback(
    (artistId: string) => navigate(`/artista/${artistId}`),
    [navigate],
  );

  const handlePlaySong = useCallback(
    (song: Song) => {
      if (currentSong?.id === song.id) {
        togglePlay();
        return;
      }
      playSong(song, songs);
    },
    [currentSong?.id, playSong, songs, togglePlay],
  );

  const handlePlayPlaylist = useCallback(
    (playlist: Playlist) => {
      const playlistTracks = getPlaylistSongs(playlist.id);
      if (playlistTracks.length === 0) return;

      const isPlaylistCurrent = playlistTracks.some(
        (track) => track.id === currentSong?.id,
      );
      if (isPlaylistCurrent && currentSong) {
        togglePlay();
        return;
      }
      playSong(playlistTracks[0], playlistTracks);
    },
    [currentSong, playSong, togglePlay],
  );

  const handlePlayArtist = useCallback(
    (artist: Artist) => {
      const artistTracks = getArtistSongs(artist.id);
      if (artistTracks.length === 0) return;

      const isArtistCurrent = artistTracks.some(
        (track) => track.id === currentSong?.id,
      );
      if (isArtistCurrent && currentSong) {
        togglePlay();
        return;
      }
      playSong(artistTracks[0], artistTracks);
    },
    [currentSong, playSong, togglePlay],
  );

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
              <HomePlaylistCard
                key={playlist.id}
                playlist={playlist}
                isActive={isActivePlaylist}
                onOpen={handleOpenPlaylist}
                onPlay={handlePlayPlaylist}
              />
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
              <HomeArtistCard
                key={artist.id}
                artist={artist}
                isActive={isActiveArtist}
                onOpen={handleOpenArtist}
                onPlay={handlePlayArtist}
              />
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Canciones para vos</h2>
        </div>

        <div className="home-songs">
          {songs.map((song, index) => (
            <HomeSongRow
              key={song.id}
              song={song}
              index={index}
              artistName={artistNameById.get(song.artistId) ?? 'Artista desconocido'}
              isCurrent={currentSong?.id === song.id}
              isPlaying={isPlaying}
              canAddToPlaylist={Boolean(user)}
              onPlay={handlePlaySong}
              onAddToPlaylist={setSongForPlaylist}
            />
          ))}
        </div>
      </section>

      <AgregarAPlaylistModal
        song={songForPlaylist}
        userId={user?.id}
        onClose={() => setSongForPlaylist(null)}
      />
    </div>
  );
}