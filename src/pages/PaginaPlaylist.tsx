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
import './PaginaPlaylist.css';

function PaginaPlaylist() {
  const { id } = useParams<{ id: string }>();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerContext();
  const playlist = id ? getById('playlists', id) : undefined;
  const headerColor = useDominantColor(playlist?.cover);

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

  const canciones = getPlaylistSongs(playlist.id);
  const artistas = getAll('artists');

  const obtenerArtista = (artistId: string) =>
    artistas.find((a) => a.id === artistId)?.name ?? artistId;

  const formatearDuracion = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  const duracionTotal = canciones.reduce((total, c) => total + c.duration, 0);
  const isPlaylistPlaying =
    isPlaying &&
    currentSong !== null &&
    canciones.some((c) => c.id === currentSong.id);

  const handlePlayAll = () => {
    if (canciones.length === 0) return;
    if (currentSong && canciones.some((c) => c.id === currentSong.id)) {
      togglePlay();
      return;
    }
    playSong(canciones[0], canciones);
  };

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

            {canciones.map((cancion, index) => {
              const isCurrent = currentSong?.id === cancion.id;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.3) }}
                  className={`playlist-song ${isCurrent ? 'playlist-song--active' : ''}`}
                  key={cancion.id}
                  onClick={() => {
                    if (isCurrent) {
                      togglePlay();
                    } else {
                      playSong(cancion, canciones);
                    }
                  }}
                >
                  <span className="playlist-song-number">
                    <span className="song-index">
                      {isCurrent && isPlaying ? '❚❚' : index + 1}
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
                      src={cancion.cover}
                      alt={cancion.title}
                    />
                    <div className="playlist-song-titles">
                      <strong className="playlist-song-name">
                        {cancion.title}
                      </strong>
                      <span className="playlist-song-artist-mobile">
                        {obtenerArtista(cancion.artistId)}
                      </span>
                    </div>
                  </div>

                  <span className="playlist-song-artist">
                    {obtenerArtista(cancion.artistId)}
                  </span>

                  <span className="playlist-song-duration">
                    {formatearDuracion(cancion.duration)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </motion.main>
  );
}

export default PaginaPlaylist;