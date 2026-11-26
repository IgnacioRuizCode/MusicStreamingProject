
import './App.css';
import MusicPlayer from './components/MusicPlayer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PaginaPlaylist from './.pages/PaginaPlaylist';
import PaginaArtista from './.pages/PaginaArtista';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <h1>CODIFY</h1>
              <p>Bienvenido a nuestra plataforma musical.</p>
            </main>
          }
        />

        <Route
          path="/playlist/:id"
          element={<PaginaPlaylist />}
        />

        <Route
          path="/artista/:id"
          element={<PaginaArtista />}
        />
      </Routes>

      <MusicPlayer />
    </BrowserRouter>
  );
}

export default App;
