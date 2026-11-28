import { Music } from 'lucide-react';

interface SongCountBadgeProps {
  count: number;
}

export function SongCountBadge({ count }: SongCountBadgeProps) {
  const label = count === 1 ? '1 canción' : `${count} canciones`;

  return (
    <span className="admin-song-count">
      <Music size={13} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
