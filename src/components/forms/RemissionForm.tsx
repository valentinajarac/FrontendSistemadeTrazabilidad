import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Remission, Farm, Crop, Client } from '../../types';
import { Button } from '../ui/Button';

interface RemissionFormProps {
  onSubmit: (data: Omit<Remission, 'id'>) => Promise<void>;
  initialData?: Remission | null;
  farms: Farm[];
  crops: Crop[];
  clients: Client[];
  onClose: () => void;
  loading?: boolean;
}

export function RemissionForm({
  onSubmit,
  initialData,
  farms,
  crops,
  clients,
  onClose,
  loading
}: RemissionFormProps) {
  const [availableCrops, setAvailableCrops] = useState<Crop[]>([]);

  const defaultValues = {
    fechaDespacho: initialData?.fechaDespacho 
      ? new Date(initialData.fechaDespacho).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    canastillasEnviadas: initialData?.canastillasEnviadas || '',
    kilosPromedio: initialData?.kilosPromedio || '',
    producto: initialData?.producto || '',
    farm: { id: initialData?.farm?.id || '' },
    crop: { id: initialData?.crop?.id || '' },
    client: { id: initialData?.client?.id || '' }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues
  });

  const selectedFarmId = watch('farm.id');

  // Actualizar cultivos disponibles cuando cambia la finca seleccionada
  useEffect(() => {
    if (selectedFarmId) {
      // Filtrar los cultivos que pertenecen a la finca seleccionada
      const farmCrops = crops.filter(crop => 
        crop.farmId === Number(selectedFarmId)
      );
      setAvailableCrops(farmCrops);

      // Limpiar el cultivo seleccionado si no está disponible en la nueva finca
      const currentCropId = watch('crop.id');
      if (currentCropId && !farmCrops.some(crop => crop.id === Number(currentCropId))) {
        setValue('crop.id', '');
        setValue('producto', '');
      }
    } else {
      setAvailableCrops([]);
    }
  }, [selectedFarmId, crops, setValue, watch]);

  const selectedCropId = watch('crop.id');
  
  // Actualizar producto cuando cambia el cultivo seleccionado
  useEffect(() => {
    if (selectedCropId) {
      const selectedCrop = crops.find(crop => crop.id === Number(selectedCropId));
      if (selectedCrop) {
        setValue('producto', selectedCrop.producto);
      }
    }
  }, [selectedCropId, crops, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha de Despacho
        </label>
        <input
          type="date"
          {...register('fechaDespacho', {
            required: 'La fecha es requerida'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.fechaDespacho && (
          <span className="text-red-500 text-sm">{errors.fechaDespacho.message}</span>
        )}
      </div>

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
          Cultivo
        </label>
        <select
          {...register('crop.id', {
            required: 'Debe seleccionar un cultivo'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={!selectedFarmId || loading}
        >
          <option value="">
            {!selectedFarmId 
              ? 'Primero seleccione una finca' 
              : 'Seleccione un cultivo'
            }
          </option>
          {availableCrops.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {`${crop.producto} - ${crop.estado} (${crop.numeroPlants} plantas)`}
            </option>
          ))}
        </select>
        {errors.crop?.id && (
          <span className="text-red-500 text-sm">{errors.crop.id.message}</span>
        )}
        {selectedFarmId && availableCrops.length === 0 && (
          <span className="text-yellow-600 text-sm">
            No hay cultivos disponibles para esta finca
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          {...register('client.id', {
            required: 'Debe seleccionar un cliente'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        >
          <option value="">Seleccione un cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nombre}
            </option>
          ))}
        </select>
        {errors.client?.id && (
          <span className="text-red-500 text-sm">{errors.client.id.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Canastillas Enviadas
        </label>
        <input
          type="number"
          {...register('canastillasEnviadas', {
            required: 'El número de canastillas es requerido',
            min: {
              value: 1,
              message: 'Debe enviar al menos 1 canastilla'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.canastillasEnviadas && (
          <span className="text-red-500 text-sm">{errors.canastillasEnviadas.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kilos Promedio por Canastilla
        </label>
        <input
          type="number"
          step="0.01"
          {...register('kilosPromedio', {
            required: 'Los kilos promedio son requeridos',
            min: {
              value: 0.01,
              message: 'El valor debe ser mayor a 0'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          disabled={loading}
        />
        {errors.kilosPromedio && (
          <span className="text-red-500 text-sm">{errors.kilosPromedio.message}</span>
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
          {initialData ? 'Actualizar' : 'Crear'} Remisión
        </Button>
      </div>
    </form>
  );
}