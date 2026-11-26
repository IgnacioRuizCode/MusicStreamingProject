
import { useContext } from 'react';
import { PlayerContext } from '../context/playerContext';

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      'usePlayer debe utilizarse dentro de un PlayerProvider'
    );
  }

  return context;
}
