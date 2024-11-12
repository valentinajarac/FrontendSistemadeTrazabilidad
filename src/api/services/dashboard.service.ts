import api from '../config';
import { DashboardStats, MonthlyStats, ApiResponse } from '../../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error getting dashboard stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  async getMonthlyData(): Promise<MonthlyStats[]> {
    try {
      const response = await api.get<ApiResponse<MonthlyStats[]>>('/dashboard/monthly');
      
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