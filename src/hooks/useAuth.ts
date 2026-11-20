import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import type { AuthContextType } from '../types/types';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }

  return context;
}