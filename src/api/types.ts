// Tipos para configuración de API
export interface ApiConfig {
  baseURL: string;
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
}

// Tipos para errores de API
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Tipos para parámetros de consulta
export interface QueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

// Tipos para respuestas específicas
export interface DashboardStats {
  totalProductores: number;
  totalFincas: number;
  totalCultivos: number;
  despachosMes: number;
  kilosUchuvaMes: number;
  kilosGulupaMes: number;
}

export interface UserStats {
  totalFincas: number;
  totalCultivos: number;
  totalRemisiones: number;
  kilosTotales: number;
}