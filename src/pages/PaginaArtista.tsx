import { memo, useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play } from 'lucide-react';

import {
  getById,
  getArtistSongs,
  update,
} from '../services/storageServices';

import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';

import type { Artist, Song } from '../types/types';

import './PaginaArtista.css';

function formatearDuracion(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${minutos}:${String(segundosRestantes).padStart(2, '0')}`;
}

function formatearOyentes(cantidad: number): string {
  return new Intl.NumberFormat('es-AR').format(cantidad);
}

interface ArtistSongRowProps {
  song: Song;
  index: number;
  onPlay: (song: Song) => void;
}

const ArtistSongRow = memo(function ArtistSongRow({
  song,
  index,
  onPlay,
}: ArtistSongRowProps) {
  return (
    <button
      className="artist-song-row"
      onClick={() => onPlay(song)}
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

      <span className="artist-song-duration">
        {formatearDuracion(song.duration)}
      </span>
    </button>
  );
});

export function PaginaArtista() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { playSong } = usePlayer();
  const { user, loading } = useAuth();

  const [mostrarTodasKey, setMostrarTodasKey] = useState<string | null>(null);
  const [followOverride, setFollowOverride] = useState<{
    key: string;
    value: boolean;
  } | null>(null);

  const artista = useMemo<Artist | undefined>(
    () => (id ? getById('artists', id) : undefined),
    [id],
  );

  const canciones = useMemo<Song[]>(
    () => (artista ? getArtistSongs(artista.id) : []),
    [artista],
  );

  const mostrarTodas = Boolean(artista && mostrarTodasKey === artista.id);
  const cancionesPopulares = useMemo(
    () => (mostrarTodas ? canciones : canciones.slice(0, 5)),
    [canciones, mostrarTodas],
  );

  const seguidoEnStorage = useMemo(() => {
    if (!user || !artista) return false;
    const storedUser = getById('users', user.id);
    return storedUser?.followedArtists.includes(artista.id) ?? false;
  }, [artista, user]);

  const followKey = `${user?.id ?? 'guest'}:${artista?.id ?? 'none'}`;
  const estaSiguiendo =
    followOverride?.key === followKey ? followOverride.value : seguidoEnStorage;

  const reproducirCancion = useCallback(
    (cancion: Song) => {
      playSong(cancion, canciones);
    },
    [canciones, playSong],
  );

  const reproducirArtista = useCallback(() => {
    const primeraCancion = canciones[0];
    if (primeraCancion) {
      playSong(primeraCancion, canciones);
    }
  }, [canciones, playSong]);

  const cambiarSeguimiento = useCallback(() => {
    if (loading || !artista) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const usuarioActualizado = getById('users', user.id);

    if (!usuarioActualizado) return;

    const nuevaLista = estaSiguiendo
      ? usuarioActualizado.followedArtists.filter(
          (artistId) => artistId !== artista.id
        )
      : [...usuarioActualizado.followedArtists, artista.id];

    const actualizado = update('users', user.id, {
      followedArtists: nuevaLista,
    });

    if (actualizado) {
      setFollowOverride({ key: followKey, value: !estaSiguiendo });
    }
  }, [artista, estaSiguiendo, followKey, loading, navigate, user]);

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

          <p>
            {formatearOyentes(artista.monthlyListeners)} oyentes mensuales
          </p>
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
          className={`artist-follow-button ${
            estaSiguiendo ? 'following' : ''
          }`}
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
                onPlay={reproducirCancion}
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
    </main>
  );
}
