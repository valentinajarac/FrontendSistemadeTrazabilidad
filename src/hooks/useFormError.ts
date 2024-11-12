import { useEffect } from 'react';
import { useError } from '../context/ErrorContext';
import { FieldErrors } from 'react-hook-form';

export function useFormError<T>(errors: FieldErrors<T>) {
  const { setError } = useError();

  useEffect(() => {
    const errorMessages = Object.values(errors)
      .map((error) => error.message)
      .filter(Boolean);

    if (errorMessages.length > 0) {
      setError(errorMessages.join(', '));
    }
  }, [errors, setError]);
}