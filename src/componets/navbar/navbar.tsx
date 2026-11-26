import { useEffect, useRef, type FormEvent } from 'react';
import { Home, Menu, Search } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isSearchPage = pathname.startsWith('/search');
  const query = isSearchPage ? (searchParams.get('q') ?? '') : '';

  useEffect(() => {
    if (isSearchPage) {
      searchInputRef.current?.focus();
    }
  }, [isSearchPage]);

  const handleSearchChange = (value: string) => {
    if (!isSearchPage) {
      navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
      return;
    }

    if (value) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
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
            ref={searchInputRef}
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