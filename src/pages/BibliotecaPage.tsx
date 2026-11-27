import { useMemo, useState } from 'react';
import { Heart, Music, Play, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { usePlayer } from '../hooks/usePlayer';
import {
  deleteUserPlaylist,
  getAll,
  getArtistSongs,
  getPlaylistSongs,
  getUserPlaylists,
} from '../services/storageServices';
import { CardPlaylist } from '../components/cardplaylist/CardPlaylist';
import { ArtistCard } from '../components/ArtistCard/ArtistCard';
import { CrearPlaylistModal } from '../components/CrearPlaylistModal';
import { ConfirmationModal } from '../components/admin/ConfirmationModal';
import './BibliotecaPage.css';

type BibliotecaTab = 'all' | 'playlists' | 'songs' | 'artists';

export function BibliotecaPage() {
  const { user, toggleLikedSong } = useAuth();
  const { playSong } = usePlayer();
  const [tab, setTab] = useState<BibliotecaTab>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const playlists = useMemo(() => {
    void version;
    if (!user) return [];
    return getUserPlaylists(user.id);
  }, [user, version]);

  const artists = useMemo(() => {
    if (!user) return [];
    return getAll('artists').filter((a) => user.followedArtists.includes(a.id));
  }, [user]);

  const likedSongs = useMemo(() => {
    if (!user) return [];
    const allSongs = getAll('songs');
    const allArtists = getAll('artists');
    const likedIds = user.likedSongs ?? [];
    return allSongs
      .filter((s) => likedIds.includes(s.id))
      .map((song) => ({
        ...song,
        artistName:
          allArtists.find((a) => a.id === song.artistId)?.name ?? 'Artista desconocido',
      }));
  }, [user]);

  if (!user) return null;

  const handleDeletePlaylist = () => {
    if (!playlistToDelete) return;
    const deleted = deleteUserPlaylist(playlistToDelete, user.id);
    setPlaylistToDelete(null);
    if (deleted) {
      toast.success('Playlist eliminada');
      setVersion((v) => v + 1);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const tracks = getPlaylistSongs(playlistId);
    if (tracks.length === 0) {
      toast.info('Esta playlist todavía no tiene canciones');
      return;
    }
    playSong(tracks[0], tracks);
  };

  const handlePlayArtist = (artistId: string) => {
    const tracks = getArtistSongs(artistId);
    if (tracks.length === 0) {
      toast.info('Este artista todavía no tiene canciones');
      return;
    }
    playSong(tracks[0], tracks);
  };

  return (
    <div className="biblioteca-page">
      <header className="biblioteca-header">
        <div>
          <h1 className="biblioteca-header__title">Tu biblioteca</h1>
          <p className="biblioteca-header__subtitle">
            Tus playlists creadas, guardadas, canciones favoritas y artistas seguidos.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} /> Crear playlist
        </button>
      </header>

      <div className="biblioteca-tabs" role="tablist" aria-label="Filtrar biblioteca">
        {(
          [
            { id: 'all', label: 'Todo' },
            { id: 'playlists', label: `Playlists (${playlists.length})` },
            { id: 'songs', label: `Favoritas (${likedSongs.length})` },
            { id: 'artists', label: `Artistas (${artists.length})` },
          ] as { id: BibliotecaTab; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`btn ${tab === item.id ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {(tab === 'all' || tab === 'playlists') && (
        <section className="biblioteca-section">
          <h2 className="biblioteca-section__title">Playlists ({playlists.length})</h2>

          {playlists.length === 0 ? (
            <p className="biblioteca-empty">
              No tenés playlists todavía. ¡Creá la primera con el botón de arriba!
            </p>
          ) : (
            <div className="biblioteca-grid">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="biblioteca-playlist-item">
                  <CardPlaylist
                    id={playlist.id}
                    title={playlist.title}
                    description={playlist.description}
                    image={playlist.cover}
                    songCount={playlist.songIds.length}
                    onPlay={handlePlayPlaylist}
                  />
                  {playlist.creatorId === user.id && (
                    <button
                      type="button"
                      className="biblioteca-playlist-delete"
                      aria-label={`Eliminar playlist ${playlist.title}`}
                      title="Eliminar playlist propia"
                      onClick={() => setPlaylistToDelete(playlist.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {(tab === 'all' || tab === 'songs') && (
        <section className="biblioteca-section">
          <h2 className="biblioteca-section__title">
            <Music size={18} /> Canciones que te gustan ({likedSongs.length})
          </h2>

          {likedSongs.length === 0 ? (
            <p className="biblioteca-empty">
              Marcá con corazón tus canciones preferidas para tenerlas siempre a mano.
            </p>
          ) : (
            <ul className="biblioteca-songs">
              {likedSongs.map((song) => (
                <li key={song.id} className="biblioteca-song-row">
                  <div className="biblioteca-song-row__left">
                    <img
                      src={song.cover}
                      alt=""
                      className="biblioteca-song-row__cover"
                    />
                    <div className="biblioteca-song-row__meta">
                      <span className="biblioteca-song-row__title">{song.title}</span>
                      <span className="biblioteca-song-row__artist">{song.artistName}</span>
                    </div>
                  </div>
                  <div className="biblioteca-song-row__actions">
                    <button
                      type="button"
                      className="biblioteca-icon-btn"
                      aria-label={`Reproducir ${song.title}`}
                      title="Reproducir"
                      onClick={() => playSong(song, likedSongs)}
                    >
                      <Play size={16} />
                    </button>
                    <button
                      type="button"
                      className="biblioteca-icon-btn"
                      aria-label={`Quitar ${song.title} de favoritos`}
                      title="Quitar de favoritos"
                      onClick={() => {
                        toggleLikedSong(song.id);
                        toast.info('Quitada de favoritos');
                      }}
                    >
                      <Heart size={16} fill="#ec4899" color="#ec4899" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {(tab === 'all' || tab === 'artists') && (
        <section className="biblioteca-section">
          <h2 className="biblioteca-section__title">
            Artistas seguidos ({artists.length})
          </h2>

          {artists.length === 0 ? (
            <p className="biblioteca-empty">Todavía no seguís a ningún artista.</p>
          ) : (
            <div className="biblioteca-grid">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  id={artist.id}
                  name={artist.name}
                  image={artist.image}
                  monthlyListeners={artist.monthlyListeners}
                  songIds={artist.songIds}
                  onPlay={handlePlayArtist}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <CrearPlaylistModal
        abierto={createOpen}
        userId={user.id}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setVersion((v) => v + 1)}
      />

      <ConfirmationModal
        abierto={Boolean(playlistToDelete)}
        titulo="¿Eliminar playlist?"
        mensaje="Esta acción borrará la playlist de tu biblioteca."
        textoConfirmar="Eliminar"
        onConfirmar={handleDeletePlaylist}
        onCancelar={() => setPlaylistToDelete(null)}
      />
    </div>
  );
}