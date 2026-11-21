import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { RegisterValues } from '../schemas'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedUsers } from '../seed/index2'
import { storageKeys } from '../services/localStorage'
import type { PlanId, User } from '../types'
import { createId } from '../util'

interface AuthContextValue {
  user: User | null
  users: User[]
  isAdmin: boolean
  isPremium: boolean
  plan: PlanId
  selectPlan: (plan: PlanId) => void
  login: (email: string, password: string) => string | null
  register: (values: RegisterValues) => string | null
  logout: () => void
  deleteUser: (id: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>(storageKeys.users, seedUsers)
  const [user, setUser] = useLocalStorage<User | null>(storageKeys.session, null)

  const login = useCallback(
    (email: string, password: string): string | null => {
      const normalized = email.trim().toLowerCase()
      const found = users.find((item) => item.email.toLowerCase() === normalized)

      if (!found || found.password !== password) {
        return 'Correo o contraseña incorrectos'
      }

      setUser(found)
      return null
    },
    [setUser, users],
  )

  const register = useCallback(
    (values: RegisterValues): string | null => {
      const email = values.email.trim().toLowerCase()
      const exists = users.some((item) => item.email.toLowerCase() === email)

      if (exists) {
        return 'Ya existe una cuenta con ese correo'
      }

      const newUser: User = {
        id: createId('user'),
        name: values.name.trim(),
        email,
        password: values.password,
        role: 'user',
        avatar: `https://picsum.photos/seed/${encodeURIComponent(email)}/200/200`,
        plan: 'free',
      }

      setUsers((previous) => [...previous, newUser])
      setUser(newUser)
      return null
    },
    [setUser, setUsers, users],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  const selectPlan = useCallback(
    (plan: PlanId) => {
      setUser((previous) => (previous ? { ...previous, plan } : previous))
      setUsers((previous) =>
        previous.map((item) => (item.id === user?.id ? { ...item, plan } : item)),
      )
    },
    [setUser, setUsers, user?.id],
  )

  const deleteUser = useCallback(
    (id: string) => {
      setUsers((previous) => previous.filter((item) => item.id !== id))
      setUser((previous) => (previous?.id === id ? null : previous))
    },
    [setUser, setUsers],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      users,
      isAdmin: user?.role === 'admin',
      isPremium: user?.plan === 'premium' || user?.plan === 'family',
      plan: user?.plan ?? 'free',
      selectPlan,
      login,
      register,
      logout,
      deleteUser,
    }),
    [deleteUser, login, logout, register, selectPlan, user, users],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
