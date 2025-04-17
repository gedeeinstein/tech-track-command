
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Component } from "@/features/assemblies/types";
import { Json } from "@/integrations/supabase/types";

// Helper function to convert database component to Component
const dbToComponent = (dbComponent: any): Component => {
  return {
    id: dbComponent.id,
    name: dbComponent.name,
    // Fix: Use type directly instead of type_id
    type: dbComponent.type || "",
    subtype: dbComponent.subtype,
    serialNumber: dbComponent.serial_number,
    manufacturer: dbComponent.manufacturer,
    model: dbComponent.model,
    specifications: dbComponent.specifications ? convertJsonbToRecord(dbComponent.specifications) : undefined
  };
};

// Helper function to convert Component to database format
const componentToDB = (component: Partial<Component>): any => {
  const dbComponent: any = {};
  
  if (component.id !== undefined) dbComponent.id = component.id;
  if (component.name !== undefined) dbComponent.name = component.name;
  if (component.type !== undefined) dbComponent.type = component.type;
  if (component.subtype !== undefined) dbComponent.subtype = component.subtype;
  if (component.serialNumber !== undefined) dbComponent.serial_number = component.serialNumber;
  if (component.manufacturer !== undefined) dbComponent.manufacturer = component.manufacturer;
  if (component.model !== undefined) dbComponent.model = component.model;
  if (component.specifications !== undefined) dbComponent.specifications = component.specifications as unknown as Json;
  
  return dbComponent;
};

// Helper function to convert JSONB to Record<string, string>
const convertJsonbToRecord = (jsonb: any): Record<string, string> => {
  if (!jsonb) return {};
  
  const result: Record<string, string> = {};
  for (const key in jsonb) {
    if (Object.prototype.hasOwnProperty.call(jsonb, key)) {
      result[key] = String(jsonb[key]);
    }
  }
  return result;
};

export const fetchComponents = async (): Promise<Component[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from("components")
      .select("*");

    if (error) {
      throw error;
    }

    console.log("Raw component data from API:", data);

    const components = (data || []).map(dbToComponent);
    console.log("Mapped components:", components);
    
    return components;
  } catch (error) {
    console.error("Error fetching components:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch components",
      variant: "destructive"
    });
    return [];
  }
};

export const fetchComponentsByType = async (typeId: string): Promise<Component[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from("components")
      .select("*")
      .eq("type_id", typeId);

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => {
      const component = dbToComponent(item);
      // We'll resolve type and brand names separately if needed
      return component;
    });
  } catch (error) {
    console.error("Error fetching components by type:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch components",
      variant: "destructive"
    });
    return [];
  }
};

export const createComponent = async (component: Omit<Component, "id">): Promise<Component | null> => {
  try {
    const dbComponent = componentToDB(component);
    
    const { data, error } = await (supabase as any)
      .from("components")
      .insert(dbComponent)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Component Created",
      description: `${component.name} has been created successfully.`
    });

    const newComponent = dbToComponent(data);
    return newComponent;
  } catch (error) {
    console.error("Error creating component:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create component",
      variant: "destructive"
    });
    return null;
  }
};

export const updateComponent = async (id: string, component: Partial<Component>): Promise<Component | null> => {
  try {
    const dbComponent = componentToDB(component);
    
    const { data, error } = await (supabase as any)
      .from("components")
      .update(dbComponent)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Component Updated",
      description: `${component.name || 'Component'} has been updated successfully.`
    });

    const updatedComponent = dbToComponent(data);
    return updatedComponent;
  } catch (error) {
    console.error("Error updating component:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update component",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteComponent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from("components")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast({
      title: "Component Deleted",
      description: "The component has been deleted successfully."
    });

    return true;
  } catch (error) {
    console.error("Error deleting component:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete component",
      variant: "destructive"
    });
    return false;
  }
};
