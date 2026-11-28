import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { addSongToPlaylist, getAll, getById } from '../services/storageServices';
import type { Song } from '../types/types';
import './AgregarAPlaylistModal.css';

interface AgregarAPlaylistModalProps {
  song: Song | null;
  userId?: string;
  onClose: () => void;
  onAdded?: () => void;
}

export function AgregarAPlaylistModal({
  song,
  userId,
  onClose,
  onAdded,
}: AgregarAPlaylistModalProps) {
  const userPlaylists = useMemo(() => {
    if (!userId) return [];
    return getAll('playlists').filter((p) => p.creatorId === userId);
  }, [userId]);

  if (!song) return null;

  const handleSelectPlaylist = (playlistId: string) => {
    const pl = getById('playlists', playlistId);
    if (!pl) return;

    if (pl.songIds.includes(song.id)) {
      toast.info(`"${song.title}" ya está en "${pl.title}"`);
      return;
    }

    addSongToPlaylist(playlistId, song.id);
    toast.success(`Agregada a "${pl.title}"`);
    onAdded?.();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="playlist-picker__backdrop"
      onClick={onClose}
    >
      <div
        className="playlist-picker__dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="playlist-picker__header">
          <h3 className="playlist-picker__title">
            Agregar &ldquo;{song.title}&rdquo; a...
          </h3>
          <button
            type="button"
            className="playlist-picker__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {userPlaylists.length === 0 ? (
          <p className="playlist-picker__empty">
            Todavía no creaste ninguna playlist propia. Podés crear una desde{' '}
            <Link
              to="/biblioteca"
              className="playlist-picker__link"
              onClick={onClose}
            >
              Tu biblioteca
            </Link>
            .
          </p>
        ) : (
          <div className="playlist-picker__list">
            {userPlaylists.map((pl) => {
              const alreadyAdded = pl.songIds.includes(song.id);

              return (
                <button
                  key={pl.id}
                  type="button"
                  className={`playlist-picker__option${alreadyAdded ? ' is-added' : ''}`}
                  onClick={() => handleSelectPlaylist(pl.id)}
                >
                  <img
                    src={pl.cover}
                    alt=""
                    className="playlist-picker__cover"
                  />
                  <div className="playlist-picker__meta">
                    <span className="playlist-picker__name">{pl.title}</span>
                    <span className="playlist-picker__count">
                      {pl.songIds.length} canciones
                    </span>
                  </div>
                  <span className="playlist-picker__badge">
                    {alreadyAdded ? (
                      <>
                        <Check size={14} /> Agregada
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Agregar
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}