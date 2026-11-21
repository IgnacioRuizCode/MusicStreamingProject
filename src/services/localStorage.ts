const PREFIX = 'music-streaming:'

export const storageKeys = {
  songs: `${PREFIX}songs`,
  users: `${PREFIX}users`,
  playlists: `${PREFIX}playlists`,
  session: `${PREFIX}session`,
  volume: `${PREFIX}volume`,
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}

export function resetStorage(): void {
  Object.values(storageKeys).forEach((key) => removeStorage(key))
}
