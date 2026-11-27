import App from './App';
import { PlayerProvider } from './context/PlayerContext';
import { useAuth } from './hooks/useAuth';

export function AppProviders() {
  const { user } = useAuth();

  return (
    <PlayerProvider key={user?.id ?? 'guest'}>
      <App />
    </PlayerProvider>
  );
}
