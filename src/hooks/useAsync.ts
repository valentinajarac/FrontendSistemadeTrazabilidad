import { useState, useCallback } from 'react';
import { useError } from '../context/ErrorContext';
import { useLoading } from '../context/LoadingContext';

interface UseAsyncReturn<T> {
  data: T | null;
  execute: (...args: any[]) => Promise<T>;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const { setError } = useError();
  const { setLoading } = useLoading();

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        const response = await asyncFunction(...args);
        setData(response);
        return response;
      } catch (error: any) {
        setError(error.message || 'Ha ocurrido un error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, setError, setLoading]
  );

  return { data, execute };
}