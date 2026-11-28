import { memo, useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ListPlus, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  addSongToPlaylist,
  getAll,
  getArtistSongs,
  getById,
} from '../services/storageServices';
import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';
import type { Artist, Song } from '../types/types';
import './PaginaArtista.css';

function formatearDuracion(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos}:${String(segundosRestantes).padStart(2, '0')}`;
}

function formatearOyentes(cantidad: number): string {
  return new Intl.NumberFormat('es-AR').format(cantidad);
}

interface ArtistSongRowProps {
  song: Song;
  index: number;
  isLiked: boolean;
  canInteract: boolean;
  onPlay: (song: Song) => void;
  onToggleLike: (song: Song) => void;
  onOpenAddPlaylist: (song: Song) => void;
}

const ArtistSongRow = memo(function ArtistSongRow({
  song,
  index,
  isLiked,
  canInteract,
  onPlay,
  onToggleLike,
  onOpenAddPlaylist,
}: ArtistSongRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="artist-song-row"
      onClick={() => onPlay(song)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay(song);
        }
      }}
    >
      <span className="artist-song-number">{index + 1}</span>

      <img
        className="artist-song-cover"
        src={song.cover}
        alt={`Portada de ${song.title}`}
        loading="lazy"
        decoding="async"
      />

      <span className="artist-song-title">{song.title}</span>

      {canInteract && (
        <div
          className="artist-song-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`artist-song-action-btn${isLiked ? ' is-liked' : ''}`}
            aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            title={isLiked ? 'Quitar de favoritos' : 'Me gusta'}
            onClick={() => onToggleLike(song)}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            className="artist-song-action-btn"
            aria-label="Agregar a una playlist"
            title="Agregar a mi playlist"
            onClick={() => onOpenAddPlaylist(song)}
          >
            <ListPlus size={16} />
          </button>
        </div>
      )}

      <span className="artist-song-duration">
        {formatearDuracion(song.duration)}
      </span>
    </div>
  );
});

export function PaginaArtista() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { playSong } = usePlayer();
  const { user, loading, toggleFollowedArtist, toggleLikedSong } = useAuth();

  const [mostrarTodasKey, setMostrarTodasKey] = useState<string | null>(null);
  const [songForPlaylist, setSongForPlaylist] = useState<Song | null>(null);

  const artista = useMemo<Artist | undefined>(
    () => (id ? getById('artists', id) : undefined),
    [id],
  );

  const canciones = useMemo<Song[]>(
    () => (artista ? getArtistSongs(artista.id) : []),
    [artista],
  );

  const userCreatedPlaylists = useMemo(() => {
    if (!user) return [];
    return getAll('playlists').filter((p) => p.creatorId === user.id);
  }, [user]);

  const mostrarTodas = Boolean(artista && mostrarTodasKey === artista.id);
  const cancionesPopulares = useMemo(
    () => (mostrarTodas ? canciones : canciones.slice(0, 5)),
    [canciones, mostrarTodas],
  );

  const estaSiguiendo = Boolean(
    user && artista && user.followedArtists.includes(artista.id),
  );

  const reproducirCancion = useCallback(
    (cancion: Song) => {
      playSong(cancion, canciones, { type: 'artist', id: artista?.id });
    },
    [artista?.id, canciones, playSong],
  );

  const reproducirArtista = useCallback(() => {
    const primeraCancion = canciones[0];
    if (primeraCancion) {
      playSong(primeraCancion, canciones, { type: 'artist', id: artista?.id });
    }
  }, [artista?.id, canciones, playSong]);

  const cambiarSeguimiento = useCallback(() => {
    if (loading || !artista) return;

    if (!user) {
      navigate('/login');
      return;
    }

    toggleFollowedArtist(artista.id);
    toast.success(
      estaSiguiendo
        ? `Dejaste de seguir a ${artista.name}`
        : `Ahora seguís a ${artista.name}`,
    );
  }, [artista, estaSiguiendo, loading, navigate, toggleFollowedArtist, user]);

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

  const handleAddSongToPlaylist = (playlistId: string, songId: string) => {
    const pl = getById('playlists', playlistId);
    if (!pl) return;
    if (pl.songIds.includes(songId)) {
      toast.info('Esa canción ya está en la playlist');
      setSongForPlaylist(null);
      return;
    }
    addSongToPlaylist(playlistId, songId);
    toast.success(`Agregada a "${pl.title}"`);
    setSongForPlaylist(null);
  };

  if (!artista) {
    return (
      <main className="artist-not-found">
        <h1>Artista no encontrado</h1>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  return (
    <main className="artist-page">
      <header
        className="artist-header"
        style={{
          backgroundImage: `linear-gradient(to top, #121212 5%, rgba(18,18,18,.35)), url(${artista.image})`,
        }}
      >
        <div className="artist-header-content">
          <span className="artist-label">Artista</span>
          <h1>{artista.name}</h1>
          <p>{formatearOyentes(artista.monthlyListeners)} oyentes mensuales</p>
        </div>
      </header>

      <section className="artist-actions">
        <button
          className="artist-play-button"
          onClick={reproducirArtista}
          disabled={canciones.length === 0}
          aria-label="Reproducir canciones del artista"
        >
          <Play size={24} fill="currentColor" />
        </button>

        <button
          className={`artist-follow-button ${estaSiguiendo ? 'following' : ''}`}
          onClick={cambiarSeguimiento}
          disabled={loading}
          aria-pressed={estaSiguiendo}
        >
          {estaSiguiendo ? 'Siguiendo' : 'Seguir'}
        </button>
      </section>

      <section className="artist-songs-section">
        <h2>Populares</h2>

        {canciones.length === 0 ? (
          <p className="artist-empty">
            Este artista todavía no tiene canciones disponibles.
          </p>
        ) : (
          <div className="artist-songs-list">
            {cancionesPopulares.map((cancion, index) => (
              <ArtistSongRow
                key={cancion.id}
                song={cancion}
                index={index}
                isLiked={user?.likedSongs?.includes(cancion.id) ?? false}
                canInteract={Boolean(user)}
                onPlay={reproducirCancion}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(s) => setSongForPlaylist(s)}
              />
            ))}
          </div>
        )}

        {canciones.length > 5 && (
          <button
            className="artist-show-more"
            onClick={() =>
              setMostrarTodasKey((prev) => (prev === artista.id ? null : artista.id))
            }
          >
            {mostrarTodas ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </section>

      <section className="artist-discography">
        <h2>Discografía</h2>
        <p>
          Próximamente encontrarás aquí los álbumes y lanzamientos de este artista.
        </p>
      </section>

      {songForPlaylist && (
        <div
          role="dialog"
          aria-modal="true"
          className="add-to-playlist__backdrop"
          onClick={() => setSongForPlaylist(null)}
        >
          <div
            className="add-to-playlist__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="add-to-playlist__header">
              <h3 className="add-to-playlist__title">
                Agregar &ldquo;{songForPlaylist.title}&rdquo; a...
              </h3>
              <button
                type="button"
                className="artist-song-action-btn"
                aria-label="Cerrar"
                onClick={() => setSongForPlaylist(null)}
              >
                <X size={18} />
              </button>
            </div>
            {userCreatedPlaylists.length === 0 ? (
              <p className="add-to-playlist__empty">
                Todavía no creaste ninguna playlist propia. Podés crear una desde{' '}
                <Link
                  to="/biblioteca"
                  className="add-to-playlist__link"
                  onClick={() => setSongForPlaylist(null)}
                >
                  Tu biblioteca
                </Link>
                .
              </p>
            ) : (
              <div className="add-to-playlist__list">
                {userCreatedPlaylists.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    className="btn btn--secondary add-to-playlist__option"
                    onClick={() => handleAddSongToPlaylist(pl.id, songForPlaylist.id)}
                  >
                    {pl.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}