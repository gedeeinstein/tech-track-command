
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Asset {
  id: string;
  inventory_number: string;
  name: string;
  type: string;
  status: string;
  location: string;
  assigned_to: string;
  purchase_date: string;
  warranty: string;
  operating_system?: string;
  user_account?: string;
  processor?: string;
  motherboard?: string;
  ram?: string;
  storage?: string;
  monitor?: string;
  peripherals?: string[];
  expansion_cards?: string[];
  accessories?: string[];
  division?: string;
  windows_license?: string;
  hostname?: string;
  created_at?: string;
}

/**
 * Fetches all assets from the database
 */
export const getAssets = async (): Promise<Asset[]> => {
  try {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*');
    
    if (error) throw error;
    
    return assets || [];
  } catch (error) {
    console.error('Error fetching assets:', error);
    toast({
      title: "Error fetching assets",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Creates a new asset in the database
 */
export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<Asset | null> => {
  try {
    // Generate a UUID for the new asset
    const id = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('assets')
      .insert({
        id,
        ...asset
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Asset created",
      description: `${asset.name} has been added successfully.`
    });
    
    return data;
  } catch (error) {
    console.error('Error creating asset:', error);
    toast({
      title: "Error creating asset",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Updates an existing asset in the database
 */
export const updateAsset = async (asset: Asset): Promise<Asset | null> => {
  try {
    // Remove the updated_at field since it doesn't exist in the database schema
    const { data, error } = await supabase
      .from('assets')
      .update({
        name: asset.name,
        inventory_number: asset.inventory_number,
        type: asset.type,
        status: asset.status,
        location: asset.location,
        assigned_to: asset.assigned_to,
        purchase_date: asset.purchase_date,
        warranty: asset.warranty,
        operating_system: asset.operating_system,
        user_account: asset.user_account,
        processor: asset.processor,
        motherboard: asset.motherboard,
        ram: asset.ram,
        storage: asset.storage,
        monitor: asset.monitor,
        peripherals: asset.peripherals,
        expansion_cards: asset.expansion_cards,
        accessories: asset.accessories,
        division: asset.division,
        windows_license: asset.windows_license,
        hostname: asset.hostname
      })
      .eq('id', asset.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Asset updated",
      description: `${asset.name} has been updated successfully.`
    });
    
    return data;
  } catch (error) {
    console.error('Error updating asset:', error);
    toast({
      title: "Error updating asset",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Deletes an asset from the database
 */
export const deleteAsset = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Asset deleted",
      description: "The asset has been removed successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    toast({
      title: "Error deleting asset",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return false;
  }
};