import { createContext, useEffect, useState, type ReactNode } from 'react';
import { z } from 'zod';
import {
  add,
  clearSession,
  deleteById,
  getAll,
  getById,
  getPlanById,
  getSession,
  getUserByEmail,
  notifyStorageChange,
  save,
  saveSession,
  update,
} from '../services/storageServices';
import { STORAGE_KEYS } from '../services/storageKeys';
import type {
  AuthContextType,
  AuthResult,
  PlanMember,
  RegisterData,
  ResumenPago,
  SessionUser,
  UpdateProfileData,
  User,
} from '../types/types';

const storedSessionSchema = z.object({
  id: z.string().min(1),
});

function toSessionUser(user: User): SessionUser {
  const safeUser = { ...user };
  delete (safeUser as Partial<User>).password;
  return {
    ...safeUser,
    savedPlaylists: safeUser.savedPlaylists ?? [],
    followedArtists: safeUser.followedArtists ?? [],
    likedSongs: safeUser.likedSongs ?? [],
    invitedMembers: safeUser.invitedMembers ?? [],
  };
}

function calcularProximoCobro(): string {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() + 1);
  return fecha.toISOString();
}

function getMaxInvitadosPorPlan(planId: string | null): number {
  if (planId === 'plan-duo') return 1;
  if (planId === 'plan-familiar') return 5;
  return 0;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncUserState = (updatedUser: User): SessionUser => {
    const safeUser = toSessionUser(updatedUser);
    saveSession(safeUser);
    setUser(safeUser);
    notifyStorageChange();
    return safeUser;
  };

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const rawSession = getSession();
        if (!rawSession) return;

        const parsed = storedSessionSchema.safeParse(rawSession);
        if (!parsed.success) {
          clearSession();
          return;
        }

        const freshUser = getById('users', parsed.data.id);
        if (!freshUser) {
          clearSession();
          return;
        }

        setUser(toSessionUser(freshUser));
      } catch {
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const register = (data: RegisterData): AuthResult => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existingUser = getUserByEmail(normalizedEmail);

    if (existingUser) {
      return {
        success: false,
        error: 'Ya existe una cuenta registrada con ese correo electrónico.',
      };
    }

    const newUser = add('users', {
      username: data.username.trim(),
      email: normalizedEmail,
      password: data.password,
      role: 'user',
      planId: null,
      savedPlaylists: [],
      followedArtists: [],
      likedSongs: [],
      invitedMembers: [],
      createdAt: new Date().toISOString(),
      birthDate: data.birthDate,
    });

    const safeUser = syncUserState(newUser);
    return { success: true, user: safeUser };
  };

  const login = (email: string, password: string): AuthResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = getUserByEmail(normalizedEmail);

    if (!foundUser || foundUser.password !== password) {
      return {
        success: false,
        error: 'Credenciales incorrectas. Verificá tu correo y contraseña.',
      };
    }

    const safeUser = syncUserState(foundUser);
    return { success: true, user: safeUser };
  };

  const logout = (): void => {
    clearSession();
    setUser(null);
  };

  const suscribirse = (
    planId: string,
    resumenPago?: ResumenPago,
  ): AuthResult => {
    if (!user) {
      return {
        success: false,
        error: 'Debés iniciar sesión para suscribirte a un plan.',
      };
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return {
        success: false,
        error: 'El plan seleccionado no existe.',
      };
    }

    const esPago = plan.precio > 0;
    const maxInvitados = getMaxInvitadosPorPlan(planId);
    const currentMembers = user.invitedMembers ?? [];

    const updatedUser = update('users', user.id, {
      planId,
      card:
        esPago && resumenPago
          ? { last4: resumenPago.ultimos4, brand: resumenPago.marca }
          : undefined,
      nextPaymentDate: esPago ? calcularProximoCobro() : undefined,
      invitedMembers: maxInvitados > 0 ? currentMembers.slice(0, maxInvitados) : [],
    });

    if (!updatedUser) {
      return {
        success: false,
        error: 'No se pudo actualizar la suscripción.',
      };
    }

    const safeUser = syncUserState(updatedUser);
    return { success: true, user: safeUser };
  };

  const cancelarSuscripcion = (): AuthResult => {
    if (!user) {
      return {
        success: false,
        error: 'Debés iniciar sesión para cancelar tu suscripción.',
      };
    }

    const updatedUser = update('users', user.id, {
      planId: null,
      card: undefined,
      nextPaymentDate: undefined,
      invitedMembers: [],
    });

    if (!updatedUser) {
      return {
        success: false,
        error: 'No se pudo cancelar la suscripción.',
      };
    }

    const safeUser = syncUserState(updatedUser);
    return { success: true, user: safeUser };
  };

  const actualizarPerfil = (datos: UpdateProfileData): AuthResult => {
    if (!user) {
      return { success: false, error: 'Sesión no iniciada.' };
    }

    const updatedUser = update('users', user.id, {
      username: datos.username.trim(),
      birthDate: datos.birthDate,
      avatar: datos.avatar?.trim() || undefined,
    });

    if (!updatedUser) {
      return { success: false, error: 'No se pudo actualizar el perfil.' };
    }

    const safeUser = syncUserState(updatedUser);
    return { success: true, user: safeUser };
  };

  const cambiarPassword = (actual: string, nueva: string): AuthResult => {
    if (!user) {
      return { success: false, error: 'Sesión no iniciada.' };
    }

    const dbUser = getById('users', user.id);
    if (!dbUser) {
      return { success: false, error: 'Usuario no encontrado.' };
    }

    if (dbUser.password !== actual) {
      return { success: false, error: 'La contraseña actual es incorrecta.' };
    }

    const updatedUser = update('users', user.id, { password: nueva });
    if (!updatedUser) {
      return { success: false, error: 'No se pudo actualizar la contraseña.' };
    }

    return { success: true };
  };

  const agregarInvitadoPlan = (nombre: string, email: string): AuthResult => {
    if (!user) {
      return { success: false, error: 'Sesión no iniciada.' };
    }

    const maxInvitados = getMaxInvitadosPorPlan(user.planId);
    if (maxInvitados === 0) {
      return {
        success: false,
        error: 'Tu plan actual no permite agregar miembros invitados.',
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === user.email.toLowerCase()) {
      return {
        success: false,
        error: 'Ya sos el titular de este plan.',
      };
    }

    const currentMembers = user.invitedMembers ?? [];
    if (currentMembers.length >= maxInvitados) {
      return {
        success: false,
        error: `Alcanzaste el límite de ${maxInvitados} invitado(s) para tu plan.`,
      };
    }

    if (currentMembers.some((m) => m.email.toLowerCase() === normalizedEmail)) {
      return {
        success: false,
        error: 'Ese correo ya fue invitado a tu plan.',
      };
    }

    const nuevoMiembro: PlanMember = {
      name: nombre.trim(),
      email: normalizedEmail,
      status: 'Pendiente',
      invitedAt: new Date().toISOString(),
    };

    const updatedUser = update('users', user.id, {
      invitedMembers: [...currentMembers, nuevoMiembro],
    });

    if (!updatedUser) {
      return { success: false, error: 'No se pudo registrar la invitación.' };
    }

    const safeUser = syncUserState(updatedUser);
    return { success: true, user: safeUser };
  };

  const eliminarInvitadoPlan = (email: string): AuthResult => {
    if (!user) {
      return { success: false, error: 'Sesión no iniciada.' };
    }

    const currentMembers = user.invitedMembers ?? [];
    const updatedUser = update('users', user.id, {
      invitedMembers: currentMembers.filter(
        (m) => m.email.toLowerCase() !== email.toLowerCase(),
      ),
    });

    if (!updatedUser) {
      return { success: false, error: 'No se pudo quitar al invitado.' };
    }

    const safeUser = syncUserState(updatedUser);
    return { success: true, user: safeUser };
  };

  const toggleSavedPlaylist = (playlistId: string): void => {
    if (!user) return;
    const current = user.savedPlaylists ?? [];
    const exists = current.includes(playlistId);
    const updatedUser = update('users', user.id, {
      savedPlaylists: exists
        ? current.filter((id) => id !== playlistId)
        : [...current, playlistId],
    });
    if (updatedUser) syncUserState(updatedUser);
  };

  const toggleFollowedArtist = (artistId: string): void => {
    if (!user) return;
    const current = user.followedArtists ?? [];
    const exists = current.includes(artistId);
    const updatedUser = update('users', user.id, {
      followedArtists: exists
        ? current.filter((id) => id !== artistId)
        : [...current, artistId],
    });
    if (updatedUser) syncUserState(updatedUser);
  };

  const toggleLikedSong = (songId: string): void => {
    if (!user) return;
    const current = user.likedSongs ?? [];
    const exists = current.includes(songId);
    const updatedUser = update('users', user.id, {
      likedSongs: exists
        ? current.filter((id) => id !== songId)
        : [...current, songId],
    });
    if (updatedUser) syncUserState(updatedUser);
  };

  const eliminarCuenta = (): AuthResult => {
    if (!user) {
      return { success: false, error: 'Sesión no iniciada.' };
    }

    const allPlaylists = getAll('playlists');
    save(
      STORAGE_KEYS.playlists,
      allPlaylists.filter((pl) => pl.creatorId !== user.id),
    );

    deleteById('users', user.id);
    clearSession();
    setUser(null);
    notifyStorageChange();
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        suscribirse,
        cancelarSuscripcion,
        actualizarPerfil,
        cambiarPassword,
        agregarInvitadoPlan,
        eliminarInvitadoPlan,
        toggleSavedPlaylist,
        toggleFollowedArtist,
        toggleLikedSong,
        eliminarCuenta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}