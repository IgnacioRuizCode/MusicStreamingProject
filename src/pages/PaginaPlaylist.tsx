import { memo, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Pause, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getById,
  getPlaylistSongs,
  getAll,
} from '../services/storageServices';
import { usePlayerContext } from '../context/PlayerContext';
import { useDominantColor } from '../hooks/useDominantColor';
import type { Song } from '../types/types';
import './PaginaPlaylist.css';

function formatearDuracion(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
}

interface PlaylistSongRowProps {
  song: Song;
  index: number;
  artistName: string;
  isCurrent: boolean;
  isPlaying: boolean;
  onSelect: (song: Song, isCurrent: boolean) => void;
}

const PlaylistSongRow = memo(function PlaylistSongRow({
  song,
  index,
  artistName,
  isCurrent,
  isPlaying,
  onSelect,
}: PlaylistSongRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.3) }}
      className={`playlist-song ${isCurrent ? 'playlist-song--active' : ''}`}
      onClick={() => onSelect(song, isCurrent)}
    >
      <span className="playlist-song-number">
        <span className="song-index">
          {isCurrent && isPlaying ? (
            <Pause size={11} fill="currentColor" />
          ) : (
            index + 1
          )}
        </span>
        <span className="song-play">
          {isCurrent && isPlaying ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" />
          )}
        </span>
      </span>

      <div className="playlist-song-main">
        <img
          className="playlist-song-cover"
          src={song.cover}
          alt={song.title}
          loading="lazy"
          decoding="async"
        />
        <div className="playlist-song-titles">
          <strong className="playlist-song-name">{song.title}</strong>
          <span className="playlist-song-artist-mobile">{artistName}</span>
        </div>
      </div>

      <span className="playlist-song-artist">{artistName}</span>

      <span className="playlist-song-duration">
        {formatearDuracion(song.duration)}
      </span>
    </motion.div>
  );
});

export function PaginaPlaylist() {
  const { id } = useParams<{ id: string }>();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerContext();

  const playlist = useMemo(
    () => (id ? getById('playlists', id) : undefined),
    [id],
  );
  const headerColor = useDominantColor(playlist?.cover);

  const canciones = useMemo(
    () => (playlist ? getPlaylistSongs(playlist.id) : []),
    [playlist],
  );

  const artistNameById = useMemo(() => {
    const map = new Map<string, string>();
    getAll('artists').forEach((artist) => map.set(artist.id, artist.name));
    return map;
  }, []);

  const duracionTotal = useMemo(
    () => canciones.reduce((total, cancion) => total + cancion.duration, 0),
    [canciones],
  );

  const isPlaylistPlaying =
    isPlaying &&
    currentSong !== null &&
    canciones.some((cancion) => cancion.id === currentSong.id);

  const handlePlayAll = useCallback(() => {
    const firstSong = canciones[0];
    if (!firstSong) return;

    if (currentSong && canciones.some((cancion) => cancion.id === currentSong.id)) {
      togglePlay();
      return;
    }
    playSong(firstSong, canciones);
  }, [canciones, currentSong, playSong, togglePlay]);

  const handleSongSelect = useCallback(
    (song: Song, isCurrent: boolean) => {
      if (isCurrent) {
        togglePlay();
      } else {
        playSong(song, canciones);
      }
    },
    [canciones, playSong, togglePlay],
  );

  if (!playlist) {
    return (
      <main className="playlist-page">
        <div className="playlist-empty">
          <h1>Playlist no encontrada</h1>
          <Link to="/" className="playlist-back-link">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="playlist-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: `linear-gradient(180deg, ${headerColor} 0%, rgba(10, 10, 15, 0) 380px)`,
        borderRadius: '12px',
      }}
    >
      <header
        className="playlist-header"
        style={{
          background: `linear-gradient(135deg, ${headerColor}, rgba(15, 15, 25, 0.72))`,
        }}
      >
        <motion.img
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="playlist-cover"
          src={playlist.cover}
          alt={`Portada de ${playlist.title}`}
          decoding="async"
        />

        <div className="playlist-info">
          <span className="playlist-badge">
            <Sparkles size={13} /> Playlist editorial
          </span>

          <h1 className="playlist-title">{playlist.title}</h1>

          <p className="playlist-description">{playlist.description}</p>

          <p className="playlist-details">
            <strong>SoundWave</strong> · {canciones.length} canciones ·{' '}
            {formatearDuracion(duracionTotal)}
          </p>
        </div>
      </header>

      <section className="playlist-body">
        <div className="playlist-actions">
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="playlist-play-button"
            aria-label={isPlaylistPlaying ? 'Pausar playlist' : 'Reproducir playlist'}
            onClick={handlePlayAll}
            disabled={canciones.length === 0}
          >
            {isPlaylistPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" />
            )}
          </motion.button>
        </div>

        {canciones.length === 0 ? (
          <p className="playlist-empty">
            Esta playlist todavía no tiene canciones.
          </p>
        ) : (
          <div className="playlist-table">
            <div className="playlist-table-head">
              <span>#</span>
              <span>Título</span>
              <span className="playlist-head-artist">Artista</span>
              <span className="playlist-head-duration">
                <Clock size={15} />
              </span>
            </div>

            {canciones.map((cancion, index) => (
              <PlaylistSongRow
                key={cancion.id}
                song={cancion}
                index={index}
                artistName={artistNameById.get(cancion.artistId) ?? cancion.artistId}
                isCurrent={currentSong?.id === cancion.id}
                isPlaying={isPlaying}
                onSelect={handleSongSelect}
              />
            ))}
          </div>
        )}
      </section>
    </motion.main>
  );
}
