import React, { useState, useEffect } from 'react';
import { 
  Warehouse, Sprout, ClipboardList, Download,
  FileSpreadsheet, FileText
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { MonthlyStats, UserStats } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { producerService } from '../../api/services/producer.service';

export function ProducerDashboard() {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, monthlyStats] = await Promise.all([
          producerService.getStats(),
          producerService.getMonthlyData()
        ]);

        setStats(statsData);
        setMonthlyData(monthlyStats);
      } catch (err: any) {
        console.error('Error fetching producer data:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportExcel = () => {
    try {
      exportToExcel(monthlyData, {
        title: 'Mis Despachos Mensuales - TrazaFrutas',
        subtitle: 'Resumen Personal de Producción',
        producer: user?.username,
        fileName: `mis_despachos_${format(new Date(), 'yyyy-MM-dd')}`
      });
    } catch (err: any) {
      setError('Error al exportar a Excel: ' + err.message);
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(monthlyData, {
        title: 'Mis Despachos Mensuales',
        subtitle: 'Resumen Personal de Producción',
        producer: user?.username,
        fileName: `mis_despachos_${format(new Date(), 'yyyy-MM-dd')}`
      });
    } catch (err: any) {
      setError('Error al exportar a PDF: ' + err.message);
    }
  };

  if (error) {
    return (
      <Alert
        type="error"
        message={error}
        onClose={() => setError(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pagina Principal Productor</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportExcel}
            icon={FileSpreadsheet}
            disabled={loading}
          >
            Excel
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="danger"
            icon={FileText}
            disabled={loading}
          >
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Mis Fincas"
          value={stats?.totalFincas || 0}
          icon={Warehouse}
          loading={loading}
        />
        <Card
          title="Mis Cultivos"
          value={stats?.totalCultivos || 0}
          icon={Sprout}
          loading={loading}
        />
        <Card
          title="Total Remisiones"
          value={stats?.totalRemisiones || 0}
          icon={ClipboardList}
          loading={loading}
        />
        <Card
          title="Total Kilos"
          value={`${stats?.kilosTotales.toFixed(2) || 0} kg`}
          icon={Download}
          loading={loading}
        />
      </div>

      {monthlyData.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mi Producción Mensual</h2>
            <div className="h-96">
              <BarChart
                data={monthlyData}
                xAxisKey="mes"
                bars={[
                  { key: 'kilosUchuva', name: 'Uchuva', color: '#f59e0b' },
                  { key: 'kilosGulupa', name: 'Gulupa', color: '#10b981' }
                ]}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución de mi Producción</h2>
            <div className="h-96">
              <PieChart
                data={[
                  {
                    name: 'Uchuva',
                    value: monthlyData.reduce((sum, curr) => sum + curr.kilosUchuva, 0),
                    color: '#f59e0b'
                  },
                  {
                    name: 'Gulupa',
                    value: monthlyData.reduce((sum, curr) => sum + curr.kilosGulupa, 0),
                    color: '#10b981'
                  }
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}