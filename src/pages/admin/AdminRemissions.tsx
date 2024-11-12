import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/ui/Button';
import { FileSpreadsheet, Calendar } from 'lucide-react';
import { Remission } from '../../types';
import api from '../../api/config';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';

export function AdminRemissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [filteredRemissions, setFilteredRemissions] = useState<Remission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    fetchRemissions();
  }, []);

  useEffect(() => {
    filterAndSortRemissions();
  }, [searchTerm, remissions, selectedMonth]);

  const sortRemissionsByDate = (remissionsToSort: Remission[]) => {
    return [...remissionsToSort].sort((a, b) => {
      const dateA = new Date(a.fechaDespacho).getTime();
      const dateB = new Date(b.fechaDespacho).getTime();
      return dateB - dateA; // Orden descendente (más reciente primero)
    });
  };

  const filterAndSortRemissions = () => {
    let filtered = remissions;

    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = remissions.filter(remission => 
        format(new Date(remission.fechaDespacho), 'dd/MM/yyyy', { locale: es }).toLowerCase().includes(searchTermLower) ||
        remission.nombreProductor?.toLowerCase().includes(searchTermLower) ||
        remission.farmNombre?.toLowerCase().includes(searchTermLower) ||
        remission.producto.toLowerCase().includes(searchTermLower) ||
        remission.clientNombre?.toLowerCase().includes(searchTermLower) ||
        remission.canastillasEnviadas.toString().includes(searchTermLower) ||
        remission.kilosPromedio.toString().includes(searchTermLower) ||
        remission.totalKilos.toString().includes(searchTermLower)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(remission => {
        const remissionDate = new Date(remission.fechaDespacho);
        const month = remissionDate.getMonth() + 1;
        const year = remissionDate.getFullYear().toString();
        return `${year}-${month.toString().padStart(2, '0')}` === selectedMonth;
      });
    }

    setFilteredRemissions(sortRemissionsByDate(filtered));
  };

  const fetchRemissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/remissions/admin');

      if (response.data.success) {
        const sortedRemissions = sortRemissionsByDate(response.data.data);
        setRemissions(sortedRemissions);
        setFilteredRemissions(sortedRemissions);
      } else {
        setError(response.data.message || 'Error al cargar las remisiones');
      }
    } catch (error: any) {
      console.error('Error al cargar remisiones:', error);
      setError(error.response?.data?.message || 'Error al cargar las remisiones');
    } finally {
      setLoading(false);
    }
  };

  const prepareRemissionForExport = (remission: Remission) => {
    return {
      'Fecha': format(new Date(remission.fechaDespacho), 'dd/MM/yyyy', { locale: es }),
      'Productor': remission.nombreProductor || 'N/A',
      'Finca': remission.farmNombre || 'N/A',
      'Producto': remission.producto.charAt(0) + remission.producto.slice(1).toLowerCase(),
      'Canastillas': remission.canastillasEnviadas,
      'Kilos Promedio': Number(remission.kilosPromedio.toFixed(2)),
      'Total Kilos': Number(remission.totalKilos.toFixed(2)),
      'Cliente': remission.clientNombre || 'N/A'
    };
  };

  const exportToExcel = (data: Remission[], fileName: string) => {
    const exportData = data.map(prepareRemissionForExport);
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Configurar anchos de columna
    const columnWidths = [
      { wch: 12 },  // Fecha
      { wch: 25 },  // Productor
      { wch: 20 },  // Finca
      { wch: 10 },  // Producto
      { wch: 12 },  // Canastillas
      { wch: 15 },  // Kilos Promedio
      { wch: 12 },  // Total Kilos
      { wch: 25 },  // Cliente
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Remisiones');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportAllRemissions = () => {
    if (remissions.length === 0) {
      setError('No hay remisiones para exportar');
      return;
    }
    exportToExcel(remissions, `todas_las_remisiones_${format(new Date(), 'dd-MM-yyyy')}`);
  };

  const exportRemissionsByMonth = () => {
    if (!selectedMonth) {
      setError('Por favor seleccione un mes para exportar');
      return;
    }

    if (filteredRemissions.length === 0) {
      setError('No hay remisiones para el mes seleccionado');
      return;
    }

    const monthDate = new Date(selectedMonth + '-01');
    const monthName = format(monthDate, 'MMMM_yyyy', { locale: es });
    exportToExcel(filteredRemissions, `remisiones_${monthName}`);
  };

  const exportSingleRemission = (remission: Remission) => {
    const fileName = `remision_${remission.id}_${format(new Date(remission.fechaDespacho), 'dd-MM-yyyy')}`;
    exportToExcel([remission], fileName);
  };

  const columns = [
    { 
      key: 'fechaDespacho', 
      label: 'Fecha',
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy', { locale: es })
    },
    { 
      key: 'nombreProductor', 
      label: 'Productor'
    },
    { 
      key: 'farmNombre', 
      label: 'Finca'
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value: string) => value.charAt(0) + value.slice(1).toLowerCase()
    },
    { 
      key: 'canastillasEnviadas', 
      label: 'Canastillas',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'kilosPromedio', 
      label: 'Kilos Promedio',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'totalKilos', 
      label: 'Total Kilos',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'clientNombre', 
      label: 'Cliente'
    },
    {
      key: 'actions',
      label: 'Exportar',
      render: (_: any, remission: Remission) => (
        <Button
          variant="secondary"
          size="sm"
          icon={FileSpreadsheet}
          onClick={(e) => {
            e.stopPropagation();
            exportSingleRemission(remission);
          }}
        >
          Excel
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Remisiones</h1>
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
              onClick={exportRemissionsByMonth}
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
            onClick={exportAllRemissions}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <span className="hidden sm:inline">Exportar Todo</span>
            <span className="sm:hidden">Todo</span>
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
        loading={loading}
      />
    </div>
  );
}