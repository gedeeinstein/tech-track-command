
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface ComponentType {
  id: string;
  name: string;
  description: string | null;
}

export const fetchComponentTypes = async (): Promise<ComponentType[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from("component_types")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching component types:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch component types",
      variant: "destructive"
    });
    return [];
  }
};

export const createComponentType = async (componentType: Omit<ComponentType, "id">): Promise<ComponentType | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from("component_types")
      .insert(componentType)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Component Type Created",
      description: `${componentType.name} has been created successfully.`
    });

    return data;
  } catch (error) {
    console.error("Error creating component type:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create component type",
      variant: "destructive"
    });
    return null;
  }
};

export const updateComponentType = async (id: string, componentType: Partial<ComponentType>): Promise<ComponentType | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from("component_types")
      .update(componentType)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Component Type Updated",
      description: `${componentType.name || 'Component type'} has been updated successfully.`
    });

    return data;
  } catch (error) {
    console.error("Error updating component type:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update component type",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteComponentType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from("component_types")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast({
      title: "Component Type Deleted",
      description: "The component type has been deleted successfully."
    });

    return true;
  } catch (error) {
    console.error("Error deleting component type:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete component type",
      variant: "destructive"
    });
    return false;
  }
};
