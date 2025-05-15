
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Types for dashboard data
export interface DashboardSummary {
  totalAssets: number;
  totalAssemblies: number;
  pendingTasks: number;
  alerts: number;
  newAssetsThisMonth: number;
  underMaintenance: number;
  overdueCount: number;
  highPriorityAlerts: number;
}

export interface AssetTypeDistribution {
  name: string;
  value: number;
}

export interface MaintenanceStats {
  name: string;  // Month
  completed: number;
  scheduled: number;
}

export interface AssetAcquisition {
  name: string;  // Month
  value: number;
}

export interface RecentTask {
  name: string;
  asset: string;
  status: string;
  date: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  assetsByType: AssetTypeDistribution[];
  maintenanceByMonth: MaintenanceStats[];
  assetAcquisition: AssetAcquisition[];
  recentTasks: RecentTask[];
  isLoading: boolean;
  error: Error | null;
}

// Helper function to format date for display
const formatTaskDate = (dateStr: string): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(dateStr);
  
  // Remove time part for comparison
  const taskDateOnly = new Date(taskDate.setHours(0, 0, 0, 0));
  const todayOnly = new Date(today.setHours(0, 0, 0, 0));
  const yesterdayOnly = new Date(yesterday.setHours(0, 0, 0, 0));
  const tomorrowOnly = new Date(tomorrow.setHours(0, 0, 0, 0));
  
  if (taskDateOnly.getTime() === todayOnly.getTime()) return "Today";
  if (taskDateOnly.getTime() === yesterdayOnly.getTime()) return "Yesterday";
  if (taskDateOnly.getTime() === tomorrowOnly.getTime()) return "Tomorrow";
  
  return new Date(dateStr).toLocaleDateString();
};

// Helper function to get month names for last 6 months
const getLast6MonthNames = (): string[] => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(month.toLocaleString('default', { month: 'short' }));
  }
  return months;
};

// Helper to convert date string to month/year format
const getMonthFromDateString = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short' });
};

// Main hook to get dashboard data
export const useDashboardData = (): DashboardData => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalAssets: 0,
    totalAssemblies: 0,
    pendingTasks: 0,
    alerts: 0,
    newAssetsThisMonth: 0,
    underMaintenance: 0,
    overdueCount: 0,
    highPriorityAlerts: 0
  });
  
  const [assetsByType, setAssetsByType] = useState<AssetTypeDistribution[]>([]);
  const [maintenanceByMonth, setMaintenanceByMonth] = useState<MaintenanceStats[]>([]);
  const [assetAcquisition, setAssetAcquisition] = useState<AssetAcquisition[]>([]);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch summary statistics
        const [
          assetsResult, 
          assembliesResult, 
          tasksResult
        ] = await Promise.all([
          supabase.from('assets').select('*'),
          supabase.from('assemblies').select('*'),
          supabase.from('maintenance_tasks').select('*')
        ]);

        // Check for errors
        if (assetsResult.error) throw new Error(assetsResult.error.message);
        if (assembliesResult.error) throw new Error(assembliesResult.error.message);
        if (tasksResult.error) throw new Error(tasksResult.error.message);
        
        const assets = assetsResult.data || [];
        const assemblies = assembliesResult.data || [];
        const tasks = tasksResult.data || [];
        
        // Current month for filtering
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Calculate summary metrics
        const newAssetsThisMonth = assets.filter(asset => {
          const purchaseDate = new Date(asset.purchase_date);
          return purchaseDate.getMonth() === currentMonth && 
                 purchaseDate.getFullYear() === currentYear;
        }).length;
        
        const underMaintenance = assemblies.filter(assembly => 
          assembly.status === "Maintenance"
        ).length;
        
        const pendingTasks = tasks.filter(task => 
          task.status !== "Completed"
        ).length;
        
        const overdueCount = tasks.filter(task => {
          const scheduledDate = new Date(task.scheduled_date);
          return scheduledDate < now && task.status !== "Completed";
        }).length;
        
        const highPriorityAlerts = tasks.filter(task => 
          task.priority === "High" && task.status !== "Completed"
        ).length;
        
        setSummary({
          totalAssets: assets.length,
          totalAssemblies: assemblies.length,
          pendingTasks,
          alerts: overdueCount + highPriorityAlerts,
          newAssetsThisMonth,
          underMaintenance,
          overdueCount,
          highPriorityAlerts
        });
        
        // Calculate asset type distribution
        const assetTypes: Record<string, number> = {};
        assets.forEach(asset => {
          assetTypes[asset.type] = (assetTypes[asset.type] || 0) + 1;
        });
        
        const assetTypeDistribution = Object.entries(assetTypes)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
          
        if (assetTypeDistribution.length > 0) {
          setAssetsByType(assetTypeDistribution);
        }
        
        // Get recent tasks
        const recentTasksData = tasks
          .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())
          .slice(0, 4)
          .map(task => {
            // Find related asset name
            const assetName = task.asset_id ? 
              assets.find(a => a.id === task.asset_id)?.name || "Unknown Asset" :
              "N/A";
              
            return {
              name: task.title,
              asset: assetName,
              status: task.status,
              date: formatTaskDate(task.scheduled_date)
            };
          });
          
        if (recentTasksData.length > 0) {
          setRecentTasks(recentTasksData);
        }
        
        // Process maintenance data by month
        const last6Months = getLast6MonthNames();
        
        // Initialize maintenance data structure with 0 values for each month
        const maintenanceData: Record<string, { completed: number, scheduled: number }> = {};
        last6Months.forEach(month => {
          maintenanceData[month] = { completed: 0, scheduled: 0 };
        });
        
        // Count tasks by month
        tasks.forEach(task => {
          const taskMonth = getMonthFromDateString(task.scheduled_date);
          if (last6Months.includes(taskMonth)) {
            // Count all tasks as scheduled
            maintenanceData[taskMonth].scheduled++;
            
            // Count completed tasks
            if (task.status === "Completed") {
              maintenanceData[taskMonth].completed++;
            }
          }
        });
        
        // Convert to array format for chart
        const maintenanceStats = Object.entries(maintenanceData).map(([name, data]) => ({
          name,
          completed: data.completed,
          scheduled: data.scheduled
        }));
        
        setMaintenanceByMonth(maintenanceStats);
        
        // Process asset acquisition data by month
        const acquisitionData: Record<string, number> = {};
        last6Months.forEach(month => {
          acquisitionData[month] = 0;
        });
        
        // Count assets by purchase month
        assets.forEach(asset => {
          const purchaseMonth = getMonthFromDateString(asset.purchase_date);
          if (last6Months.includes(purchaseMonth)) {
            acquisitionData[purchaseMonth]++;
          }
        });
        
        // Convert to array format for chart
        const acquisitionStats = Object.entries(acquisitionData).map(([name, value]) => ({
          name,
          value
        }));
        
        setAssetAcquisition(acquisitionStats);
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err);
        toast({
          title: "Error loading dashboard data",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    summary,
    assetsByType,
    maintenanceByMonth,
    assetAcquisition,
    recentTasks,
    isLoading,
    error
  };
};
