import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Song } from '../types/types';
import { getById } from '../services/storageServices';

type PlayableSong = Song & { url?: string; audioUrl?: string };

export interface PlayerContextType {
  currentSong: PlayableSong | null;
  queue: PlayableSong[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFloating: boolean;
  playSong: (song: PlayableSong, nextQueue?: PlayableSong[]) => void;
  playSongById: (songId: string, nextQueue?: PlayableSong[]) => PlayableSong | undefined;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  changeVolume: (value: number) => void;
  toggleMute: () => void;
  setFloating: (floating: boolean) => void;
  toggleFloating: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef<number>(0.7);

  const [currentSong, setCurrentSong] = useState<PlayableSong | null>(null);
  const [queue, setQueue] = useState<PlayableSong[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.7;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current = null;
    };
  }, []);

  const next = useCallback(() => {
    if (!currentSong || queue.length === 0) {
      setIsPlaying(false);
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const index = queue.findIndex((song) => song.id === currentSong.id);
    const nextIndex = index === -1 ? 0 : (index + 1) % queue.length;
    const nextSong = queue[nextIndex];

    if (nextSong) {
      setCurrentSong(nextSong);
      setProgress(0);
      setDuration(nextSong.duration || 0);
      setIsPlaying(true);
    }
  }, [currentSong, queue]);

  const previous = useCallback(() => {
    if (!currentSong) return;

    if (progress > 3) {
      setProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }

    if (queue.length === 0) {
      setProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }

    const index = queue.findIndex((song) => song.id === currentSong.id);
    const prevIndex = index <= 0 ? queue.length - 1 : index - 1;
    const prevSong = queue[prevIndex];

    if (prevSong) {
      setCurrentSong(prevSong);
      setProgress(0);
      setDuration(prevSong.duration || 0);
      setIsPlaying(true);
    }
  }, [currentSong, progress, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      next();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [next]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const src = currentSong.audioUrl ?? currentSong.url ?? '';
    setDuration(currentSong.duration || 0);
    setProgress(0);

    if (src) {
      audio.src = src;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => {
        });
      }
    } else {
      audio.removeAttribute('src');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      if (audio.src) {
        audio.play().catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    const hasAudioSrc = Boolean(currentSong?.audioUrl ?? currentSong?.url);
    if (!isPlaying || !currentSong || (hasAudioSrc && audio && !audio.paused)) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const limit = duration || currentSong.duration || 180;
        if (prev + 1 >= limit) {
          next();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, currentSong, duration, next]);

  const playSong = useCallback((song: PlayableSong, nextQueue?: PlayableSong[]) => {
    setCurrentSong(song);
    setDuration(song.duration || 0);
    setProgress(0);
    setIsPlaying(true);
    if (nextQueue && nextQueue.length > 0) {
      setQueue(nextQueue);
    } else {
      setQueue((prev) => (prev.some((item) => item.id === song.id) ? prev : [song, ...prev]));
    }
  }, []);

  const playSongById = useCallback(
    (songId: string, nextQueue?: PlayableSong[]) => {
      const song = getById('songs', songId) as PlayableSong | undefined;
      if (song) {
        playSong(song, nextQueue);
      }
      return song;
    },
    [playSong],
  );

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  }, [currentSong]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seek = useCallback(
    (seconds: number) => {
      if (!currentSong) return;
      const limit = duration || currentSong.duration || 0;
      const clamped = Math.min(Math.max(0, seconds), limit);
      setProgress(clamped);
      if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
        audioRef.current.currentTime = clamped;
      }
    },
    [currentSong, duration],
  );

  const changeVolume = useCallback((value: number) => {
    const clamped = Math.min(Math.max(0, value), 1);
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (clamped > 0) {
      previousVolumeRef.current = clamped;
    }
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = clamped === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restored = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.7;
      changeVolume(restored);
    } else {
      previousVolumeRef.current = volume;
      changeVolume(0);
    }
  }, [isMuted, volume, changeVolume]);

  const toggleFloating = useCallback(() => {
    setIsFloating((prev) => !prev);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        isFloating,
        playSong,
        playSongById,
        togglePlay,
        pause,
        next,
        previous,
        seek,
        changeVolume,
        toggleMute,
        setFloating: setIsFloating,
        toggleFloating,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext debe usarse dentro de <PlayerProvider>');
  }
  return context;
}