export interface DashboardStats {
  // Estadísticas de productores
  totalProductores: number;
  productoresActivos: number;
  productoresInactivos: number;
  
  // Estadísticas por producto
  productoresUchuva: number;
  productoresGulupa: number;
  
  // Estadísticas de certificaciones
  productoresFairtrade: number;
  productoresGlobalGap: number;
  productoresIca: number;
  productoresSinCertificacion: number;
  productoresConCertificacion: number;
  
  // Estadísticas de fincas y cultivos
  totalFincas: number;
  totalCultivos: number;
  cultivosUchuva: number;
  cultivosGulupa: number;
  
  // Estadísticas del mes actual
  despachosMes: number;
  kilosUchuvaMes: number;
  kilosGulupaMes: number;

  // Distribución por municipio
  produccionesPorMunicipio: ProduccionPorMunicipio[];
}

export interface ProduccionPorMunicipio {
  municipio: string;
  cantidad: number;
}

export interface MonthlyStats {
  mes: string;
  kilosUchuva: number;
  kilosGulupa: number;
}