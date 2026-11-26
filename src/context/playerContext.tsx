
import {
  createContext,
  useState,
  useRef,
  useEffect,
  type ReactNode
} from 'react';

import type { Song } from '../types/types';

interface PlayerContextType {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playSong: (song: Song, songs: Song[]) => void;
  togglePlay: () => void;
}

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playSong = (song: Song, songs: Song[]) => {
    const audio = audioRef.current;

    if (!audio) return;

    setCurrentSong(song);
    setQueue(songs);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    audio.pause();
    audio.src = song.url;
    audio.load();

    audio.play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.error('Error al reproducir:', song.title, song.url, error);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio || !currentSong) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Error al continuar:', error);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    if (!currentSong) return;

    const currentIndex = queue.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextSong = queue[currentIndex + 1];

    if (nextSong) {
      playSong(nextSong, queue);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(
      Number.isFinite(audio.duration) ? audio.duration : 0
    );

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        currentTime,
        duration,
        playSong,
        togglePlay
      }}
    >
      {children}

      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={handleEnded}
        onError={() => {
          const audio = audioRef.current;
          console.error(
            'No se pudo cargar el audio:',
            audio?.src,
            audio?.error
          );
          setIsPlaying(false);
        }}
      />
    </PlayerContext.Provider>
  );
}
