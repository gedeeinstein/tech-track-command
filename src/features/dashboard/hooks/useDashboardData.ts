
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

// Mock data as fallback
const mockAssetsByTypeData = [
  { name: "Laptops", value: 42 },
  { name: "Desktops", value: 28 },
  { name: "Servers", value: 15 },
  { name: "Networking", value: 22 },
  { name: "Other", value: 13 }
];

const mockMaintenanceByMonthData = [
  { name: "Jan", completed: 12, scheduled: 15 },
  { name: "Feb", completed: 19, scheduled: 20 },
  { name: "Mar", completed: 15, scheduled: 18 },
  { name: "Apr", completed: 20, scheduled: 20 },
  { name: "May", completed: 18, scheduled: 22 },
  { name: "Jun", completed: 14, scheduled: 16 }
];

const mockAssetAcquisitionData = [
  { name: "Jan", value: 5 },
  { name: "Feb", value: 8 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 12 },
  { name: "May", value: 7 },
  { name: "Jun", value: 10 }
];

const mockRecentTasks = [
  { 
    name: "Server Backup Verification", 
    asset: "Database Server", 
    status: "Completed", 
    date: "Today" 
  },
  { 
    name: "Network Switch Firmware Update", 
    asset: "Core Switch", 
    status: "In Progress", 
    date: "Today" 
  },
  { 
    name: "Workstation Security Scan", 
    asset: "Finance Dept Laptops", 
    status: "Scheduled", 
    date: "Tomorrow" 
  },
  { 
    name: "UPS Battery Replacement", 
    asset: "Server Room UPS", 
    status: "Overdue", 
    date: "Yesterday" 
  }
];

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
  
  const [assetsByType, setAssetsByType] = useState<AssetTypeDistribution[]>(mockAssetsByTypeData);
  const [maintenanceByMonth, setMaintenanceByMonth] = useState<MaintenanceStats[]>(mockMaintenanceByMonthData);
  const [assetAcquisition, setAssetAcquisition] = useState<AssetAcquisition[]>(mockAssetAcquisitionData);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>(mockRecentTasks);
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
        
        // For maintenance stats and asset acquisition, we'll leave mock data for now
        // as they require more complex date calculations
        
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
