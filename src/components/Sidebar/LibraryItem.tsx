import { memo } from 'react'
import { Link } from 'react-router-dom'
import { CoverImage } from '../ui/CoverImage'

interface LibraryItemProps {
  name: string
  image: string
  type: string
  path: string
}

export const LibraryItem = memo(function LibraryItem({
  name,
  image,
  type,
  path,
}: LibraryItemProps) {
  return (
    <li className="sidebar__item">
      <Link to={path} className="sidebar__item-link" title={`${name} — ${type}`}>
        <CoverImage src={image} alt="" className="sidebar__item-cover" />
        <span className="sidebar__item-text">
          <span className="sidebar__item-name">{name}</span>
          <span className="sidebar__item-type">{type}</span>
        </span>
      </Link>
    </li>
  )
})
