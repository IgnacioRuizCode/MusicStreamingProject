import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import {
  GripHorizontal,
  Heart,
  ListMusic,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  usePlayerContext,
  type PlayableSong,
} from '../../context/PlayerContext';
import { useDominantColor } from '../../hooks/useDominantColor';
import { getAll } from '../../services/storageServices';
import { Link } from 'react-router-dom';
import './Player.css';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface PlayerProgressProps {
  audioElement: HTMLAudioElement | null;
  currentSong: PlayableSong | null;
  isPlaying: boolean;
  next: () => void;
  onSeek: (seconds: number) => void;
}

function PlayerProgress({
  audioElement,
  currentSong,
  isPlaying,
  next,
  onSeek,
}: PlayerProgressProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(currentSong?.duration || 0);
  const hasAudioSrc = Boolean(currentSong?.audioUrl ?? currentSong?.url);

  useEffect(() => {
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setProgress(audioElement.currentTime || 0);
    };

    const handleDurationChange = () => {
      if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
        setDuration(audioElement.duration);
      }
    };

    const handleEnded = () => setProgress(0);

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleDurationChange);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('ended', handleEnded);

    handleTimeUpdate();
    handleDurationChange();

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleDurationChange);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement]);

  useEffect(() => {
    if (!isPlaying || !currentSong || hasAudioSrc) return;

    const limit = currentSong.duration || 180;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + 1 >= limit) {
          next();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentSong, hasAudioSrc, isPlaying, next]);

  const totalDuration = duration || currentSong?.duration || 0;
  const progressPercent =
    totalDuration > 0 ? Math.min((progress / totalDuration) * 100, 100) : 0;

  const handleSeek = (value: number) => {
    const limit = totalDuration || 0;
    const clamped = Math.min(Math.max(0, value), limit);
    setProgress(clamped);
    onSeek(clamped);
  };

  return (
    <div className="player__progress-row">
      <span className="player__time">{formatTime(progress)}</span>
      <input
        type="range"
        min={0}
        max={totalDuration || 100}
        step={0.1}
        value={Math.min(progress, totalDuration || 100)}
        disabled={!currentSong}
        onChange={(event) => handleSeek(Number(event.target.value))}
        aria-label="Progreso de la canción"
        className="player__range"
        style={{ '--range-progress': `${progressPercent}%` } as CSSProperties}
      />
      <span className="player__time">{formatTime(totalDuration)}</span>
    </div>
  );
}

