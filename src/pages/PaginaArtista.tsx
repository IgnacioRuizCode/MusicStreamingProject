
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

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

function PaginaArtista() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { playSong } = usePlayer();
  const { user, loading } = useAuth();

  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [siguiendo, setSiguiendo] = useState<boolean | null>(null);

  const artista: Artist | undefined = id
    ? getById('artists', id)
    : undefined;

  if (!artista) {
    return (
      <main className="artist-not-found">
        <h1>Artista no encontrado</h1>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  const canciones: Song[] = getArtistSongs(artista.id);

  const cancionesPopulares = mostrarTodas
    ? canciones.slice(0, 10)
    : canciones.slice(0, 5);

  const estaSiguiendo =
    siguiendo !== null
      ? siguiendo
      : user?.followedArtists.includes(artista.id) ?? false;

  const reproducirArtista = () => {
    if (canciones.length > 0) {
      playSong(canciones[0], canciones);
    }
  };

  const reproducirCancion = (cancion: Song) => {
    playSong(cancion, canciones);
  };

  const cambiarSeguimiento = () => {
    if (loading) return;

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
      setSiguiendo(!estaSiguiendo);
    }
  };

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
          ▶
        </button>

        <button
          className={`artist-follow-button ${
            estaSiguiendo ? 'following' : ''
          }`}
          onClick={cambiarSeguimiento}
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
              <button
                className="artist-song-row"
                key={cancion.id}
                onClick={() => reproducirCancion(cancion)}
              >
                <span className="artist-song-number">
                  {index + 1}
                </span>

                <img
                  className="artist-song-cover"
                  src={cancion.cover}
                  alt={`Portada de ${cancion.title}`}
                />

                <span className="artist-song-title">
                  {cancion.title}
                </span>

                <span className="artist-song-duration">
                  {formatearDuracion(cancion.duration)}
                </span>
              </button>
            ))}
          </div>
        )}

        {canciones.length > 5 && (
          <button
            className="artist-show-more"
            onClick={() => setMostrarTodas(!mostrarTodas)}
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

export default PaginaArtista;
