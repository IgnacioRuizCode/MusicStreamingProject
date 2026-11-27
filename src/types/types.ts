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
  nextPaymentDate?: string;
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
  nombre: string;
  precio: number;
  beneficios: string[];
  destacado: boolean;
}

export interface ResumenPago {
  planId: string;
  ultimos4: string;
  marca: string;
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
  suscribirse: (planId: string, resumenPago?: ResumenPago) => AuthResult;
  cancelarSuscripcion: () => AuthResult;
}