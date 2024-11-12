import api from '../config';
import { UserStats, MonthlyStats, ApiResponse } from '../../types';

export const producerService = {
  async getStats(): Promise<UserStats> {
    try {
      const response = await api.get<ApiResponse<UserStats>>('/producer/stats');
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error getting producer stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  async getMonthlyData(): Promise<MonthlyStats[]> {
    try {
      const response = await api.get<ApiResponse<MonthlyStats[]>>('/producer/monthly');
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error getting monthly data:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener datos mensuales');
    }
  }
};