import { memo, useCallback, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bookmark,
  Check,
  Clock,
  Heart,
  ListPlus,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  getById,
  getPlaylistSongs,
  getAll,
  notifyStorageChange,
  update,
} from '../services/storageServices';
import { usePlayerContext } from '../context/PlayerContext';
import { useAuth } from '../hooks/useAuth';
import { useDominantColor } from '../hooks/useDominantColor';
import { AgregarAPlaylistModal } from '../components/AgregarAPlaylistModal';
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
  isLiked: boolean;
  canInteract: boolean;
  isOwner: boolean;
  onSelect: (song: Song, isCurrent: boolean) => void;
  onToggleLike: (song: Song) => void;
  onOpenAddPlaylist: (song: Song) => void;
  onRemoveFromPlaylist?: (song: Song) => void;
}

const PlaylistSongRow = memo(function PlaylistSongRow({
  song,
  index,
  artistName,
  isCurrent,
  isPlaying,
  isLiked,
  canInteract,
  isOwner,
  onSelect,
  onToggleLike,
  onOpenAddPlaylist,
  onRemoveFromPlaylist,
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

      <span
        className="playlist-song-duration"
        onClick={(e) => e.stopPropagation()}
      >
        {canInteract && (
          <>
            <button
              type="button"
              className={`playlist-song-action-btn${isLiked ? ' is-liked' : ''}`}
              aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              title={isLiked ? 'Quitar de favoritos' : 'Me gusta'}
              onClick={() => onToggleLike(song)}
            >
              <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
            </button>

            <button
              type="button"
              className="playlist-song-action-btn"
              aria-label="Agregar a una playlist"
              title="Agregar a mi playlist"
              onClick={() => onOpenAddPlaylist(song)}
            >
              <ListPlus size={15} />
            </button>

            {isOwner && onRemoveFromPlaylist && (
              <button
                type="button"
                className="playlist-song-action-btn playlist-song-action-btn--danger"
                aria-label="Quitar de esta playlist"
                title="Quitar de esta playlist"
                onClick={() => onRemoveFromPlaylist(song)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </>
        )}
        <span>{formatearDuracion(song.duration)}</span>
      </span>
    </motion.div>
  );
});

export function PaginaPlaylist() {
  const { id } = useParams<{ id: string }>();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerContext();
  const { user, toggleSavedPlaylist, toggleLikedSong } = useAuth();
  const [refreshTick, setRefreshTick] = useState(0);
  const [songForPlaylist, setSongForPlaylist] = useState<Song | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const playlist = useMemo(() => {
    void refreshTick;
    return id ? getById('playlists', id) : undefined;
  }, [id, refreshTick]);

  const headerColor = useDominantColor(playlist?.cover);

  const canciones = useMemo(() => {
    void refreshTick;
    return playlist ? getPlaylistSongs(playlist.id) : [];
  }, [playlist, refreshTick]);

  const allSongs = useMemo(() => getAll('songs'), []);

  const creatorName = useMemo(() => {
    if (!playlist) return 'Codify';
    const creator = getById('users', playlist.creatorId);
    return creator?.username ?? 'Codify';
  }, [playlist]);

  const artistNameById = useMemo(() => {
    const map = new Map<string, string>();
    getAll('artists').forEach((artist) => map.set(artist.id, artist.name));
    return map;
  }, []);

  const candidateSongs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = q
      ? allSongs.filter((song) => {
          const artist = (artistNameById.get(song.artistId) ?? '').toLowerCase();
          return (
            song.title.toLowerCase().includes(q) || artist.includes(q)
          );
        })
      : allSongs;
    return filtered.slice(0, 8);
  }, [allSongs, artistNameById, searchTerm]);

  const duracionTotal = useMemo(
    () => canciones.reduce((total, cancion) => total + cancion.duration, 0),
    [canciones],
  );

  const isOwner = Boolean(user && playlist && playlist.creatorId === user.id);
  const isSaved = Boolean(
    user && playlist && user.savedPlaylists.includes(playlist.id),
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

  const handleToggleLike = useCallback(
    (song: Song) => {
      if (!user) return;
      const yaTieneLike = user.likedSongs?.includes(song.id) ?? false;
      toggleLikedSong(song.id);
      toast.success(
        yaTieneLike
          ? `"${song.title}" quitada de favoritos`
          : `"${song.title}" agregada a favoritos`,
      );
    },
    [toggleLikedSong, user],
  );

  const handleRemoveFromPlaylist = useCallback(
    (song: Song) => {
      if (!playlist || !isOwner) return;
      update('playlists', playlist.id, {
        songIds: playlist.songIds.filter((sId) => sId !== song.id),
      });
      notifyStorageChange();
      setRefreshTick((v) => v + 1);
      toast.info(`"${song.title}" quitada de la playlist`);
    },
    [isOwner, playlist],
  );

  const handleQuickAddToCurrent = useCallback(
    (song: Song) => {
      if (!playlist || !isOwner) return;
      if (playlist.songIds.includes(song.id)) {
        toast.info('Esa canción ya está en esta playlist');
        return;
      }
      update('playlists', playlist.id, {
        songIds: [...playlist.songIds, song.id],
      });
      notifyStorageChange();
      setRefreshTick((v) => v + 1);
      toast.success(`"${song.title}" agregada a "${playlist.title}"`);
    },
    [isOwner, playlist],
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
            <Sparkles size={13} /> {isOwner ? 'Tu playlist' : 'Playlist editorial'}
          </span>

          <h1 className="playlist-title">{playlist.title}</h1>

          <p className="playlist-description">{playlist.description}</p>

          <p className="playlist-details">
            <strong>{creatorName}</strong> · {canciones.length} canciones ·{' '}
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

          {user && !isOwner && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                toggleSavedPlaylist(playlist.id);
                toast.success(
                  isSaved
                    ? 'Playlist quitada de tu biblioteca'
                    : 'Playlist guardada en tu biblioteca',
                );
              }}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Guardada' : 'Guardar en biblioteca'}
            </button>
          )}
        </div>

        {canciones.length === 0 ? (
          <p className="playlist-empty">
            Esta playlist todavía no tiene canciones.{' '}
            {isOwner && 'Buscá abajo para agregar tus primeras canciones.'}
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
                isLiked={user?.likedSongs?.includes(cancion.id) ?? false}
                canInteract={Boolean(user)}
                isOwner={isOwner}
                onSelect={handleSongSelect}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(s) => setSongForPlaylist(s)}
                onRemoveFromPlaylist={handleRemoveFromPlaylist}
              />
            ))}
          </div>
        )}

        {isOwner && (
          <div className="playlist-finder">
            <div className="playlist-finder__header">
              <h2 className="playlist-finder__title">
                Buscá canciones para tu playlist
              </h2>
              <div className="playlist-finder__input-wrap">
                <Search size={16} className="playlist-finder__icon" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por canción o artista..."
                  className="playlist-finder__input"
                  aria-label="Buscar canciones para agregar a la playlist"
                />
              </div>
            </div>

            <div className="playlist-finder__list">
              {candidateSongs.map((song) => {
                const alreadyInPlaylist = playlist.songIds.includes(song.id);
                const artistName =
                  artistNameById.get(song.artistId) ?? 'Artista desconocido';

                return (
                  <div key={song.id} className="playlist-finder__row">
                    <img
                      src={song.cover}
                      alt=""
                      className="playlist-finder__cover"
                      loading="lazy"
                    />
                    <div className="playlist-finder__meta">
                      <strong>{song.title}</strong>
                      <span>{artistName}</span>
                    </div>
                    <button
                      type="button"
                      className={`playlist-finder__add-btn${alreadyInPlaylist ? ' is-added' : ''}`}
                      disabled={alreadyInPlaylist}
                      onClick={() => handleQuickAddToCurrent(song)}
                    >
                      {alreadyInPlaylist ? (
                        <>
                          <Check size={14} /> Agregada
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Agregar
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <AgregarAPlaylistModal
        song={songForPlaylist}
        userId={user?.id}
        onClose={() => setSongForPlaylist(null)}
        onAdded={() => setRefreshTick((v) => v + 1)}
      />
    </motion.main>
  );
}