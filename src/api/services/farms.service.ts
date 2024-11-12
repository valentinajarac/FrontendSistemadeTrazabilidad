import axios from '../axios';
import { Farm, ApiResponse } from '../../types';

export const farmService = {
  async getMyFarms(): Promise<Farm[]> {
    try {
      const { data } = await axios.get<ApiResponse<Farm[]>>('/farms');
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las fincas');
    }
  },

  async getFarmById(id: number): Promise<Farm> {
    try {
      const { data } = await axios.get<ApiResponse<Farm>>(`/farms/${id}`);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener la finca');
    }
  },

  async createFarm(farm: Omit<Farm, 'id'>): Promise<Farm> {
    try {
      const { data } = await axios.post<ApiResponse<Farm>>('/farms', farm);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear la finca');
    }
  },

  async updateFarm(id: number, farm: Partial<Farm>): Promise<Farm> {
    try {
      const { data } = await axios.put<ApiResponse<Farm>>(`/farms/${id}`, farm);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la finca');
    }
  },

  async deleteFarm(id: number): Promise<void> {
    try {
      await axios.delete(`/farms/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la finca');
    }
  }
};