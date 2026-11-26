
import { usePlayer } from '../hooks/usePlayer';
import './MusicPlayer.css';
function formatTime(time: number) {
  if (!Number.isFinite(time) || time < 0) {
    return '0:00';
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    currentTime,
    duration
  } = usePlayer();

  if (!currentSong) {
    return null;
  }
  const progress = duration > 0
    ? (currentTime / duration) * 100
    : 0;  
    
  return (
    <footer className="music-player">
      <div className="music-player-song">
        <img
          src={currentSong.cover}
          alt={currentSong.title}
        />

        <div>
          <strong>{currentSong.title}</strong>
          <span>CODIFY</span>
        </div>
      </div>

      <div className="music-player-controls">
        <button onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="music-player-timeline">
          <span>{formatTime(currentTime)}</span>

          <div className="music-player-progress">
            <div
              className="music-player-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="music-player-status">
        {isPlaying ? 'Reproduciendo' : 'En pausa'}
      </div>
    </footer>
  );
}

export default MusicPlayer;
