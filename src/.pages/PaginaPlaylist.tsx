
import { useParams, Link } from 'react-router-dom';

import {
  getById,
  getPlaylistSongs,
  getAll
} from '../services/storageServices';

import { usePlayer } from '../hooks/usePlayer';

import './PaginaPlaylist.css';

function PaginaPlaylist() {
  const { id } = useParams<{ id: string }>();

  const { playSong } = usePlayer();

  const playlist = id
    ? getById('playlists', id)
    : undefined;

  if (!playlist) {
    return (
      <main className="playlist-page">
        <h1>Playlist no encontrada</h1>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  // Obtenemos las canciones y artistas
  const canciones = getPlaylistSongs(playlist.id);
  const artistas = getAll('artists');

  // Buscamos el nombre del artista
  const obtenerArtista = (artistId: string) => {
    return (
      artistas.find((artista) => artista.id === artistId)?.name
      ?? 'Artista desconocido'
    );
  };

  const formatearDuracion = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${minutos}:${segundosRestantes
      .toString()
      .padStart(2, '0')}`;
  };

  // Calculamos la duración total
  const duracionTotal = canciones.reduce(
    (total, cancion) => total + cancion.duration,
    0
  );

  return (
    <main className="playlist-page">


      <header className="playlist-header">

        <img
          className="playlist-cover"
          src={playlist.cover}
          alt={`Portada de ${playlist.title}`}
        />

        <div className="playlist-info">

          <p className="playlist-label">
            Playlist
          </p>

          <h1 className="playlist-title">
            {playlist.title}
          </h1>

          <p className="playlist-description">
            {playlist.description}
          </p>

          <p className="playlist-details">
            {canciones.length} canciones ·{' '}
            {formatearDuracion(duracionTotal)}
          </p>

        </div>

      </header>


      <section>

        <div className="playlist-actions">

          <button
            className="playlist-play-button"
            aria-label="Reproducir playlist"
            onClick={() => {
              if (canciones.length > 0) {
                playSong(canciones[0], canciones);
              }
            }}
          >
            ▶
          </button>

        </div>

        <h2 className="playlist-songs-title">
          Canciones
        </h2>

        {canciones.length === 0 ? (

          <p className="playlist-empty">
            Esta playlist todavía no tiene canciones.
          </p>

        ) : (

          <div>

            {canciones.map((cancion, index) => (

              <div
                className="playlist-song"
                key={cancion.id}
                onClick={() => {
                  playSong(cancion, canciones);
                }}
              >

                <span className="playlist-song-number">

                  <span className="song-index">
                    {index + 1}
                  </span>

                  <span className="song-play">
                    ▶
                  </span>

                </span>

                <img
                  className="playlist-song-cover"
                  src={cancion.cover}
                  alt={cancion.title}
                />

                <strong className="playlist-song-name">
                  {cancion.title}
                </strong>

                <span className="playlist-song-artist">
                  {obtenerArtista(cancion.artistId)}
                </span>

                <span className="playlist-song-duration">
                  {formatearDuracion(cancion.duration)}
                </span>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default PaginaPlaylist;
