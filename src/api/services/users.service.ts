import axios from '../axios';
import { User, ApiResponse } from '../../types';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const { data } = await axios.get<ApiResponse<User[]>>('/users');
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener los usuarios');
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const { data } = await axios.get<ApiResponse<User>>(`/users/${id}`);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
    }
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const { data } = await axios.post<ApiResponse<User>>('/users', user);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear el usuario');
    }
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const { data } = await axios.put<ApiResponse<User>>(`/users/${id}`, user);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  }
};