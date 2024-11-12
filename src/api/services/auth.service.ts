import api from "../config";
import { AuthRequest, AuthResponse, ApiResponse } from '../../types';
import { API_CONFIG } from "../../config/constants";

export const authService = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      console.log('Respuesta del servidor:', response.data);

      // Validar la respuesta
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Error en la respuesta del servidor');
      }

      const authData = response.data.data;

      // Validar datos requeridos
      if (!authData.token || !authData.role || !authData.userId || !authData.username) {
        throw new Error('Respuesta del servidor incompleta');
      }

      // Guardar token
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, authData.token);

      return authData;
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al iniciar sesión');
    }
  },

  logout() {
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.AUTH.USER_KEY);
  },

  getCurrentUser(): AuthResponse | null {
    try {
      const userStr = localStorage.getItem(API_CONFIG.AUTH.USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr) as AuthResponse;
      if (!user.token || !user.role || !user.userId || !user.username) {
        this.logout();
        return null;
      }
      
      return user;
    } catch {
      this.logout();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
  }
};