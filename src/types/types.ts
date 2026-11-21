export type Role = 'user' | 'admin';

export interface Card {
  last4: string;
  brand: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  birthDate: string; 
  role: Role;
  planId: string | null;
  createdAt?: string;
  card?: Card;
  savedPlaylists: string[];
  followedArtists: string[];
}

export type SessionUser = Omit<User, 'password'>;

export interface Artist {
  id: string;
  name: string;
  image: string;
  monthlyListeners: number;
  songIds: string[];
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  cover: string;
  url: string;
  duration: number; 
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  creatorId: string;
  songIds: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  featured: boolean;
}

export interface CollectionMap {
  users: User;
  songs: Song;
  artists: Artist;
  playlists: Playlist;
  plans: Plan;
}

export type CollectionName = keyof CollectionMap;

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  birthDate: string;
}

export type AuthResult =
  | { success: true; user?: SessionUser }
  | { success: false; error: string };

export interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  register: (data: RegisterData) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  subscribe: (planId: string) => AuthResult;
}