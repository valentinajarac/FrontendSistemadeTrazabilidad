import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import api from '../../api/config';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function AdminCrops() {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [searchTerm, crops]);

  const filterCrops = () => {
    if (!searchTerm.trim()) {
      setFilteredCrops(crops);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = crops.filter((crop: any) => {
      const fechaSiembra = crop.fechaSiembra ? format(parseISO(crop.fechaSiembra), 'dd/MM/yyyy', { locale: es }) : '';
      return crop.productor?.toLowerCase().includes(searchTermLower) ||
        crop.numeroPlants?.toString().includes(searchTermLower) ||
        crop.hectareas?.toString().includes(searchTermLower) ||
        fechaSiembra.includes(searchTermLower) ||
        crop.producto?.toLowerCase().includes(searchTermLower) ||
        crop.estado?.toLowerCase().includes(searchTermLower) ||
        crop.farmNombre?.toLowerCase().includes(searchTermLower);
    });
    setFilteredCrops(filtered);
  };

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crops/admin');
      
      if (response.data.success) {
        setCrops(response.data.data);
        setFilteredCrops(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar los cultivos');
      }
    } catch (error: any) {
      console.error('Error al cargar cultivos:', error);
      setError(error.response?.data?.message || 'Error al cargar los cultivos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'productor', 
      label: 'Productor'
    },
    { 
      key: 'farmNombre', 
      label: 'Finca'
    },
    { 
      key: 'numeroPlants', 
      label: 'Número de Plantas',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'hectareas', 
      label: 'Hectáreas',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'fechaSiembra', 
      label: 'Fecha de Siembra',
      render: (value: string) => {
        if (!value) return 'N/A';
        try {
          return format(parseISO(value), 'dd/MM/yyyy', { locale: es });
        } catch (error) {
          console.error('Error parsing date:', error);
          return 'Fecha inválida';
        }
      }
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value: string) => value.charAt(0) + value.slice(1).toLowerCase()
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: string) => {
        const estado = value.charAt(0) + value.slice(1).toLowerCase();
        return (
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            estado === 'Produccion' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {estado}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cultivos Registrados</h1>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar cultivos..."
      />

      <DataTable
        columns={columns}
        data={filteredCrops}
        loading={loading}
      />
    </div>
  );
}