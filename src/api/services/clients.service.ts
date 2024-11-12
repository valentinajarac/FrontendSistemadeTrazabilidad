import axios from '../axios';
import { Client, ApiResponse } from '../../types';

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const { data } = await axios.get<ApiResponse<Client[]>>('/clients');
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener los clientes');
    }
  },

  async getClientById(id: number): Promise<Client> {
    try {
      const { data } = await axios.get<ApiResponse<Client>>(`/clients/${id}`);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener el cliente');
    }
  },

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const { data } = await axios.post<ApiResponse<Client>>('/clients', client);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear el cliente');
    }
  },

  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    try {
      const { data } = await axios.put<ApiResponse<Client>>(`/clients/${id}`, client);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el cliente');
    }
  },

  async deleteClient(id: number): Promise<void> {
    try {
      await axios.delete(`/clients/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el cliente');
    }
  }
};