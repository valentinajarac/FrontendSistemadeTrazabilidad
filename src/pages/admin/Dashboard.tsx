import React, { useState, useEffect } from 'react';
import { 
  Users, Warehouse, Sprout, FileText, FileSpreadsheet,
  Leaf, TrendingUp, Building2, Award, Trees
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart } from '../../components/charts/PieChart';
import { DashboardStats, MonthlyStats } from '../../types';
import { dashboardService } from '../../api/services/dashboard.service';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AdminDashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, monthlyStats] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getMonthlyData()
        ]);

        setStats(statsData);
        setMonthlyData(monthlyStats);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
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
        title: 'Reporte Mensual de Despachos - TrazaFrutas',
        subtitle: 'Resumen General de Producción',
        fileName: `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}`
      });
    } catch (err: any) {
      setError('Error al exportar a Excel: ' + err.message);
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(monthlyData, {
        title: 'Reporte Mensual de Despachos',
        subtitle: 'Resumen General de Producción',
        fileName: `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}`
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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
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

      {/* Estadísticas de Productores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Productores Activos"
          value={stats?.productoresActivos || 0}
          icon={Users}
          loading={loading}
        />
        <Card
          title="Certificación Fairtrade-USA"
          value={stats?.productoresFairtrade || 0}
          icon={Award}
          loading={loading}
        />
        <Card
          title="Certificación Global GAP"
          value={stats?.productoresGlobalGap || 0}
          icon={Award}
          loading={loading}
        />
        <Card
          title="Certificación ICA"
          value={stats?.productoresIca || 0}
          icon={Award}
          loading={loading}
        />
      </div>

      {/* Estadísticas de Producción */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Total Fincas"
          value={stats?.totalFincas || 0}
          icon={Warehouse}
          loading={loading}
        />
        <Card
          title="Total Cultivos"
          value={stats?.totalCultivos || 0}
          icon={Trees}
          loading={loading}
        />
        <Card
          title="Cultivos en Producción"
          value={stats?.cultivosProduccion || 0}
          icon={Sprout}
          loading={loading}
        />
        <Card
          title="Cultivos en Vegetación"
          value={stats?.cultivosVegetacion || 0}
          icon={Leaf}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Municipio */}
        {stats?.produccionesPorMunicipio && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución de Productores por Municipio</h2>
            <div className="h-96">
              <PieChart
                data={stats.produccionesPorMunicipio.map((item, index) => ({
                  name: item.municipio,
                  value: item.cantidad,
                  color: `hsl(${index * 137.5}, 70%, 50%)`
                }))}
                valueFormatter={(value) => `${value} productores`}
              />
            </div>
          </div>
        )}

        {/* Distribución por Producto */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución por Producto</h2>
          <div className="h-96">
            <PieChart
              data={[
                {
                  name: 'Productores Uchuva',
                  value: stats?.productoresUchuva || 0,
                  color: '#f59e0b'
                },
                {
                  name: 'Productores Gulupa',
                  value: stats?.productoresGulupa || 0,
                  color: '#10b981'
                }
              ]}
              valueFormatter={(value) => `${value} productores`}
            />
          </div>
        </div>
      </div>

      {monthlyData.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Producción Mensual</h2>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tendencia de Producción</h2>
            <div className="h-96">
              <LineChart
                data={monthlyData}
                xAxisKey="mes"
                lines={[
                  { key: 'kilosUchuva', name: 'Uchuva', color: '#f59e0b' },
                  { key: 'kilosGulupa', name: 'Gulupa', color: '#10b981' }
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}