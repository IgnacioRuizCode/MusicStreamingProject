export type Role = 'user' | 'admin';

export interface Card {
  last4: string;
  brand: string;
}

export interface PlanMember {
  name: string;
  email: string;
  status: 'Pendiente' | 'Activo';
  invitedAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  birthDate: string;
  avatar?: string;
  role: Role;
  planId: string | null;
  createdAt?: string;
  nextPaymentDate?: string;
  card?: Card;
  invitedMembers?: PlanMember[];
  savedPlaylists: string[];
  followedArtists: string[];
  likedSongs?: string[];
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
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UpdateProfileData {
  username: string;
  birthDate: string;
  avatar?: string;
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
  actualizarPerfil: (datos: UpdateProfileData) => AuthResult;
  cambiarPassword: (actual: string, nueva: string) => AuthResult;
  agregarInvitadoPlan: (nombre: string, email: string) => AuthResult;
  eliminarInvitadoPlan: (email: string) => AuthResult;
  toggleSavedPlaylist: (playlistId: string) => void;
  toggleFollowedArtist: (artistId: string) => void;
  toggleLikedSong: (songId: string) => void;
  eliminarCuenta: () => AuthResult;
}