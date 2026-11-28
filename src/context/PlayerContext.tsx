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
import { useAuth } from '../hooks/useAuth';
import { AuthPromptModal } from '../components/player/AuthPromptModal';

export type PlayableSong = Song & { url?: string; audioUrl?: string };
export type RepeatMode = 'off' | 'all' | 'one';
export type PlaybackSourceType =
  | 'playlist'
  | 'artist'
  | 'search'
  | 'home'
  | 'liked'
  | 'song';

export interface PlaybackSource {
  type: PlaybackSourceType;
  id?: string;
}

export interface PlayerContextType {
  currentSong: PlayableSong | null;
  queue: PlayableSong[];
  queueSource: PlaybackSource | null;
  isPlaying: boolean;
  audioElement: HTMLAudioElement | null;
  volume: number;
  isMuted: boolean;
  isFloating: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  authPromptSong: PlayableSong | null;
  closeAuthPrompt: () => void;
  playSong: (
    song: PlayableSong,
    nextQueue?: PlayableSong[],
    source?: PlaybackSource | null,
  ) => void;
  playSongById: (
    songId: string,
    nextQueue?: PlayableSong[],
    source?: PlaybackSource | null,
  ) => PlayableSong | undefined;
  removeFromQueue: (songId: string) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  changeVolume: (value: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setFloating: (floating: boolean) => void;
  toggleFloating: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

let sharedAudioElement: HTMLAudioElement | null = null;

function getAudioElement(): HTMLAudioElement {
  if (!sharedAudioElement) {
    sharedAudioElement = new Audio();
    sharedAudioElement.preload = 'metadata';
  }
  return sharedAudioElement;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [audioElement] = useState(getAudioElement);
  const audioRef = useRef<HTMLAudioElement | null>(audioElement);
  const previousVolumeRef = useRef<number>(0.7);

  const [authPromptSong, setAuthPromptSong] = useState<PlayableSong | null>(null);
  const [currentSong, setCurrentSong] = useState<PlayableSong | null>(null);
  const [queue, setQueue] = useState<PlayableSong[]>([]);
  const [queueSource, setQueueSource] = useState<PlaybackSource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    return () => {
      audio.pause();
    };
  }, []);

  const advanceToSong = useCallback((song: PlayableSong) => {
    setQueue((prev) =>
      prev.some((item) => item.id === song.id) ? prev : [song, ...prev],
    );
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const next = useCallback(() => {
    if (!currentSong || queue.length === 0) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
      return;
    }

    const index = queue.findIndex((song) => song.id === currentSong.id);

    if (isShuffle && queue.length > 1) {
      let randomIndex = index;
      while (randomIndex === index) {
        randomIndex = Math.floor(Math.random() * queue.length);
      }
      const randomSong = queue[randomIndex];
      if (randomSong) {
        advanceToSong(randomSong);
      }
      return;
    }

    const isLastSong = index === queue.length - 1;
    if (isLastSong && repeatMode === 'off') {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const nextIndex = index === -1 ? 0 : (index + 1) % queue.length;
    const nextSong = queue[nextIndex];

    if (nextSong) {
      advanceToSong(nextSong);
    }
  }, [advanceToSong, currentSong, queue, isShuffle, repeatMode]);

  const previous = useCallback(() => {
    if (!currentSong) return;

    if ((audioRef.current?.currentTime ?? 0) > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }

    if (queue.length === 0) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }

    const index = queue.findIndex((song) => song.id === currentSong.id);
    const prevIndex = index <= 0 ? queue.length - 1 : index - 1;
    const prevSong = queue[prevIndex];

    if (prevSong) {
      advanceToSong(prevSong);
    }
  }, [advanceToSong, currentSong, queue]);

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

    if (src) {
      audio.src = src;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => {});
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

  // Integración nativa con controles multimedia de Windows / Chrome
  useEffect(() => {
    if (!currentSong || typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    const artistName =
      getById('artists', currentSong.artistId)?.name ?? currentSong.artistId;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: artistName,
      artwork: currentSong.cover
        ? [{ src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('previoustrack', previous);
  }, [currentSong, next, previous]);

  // Atajo global con barra espaciadora (Space)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (!currentSong) return;
      event.preventDefault();
      setIsPlaying((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSong]);

  const playSong = useCallback(
    (
      song: PlayableSong,
      nextQueue?: PlayableSong[],
      source: PlaybackSource | null = null,
    ) => {
      if (!user) {
        setAuthPromptSong(song);
        return;
      }

      setCurrentSong(song);
      setIsPlaying(true);
      setQueueSource(source);
      if (nextQueue && nextQueue.length > 0) {
        setQueue(nextQueue);
      } else {
        setQueue((prev) =>
          prev.some((item) => item.id === song.id) ? prev : [song, ...prev],
        );
      }
    },
    [user],
  );

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptSong(null);
  }, []);

  const playSongById = useCallback(
    (
      songId: string,
      nextQueue?: PlayableSong[],
      source: PlaybackSource | null = null,
    ) => {
      const song = getById('songs', songId) as PlayableSong | undefined;
      if (song) {
        playSong(song, nextQueue, source);
      }
      return song;
    },
    [playSong],
  );

  const removeFromQueue = useCallback((songId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== songId));
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  }, [currentSong]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seek = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio?.src) return;

      const limit =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : currentSong?.duration ?? 0;
      const clamped = Math.min(Math.max(0, seconds), limit);
      audio.currentTime = clamped;
    },
    [currentSong?.duration],
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

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  }, []);

  const toggleFloating = useCallback(() => {
    setIsFloating((prev) => !prev);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        queueSource,
        isPlaying,
        audioElement,
        volume,
        isMuted,
        isFloating,
        isShuffle,
        repeatMode,
        authPromptSong,
        closeAuthPrompt,
        playSong,
        playSongById,
        removeFromQueue,
        togglePlay,
        pause,
        next,
        previous,
        seek,
        changeVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        setFloating: setIsFloating,
        toggleFloating,
      }}
    >
      {children}
      <AuthPromptModal song={authPromptSong} onClose={closeAuthPrompt} />
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