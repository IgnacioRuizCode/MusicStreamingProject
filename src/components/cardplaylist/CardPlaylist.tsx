import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import './CardPlaylist.css';

export interface CardPlaylistProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
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
  fallbackImage = DEFAULT_PLAYLIST_IMAGE,
  onPlay,
}: CardPlaylistProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedImage = !hasError && image ? image : fallbackImage;

  const handleImageError = () => {
    setHasError(true);
  };

  const handlePlayClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onPlay?.(id);
  };

  return (
    <Link
      to={`/playlist/${id}`}
      className="playlist-card"
      aria-label={`Open playlist ${title}`}
    >
      <div className="playlist-card__media">
        <img
          src={resolvedImage}
          alt={title}
          className="playlist-card__image"
          loading="lazy"
          onError={handleImageError}
        />

        <button
          type="button"
          className="playlist-card__play-button"
          aria-label={`Play ${title}`}
          onClick={handlePlayClick}
        >
          <FaPlay className="playlist-card__play-icon" aria-hidden="true" />
        </button>
      </div>

      <div className="playlist-card__info">
        <h3 className="playlist-card__title" title={title}>
          {title}
        </h3>

        {description && (
          <p className="playlist-card__description" title={description}>
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}