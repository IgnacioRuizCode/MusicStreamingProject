import { Link } from 'react-router-dom'
import { AudioLines } from 'lucide-react'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="Soundwave home">
      <span className="brand__mark">
        <AudioLines size={compact ? 20 : 24} aria-hidden="true" />
      </span>
      {!compact && <span className="brand__name">soundwave</span>}
    </Link>
  )
}
