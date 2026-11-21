import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LayoutAuth } from './layouts/LayoutAuth';

export default function App() {
  return (
    <Routes>
      {/* Rutas con Layout Principal */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/search" element={<h1>Buscar</h1>} />
        <Route path="/library" element={<h1>Biblioteca</h1>} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Route>

      {/* Rutas de Autenticación */}
      <Route element={<LayoutAuth />}>
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/register" element={<h1>Registro</h1>} />
      </Route>

      {/* Rutas de Admin (reemplazar por <LayoutAdmin /> cuando exista) */}
      <Route path="/admin/*" element={<h1>Panel de Admin</h1>} />
    </Routes>
  );
}