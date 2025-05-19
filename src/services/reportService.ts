
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, parseISO, addDays } from "date-fns"; // Added addDays import

// Types for report data
export interface AssetStatusData {
  name: string;
  value: number;
}

export interface AssetTypeData {
  name: string;
  value: number;
}

export interface MaintenanceCompletionData {
  month: string;
  completed: number;
  scheduled: number;
}

export interface AssemblyComponentData {
  name: string;
  components: number;
}

export interface WarrantyExpirationData {
  id: string;
  name: string;
  type: string;
  purchaseDate: string;
  warrantyUntil: string;
  status: string;
}

export interface InventoryItemData {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  assignedTo: string;
}

// Get asset status distribution
export const getAssetStatusDistribution = async (): Promise<AssetStatusData[]> => {
  try {
    // Need to use count aggregation instead of group
    const { data, error } = await supabase
      .from('assets')
      .select('status, count')
      .select('status');
      
    if (error) {
      console.error('Error fetching asset status distribution:', error);
      throw error;
    }
    
    // Process the data to get counts by status
    const statusCounts: Record<string, number> = {};
    data.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Error in getAssetStatusDistribution:', error);
    return [];
  }
};

// Get asset type distribution
export const getAssetTypeDistribution = async (): Promise<AssetTypeData[]> => {
  try {
    // Need to use count aggregation instead of group
    const { data, error } = await supabase
      .from('assets')
      .select('type');
      
    if (error) {
      console.error('Error fetching asset type distribution:', error);
      throw error;
    }
    
    // Process the data to get counts by type
    const typeCounts: Record<string, number> = {};
    data.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Error in getAssetTypeDistribution:', error);
    return [];
  }
};

// Get maintenance completion data
export const getMaintenanceCompletionData = async (timeRange: string = "Last 6 Months"): Promise<MaintenanceCompletionData[]> => {
  try {
    // Determine date range based on timeRange
    const today = new Date();
    let startDate;
    
    if (timeRange === "Last 30 Days") {
      startDate = subDays(today, 30);
    } else if (timeRange === "Last Quarter") {
      startDate = subDays(today, 90);
    } else if (timeRange === "Last 6 Months") {
      startDate = subDays(today, 180);
    } else if (timeRange === "Year to Date") {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else {
      // All Time - get all data
      startDate = new Date(2000, 0, 1);
    }
    
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    
    // Get scheduled tasks
    const { data: scheduledData, error: scheduledError } = await supabase
      .from('maintenance_tasks')
      .select('scheduled_date')
      .gte('scheduled_date', formattedStartDate);
    
    if (scheduledError) {
      console.error('Error fetching scheduled tasks:', scheduledError);
      throw scheduledError;
    }
    
    // Get completed tasks
    const { data: completedData, error: completedError } = await supabase
      .from('maintenance_tasks')
      .select('completed_date')
      .not('completed_date', 'is', null)
      .gte('completed_date', formattedStartDate);
    
    if (completedError) {
      console.error('Error fetching completed tasks:', completedError);
      throw completedError;
    }
    
    // Create a map of months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthData: Record<string, MaintenanceCompletionData> = {};
    
    // Initialize month data
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Determine how many months to show based on the timeRange
    let monthsToShow = 12; // Default
    if (timeRange === "Last 30 Days") {
      monthsToShow = 1;
    } else if (timeRange === "Last Quarter") {
      monthsToShow = 3;
    } else if (timeRange === "Last 6 Months") {
      monthsToShow = 6;
    }
    
    for (let i = 0; i < monthsToShow; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      
      const monthKey = `${year}-${month + 1}`;
      const monthName = months[month];
      monthData[monthKey] = {
        month: monthName,
        scheduled: 0,
        completed: 0
      };
    }
    
    // Count scheduled tasks by month
    scheduledData.forEach(task => {
      try {
        const date = parseISO(task.scheduled_date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (monthData[monthKey]) {
          monthData[monthKey].scheduled += 1;
        }
      } catch (e) {
        console.warn('Invalid date format in scheduled task:', task.scheduled_date);
      }
    });
    
    // Count completed tasks by month
    completedData.forEach(task => {
      try {
        const date = parseISO(task.completed_date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (monthData[monthKey]) {
          monthData[monthKey].completed += 1;
        }
      } catch (e) {
        console.warn('Invalid date format in completed task:', task.completed_date);
      }
    });
    
    // Convert to array and reverse to get chronological order
    return Object.values(monthData).reverse();
  } catch (error) {
    console.error('Error in getMaintenanceCompletionData:', error);
    return [];
  }
};

// Get assembly component data
export const getAssemblyComponentData = async (): Promise<AssemblyComponentData[]> => {
  try {
    const { data: assemblies, error: assembliesError } = await supabase
      .from('assemblies')
      .select('id, name');
      
    if (assembliesError) {
      console.error('Error fetching assemblies:', assembliesError);
      throw assembliesError;
    }
    
    // For each assembly, count the number of assets
    const result: AssemblyComponentData[] = [];
    
    for (const assembly of assemblies) {
      const { data: assetCount, error: countError } = await supabase
        .from('assembly_assets')
        .select('asset_id', { count: 'exact', head: true })
        .eq('assembly_id', assembly.id);
        
      if (countError) {
        console.error(`Error fetching asset count for assembly ${assembly.id}:`, countError);
        continue;
      }
      
      result.push({
        name: assembly.name,
        components: assetCount?.length || 0
      });
    }
    
    // Sort by component count (descending)
    return result.sort((a, b) => b.components - a.components).slice(0, 5); // Top 5
  } catch (error) {
    console.error('Error in getAssemblyComponentData:', error);
    return [];
  }
};

// Get warranty expiration data
export const getWarrantyExpirationData = async (): Promise<WarrantyExpirationData[]> => {
  try {
    const today = new Date();
    const in180days = format(addDays(today, 180), 'yyyy-MM-dd');
    
    // Get assets with warranty expiring in the next 180 days
    const { data, error } = await supabase
      .from('assets')
      .select('id, inventory_number, name, type, purchase_date, warranty')
      .lte('warranty', in180days)
      .order('warranty');
      
    if (error) {
      console.error('Error fetching warranty data:', error);
      throw error;
    }
    
    return data.map(asset => {
      let status = 'Valid';
      
      // Check if warranty has expired
      if (new Date(asset.warranty) < today) {
        status = 'Expired';
      } 
      // Check if warranty expires in the next 90 days
      else if (new Date(asset.warranty) < addDays(today, 90)) {
        status = 'Expiring Soon';
      }
      
      return {
        id: asset.id,
        name: asset.name,
        type: asset.type,
        purchaseDate: asset.purchase_date,
        warrantyUntil: asset.warranty,
        status
      };
    });
  } catch (error) {
    console.error('Error in getWarrantyExpirationData:', error);
    return [];
  }
};

// Get inventory list data
export const getInventoryListData = async (): Promise<InventoryItemData[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('id, name, type, status, location, assigned_to')
      .order('name');
      
    if (error) {
      console.error('Error fetching inventory data:', error);
      throw error;
    }
    
    return data.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      status: asset.status,
      location: asset.location,
      assignedTo: asset.assigned_to
    }));
  } catch (error) {
    console.error('Error in getInventoryListData:', error);
    return [];
  }
};
