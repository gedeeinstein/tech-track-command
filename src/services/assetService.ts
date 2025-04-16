
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/features/assemblies/types";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";

export const fetchAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from("assets")
    .select("*");

  if (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }

  return data || [];
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

  const { data, error } = await supabase
    .from("assets")
    .insert(newAsset)
    .select()
    .single();

  if (error) {
    console.error("Error creating asset:", error);
    throw error;
  }

  return data;
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
  const { data, error } = await supabase
    .from("assets")
    .update(asset)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating asset:", error);
    throw error;
  }

  return data;
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
