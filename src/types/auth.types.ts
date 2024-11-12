// Tipos de autenticación
export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: 'ADMIN' | 'PRODUCER';
  userId: number;
  username: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}