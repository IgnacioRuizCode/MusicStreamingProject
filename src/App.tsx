import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { MainLayout } from './layouts/MainLayout';
import { LayoutAuth } from './layouts/LayoutAuth';
import { LayoutAdmin } from './layouts/AdminLayout';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminArtistas } from './components/admin/AdminArtist';
import { AdminPlanes } from './components/admin/AdminPlan';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Toaster position="bottom-right" richColors theme="dark" />
        <Routes>
          {/* Rutas principales con Navbar, Sidebar y Player */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<h1>Buscar</h1>} />
            <Route path="/busqueda" element={<Navigate to="/search" replace />} />
            <Route path="/library" element={<h1>Biblioteca</h1>} />
            <Route path="/planes" element={<h1>Planes</h1>} />
            <Route path="/perfil" element={<h1>Perfil</h1>} />
            <Route path="/ayuda" element={<h1>Ayuda</h1>} />
            <Route path="/artista/:id" element={<h1>Artista</h1>} />
            <Route path="/playlist/:id" element={<h1>Playlist</h1>} />
          </Route>

          {/* Rutas de autenticación */}
          <Route element={<LayoutAuth />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/register" element={<Navigate to="/registro" replace />} />
          </Route>

          {/* Rutas protegidas de administración */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<Navigate to="artistas" replace />} />
              <Route path="artistas" element={<AdminArtistas />} />
              <Route path="canciones" element={<h1>Gestión de Canciones</h1>} />
              <Route path="playlists" element={<h1>Gestión de Playlists</h1>} />
              <Route path="planes" element={<AdminPlanes />} />
              <Route path="usuarios" element={<h1>Gestión de Usuarios</h1>} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </PlayerProvider>
    </AuthProvider>
  );
}