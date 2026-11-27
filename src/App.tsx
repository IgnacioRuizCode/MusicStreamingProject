import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { LayoutAuth } from './layouts/LayoutAuth';
import { LayoutAdmin } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { hydrateCatalogWithRealMedia } from './services/musicApiService';

const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((module) => ({ default: module.SearchPage })),
);
const PaginaArtista = lazy(() =>
  import('./pages/PaginaArtista').then((module) => ({ default: module.PaginaArtista })),
);
const PaginaPlaylist = lazy(() =>
  import('./pages/PaginaPlaylist').then((module) => ({ default: module.PaginaPlaylist })),
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);
const BibliotecaPage = lazy(() =>
  import('./pages/BibliotecaPage').then((module) => ({ default: module.BibliotecaPage })),
);
const PerfilPage = lazy(() =>
  import('./pages/PerfilPage').then((module) => ({ default: module.PerfilPage })),
);
const PlanesPage = lazy(() =>
  import('./pages/PlanesPage').then((module) => ({ default: module.PlanesPage })),
);
const AyudaPage = lazy(() =>
  import('./pages/AyudaPage').then((module) => ({ default: module.AyudaPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);
const AdminDashboard = lazy(() =>
  import('./pages/admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
);
const AdminArtists = lazy(() =>
  import('./pages/admin/AdminArtists').then((module) => ({ default: module.AdminArtists })),
);
const AdminCanciones = lazy(() =>
  import('./pages/admin/AdminCanciones').then((module) => ({ default: module.AdminCanciones })),
);
const AdminPlaylists = lazy(() =>
  import('./pages/admin/AdminPlaylists').then((module) => ({ default: module.AdminPlaylists })),
);
const AdminPlans = lazy(() =>
  import('./pages/admin/AdminPlans').then((module) => ({ default: module.AdminPlans })),
);
const AdminUsuarios = lazy(() =>
  import('./pages/admin/AdminUsuarios').then((module) => ({ default: module.AdminUsuarios })),
);

export default function App() {
  useEffect(() => {
    void hydrateCatalogWithRealMedia();
  }, []);

import { useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AboutPage } from './components/about-us/AboutPage';
import { AboutUsLayout } from './components/about-us/AboutUsLayout';
import './App.css';

function HomePlaceholder() {
  useEffect(() => {
    document.title = 'CODIFY · Inicio';
  }, []);

  return (
    <div className="home-placeholder">
      <h1>CODIFY</h1>
      <p>Tu música, en un solo lugar.</p>
      <Link to="/nosotros">Conocé al equipo</Link>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="busqueda" element={<Navigate to="/search" replace />} />
          <Route path="artista/:id" element={<PaginaArtista />} />
          <Route path="playlist/:id" element={<PaginaPlaylist />} />
          <Route path="planes" element={<PlanesPage />} />
          <Route path="ayuda" element={<AyudaPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="biblioteca" element={<BibliotecaPage />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<LayoutAuth />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/registro" element={<Navigate to="/register" replace />} />
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="artistas" element={<AdminArtists />} />
            <Route path="canciones" element={<AdminCanciones />} />
            <Route path="playlists" element={<AdminPlaylists />} />
            <Route path="planes" element={<AdminPlans />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="bottom-right" richColors theme="dark" />
    </>
  );
}

    <BrowserRouter>
      <Routes>
        <Route element={<AboutUsLayout />}>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/nosotros" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
