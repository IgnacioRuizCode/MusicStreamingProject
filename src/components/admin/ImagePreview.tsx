import { useEffect, useState } from 'react';

interface ImagePreviewProps {
  src?: string;
  alt: string;
  redonda?: boolean;
  grande?: boolean;
}

export function ImagePreview({
  src,
  alt,
  redonda = false,
  grande = false,
}: ImagePreviewProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const clase = [
    'admin-thumb',
    redonda ? 'admin-thumb--round' : '',
    grande ? 'admin-thumb--lg' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!src || error) {
    return (
      <span className={`${clase} admin-thumb__fallback`} aria-hidden="true">
        {alt.trim().charAt(0).toUpperCase() || '?'}
      </span>
    );
  }

  return (
    <img
      className={clase}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
