import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users } from 'lucide-react';
import './ArtistCard.css';

export interface ArtistCardProps {
  id: string;
  name: string;
  image?: string;
  monthlyListeners?: number;
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
  monthlyListeners,
  songIds,
  fallbackImage = DEFAULT_ARTIST_IMAGE,
  onPlay,
}: ArtistCardProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedImage = !hasError && image ? image : fallbackImage;

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
      <div className="artist-card__inner">
        <div className="artist-card__face artist-card__front">
          <div className="artist-card__media">
            <img
              src={resolvedImage}
              alt={name}
              className="artist-card__image"
              loading="lazy"
              decoding="async"
              onError={() => setHasError(true)}
            />
          </div>
          <h3 className="artist-card__name" title={name}>
            {name}
          </h3>
        </div>

        <div className="artist-card__face artist-card__back">
          <div className="artist-card__back-top">
            <span className="artist-card__badge">
              <Users size={13} aria-hidden="true" />
              Artista seguido
            </span>
            <h3 className="artist-card__back-title">{name}</h3>
            <p className="artist-card__type">
              {typeof monthlyListeners === 'number'
                ? `${monthlyListeners.toLocaleString('es-AR')} oyentes mensuales`
                : 'Artista en tu biblioteca'}
            </p>
          </div>

          {onPlay && (
            <button
              type="button"
              className="artist-card__play-button"
              aria-label={`Reproducir ${name}`}
              onClick={handlePlayClick}
            >
              <Play size={16} fill="currentColor" aria-hidden="true" />
              <span>Escuchar</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}