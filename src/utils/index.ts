export function createId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function getArtistImage(artist: string, songs: { artist: string; image: string }[]): string {
  return songs.find((song) => song.artist === artist)?.image ?? ''
}

export function getMaxInvitadosPorPlan(planId: string | null): number {
  if (planId === 'plan-duo') return 1;
  if (planId === 'plan-familiar') return 5;
  return 0;
}