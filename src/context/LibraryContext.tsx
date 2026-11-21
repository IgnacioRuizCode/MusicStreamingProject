import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { seedPlaylists, seedSongs } from '@/seed'
import { storageKeys } from '@/servicios/localStorage'
import type { Playlist, Song } from '@/tipos'
import { createId } from '@/utils'

interface LibraryContextValue {
  songs: Song[]
  playlists: Playlist[]
  addSong: (values: Omit<Song, 'id'>) => void
  updateSong: (id: string, values: Omit<Song, 'id'>) => void
  deleteSong: (id: string) => void
  getSong: (id: string) => Song | undefined
  getPlaylist: (userId: string) => Playlist | undefined
  togglePlaylistSong: (userId: string, songId: string) => void
  removeFromPlaylist: (userId: string, songId: string) => void
  isInPlaylist: (userId: string, songId: string) => boolean
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useLocalStorage<Song[]>(storageKeys.songs, seedSongs)
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>(
    storageKeys.playlists,
    seedPlaylists,
  )

  const addSong = useCallback(
    (values: Omit<Song, 'id'>) => {
      setSongs((previous) => [...previous, { ...values, id: createId('song') }])
    },
    [setSongs],
  )

  const updateSong = useCallback(
    (id: string, values: Omit<Song, 'id'>) => {
      setSongs((previous) => previous.map((song) => (song.id === id ? { ...values, id } : song)))
    },
    [setSongs],
  )

  const deleteSong = useCallback(
    (id: string) => {
      setSongs((previous) => previous.filter((song) => song.id !== id))
      setPlaylists((previous) =>
        previous.map((playlist) => ({
          ...playlist,
          songIds: playlist.songIds.filter((songId) => songId !== id),
        })),
      )
    },
    [setPlaylists, setSongs],
  )

  const getSong = useCallback((id: string) => songs.find((song) => song.id === id), [songs])

  const getPlaylist = useCallback(
    (userId: string) => playlists.find((playlist) => playlist.userId === userId),
    [playlists],
  )

  const ensurePlaylist = useCallback((current: Playlist[], userId: string): Playlist[] => {
    if (current.some((playlist) => playlist.userId === userId)) {
      return current
    }
    return [
      ...current,
      {
        id: createId('playlist'),
        userId,
        name: 'My Playlist',
        songIds: [],
        createdAt: new Date().toISOString(),
      },
    ]
  }, [])

  const togglePlaylistSong = useCallback(
    (userId: string, songId: string) => {
      setPlaylists((previous) => {
        const withPlaylist = ensurePlaylist(previous, userId)
        return withPlaylist.map((playlist) => {
          if (playlist.userId !== userId) {
            return playlist
          }
          const exists = playlist.songIds.includes(songId)
          return {
            ...playlist,
            songIds: exists
              ? playlist.songIds.filter((id) => id !== songId)
              : [...playlist.songIds, songId],
          }
        })
      })
    },
    [ensurePlaylist, setPlaylists],
  )

  const removeFromPlaylist = useCallback(
    (userId: string, songId: string) => {
      setPlaylists((previous) =>
        previous.map((playlist) =>
          playlist.userId === userId
            ? { ...playlist, songIds: playlist.songIds.filter((id) => id !== songId) }
            : playlist,
        ),
      )
    },
    [setPlaylists],
  )

  const isInPlaylist = useCallback(
    (userId: string, songId: string) =>
      playlists.some((playlist) => playlist.userId === userId && playlist.songIds.includes(songId)),
    [playlists],
  )

  const value = useMemo<LibraryContextValue>(
    () => ({
      songs,
      playlists,
      addSong,
      updateSong,
      deleteSong,
      getSong,
      getPlaylist,
      togglePlaylistSong,
      removeFromPlaylist,
      isInPlaylist,
    }),
    [
      addSong,
      deleteSong,
      getPlaylist,
      getSong,
      isInPlaylist,
      playlists,
      removeFromPlaylist,
      songs,
      togglePlaylistSong,
      updateSong,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used inside LibraryProvider')
  }
  return context
}
