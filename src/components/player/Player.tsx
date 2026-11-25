import {  useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useLocation } from 'react-router-dom';
import {
  GripHorizontal,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { usePlayerContext } from '../../context/PlayerContext';
import { getById } from '../../services/storageServices';
import './Player.css';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Player() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isFloating,
    togglePlay,
    next,
    previous,
    seek,
    changeVolume,
    toggleMute,
    toggleFloating,
  } = usePlayerContext();

  const { pathname } = useLocation();
  const playerRef = useRef<HTMLElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const [dragState, setDragState] = useState<{
    pathname: string;
    pos: { x: number; y: number };
  } | null>(null);

  const isSearchRoute = pathname.startsWith('/search') || pathname.startsWith('/buscar');
  const effectiveFloating = isSearchRoute || isFloating;

  const defaultPosition =
    typeof window !== 'undefined'
      ? {
          x: Math.max(12, window.innerWidth - 344),
          y: Math.max(12, window.innerHeight - 244),
        }
      : { x: 24, y: 24 };

  const position =
    effectiveFloating
      ? dragState?.pathname === pathname
        ? dragState.pos
        : defaultPosition
      : null;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!effectiveFloating || !playerRef.current) return;
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

    setDragState({ pathname, pos: { x: nextX, y: nextY } });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragOffsetRef.current) {
      dragOffsetRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const totalDuration = duration || currentSong?.duration || 0;
  const progressPercent = totalDuration > 0 ? Math.min((progress / totalDuration) * 100, 100) : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  const artistName = currentSong?.artistId
    ? getById('artists', currentSong.artistId)?.name ?? 'Artista desconocido'
    : 'Seleccioná una canción';

  const floatingStyle: CSSProperties | undefined =
    isFloating && position ? { left: `${position.x}px`, top: `${position.y}px` } : undefined;

  return (
    <section
      ref={playerRef}
      className={`player${isFloating ? ' player--floating' : ''}`}
      style={floatingStyle}
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
        {currentSong?.url ? (
          <img
            src={currentSong.url}
            alt={`Portada de ${currentSong.title}`}
            className="player__cover"
          />
        ) : (
          <div className="player__cover player__cover--empty" aria-hidden="true">
            <Music size={20} />
          </div>
        )}

        <div className="player__meta">
          <p className="player__title">
            {currentSong ? currentSong.title : 'Ninguna canción en reproducción'}
          </p>
          <p className="player__artist">
            {currentSong ? artistName : 'Elegí una canción o playlist para empezar'}
          </p>
        </div>
      </div>

      <div className="player__center">
        <div className="player__controls">
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
            title={isPlaying ? 'Pausar' : 'Reproducir'}
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
        </div>

        <div className="player__progress-row">
          <span className="player__time">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            step={0.1}
            value={Math.min(progress, totalDuration || 100)}
            disabled={!currentSong}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Progreso de la canción"
            className="player__range"
            style={{ '--range-progress': `${progressPercent}%` } as CSSProperties}
          />
          <span className="player__time">{formatTime(totalDuration)}</span>
        </div>
      </div>

      <div className="player__right">
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
            title="Modo flotante"
          >
            <Minimize2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}