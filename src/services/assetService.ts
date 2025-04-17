
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/features/assemblies/types";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";

// Helper function to convert snake_case database object to camelCase Asset
const dbToAsset = (dbAsset: any): Asset => {
  return {
    id: dbAsset.id,
    inventoryNumber: dbAsset.inventory_number,
    name: dbAsset.name,
    type: dbAsset.type,
    status: dbAsset.status,
    location: dbAsset.location,
    assignedTo: dbAsset.assigned_to,
    purchaseDate: dbAsset.purchase_date,
    warranty: dbAsset.warranty,
    operatingSystem: dbAsset.operating_system,
    user: dbAsset.user_account,
    processor: dbAsset.processor,
    motherboard: dbAsset.motherboard,
    ram: dbAsset.ram,
    storage: dbAsset.storage,
    monitor: dbAsset.monitor,
    peripherals: dbAsset.peripherals,
    expansionCards: dbAsset.expansion_cards,
    accessories: dbAsset.accessories,
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

export const fetchAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from("assets")
    .select("*");

  if (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }

  // Convert each database asset object to our Asset type
  return (data || []).map(dbToAsset);
};

export const createAsset = async (asset: Omit<Asset, "id" | "inventoryNumber">): Promise<Asset> => {
  // Generate a unique ID
  const id = `A${Date.now().toString().slice(-6)}`;
  
  // Generate inventory number
  const type = asset.type || "Other";
  const inventoryNumber = generateInventoryNumber(type, Date.now() % 1000);
  
  const newAsset = {
    ...asset,
    id,
    inventoryNumber
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

  return dbToAsset(data);
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
  // Convert to database format
  const dbAsset = assetToDB(asset);

  const { data, error } = await supabase
    .from("assets")
    .update(dbAsset)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating asset:", error);
    throw error;
  }

  return dbToAsset(data);
};

export const deleteAsset = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("assets")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};
