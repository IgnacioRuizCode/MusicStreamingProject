import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Disc3, Play } from 'lucide-react';
import './CardPlaylist.css';

export interface CardPlaylistProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  songCount?: number;
  fallbackImage?: string;
  onPlay?: (id: string) => void;
}

const DEFAULT_PLAYLIST_IMAGE =
  'https://placehold.co/400x400/282828/A7A7A7?text=Playlist';

export function CardPlaylist({
  id,
  title,
  description,
  image,
  songCount,
  fallbackImage = DEFAULT_PLAYLIST_IMAGE,
  onPlay,
}: CardPlaylistProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedImage = !hasError && image ? image : fallbackImage;

  const handlePlayClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onPlay?.(id);
  };

  return (
    <Link
      to={`/playlist/${id}`}
      className="playlist-card"
      aria-label={`Abrir playlist ${title}`}
    >
      <div className="playlist-card__inner">
        <div className="playlist-card__face playlist-card__front">
          <div className="playlist-card__media">
            <img
              src={resolvedImage}
              alt={title}
              className="playlist-card__image"
              loading="lazy"
              decoding="async"
              onError={() => setHasError(true)}
            />
          </div>
          <h3 className="playlist-card__title" title={title}>
            {title}
          </h3>
        </div>

        <div className="playlist-card__face playlist-card__back">
          <div className="playlist-card__back-top">
            <span className="playlist-card__badge">
              <Disc3 size={13} aria-hidden="true" />
              {typeof songCount === 'number' ? `Playlist • ${songCount} temas` : 'Playlist'}
            </span>
            <h3 className="playlist-card__back-title">{title}</h3>
            <p className="playlist-card__description">
              {description || 'Selección curada para escuchar sin límites.'}
            </p>
          </div>

          {onPlay && (
            <button
              type="button"
              className="playlist-card__play-button"
              aria-label={`Reproducir ${title}`}
              onClick={handlePlayClick}
            >
              <Play size={16} fill="currentColor" aria-hidden="true" />
              <span>Reproducir</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}