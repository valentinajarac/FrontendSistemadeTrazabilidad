import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { format, parse, getMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { MonthlyData } from '../types';

interface ExportOptions {
  title: string;
  subtitle?: string;
  fileName: string;
  producer?: string;
}

// Función auxiliar para ordenar los meses
const sortByMonth = (data: MonthlyData[]): MonthlyData[] => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.mes);
    const dateB = new Date(b.mes);
    const monthA = getMonth(dateA);
    const monthB = getMonth(dateB);
    const yearA = dateA.getFullYear();
    const yearB = dateB.getFullYear();

    // Primero ordenar por año descendente
    if (yearA !== yearB) {
      return yearB - yearA;
    }
    // Luego ordenar por mes (enero a diciembre)
    return monthA - monthB;
  });
};

// Función auxiliar para formatear números
const formatNumber = (num: number): string => {
  return num.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const exportToExcel = (data: MonthlyData[], options: ExportOptions) => {
  const sortedData = sortByMonth(data);
  
  // Preparar los datos para Excel
  const excelData = sortedData.map(item => ({
    'Mes': format(new Date(item.mes), 'MMMM yyyy', { locale: es }),
    'Kilos Uchuva': formatNumber(item.kilosUchuva),
    'Kilos Gulupa': formatNumber(item.kilosGulupa),
    'Total Kilos': formatNumber(item.kilosUchuva + item.kilosGulupa)
  }));

  // Crear libro y hoja
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([], { header: [] });

  // Agregar título y metadatos
  const headerRows = [];
  headerRows.push([options.title]);
  if (options.subtitle) headerRows.push([options.subtitle]);
  if (options.producer) headerRows.push([`Productor: ${options.producer}`]);
  headerRows.push([]); // Línea en blanco antes de los datos

  XLSX.utils.sheet_add_aoa(ws, headerRows);

  // Agregar datos
  XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A' + (headerRows.length + 1) });

  // Ajustar anchos de columna
  const columnWidths = [
    { wch: 20 }, // Mes
    { wch: 15 }, // Kilos Uchuva
    { wch: 15 }, // Kilos Gulupa
    { wch: 15 }  // Total Kilos
  ];
  ws['!cols'] = columnWidths;

  // Agregar totales
  const totalRow = excelData.length + headerRows.length + 1;
  const totalUchuva = data.reduce((sum, item) => sum + item.kilosUchuva, 0);
  const totalGulupa = data.reduce((sum, item) => sum + item.kilosGulupa, 0);
  
  XLSX.utils.sheet_add_aoa(ws, [
    ['Total:', formatNumber(totalUchuva), formatNumber(totalGulupa), formatNumber(totalUchuva + totalGulupa)]
  ], { origin: `A${totalRow}` });

  // Agregar estilos
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!ws[cell_ref]) continue;
      
      ws[cell_ref].s = {
        font: { name: 'Arial' },
        alignment: { vertical: 'center', horizontal: 'left' }
      };

      // Estilos para encabezados
      if (R < headerRows.length) {
        ws[cell_ref].s.font.bold = true;
        ws[cell_ref].s.font.sz = R === 0 ? 14 : 12;
      }

      // Estilos para la fila de totales
      if (R === totalRow - 1) {
        ws[cell_ref].s.font.bold = true;
      }
    }
  }

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  
  // Guardar archivo
  XLSX.writeFile(wb, `${options.fileName}.xlsx`);
};

export const exportToPDF = (data: MonthlyData[], options: ExportOptions) => {
  const sortedData = sortByMonth(data);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Configurar fuente y estilos
  doc.setFont('helvetica');
  
  // Título
  doc.setFontSize(16);
  doc.text(options.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Subtítulo
  if (options.subtitle) {
    doc.setFontSize(12);
    doc.text(options.subtitle, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  }

  // Productor
  if (options.producer) {
    doc.setFontSize(12);
    doc.text(`Productor: ${options.producer}`, 20, yPos);
    yPos += 10;
  }

  // Fecha de generación
  doc.setFontSize(10);
  doc.text(
    `Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
    20,
    yPos
  );
  yPos += 15;

  // Encabezados de tabla
  const headers = ['Mes', 'Kilos Uchuva', 'Kilos Gulupa', 'Total'];
  const columnWidths = [60, 40, 40, 40];
  const startX = 20;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  headers.forEach((header, i) => {
    let x = startX;
    for (let j = 0; j < i; j++) x += columnWidths[j];
    doc.text(header, x, yPos);
  });
  yPos += 5;

  // Línea separadora
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Datos
  doc.setFontSize(10);
  let totalUchuva = 0;
  let totalGulupa = 0;

  sortedData.forEach(item => {
    const mes = format(new Date(item.mes), 'MMMM yyyy', { locale: es });
    let x = startX;
    
    doc.text(mes, x, yPos);
    x += columnWidths[0];
    
    doc.text(formatNumber(item.kilosUchuva), x, yPos);
    x += columnWidths[1];
    
    doc.text(formatNumber(item.kilosGulupa), x, yPos);
    x += columnWidths[2];
    
    doc.text(formatNumber(item.kilosUchuva + item.kilosGulupa), x, yPos);
    
    yPos += 8;
    totalUchuva += item.kilosUchuva;
    totalGulupa += item.kilosGulupa;

    // Nueva página si es necesario
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Línea separadora para totales
  yPos += 2;
  doc.line(20, yPos, 190, yPos);
  yPos += 8;

  // Totales
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  let x = startX;
  doc.text('Total:', x, yPos);
  x += columnWidths[0];
  doc.text(formatNumber(totalUchuva), x, yPos);
  x += columnWidths[1];
  doc.text(formatNumber(totalGulupa), x, yPos);
  x += columnWidths[2];
  doc.text(formatNumber(totalUchuva + totalGulupa), x, yPos);

  // Guardar archivo
  doc.save(`${options.fileName}.pdf`);
};