import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Home, LibraryBig, Plus, Search } from 'lucide-react'
import { useAuth } from '../../componets/AuthContext'
import {
  getAll,
  getById,
  getUserPlaylists,
  initializeData,
} from '../../services/storageServices'
import { LibraryItem } from './LibraryItem'
import './Sidebar.css'

type LibraryFilter = 'playlists' | 'artists'

interface SidebarItem {
  id: string
  name: string
  image: string
  type: string
  path: string
}

const filters: { id: LibraryFilter; label: string }[] = [
  { id: 'playlists', label: 'Playlists' },
  { id: 'artists', label: 'Artistas' },
]

function formatListeners(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`
  }
  return String(value)
}

export function Sidebar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [filter, setFilter] = useState<LibraryFilter>('playlists')
  const [storageVersion, setStorageVersion] = useState(0)

  useEffect(() => {
    initializeData()
    const handleStorage = () => setStorageVersion((value) => value + 1)
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const items = useMemo<SidebarItem[]>(() => {
    void storageVersion
    if (!user) return []

    if (filter === 'playlists') {
      return getUserPlaylists(user.id).map((playlist) => {
        const creator = getById('users', playlist.creatorId)
        return {
          id: playlist.id,
          name: playlist.title,
          image: playlist.cover,
          type: `Playlist • ${creator?.username ?? 'Web Streaming Music'}`,
          path: `/playlist/${playlist.id}`,
        }
      })
    }

    const followedIds = getById('users', user.id)?.followedArtists ?? []
    return getAll('artists')
      .filter((artist) => followedIds.includes(artist.id))
      .map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.image,
        type: `Artista • ${formatListeners(artist.monthlyListeners)} oyentes`,
        path: `/artista/${artist.id}`,
      }))
  }, [filter, storageVersion, user])

  const isSearchActive = pathname === '/search' || pathname.startsWith('/busqueda')

  return (
    <div className="sidebar">
      <nav className="sidebar__block sidebar__nav" aria-label="Menú principal">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar__nav-link${isActive ? ' is-active' : ''}`}
        >
          <Home size={22} aria-hidden="true" />
          <span className="sidebar__label">Inicio</span>
        </NavLink>
        <NavLink
          to="/busqueda"
          className={() => `sidebar__nav-link${isSearchActive ? ' is-active' : ''}`}
        >
          <Search size={22} aria-hidden="true" />
          <span className="sidebar__label">Buscar</span>
        </NavLink>
      </nav>

      <section className="sidebar__block sidebar__block--library" aria-labelledby="sidebar-library-title">
        <div className="sidebar__library-header">
          <h2 id="sidebar-library-title" className="sidebar__library-title">
            <LibraryBig size={22} aria-hidden="true" />
            <span className="sidebar__label">Tu biblioteca</span>
          </h2>
          {user && (
            <button
              type="button"
              className="sidebar__add"
              aria-label="Crear playlist"
              title="Crear playlist"
              onClick={() => {}}
            >
              <Plus size={22} aria-hidden="true" />
            </button>
          )}
        </div>

        {user && (
          <div className="sidebar__chips" role="group" aria-label="Filtrar biblioteca">
            {filters.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`sidebar__chip${filter === option.id ? ' is-active' : ''}`}
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {!user ? (
          <div className="sidebar__message">
            <p>Iniciá sesión para ver tu biblioteca y guardar tu música.</p>
            <div className="sidebar__message-actions">
              <Link to="/login" className="sidebar__message-link">
                Iniciar sesión
              </Link>
              <Link to="/register" className="sidebar__message-link">
                Registrarse
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="sidebar__message">
            <p>
              {filter === 'playlists'
                ? 'Todavía no tenés playlists.'
                : 'Todavía no seguís artistas.'}
            </p>
            {filter === 'playlists' && (
              <button
                type="button"
                className="sidebar__empty-action"
                onClick={() => {}}
              >
                <Plus size={18} aria-hidden="true" />
                Crear playlist
              </button>
            )}
          </div>
        ) : (
          <ul className="sidebar__list">
            {items.map((item) => (
              <LibraryItem key={item.id} {...item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
