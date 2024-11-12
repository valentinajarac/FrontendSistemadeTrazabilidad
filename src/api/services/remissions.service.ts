import axios from '../axios';
import { Remission, MonthlyStats, ApiResponse } from '../../types';

export const remissionService = {
  async getMyRemissions(): Promise<Remission[]> {
    try {
      const { data } = await axios.get<ApiResponse<Remission[]>>('/remissions');
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las remisiones');
    }
  },

  async getRemissionById(id: number): Promise<Remission> {
    try {
      const { data } = await axios.get<ApiResponse<Remission>>(`/remissions/${id}`);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener la remisión');
    }
  },

  async createRemission(remission: Omit<Remission, 'id'>): Promise<Remission> {
    try {
      const { data } = await axios.post<ApiResponse<Remission>>('/remissions', remission);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear la remisión');
    }
  },

  async updateRemission(id: number, remission: Partial<Remission>): Promise<Remission> {
    try {
      const { data } = await axios.put<ApiResponse<Remission>>(`/remissions/${id}`, remission);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la remisión');
    }
  },

  async deleteRemission(id: number): Promise<void> {
    try {
      await axios.delete(`/remissions/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la remisión');
    }
  },

  async getMonthlySummary(): Promise<MonthlyStats[]> {
    try {
      const { data } = await axios.get<ApiResponse<MonthlyStats[]>>('/remissions/monthly-summary');
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener el resumen mensual');
    }
  }
};