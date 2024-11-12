import React, { useState, useEffect } from 'react';
import { PlusCircle, FileSpreadsheet, Download, Calendar } from 'lucide-react';
import { Remission, Farm, Crop, Client } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import { RemissionForm } from '../../components/forms/RemissionForm';
import api from '../../api/config';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';

export function Remissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [filteredRemissions, setFilteredRemissions] = useState<Remission[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRemission, setCurrentRemission] = useState<Remission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    fetchRemissions();
    fetchFarms();
    fetchCrops();
    fetchClients();
  }, []);

  useEffect(() => {
    filterRemissions();
  }, [searchTerm, remissions]);

  const sortRemissionsByDate = (remissionsToSort: Remission[]) => {
    return [...remissionsToSort].sort((a, b) => {
      const dateA = new Date(a.fechaDespacho).getTime();
      const dateB = new Date(b.fechaDespacho).getTime();
      return dateB - dateA; // Orden descendente (más reciente primero)
    });
  };

  const filterRemissions = () => {
    if (!searchTerm.trim()) {
      setFilteredRemissions(sortRemissionsByDate(remissions));
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = remissions.filter(remission => 
      format(new Date(remission.fechaDespacho), 'dd/MM/yyyy', { locale: es }).toLowerCase().includes(searchTermLower) ||
      remission.farm.nombre.toLowerCase().includes(searchTermLower) ||
      remission.producto.toLowerCase().includes(searchTermLower) ||
      remission.client.nombre.toLowerCase().includes(searchTermLower) ||
      remission.canastillasEnviadas.toString().includes(searchTermLower) ||
      remission.totalKilos.toString().includes(searchTermLower)
    );
    setFilteredRemissions(sortRemissionsByDate(filtered));
  };

  const fetchRemissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/remissions');
      if (response.data.success) {
        // Transformar los datos para asegurar que las relaciones estén correctamente mapeadas
        const transformedRemissions = response.data.data.map((remission: any) => ({
          ...remission,
          farm: farms.find(f => f.id === remission.farmId) || { nombre: 'N/A' },
          client: clients.find(c => c.id === remission.clientId) || { nombre: 'N/A' }
        }));
        const sortedRemissions = sortRemissionsByDate(transformedRemissions);
        setRemissions(sortedRemissions);
        setFilteredRemissions(sortedRemissions);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar las remisiones');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms');
      if (response.data.success) {
        setFarms(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar las fincas');
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await api.get('/crops');
      if (response.data.success) {
        setCrops(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar los cultivos');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar los clientes');
    }
  };

  // Refrescar los datos cuando se carguen las fincas y clientes
  useEffect(() => {
    if (farms.length > 0 && clients.length > 0) {
      fetchRemissions();
    }
  }, [farms, clients]);

  const handleSubmit = async (data: Omit<Remission, 'id'>) => {
    try {
      setLoading(true);
      const url = currentRemission ? `/remissions/${currentRemission.id}` : '/remissions';
      const method = currentRemission ? 'put' : 'post';
      
      const response = await api[method](url, data);
      
      if (response.data.success) {
        await fetchRemissions();
        setIsModalOpen(false);
        setCurrentRemission(null);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar la remisión');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (remission: Remission) => {
    setCurrentRemission(remission);
    setIsModalOpen(true);
  };

  const handleDelete = async (remission: Remission) => {
    if (window.confirm('¿Está seguro de eliminar esta remisión?')) {
      try {
        setLoading(true);
        const response = await api.delete(`/remissions/${remission.id}`);
        
        if (response.data.success) {
          await fetchRemissions();
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error al eliminar la remisión');
      } finally {
        setLoading(false);
      }
    }
  };

  const exportToExcel = (data: Remission[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(remission => ({
        'Fecha': format(new Date(remission.fechaDespacho), 'dd/MM/yyyy', { locale: es }),
        'Finca': remission.farm.nombre,
        'Producto': remission.producto.charAt(0) + remission.producto.slice(1).toLowerCase(),
        'Canastillas': remission.canastillasEnviadas,
        'Kilos Promedio': Number(remission.kilosPromedio.toFixed(2)),
        'Total Kilos': Number(remission.totalKilos.toFixed(2)),
        'Cliente': remission.client.nombre
      }))
    );

    const columnWidths = [
      { wch: 12 }, // Fecha
      { wch: 20 }, // Finca
      { wch: 10 }, // Producto
      { wch: 12 }, // Canastillas
      { wch: 15 }, // Kilos Promedio
      { wch: 12 }, // Total Kilos
      { wch: 25 }, // Cliente
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Remisiones');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportSingleRemission = (remission: Remission) => {
    exportToExcel([remission], `remision_${remission.id}_${format(new Date(remission.fechaDespacho), 'dd-MM-yyyy')}`);
  };

  const exportSelectedMonth = () => {
    const selectedDate = parse(selectedMonth, 'yyyy-MM', new Date());
    const selectedMonthNumber = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const monthlyRemissions = remissions.filter(remission => {
      const remissionDate = new Date(remission.fechaDespacho);
      return remissionDate.getMonth() === selectedMonthNumber && 
             remissionDate.getFullYear() === selectedYear;
    });

    if (monthlyRemissions.length === 0) {
      setError(`No hay remisiones para ${format(selectedDate, 'MMMM yyyy', { locale: es })}`);
      return;
    }

    exportToExcel(
      monthlyRemissions,
      `mis_remisiones_${format(selectedDate, 'MMMM_yyyy', { locale: es })}`
    );
  };

  const exportAll = () => {
    if (remissions.length === 0) {
      setError('No hay remisiones para exportar');
      return;
    }
    exportToExcel(remissions, `todas_mis_remisiones_${format(new Date(), 'dd-MM-yyyy')}`);
  };

  const columns = [
    { 
      key: 'fechaDespacho', 
      label: 'Fecha',
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy', { locale: es })
    },
    { 
      key: 'farm.nombre', 
      label: 'Finca'
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value: string) => value?.charAt(0) + value?.slice(1).toLowerCase() || 'N/A'
    },
    { 
      key: 'canastillasEnviadas', 
      label: 'Canastillas',
      render: (value: number) => value?.toLocaleString() || '0'
    },
    { 
      key: 'kilosPromedio', 
      label: 'Kilos Promedio',
      render: (value: number) => value?.toFixed(2) || '0.00'
    },
    { 
      key: 'totalKilos', 
      label: 'Total Kilos',
      render: (value: number) => value?.toFixed(2) || '0.00'
    },
    { 
      key: 'client.nombre', 
      label: 'Cliente'
    },
    {
      key: 'actions',
      label: 'Exportar',
      render: (_: any, remission: Remission) => (
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={() => exportSingleRemission(remission)}
        >
          Excel
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Remisiones de Campo</h1>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 sm:flex-none">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <Button
              variant="primary"
              icon={FileSpreadsheet}
              onClick={exportSelectedMonth}
              disabled={loading}
              className="whitespace-nowrap"
            >
              <span className="hidden sm:inline">Exportar Mes</span>
              <span className="sm:hidden">Mes</span>
            </Button>
          </div>

          <Button
            variant="secondary"
            icon={FileSpreadsheet}
            onClick={exportAll}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <span className="hidden sm:inline">Exportar Todo</span>
            <span className="sm:hidden">Todo</span>
          </Button>

          <Button
            onClick={() => {
              setCurrentRemission(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            icon={PlusCircle}
            disabled={loading}
          >
            Nueva Remisión
          </Button>
        </div>
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
        placeholder="Buscar remisiones..."
      />

      <DataTable
        columns={columns}
        data={filteredRemissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRemission ? 'Editar Remisión' : 'Nueva Remisión'}
      >
        <RemissionForm
          onSubmit={handleSubmit}
          initialData={currentRemission}
          farms={farms}
          crops={crops}
          clients={clients}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}