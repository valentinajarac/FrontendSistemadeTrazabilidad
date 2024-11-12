import axios from '../axios';
import { Crop, ApiResponse } from '../../types';

export const cropService = {
  async getMyCrops(): Promise<Crop[]> {
    try {
      const { data } = await axios.get<ApiResponse<Crop[]>>('/crops');
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener los cultivos');
    }
  },

  async getCropsByFarm(farmId: number): Promise<Crop[]> {
    try {
      const { data } = await axios.get<ApiResponse<Crop[]>>(`/crops/farm/${farmId}`);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener los cultivos de la finca');
    }
  },

  async getCropById(id: number): Promise<Crop> {
    try {
      const { data } = await axios.get<ApiResponse<Crop>>(`/crops/${id}`);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener el cultivo');
    }
  },

  async createCrop(crop: Omit<Crop, 'id'>): Promise<Crop> {
    try {
      const { data } = await axios.post<ApiResponse<Crop>>('/crops', crop);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear el cultivo');
    }
  },

  async updateCrop(id: number, crop: Partial<Crop>): Promise<Crop> {
    try {
      const { data } = await axios.put<ApiResponse<Crop>>(`/crops/${id}`, crop);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el cultivo');
    }
  },

  async deleteCrop(id: number): Promise<void> {
    try {
      await axios.delete(`/crops/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el cultivo');
    }
  }
};