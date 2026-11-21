import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './componets/AuthContext';
import { Navbar } from './componets/navbar/navbar';

function App () {
  const handleTggleSidebar = () => {
    console.log('Toggle sidebar');
  };
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout} from './layouts/MainLayout';
import { LayoutAuth } from './layouts/LayoutAuth';
/* import { LayoutAdmin } from './layouts/LayoutAdmin'; */
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminArtistas } from './components/admin/AdminArtist';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar onToggleSidebar={handleTggleSidebar} />
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;

    <Routes>
      <Toaster position="bottom-right" richColors theme="dark"/>
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
  );
}

