
import { useState, useEffect, useCallback } from 'react';
import { 
  getAssetStatusDistribution,
  getAssetTypeDistribution,
  getMaintenanceCompletionData,
  getAssemblyComponentData,
  getWarrantyExpirationData,
  getInventoryListData,
  AssetStatusData,
  AssetTypeData,
  MaintenanceCompletionData,
  AssemblyComponentData,
  WarrantyExpirationData,
  InventoryItemData
} from '@/services/reportService';
import { addDays, format } from 'date-fns';

export const useReportData = (activeReport: string, timeRange: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for different report types
  const [assetStatusData, setAssetStatusData] = useState<AssetStatusData[]>([]);
  const [assetTypeData, setAssetTypeData] = useState<AssetTypeData[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceCompletionData[]>([]);
  const [assemblyData, setAssemblyData] = useState<AssemblyComponentData[]>([]);
  const [warrantyData, setWarrantyData] = useState<WarrantyExpirationData[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryItemData[]>([]);

  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch (activeReport) {
        case 'asset-status':
          const statusData = await getAssetStatusDistribution();
          setAssetStatusData(statusData);
          break;
        
        case 'asset-type':
          const typeData = await getAssetTypeDistribution();
          setAssetTypeData(typeData);
          break;
          
        case 'maintenance':
          const maintenanceData = await getMaintenanceCompletionData(timeRange);
          setMaintenanceData(maintenanceData);
          break;
          
        case 'assemblies':
          const assemblyData = await getAssemblyComponentData();
          setAssemblyData(assemblyData);
          break;
          
        case 'warranty':
          const warrantyData = await getWarrantyExpirationData();
          setWarrantyData(warrantyData);
          break;
          
        case 'inventory':
          const inventoryData = await getInventoryListData();
          setInventoryData(inventoryData);
          break;
          
        default:
          setError('Invalid report type selected');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  }, [activeReport, timeRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return {
    isLoading,
    error,
    assetStatusData,
    assetTypeData,
    maintenanceData,
    assemblyData,
    warrantyData,
    inventoryData,
    refreshData: fetchReportData
  };
};
