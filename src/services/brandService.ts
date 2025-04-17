
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Brand {
  id: string;
  name: string;
  description: string | null;
}

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    // Using any to bypass TypeScript's type checking since the brands table is new
    const { data, error } = await (supabase as any)
      .from("brands")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch brands",
      variant: "destructive"
    });
    return [];
  }
};

export const createBrand = async (brand: Omit<Brand, "id">): Promise<Brand | null> => {
  try {
    // Using any to bypass TypeScript's type checking
    const { data, error } = await (supabase as any)
      .from("brands")
      .insert(brand)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Brand Created",
      description: `${brand.name} has been created successfully.`
    });

    return data;
  } catch (error) {
    console.error("Error creating brand:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create brand",
      variant: "destructive"
    });
    return null;
  }
};

export const updateBrand = async (id: string, brand: Partial<Brand>): Promise<Brand | null> => {
  try {
    // Using any to bypass TypeScript's type checking
    const { data, error } = await (supabase as any)
      .from("brands")
      .update(brand)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Brand Updated",
      description: `${brand.name || 'Brand'} has been updated successfully.`
    });

    return data;
  } catch (error) {
    console.error("Error updating brand:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update brand",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteBrand = async (id: string): Promise<boolean> => {
  try {
    // Using any to bypass TypeScript's type checking
    const { error } = await (supabase as any)
      .from("brands")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast({
      title: "Brand Deleted",
      description: "The brand has been deleted successfully."
    });

    return true;
  } catch (error) {
    console.error("Error deleting brand:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete brand",
      variant: "destructive"
    });
    return false;
  }
};
