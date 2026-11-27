const PREFIX = 'streaming:';

export const STORAGE_KEYS = {
  users: `${PREFIX}users`,
  songs: `${PREFIX}songs`,
  artists: `${PREFIX}artists`,
  playlists: `${PREFIX}playlists`,
  plans: `${PREFIX}plans`,
  session: `${PREFIX}session`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const SESSION_KEYS = {
  pendingPlanId: 'pendingPlanId',
} as const;