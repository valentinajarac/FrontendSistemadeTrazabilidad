import { useState, useCallback } from 'react';
import { useError } from '../context/ErrorContext';

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  setValues: (values: T) => void;
  reset: () => void;
}

export function useForm<T>(initialValues: T): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const { setError } = useError();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    []
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) => async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await onSubmit(values);
      } catch (error: any) {
        setError(error.message || 'Error al procesar el formulario');
      }
    },
    [values, setError]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    reset,
  };
}