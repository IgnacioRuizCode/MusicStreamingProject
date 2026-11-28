import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Search, Shield, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '../ui/IconButton';
import { useAuth } from '../../hooks/useAuth';
import './NavbarLogueado.css';

interface NavbarLogueadoProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function NavbarLogueado({ query, onQueryChange }: NavbarLogueadoProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const tienePlan = Boolean(user?.planId);
  const showAvatarImg = Boolean(user?.avatar && failedAvatarUrl !== user.avatar);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="navbar__actions navbar__actions--auth">
      <form
        className={`navbar__search${searchOpen ? ' is-open' : ''}`}
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = query.trim();
          if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            setSearchOpen(false);
          }
        }}
      >
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar canciones o artistas"
          aria-label="Buscar canciones o artistas"
        />
      </form>

      <IconButton
        label="Buscar"
        className="navbar__search-toggle"
        onClick={() => setSearchOpen((value) => !value)}
        aria-expanded={searchOpen}
      >
        <Search size={20} />
      </IconButton>

      {!tienePlan && (
        <Link to="/planes" className="btn btn--secondary navbar__plan-button">
          Explorar planes
        </Link>
      )}

      <div className="user-menu" ref={menuRef}>
        <button
          type="button"
          className="user-menu__trigger"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <span className="user-menu__avatar" aria-hidden="true">
            {showAvatarImg ? (
              <img
                src={user!.avatar}
                alt=""
                className="user-menu__avatar-img"
                onError={() => setFailedAvatarUrl(user?.avatar ?? null)}
              />
            ) : (
              user?.username?.charAt(0).toUpperCase() ?? '?'
            )}
          </span>
          <span className="user-menu__name">{user?.username}</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`user-menu__chevron${menuOpen ? ' is-open' : ''}`}
          />
        </button>

        {menuOpen && (
          <div className="user-menu__dropdown" role="menu">
            <Link to="/perfil" role="menuitem" onClick={closeMenu}>
              <UserRound size={16} /> Perfil
            </Link>
            <Link to="/planes" role="menuitem" onClick={closeMenu}>
              <Shield size={16} /> Cuenta/Planes
            </Link>
            {isAdmin && (
              <Link to="/admin" role="menuitem" onClick={closeMenu}>
                <Shield size={16} /> Panel de administración
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                logout();
                closeMenu();
                navigate('/');
              }}
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}