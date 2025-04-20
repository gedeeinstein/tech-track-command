
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/features/assemblies/types";
import { toast } from "@/components/ui/use-toast";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";

// Helper function to convert snake_case database object to camelCase Asset
const dbToAsset = (dbAsset: any): Asset => {
  return {
    id: dbAsset.id,
    inventoryNumber: dbAsset.inventory_number,
    name: dbAsset.name,
    type: dbAsset.type,
    status: dbAsset.status,
    location: dbAsset.location || "",
    assignedTo: dbAsset.assigned_to || "",
    purchaseDate: dbAsset.purchase_date ? dbAsset.purchase_date : "",
    warranty: dbAsset.warranty ? dbAsset.warranty : "",
    operatingSystem: dbAsset.operating_system,
    user: dbAsset.user_account,
    processor: dbAsset.processor,
    motherboard: dbAsset.motherboard,
    ram: dbAsset.ram,
    storage: dbAsset.storage,
    monitor: dbAsset.monitor,
    peripherals: dbAsset.peripherals || [],
    expansionCards: dbAsset.expansion_cards || [],
    accessories: dbAsset.accessories || [],
    division: dbAsset.division,
    windowsLicense: dbAsset.windows_license,
    hostname: dbAsset.hostname
  };
};

// Helper function to convert camelCase Asset to snake_case database object
const assetToDB = (asset: Partial<Asset>): any => {
  const dbAsset: any = {};
  
  if (asset.id !== undefined) dbAsset.id = asset.id;
  if (asset.inventoryNumber !== undefined) dbAsset.inventory_number = asset.inventoryNumber;
  if (asset.name !== undefined) dbAsset.name = asset.name;
  if (asset.type !== undefined) dbAsset.type = asset.type;
  if (asset.status !== undefined) dbAsset.status = asset.status;
  if (asset.location !== undefined) dbAsset.location = asset.location;
  if (asset.assignedTo !== undefined) dbAsset.assigned_to = asset.assignedTo;
  if (asset.purchaseDate !== undefined) dbAsset.purchase_date = asset.purchaseDate;
  if (asset.warranty !== undefined) dbAsset.warranty = asset.warranty;
  if (asset.operatingSystem !== undefined) dbAsset.operating_system = asset.operatingSystem;
  if (asset.user !== undefined) dbAsset.user_account = asset.user;
  if (asset.processor !== undefined) dbAsset.processor = asset.processor;
  if (asset.motherboard !== undefined) dbAsset.motherboard = asset.motherboard;
  if (asset.ram !== undefined) dbAsset.ram = asset.ram;
  if (asset.storage !== undefined) dbAsset.storage = asset.storage;
  if (asset.monitor !== undefined) dbAsset.monitor = asset.monitor;
  if (asset.peripherals !== undefined) dbAsset.peripherals = asset.peripherals;
  if (asset.expansionCards !== undefined) dbAsset.expansion_cards = asset.expansionCards;
  if (asset.accessories !== undefined) dbAsset.accessories = asset.accessories;
  if (asset.division !== undefined) dbAsset.division = asset.division;
  if (asset.windowsLicense !== undefined) dbAsset.windows_license = asset.windowsLicense;
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

// Generate a unique ID for assets
const generateAssetId = (): string => {
  // Create a unique ID with 'AST' prefix
  return `AST${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

export const fetchAssets = async (): Promise<Asset[]> => {
  try {
    // Using any to bypass TypeScript's type checking
    const { data, error } = await (supabase as any)
      .from("assets")
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

export const fetchDepartmentCode = async (departmentId: string): Promise<string> => {
  try {
    console.log("Fetching department code for department ID:", departmentId);
    
    const { data, error } = await supabase
      .from("departments")
      .select("code")
      .eq("id", departmentId)
      .single();

    if (error) {
      console.error("Error fetching department code:", error);
      throw error;
    }

    console.log("Department data retrieved:", data);
    
    if (!data || !data.code) {
      console.warn("No department code found, using default GEN");
      return "GEN"; // Default fallback code
    }
    
    console.log("Using department code:", data.code);
    return data.code;
  } catch (error) {
    console.error("Error in fetchDepartmentCode:", error);
    toast({
      title: "Error fetching department code",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    return "GEN"; // Default fallback code
  }
};

export const createAsset = async (asset: Omit<Asset, "id" | "inventoryNumber">): Promise<Asset> => {
  try {
    console.log("Creating asset with division:", asset.division);
    
    // Get department code for the inventory number
    const departmentCode = await fetchDepartmentCode(asset.division);
    console.log("Retrieved department code:", departmentCode);
    
    // Generate asset code using the full year and department code
    const assetCode = await generateInventoryNumber(asset.type, departmentCode);
    console.log("Generated inventory number:", assetCode);
    
    // Generate a unique ID for the asset
    const assetId = `AST${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    const newAsset = {
      ...asset,
      id: assetId,
      inventoryNumber: assetCode
    };

    // Convert to database format
    const dbAsset = assetToDB(newAsset);

    const { data, error } = await supabase
      .from("assets")
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
      .from("assets")
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
      .from("assets")
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
