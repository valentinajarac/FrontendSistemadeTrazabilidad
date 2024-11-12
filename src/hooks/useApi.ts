import { useState, useCallback } from 'react';
import { ApiError } from '../api/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await promise;
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Error en la solicitud',
        status: error.response?.status || 500,
        errors: error.response?.data?.errors,
      };
      setState(prev => ({ ...prev, loading: false, error: apiError }));
      throw apiError;
    }
  }, []);

  return {
    ...state,
    execute,
  };
}