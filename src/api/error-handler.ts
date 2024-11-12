import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/constants';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // El servidor respondió con un código de error
    return {
      message: error.response.data?.message || 'Error en la solicitud',
      status: error.response.status,
      errors: error.response.data?.errors
    };
  } else if (error.request) {
    // La solicitud se realizó pero no se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor',
      status: 503
    };
  } else {
    // Error en la configuración de la solicitud
    return {
      message: error.message || 'Error al procesar la solicitud',
      status: 500
    };
  }
};