export function Player() {
  const {
    currentSong,
    queue,
    isPlaying,
    audioElement,
    volume,
    isMuted,
    isFloating,
    isShuffle,
    repeatMode,
    playSong,
    removeFromQueue,
    togglePlay,
    next,
    previous,
    seek,
    changeVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleFloating,
  } = usePlayerContext();

  const playerRef = useRef<HTMLElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const [customPos, setCustomPos] = useState<{ x: number; y: number } | null>(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const ambientColor = useDominantColor(currentSong?.cover, 'rgba(99, 102, 241, 0.25)');

  const defaultPosition =
    typeof window !== 'undefined'
      ? {
          x: Math.max(12, window.innerWidth - 344),
          y: Math.max(12, window.innerHeight - 256),
        }
      : { x: 24, y: 24 };

  const position = isFloating ? (customPos ?? defaultPosition) : null;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isFloating || !playerRef.current) return;
    if ((event.target as Element).closest('button')) return;

    const rect = playerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOffsetRef.current || !playerRef.current) return;

    const rect = playerRef.current.getBoundingClientRect();
    const maxX = Math.max(8, window.innerWidth - rect.width - 8);
    const maxY = Math.max(8, window.innerHeight - rect.height - 8);

    const nextX = Math.min(Math.max(8, event.clientX - dragOffsetRef.current.x), maxX);
    const nextY = Math.min(Math.max(8, event.clientY - dragOffsetRef.current.y), maxY);

    setCustomPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragOffsetRef.current) {
      dragOffsetRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const artistNameById = useMemo(
    () => new Map(getAll('artists').map((artist) => [artist.id, artist.name] as const)),
    [],
  );

  const resolveArtistName = useCallback(
    (artistId?: string) => {
      if (!artistId) return 'Seleccioná una canción';
      return artistNameById.get(artistId) ?? artistId;
    },
    [artistNameById],
  );

  const volumePercent = (isMuted ? 0 : volume) * 100;
  const artistName = resolveArtistName(currentSong?.artistId);
  const artistExists = currentSong?.artistId
    ? artistNameById.has(currentSong.artistId)
    : false;
  const isLiked = currentSong ? Boolean(likedIds[currentSong.id]) : false;

  const toggleLike = () => {
    if (!currentSong) return;
    setLikedIds((prev) => ({ ...prev, [currentSong.id]: !prev[currentSong.id] }));
  };

  const playerStyle: CSSProperties = {
    '--player-ambient': currentSong ? ambientColor : 'rgba(99, 102, 241, 0.16)',
    ...(isFloating && position
      ? { left: `${position.x}px`, top: `${position.y}px` }
      : {}),
  } as CSSProperties;

  return (
    <>
      {isQueueOpen && (
        <aside className="player-queue" aria-label="Cola de reproducción">
          <div className="player-queue__header">
            <h3>Cola de reproducción</h3>
            <button
              type="button"
              className="player__icon-btn"
              onClick={() => setIsQueueOpen(false)}
              aria-label="Cerrar cola"
            >
              <X size={18} />
            </button>
          </div>

          {queue.length === 0 ? (
            <p className="player-queue__empty">No hay canciones en la cola.</p>
          ) : (
            <ul className="player-queue__list">
              {queue.map((track) => {
                const isCurrent = track.id === currentSong?.id;
                return (
                  <li
                    key={track.id}
                    className={`player-queue__item${isCurrent ? ' is-active' : ''}`}
                    onClick={() => playSong(track, queue)}
                  >
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="player-queue__cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="player-queue__meta">
                      <strong>{track.title}</strong>
                      <span>{resolveArtistName(track.artistId)}</span>
                    </div>
                    {!isCurrent && (
                      <button
                        type="button"
                        className="player__icon-btn player-queue__remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(track.id);
                        }}
                        title="Quitar de la cola"
                        aria-label={`Quitar ${track.title} de la cola`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      )}

      <section
        ref={playerRef}
        className={`player${isFloating ? ' player--floating' : ''}${isPlaying ? ' is-playing' : ''}`}
        style={playerStyle}
        aria-label="Reproductor de música"
      >
        {isFloating && (
          <div
            className="player__drag-handle"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            title="Arrastrá para mover el reproductor"
          >
            <span className="player__drag-title">
              <GripHorizontal size={15} aria-hidden="true" />
              Mini reproductor
            </span>
            <button
              type="button"
              className="player__icon-btn"
              onClick={toggleFloating}
              aria-label="Acoplar reproductor abajo"
              title="Acoplar abajo"
            >
              <Maximize2 size={15} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="player__info">
          <div className="player__cover-wrap">
            {currentSong?.cover ? (
              <img
                src={currentSong.cover}
                alt={`Portada de ${currentSong.title}`}
                className="player__cover"
              />
            ) : (
              <div className="player__cover player__cover--empty" aria-hidden="true">
                <Music size={20} />
              </div>
            )}
          </div>

          <div className="player__meta">
            <div className="player__title-row">
              <p className="player__title">
                {currentSong ? currentSong.title : 'Ninguna canción en reproducción'}
              </p>
              {isPlaying && currentSong && (
                <span className="player__eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
            <div className="player__artist-wrap">
              {currentSong ? (
                artistExists ? (
                  <Link
                    to={`/artista/${currentSong.artistId}`}
                    className="player__artist player__artist--link"
                  >
                    {artistName}
                  </Link>
                ) : (
                  <p className="player__artist">{artistName}</p>
                )
              ) : (
                <p className="player__artist">Elegí una canción o playlist para empezar</p>
              )}
            </div>
          </div>

          {currentSong && (
            <button
              type="button"
              className={`player__like-btn${isLiked ? ' is-liked' : ''}`}
              onClick={toggleLike}
              aria-label={isLiked ? 'Quitar de tus Me gusta' : 'Guardar en tus Me gusta'}
              title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <div className="player__center">
          <div className="player__controls">
            <button
              type="button"
              className={`player__icon-btn player__extra-btn${isShuffle ? ' is-active' : ''}`}
              onClick={toggleShuffle}
              aria-label="Reproducción aleatoria"
              title={isShuffle ? 'Aleatorio activado' : 'Activar aleatorio'}
            >
              <Shuffle size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="player__icon-btn player__skip-btn"
              onClick={previous}
              disabled={!currentSong}
              aria-label="Canción anterior"
              title="Anterior"
            >
              <SkipBack size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="player__play-btn"
              onClick={togglePlay}
              disabled={!currentSong}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              title={isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" aria-hidden="true" />
              ) : (
                <Play size={18} fill="currentColor" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              className="player__icon-btn player__skip-btn"
              onClick={next}
              disabled={!currentSong}
              aria-label="Canción siguiente"
              title="Siguiente"
            >
              <SkipForward size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              className={`player__icon-btn player__extra-btn${repeatMode !== 'off' ? ' is-active' : ''}`}
              onClick={cycleRepeatMode}
              aria-label="Repetir"
              title={
                repeatMode === 'off'
                  ? 'Activar repetición'
                  : repeatMode === 'all'
                    ? 'Repitiendo lista'
                    : 'Repitiendo canción actual'
              }
            >
              {repeatMode === 'one' ? (
                <Repeat1 size={16} aria-hidden="true" />
              ) : (
                <Repeat size={16} aria-hidden="true" />
              )}
            </button>
          </div>

          <PlayerProgress
            key={currentSong?.id ?? 'empty'}
            audioElement={audioElement}
            currentSong={currentSong}
            isPlaying={isPlaying}
            next={next}
            onSeek={seek}
          />
        </div>

        <div className="player__right">
          <button
            type="button"
            className={`player__icon-btn${isQueueOpen ? ' is-active' : ''}`}
            onClick={() => setIsQueueOpen((prev) => !prev)}
            aria-label="Cola de reproducción"
            title="Cola de reproducción"
          >
            <ListMusic size={18} aria-hidden="true" />
          </button>

          <div className="player__volume-box">
            <button
              type="button"
              className="player__icon-btn"
              onClick={toggleMute}
              aria-label={isMuted || volume === 0 ? 'Activar sonido' : 'Silenciar'}
              title={isMuted || volume === 0 ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} aria-hidden="true" />
              ) : volume < 0.5 ? (
                <Volume1 size={18} aria-hidden="true" />
              ) : (
                <Volume2 size={18} aria-hidden="true" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volumen"
              className="player__range"
              style={{ '--range-progress': `${volumePercent}%` } as CSSProperties}
            />
          </div>

          {!isFloating && (
            <button
              type="button"
              className="player__icon-btn"
              onClick={toggleFloating}
              aria-label="Desacoplar como mini reproductor flotante"
              title="Mini reproductor flotante"
            >
              <Minimize2 size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </>
  );
}