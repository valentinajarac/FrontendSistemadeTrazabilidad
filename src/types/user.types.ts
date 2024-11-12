export type UserStatus = 'ACTIVO' | 'INACTIVO';
export type Role = 'ADMIN' | 'PRODUCER';
export type Certification = 'FAIRTRADE_USA' | 'GLOBAL_GAP' | 'ICA' | 'NINGUNA';

export interface User {
  id?: number;
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

export interface UserResponse {
  id: number;
  cedula: string;
  nombreCompleto: string;
  codigoTrazabilidad: string;
  municipio: string;
  telefono: string;
  usuario: string;
  role: Role;
  status: UserStatus;
  certifications: Certification[];
}