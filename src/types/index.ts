export type UserRole = 'admin' | 'user'
export type PlanId = 'free' | 'premium' | 'family'

export interface Song {
  id: string
  name: string
  artist: string
  album: string
  image: string
  audio: string
  year: number
  genre: string
  duration: number
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  avatar: string
  plan?: PlanId
}

export interface Playlist {
  id: string
  userId: string
  name: string
  songIds: string[]
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  featured: boolean
}
