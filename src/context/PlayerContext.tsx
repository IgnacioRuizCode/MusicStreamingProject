import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { storageKeys } from '../services/localStorage'
import type { Song } from '../types'

interface PlayerContextValue {
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  volume: number
  queue: Song[]
  playSong: (song: Song, nextQueue?: Song[]) => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  seek: (seconds: number) => void
  changeVolume: (value: number) => void
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [queue, setQueue] = useState<Song[]>([])
  const [volume, setVolume] = useLocalStorage<number>(storageKeys.volume, 0.7)
  const progressRef = useRef(0)

  const applyProgress = useCallback((value: number) => {
    progressRef.current = value
    setProgress(value)
  }, [])

  const playSong = useCallback(
    (song: Song, nextQueue?: Song[]) => {
      setCurrentSong(song)
      applyProgress(0)
      setIsPlaying(true)
      if (nextQueue && nextQueue.length > 0) {
        setQueue(nextQueue)
      }
    },
    [applyProgress],
  )

  const next = useCallback(() => {
    if (queue.length === 0 || !currentSong) {
      setIsPlaying(false)
      return
    }
    const index = queue.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (index + 1) % queue.length
    const nextSong = queue[nextIndex]
    if (nextSong) {
      setCurrentSong(nextSong)
      applyProgress(0)
      setIsPlaying(true)
    }
  }, [applyProgress, currentSong, queue])

  const previous = useCallback(() => {
    if (queue.length === 0 || !currentSong) {
      return
    }
    const index = queue.findIndex((song) => song.id === currentSong.id)
    const previousIndex = (index - 1 + queue.length) % queue.length
    const previousSong = queue[previousIndex]
    if (previousSong) {
      setCurrentSong(previousSong)
      applyProgress(0)
    }
  }, [applyProgress, currentSong, queue])

  const togglePlay = useCallback(() => {
    if (!currentSong) {
      return
    }
    if (progressRef.current >= currentSong.duration) {
      applyProgress(0)
    }
    setIsPlaying((value) => !value)
  }, [applyProgress, currentSong])

  const seek = useCallback(
    (seconds: number) => {
      const limit = currentSong?.duration ?? 0
      applyProgress(Math.min(Math.max(0, seconds), limit))
    },
    [applyProgress, currentSong],
  )

  const changeVolume = useCallback(
    (value: number) => setVolume(Math.min(Math.max(0, value), 1)),
    [setVolume],
  )

  useEffect(() => {
    if (!isPlaying || !currentSong) {
      return
    }
    const timer = window.setInterval(() => {
      const value = progressRef.current + 1
      if (value > currentSong.duration) {
        applyProgress(0)
        next()
      } else {
        applyProgress(value)
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [applyProgress, currentSong, isPlaying, next])

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentSong,
      isPlaying,
      progress,
      volume,
      queue,
      playSong,
      togglePlay,
      next,
      previous,
      seek,
      changeVolume,
    }),
    [
      changeVolume,
      currentSong,
      isPlaying,
      next,
      playSong,
      previous,
      progress,
      queue,
      seek,
      togglePlay,
      volume,
    ],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used inside PlayerProvider')
  }
  return context
}
