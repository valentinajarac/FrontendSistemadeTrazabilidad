import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services/auth.service';
import { useLoading } from './LoadingContext';
import { useError } from './ErrorContext';
import { AuthResponse } from '../types';
import { API_CONFIG } from '../config/constants';

interface AuthContextType {
  user: AuthResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar el estado del usuario con los datos almacenados
  const [user, setUser] = useState<AuthResponse | null>(() => {
    try {
      const savedUser = localStorage.getItem(API_CONFIG.AUTH.USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem(API_CONFIG.AUTH.USER_KEY);
      return null;
    }
  });

  const { setLoading } = useLoading();
  const { setError } = useError();
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ username, password });
      
      // Guardar el usuario en el estado y localStorage
      setUser(response);
      localStorage.setItem(API_CONFIG.AUTH.USER_KEY, JSON.stringify(response));

      // Redirigir según el rol
      navigate(response.role === 'ADMIN' ? '/admin' : '/producer');
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};