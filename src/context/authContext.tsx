import { createContext, useEffect, useState, type ReactNode } from 'react';
import { z } from 'zod';
import {
  add,
  clearSession,
  getById,
  getSession,
  getUserByEmail,
  saveSession,
  update,
} from '../services/storageServices';
import type {
  AuthContextType,
  AuthResult,
  RegisterData,
  SessionUser,
  User,
} from '../types/types';

// Esquema mínimo para validar que la sesión guardada tiene un id válido
const storedSessionSchema = z.object({
  id: z.string().min(1),
});

function toSessionUser(user: User): SessionUser {
  const safeUser = { ...user };
  delete (safeUser as Partial<User>).password;
  return safeUser;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        createdAt: new Date().toISOString(),
        birthDate: data.birthDate,
    });

    const safeUser = toSessionUser(newUser);
    saveSession(safeUser);
    setUser(safeUser);

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

    const safeUser = toSessionUser(foundUser);
    saveSession(safeUser);
    setUser(safeUser);

    return { success: true, user: safeUser };
  };

  const logout = (): void => {
    clearSession();
    setUser(null);
  };

  const subscribe = (planId: string): AuthResult => {
    if (!user) {
      return {
        success: false,
        error: 'Debés iniciar sesión para suscribirte a un plan.',
      };
    }

    const plan = getById('plans', planId);
    if (!plan) {
      return {
        success: false,
        error: 'El plan seleccionado no existe.',
      };
    }

    const updatedUser = update('users', user.id, { planId: planId });
    if (!updatedUser) {
      return {
        success: false,
        error: 'No se pudo actualizar la suscripción.',
      };
    }

    const safeUser = toSessionUser(updatedUser);
    saveSession(safeUser);
    setUser(safeUser);

    return { success: true, user: safeUser };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, subscribe }}
    >
      {children}
    </AuthContext.Provider>
  );
}