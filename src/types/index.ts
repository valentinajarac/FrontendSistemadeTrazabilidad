// Re-exportar todos los tipos
export * from './auth.types';
export * from './dashboard.types';
export * from './producer.types';

// Tipos base
export type Role = 'ADMIN' | 'PRODUCER';
export type ProductType = 'UCHUVA' | 'GULUPA';
export type CropStatus = 'PRODUCCION' | 'VEGETACION';
export type UserStatus = 'ACTIVO' | 'INACTIVO';
export type Certification = 'FAIRTRADE_USA' | 'GLOBAL_GAP' | 'ICA';

// Interfaces principales
export interface User {
  id: number;
  cedula: string;
  nombreCompleto: string;
  codigoTrazabilidad: string;
  municipio: string;
  telefono: string;
  usuario: string;
  password?: string;
  role: Role;
  status: UserStatus;
  certifications: Certification[];
}

export interface Farm {
  id: number;
  nombre: string;
  hectareas: number;
  municipio: string;
  vereda: string;
  user?: User;
}

export interface Crop {
  id: number;
  numeroPlants: number;
  hectareas: number;
  fechaSiembra: string;
  producto: ProductType;
  estado: CropStatus;
  farm: Farm;
  farmNombre?: string;
  user?: User;
}


export interface Client {
  id: number;
  nit: string;
  nombre: string;
  floid: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Remission {
  id: number;
  fechaDespacho: string;
  canastillasEnviadas: number;
  kilosPromedio: number;
  totalKilos: number;
  producto: ProductType;
  user?: User;
  farm: Farm;
  crop: Crop;
  client: Client;
}

// Interfaces para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Interfaces para filtros y búsqueda
export interface FilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  producto?: ProductType;
  estado?: CropStatus;
  farmId?: number;
  clientId?: number;
}