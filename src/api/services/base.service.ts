import api from '../config';
import { AxiosResponse } from 'axios';

export class BaseService {
  protected async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await api.get(url);
    return response.data;
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await api.post(url, data);
    return response.data;
  }

  protected async put<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await api.put(url, data);
    return response.data;
  }

  protected async delete(url: string): Promise<void> {
    await api.delete(url);
  }

  protected handleError(error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en la solicitud');
    }
    throw error;
  }
}