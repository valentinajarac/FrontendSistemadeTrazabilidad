import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import { Farm } from '../../types';
import api from '../../api/config';

export function AdminFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFarms();
  }, []);

  useEffect(() => {
    filterFarms();
  }, [searchTerm, farms]);

  const filterFarms = () => {
    if (!searchTerm.trim()) {
      setFilteredFarms(farms);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = farms.filter(farm => 
      farm.productor?.toLowerCase().includes(searchTermLower) ||
      farm.nombre.toLowerCase().includes(searchTermLower) ||
      farm.hectareas.toString().includes(searchTermLower) ||
      farm.municipio.toLowerCase().includes(searchTermLower) ||
      farm.vereda.toLowerCase().includes(searchTermLower)
    );
    setFilteredFarms(filtered);
  };

  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/farms/admin');

      if (response.data.success) {
        setFarms(response.data.data);
        setFilteredFarms(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar las fincas');
      }
    } catch (error: any) {
      console.error('Error al cargar fincas:', error);
      setError(error.response?.data?.message || 'Error al cargar las fincas');
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
      key: 'nombre', 
      label: 'Nombre'
    },
    { 
      key: 'hectareas', 
      label: 'Hectáreas',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'municipio', 
      label: 'Municipio'
    },
    {
      key: 'vereda',
      label: 'Vereda'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Fincas</h1>
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
        placeholder="Buscar fincas..."
      />

      <DataTable
        columns={columns}
        data={filteredFarms}
        loading={loading}
      />
    </div>
  );
}

export default AdminFarms;