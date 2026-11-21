import { useState } from 'react'
import { Music2 } from 'lucide-react'

interface CoverImageProps {
  src: string
  alt: string
  className?: string
}

export function CoverImage({ src, alt, className = '' }: CoverImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`cover-fallback ${className}`.trim()} role="img" aria-label={alt}>
        <Music2 size={32} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  )
}
