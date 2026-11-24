import { useState } from 'react'
import { ArrowLeft, ArrowRight, Home, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Brand } from '../ui/Brand'
import { IconButton } from '../ui/IconButton'
import { NavbarLogueado } from '../navbar/NavbarLogueado'
import { NavbarNoLogueado } from '../navbar/NavbarNoLogueado'
import './navbar.css'

interface NavbarProps {
  onToggleSidebar: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <header className="navbar">
      <div className="navbar__left">
        <IconButton
          label="Toggle navigation"
          onClick={onToggleSidebar}
          className="navbar__menu navbar__mobile-menu"
        >
          <Menu size={22} />
        </IconButton>
        <Brand />
        {user && (
          <nav className="navbar__nav" aria-label="Navegación de páginas">
            <IconButton label="Atrás" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </IconButton>
            <IconButton label="Adelante" onClick={() => navigate(1)}>
              <ArrowRight size={20} />
            </IconButton>
            <IconButton label="Inicio" onClick={() => navigate('/')}>
              <Home size={20} />
            </IconButton>
          </nav>
        )}
      </div>
      {user ? <NavbarLogueado query={query} onQueryChange={setQuery} /> : <NavbarNoLogueado />}
      {!user && (
        <Link to="/login" className="btn btn--primary btn--sm navbar__login-mobile">
          Iniciar sesión
        </Link>
      )}
    </header>
  )
}