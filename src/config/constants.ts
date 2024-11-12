export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://sistemawebdetrazabilidad-e19da3b0d7eb.herokuapp.com/api',
  TIMEOUT: 10000,
  AUTH: {
    TOKEN_KEY: 'trazafrutas_token',
    USER_KEY: 'trazafrutas_user'
  }
};