import { useState, type FormEvent } from 'react';
import { Home, Menu, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Brand } from '../ui/Brand';
import { IconButton } from '../ui/IconButton';
import { NavbarLogueado } from './NavbarLogueado';
import { NavbarNoLogueado } from './NavbarNoLogueado';
import './navbar.css';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (!pathname.startsWith('/search')) {
      navigate('/search');
    }
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate('/search');
  };

  const isHome = pathname === '/';

  return (
    <header className="navbar">
      <div className="navbar__left">
        <IconButton
          label="Abrir menú"
          onClick={onToggleSidebar}
          className="navbar__menu navbar__mobile-menu"
        >
          <Menu size={22} />
        </IconButton>

        <Brand />

      </div>

      <div className="navbar__center">
        <button
          type="button"
          className={`navbar__home-btn${isHome ? ' is-active' : ''}`}
          onClick={() => navigate('/')}
          aria-label="Inicio"
          title="Inicio"
        >
          <Home size={20} />
        </button>

        <form className="navbar__search-pill" onSubmit={handleSearchSubmit} role="search">
          <Search size={18} className="navbar__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="¿Qué querés reproducir?"
            aria-label="Buscar canciones, artistas o playlists"
          />
        </form>
      </div>

      <div className="navbar__right">
        {user ? (
          <NavbarLogueado query={query} onQueryChange={handleSearchChange} />
        ) : (
          <NavbarNoLogueado />
        )}
      </div>
    </header>
  );
}