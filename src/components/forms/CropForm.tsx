import React from 'react';
import { useForm } from 'react-hook-form';
import { Crop, Farm } from '../../types';
import { Button } from '../ui/Button';

interface CropFormProps {
  onSubmit: (data: Omit<Crop, 'id'>) => Promise<void>;
  initialData?: Crop | null;
  farms: Farm[];
  onClose: () => void;
  loading?: boolean;
}

export function CropForm({
  onSubmit,
  initialData,
  farms,
  onClose,
  loading
}: CropFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<Crop, 'id'>>({
    defaultValues: {
      ...initialData,
      fechaSiembra: initialData?.fechaSiembra 
        ? initialData.fechaSiembra.split('T')[0]
        : new Date().toISOString().split('T')[0]
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Finca
        </label>
        <select
          {...register('farm.id', {
            required: 'Debe seleccionar una finca'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        >
          <option value="">Seleccione una finca</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.nombre}
            </option>
          ))}
        </select>
        {errors.farm?.id && (
          <span className="text-red-500 text-sm">{errors.farm.id.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número de Plantas
        </label>
        <input
          type="number"
          {...register('numeroPlants', {
            required: 'El número de plantas es requerido',
            min: {
              value: 1,
              message: 'Debe tener al menos 1 planta'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.numeroPlants && (
          <span className="text-red-500 text-sm">{errors.numeroPlants.message}</span>
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
          Fecha de Siembra
        </label>
        <input
          type="date"
          {...register('fechaSiembra', {
            required: 'La fecha de siembra es requerida'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.fechaSiembra && (
          <span className="text-red-500 text-sm">{errors.fechaSiembra.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Producto
        </label>
        <select
          {...register('producto', {
            required: 'Debe seleccionar un producto'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        >
          <option value="">Seleccione un producto</option>
          <option value="UCHUVA">Uchuva</option>
          <option value="GULUPA">Gulupa</option>
        </select>
        {errors.producto && (
          <span className="text-red-500 text-sm">{errors.producto.message}</span>
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
          {initialData ? 'Actualizar' : 'Crear'} Cultivo
        </Button>
      </div>
    </form>
  );
}