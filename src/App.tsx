import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './componets/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { LayoutAuth } from './layouts/LayoutAuth';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminArtistas } from './components/admin/AdminArtist';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" richColors theme="dark" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/search" element={<h1>Buscar</h1>} />
          <Route path="/busqueda" element={<h1>Buscar</h1>} />
          <Route path="/library" element={<h1>Biblioteca</h1>} />
          <Route path="/playlist/:id" element={<h1>Playlist</h1>} />
          <Route path="/artista/:id" element={<h1>Artista</h1>} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Route>

        <Route element={<LayoutAuth />}>
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/register" element={<h1>Registro</h1>} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<Navigate to="artistas" replace />} />
            <Route path="artistas" element={<AdminArtistas />} />
            <Route path="canciones" element={<h1>Gestión de Canciones</h1>} />
            <Route path="playlists" element={<h1>Gestión de Playlists</h1>} />
            <Route path="planes" element={<h1>Gestión de Planes</h1>} />
            <Route path="usuarios" element={<h1>Gestión de Usuarios</h1>} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
