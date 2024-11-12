import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export interface Column<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false
}: DataTableProps<T>) => {
  const getCellValue = (row: T, column: Column<T>) => {
    try {
      const value = column.key.includes('.') 
        ? column.key.split('.').reduce((obj, key) => obj?.[key], row)
        : row[column.key];
      
      if (column.render) {
        return column.render(value, row);
      }
      
      if (value === null || value === undefined) {
        return 'N/A';
      }
      
      if (typeof value === 'boolean') {
        return value ? 'Sí' : 'No';
      }
      
      return String(value);
    } catch (error) {
      console.error(`Error getting value for column ${column.key}:`, error);
      return 'Error';
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-500">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-hidden">
      {/* Vista para dispositivos móviles */}
      <div className="block lg:hidden">
        {data.map((item, index) => (
          <div key={index} className="p-4 border-b border-gray-200">
            {columns.map((column) => (
              <div key={column.key} className="mb-2">
                <span className="font-medium text-gray-600">{column.label}: </span>
                <span className="text-gray-900">
                  {getCellValue(item, column)}
                </span>
              </div>
            ))}
            {(onEdit || onDelete) && (
              <div className="mt-3 flex justify-end space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-indigo-600 hover:text-indigo-900 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-red-600 hover:text-red-900 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Vista para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {getCellValue(item, column)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};