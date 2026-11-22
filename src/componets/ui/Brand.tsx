import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="Music Streaming App home">
      <img src={logo} alt="" className="brand__mark" aria-hidden="true" />
      {!compact && <span className="brand__name">Music Streaming App</span>}
    </Link>
  )
}
