
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// Add the necessary type definition for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Type for export data preparation functions return value
export interface ExportDataResult {
  headers: string[];
  rows: any[][];
}

/**
 * Exports data to PDF format
 */
export const exportToPDF = (
  title: string,
  headers: string[],
  data: any[][],
  filename: string
) => {
  const doc = new jsPDF();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated: ${today}`, 14, 30);
  
  // Create table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 35,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Save PDF
  doc.save(`${filename}-${today}.pdf`);
};

/**
 * Exports data to CSV format
 */
export const exportToCSV = (
  headers: string[],
  data: any[][],
  filename: string
) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n');
  
  // Create blob and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}-${today}.csv`);
};

/**
 * Prepare data for asset status distribution report exports
 */
export const prepareAssetStatusData = (data: { name: string; value: number }[]): ExportDataResult => {
  const headers = ['Status', 'Count'];
  const rows = data.map(item => [item.name, item.value.toString()]);
  return { headers, rows };
};

/**
 * Prepare data for asset type distribution report exports
 */
export const prepareAssetTypeData = (data: { name: string; value: number }[]): ExportDataResult => {
  const headers = ['Type', 'Count'];
  const rows = data.map(item => [item.name, item.value.toString()]);
  return { headers, rows };
};

/**
 * Prepare data for maintenance completion report exports
 */
export const prepareMaintenanceData = (data: { month: string; completed: number; scheduled: number }[]): ExportDataResult => {
  const headers = ['Month', 'Scheduled Tasks', 'Completed Tasks'];
  const rows = data.map(item => [item.month, item.scheduled.toString(), item.completed.toString()]);
  return { headers, rows };
};

/**
 * Prepare data for assembly component report exports
 */
export const prepareAssemblyComponentData = (data: { name: string; components: number }[]): ExportDataResult => {
  const headers = ['Assembly', 'Component Count'];
  const rows = data.map(item => [item.name, item.components.toString()]);
  return { headers, rows };
};

/**
 * Prepare data for warranty expiration report exports
 */
export const prepareWarrantyData = (data: any[]): ExportDataResult => {
  const headers = ['ID', 'Name', 'Type', 'Purchase Date', 'Warranty Until', 'Status'];
  const rows = data.map(item => [
    item.id,
    item.name,
    item.type,
    item.purchaseDate,
    item.warrantyUntil,
    item.status
  ]);
  return { headers, rows };
};

/**
 * Prepare data for inventory list report exports
 */
export const prepareInventoryData = (data: any[]): ExportDataResult => {
  const headers = ['ID', 'Name', 'Type', 'Status', 'Location', 'Assigned To'];
  const rows = data.map(item => [
    item.id,
    item.name,
    item.type,
    item.status,
    item.location,
    item.assignedTo
  ]);
  return { headers, rows };
};
