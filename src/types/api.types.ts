// Tipos base para respuestas API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  status: number;
  type?: string;
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

// Tipos para configuración de API
export interface ApiConfig {
  baseURL: string;
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
}

// Tipos para manejo de errores HTTP
export interface HttpError extends Error {
  status?: number;
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

// Tipos para respuestas de paginación
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// Tipos para respuestas con validación
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResponse {
  success: boolean;
  errors: ValidationError[];
}