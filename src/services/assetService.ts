
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/features/assemblies/types";
import { toast } from "@/components/ui/use-toast";

// Helper function to convert snake_case database object to camelCase Asset
const dbToAsset = (dbAsset: any): Asset => {
  return {
    id: dbAsset.id,
    inventoryNumber: dbAsset.asset_code,
    name: dbAsset.name,
    type: dbAsset.type,
    status: dbAsset.status,
    location: dbAsset.location || "",
    assignedTo: dbAsset.used_by || "",
    purchaseDate: dbAsset.purchase_date ? new Date(dbAsset.purchase_date).toISOString().split('T')[0] : "",
    warranty: dbAsset.warranty ? new Date(dbAsset.warranty).toISOString().split('T')[0] : "",
    operatingSystem: dbAsset.os,
    user: dbAsset.user_account,
    processor: dbAsset.processor_id,
    motherboard: dbAsset.motherboard_id,
    ram: dbAsset.ram_id,
    storage: dbAsset.storage_id,
    monitor: dbAsset.monitor_id,
    peripherals: dbAsset.peripherals || [],
    expansionCards: [],
    accessories: [],
    division: dbAsset.department_id,
    windowsLicense: dbAsset.license,
    hostname: dbAsset.hostname
  };
};

// Helper function to convert camelCase Asset to snake_case database object
const assetToDB = (asset: Partial<Asset>): any => {
  const dbAsset: any = {};
  
  if (asset.id !== undefined) dbAsset.id = asset.id;
  if (asset.inventoryNumber !== undefined) dbAsset.asset_code = asset.inventoryNumber;
  if (asset.name !== undefined) dbAsset.name = asset.name;
  if (asset.type !== undefined) dbAsset.type = asset.type;
  if (asset.status !== undefined) dbAsset.status = asset.status;
  if (asset.location !== undefined) dbAsset.location = asset.location;
  if (asset.assignedTo !== undefined) dbAsset.used_by = asset.assignedTo;
  if (asset.purchaseDate !== undefined) dbAsset.purchase_date = asset.purchaseDate;
  if (asset.warranty !== undefined) dbAsset.warranty = asset.warranty;
  if (asset.operatingSystem !== undefined) dbAsset.os = asset.operatingSystem;
  if (asset.user !== undefined) dbAsset.user_account = asset.user;
  if (asset.processor !== undefined) dbAsset.processor_id = asset.processor;
  if (asset.motherboard !== undefined) dbAsset.motherboard_id = asset.motherboard;
  if (asset.ram !== undefined) dbAsset.ram_id = asset.ram;
  if (asset.storage !== undefined) dbAsset.storage_id = asset.storage;
  if (asset.monitor !== undefined) dbAsset.monitor_id = asset.monitor;
  if (asset.peripherals !== undefined) dbAsset.peripherals = asset.peripherals;
  if (asset.division !== undefined) dbAsset.department_id = asset.division;
  if (asset.windowsLicense !== undefined) dbAsset.license = asset.windowsLicense;
  if (asset.hostname !== undefined) dbAsset.hostname = asset.hostname;
  
  return dbAsset;
};

// Generate an asset code in the format IT-FA/KPTM/{Type}/{Roman Month}/{Year}/{Dept}/{Auto}
const generateAssetCode = (type: string, departmentId: string | undefined): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  
  // Convert month to Roman numerals (simplified)
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const romanMonth = romanMonths[now.getMonth()];
  
  // Get first 2 characters of type or "OT" for Other
  const typePrefix = type.length > 2 ? type.substring(0, 2).toUpperCase() : "OT";
  
  // Department code (using last 3 characters of UUID or "GEN" if not available)
  const deptCode = departmentId ? departmentId.slice(-3).toUpperCase() : "GEN";
  
  // Auto-increment number (using timestamp for uniqueness)
  const autoNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `IT-FA/KPTM/${typePrefix}/${romanMonth}/${year}/${deptCode}/${autoNumber}`;
};

export const fetchAssets = async (): Promise<Asset[]> => {
  try {
    // Using any to bypass TypeScript's type checking
    const { data, error } = await (supabase as any)
      .from("assets_new")
      .select("*");

    if (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }

    // Convert each database asset object to our Asset type
    return (data || []).map(dbToAsset);
  } catch (error) {
    console.error("Error in fetchAssets:", error);
    toast({
      title: "Error fetching assets",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const createAsset = async (asset: Omit<Asset, "id" | "inventoryNumber">): Promise<Asset> => {
  try {
    // Generate asset code
    const assetCode = generateAssetCode(asset.type, asset.division);
    
    const newAsset = {
      ...asset,
      inventoryNumber: assetCode
    };

    // Convert to database format
    const dbAsset = assetToDB(newAsset);

    // Using any to bypass TypeScript's type checking
    const { data, error } = await (supabase as any)
      .from("assets_new")
      .insert(dbAsset)
      .select()
      .single();

    if (error) {
      console.error("Error creating asset:", error);
      throw error;
    }

    toast({
      title: "Asset created",
      description: `${newAsset.name} has been added to inventory.`
    });

    return dbToAsset(data);
  } catch (error) {
    console.error("Error in createAsset:", error);
    toast({
      title: "Error creating asset",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
  try {
    // Convert to database format
    const dbAsset = assetToDB(asset);

    // Using any to bypass TypeScript's type checking
    const { data, error } = await (supabase as any)
      .from("assets_new")
      .update(dbAsset)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating asset:", error);
      throw error;
    }

    toast({
      title: "Asset updated",
      description: `${asset.name || 'Asset'} has been updated.`
    });

    return dbToAsset(data);
  } catch (error) {
    console.error("Error in updateAsset:", error);
    toast({
      title: "Error updating asset",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

export const deleteAsset = async (id: string): Promise<void> => {
  try {
    // Using any to bypass TypeScript's type checking
    const { error } = await (supabase as any)
      .from("assets_new")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting asset:", error);
      throw error;
    }

    toast({
      title: "Asset deleted",
      description: "The asset has been removed from inventory."
    });
  } catch (error) {
    console.error("Error in deleteAsset:", error);
    toast({
      title: "Error deleting asset",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};
