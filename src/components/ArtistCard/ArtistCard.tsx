import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import './ArtistCard.css';

export interface ArtistCardProps {
  id: string;
  name: string;
  image?: string;
  songIds?: string[];
  fallbackImage?: string;
  onPlay?: (id: string, songIds?: string[]) => void;
}

const DEFAULT_ARTIST_IMAGE =
  'https://placehold.co/400x400/282828/A7A7A7?text=Artist';

export function ArtistCard({
  id,
  name,
  image,
  songIds,
  fallbackImage = DEFAULT_ARTIST_IMAGE,
  onPlay,
}: ArtistCardProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedImage = !hasError && image ? image : fallbackImage;

  const handleImageError = () => {
    setHasError(true);
  };

  const handlePlayClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onPlay?.(id, songIds);
  };

  return (
    <Link
      to={`/artista/${id}`}
      className="artist-card"
      aria-label={`Ver artista ${name}`}
    >
      <div className="artist-card__media">
        <div className="artist-card__image-wrapper">
          <img
            src={resolvedImage}
            alt={name}
            className="artist-card__image"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        <button
          type="button"
          className="artist-card__play-button"
          aria-label={`Reproducir ${name}`}
          onClick={handlePlayClick}
        >
          <FaPlay className="artist-card__play-icon" aria-hidden="true" />
        </button>
      </div>

      <div className="artist-card__info">
        <h3 className="artist-card__name" title={name}>
          {name}
        </h3>
        <span className="artist-card__type">Artista</span>
      </div>
    </Link>
  );
}