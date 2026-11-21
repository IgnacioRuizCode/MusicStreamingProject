import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IconButton } from '../ui/IconButton'
import './NavbarNoLogueado.css'

export function NavbarNoLogueado() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="navbar__actions navbar__actions--guest" ref={menuRef}>
      <nav className="navbar__guest-links" aria-label="Enlaces principales">
        <Link to="/planes" className="navbar__link">
          Planes
        </Link>
        <Link to="/ayuda" className="navbar__link">
          Ayuda
        </Link>
        <Link to="/login" className="navbar__link navbar__link--muted">
          Iniciar sesión
        </Link>
        <Link to="/registro" className="btn btn--primary btn--sm">
          Registrarse
        </Link>
      </nav>
      <div className="navbar__mobile-menu">
        <IconButton
          label="Abrir menú"
          className="navbar__mobile-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </IconButton>
        {menuOpen && (
          <div className="navbar__mobile-panel is-open">
            <Link to="/planes" className="navbar__mobile-link" onClick={closeMenu}>
              Planes
            </Link>
            <Link to="/ayuda" className="navbar__mobile-link" onClick={closeMenu}>
              Ayuda
            </Link>
            <Link to="/registro" className="navbar__mobile-link" onClick={closeMenu}>
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}