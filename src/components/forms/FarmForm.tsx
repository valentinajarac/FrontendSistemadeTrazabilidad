import React from 'react';
import { useForm } from 'react-hook-form';
import { Farm } from '../../types';
import { Button } from '../ui/Button';

interface FarmFormProps {
  onSubmit: (data: Omit<Farm, 'id'>) => Promise<void>;
  initialData?: Farm | null;
  onClose: () => void;
  loading?: boolean;
}

export function FarmForm({ onSubmit, initialData, onClose, loading }: FarmFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<Farm, 'id'>>({
    defaultValues: initialData || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la Finca
        </label>
        <input
          type="text"
          {...register('nombre', {
            required: 'El nombre es requerido',
            minLength: {
              value: 3,
              message: 'El nombre debe tener al menos 3 caracteres'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.nombre && (
          <span className="text-red-500 text-sm">{errors.nombre.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hectáreas
        </label>
        <input
          type="number"
          step="0.01"
          {...register('hectareas', {
            required: 'Las hectáreas son requeridas',
            min: {
              value: 0.01,
              message: 'El valor debe ser mayor a 0'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.hectareas && (
          <span className="text-red-500 text-sm">{errors.hectareas.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Municipio
        </label>
        <input
          type="text"
          {...register('municipio', {
            required: 'El municipio es requerido'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.municipio && (
          <span className="text-red-500 text-sm">{errors.municipio.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vereda
        </label>
        <input
          type="text"
          {...register('vereda', {
            required: 'La vereda es requerida'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.vereda && (
          <span className="text-red-500 text-sm">{errors.vereda.message}</span>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {initialData ? 'Actualizar' : 'Crear'} Finca
        </Button>
      </div>
    </form>
  );
}