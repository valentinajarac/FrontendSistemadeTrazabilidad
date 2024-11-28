import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Client } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/SearchBar';
import { Plus, X } from 'lucide-react';
import api from '../../api/config';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Client>();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchTerm, clients]);

  const filterClients = () => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      client.nit.toLowerCase().includes(searchTermLower) ||
      client.nombre.toLowerCase().includes(searchTermLower) ||
      client.floid.toLowerCase().includes(searchTermLower) ||
      client.direccion.toLowerCase().includes(searchTermLower) ||
      client.telefono.toLowerCase().includes(searchTermLower) ||
      client.email.toLowerCase().includes(searchTermLower)
    );
    setFilteredClients(filtered);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clients');
      
      if (response.data.success) {
        setClients(response.data.data);
        setFilteredClients(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar los clientes');
      }
    } catch (error: any) {
      console.error('Error al cargar clientes:', error);
      setError(error.response?.data?.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Client) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = editingClient ? `/clients/${editingClient.id}` : '/clients';
      const method = editingClient ? 'put' : 'post';
      
      const response = await api[method](url, data);

      if (response.data.success) {
        await fetchClients();
        setShowModal(false);
        reset();
        setEditingClient(null);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error('Error al guardar cliente:', error);
      setError(error.response?.data?.message || 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    reset(client);
    setShowModal(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.delete(`/clients/${client.id}`);
        
        if (response.data.success) {
          await fetchClients();
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        console.error('Error al eliminar cliente:', error);
        setError(error.response?.data?.message || 'Error al eliminar el cliente');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { key: 'nit', label: 'NIT' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'floid', label: 'FLO ID' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        <Button
          onClick={() => {
            setEditingClient(null);
            reset({});
            setShowModal(true);
          }}
          variant="primary"
          icon={Plus}
          disabled={loading}
        >
          Nuevo Cliente
        </Button>
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
        placeholder="Buscar clientes..."
      />

      <DataTable
        columns={columns}
        data={filteredClients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIT</label>
                <input
                  type="text"
                  {...register('nit', { required: 'El NIT es requerido' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.nit && (
                  <span className="text-red-500 text-sm">{errors.nit.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  {...register('nombre', { required: 'El nombre es requerido' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.nombre && (
                  <span className="text-red-500 text-sm">{errors.nombre.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">FLO ID</label>
                <input
                  type="text"
                  {...register('floid', { 
                    required: 'El FLO ID es requerido',
                    pattern: {
                      value: /^\d{5}$/,
                      message: 'El FLO ID debe ser un número de 5 dígitos'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.floid && (
                  <span className="text-red-500 text-sm">{errors.floid.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  {...register('direccion', { required: 'La dirección es requerida' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.direccion && (
                  <span className="text-red-500 text-sm">{errors.direccion.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  {...register('telefono', { 
                    required: 'El teléfono es requerido',
                    pattern: {
                      value: /^\d{7,10}$/,
                      message: 'El teléfono debe tener entre 7 y 10 dígitos'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.telefono && (
                  <span className="text-red-500 text-sm">{errors.telefono.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                {editingClient ? 'Actualizar' : 'Crear'} Cliente
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};