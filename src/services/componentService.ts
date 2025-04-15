
import { supabase } from "@/integrations/supabase/client";
import { Component } from "@/features/assemblies/types";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

type ComponentRow = Database['public']['Tables']['components']['Row'];

/**
 * Helper function to convert database row to Component
 */
const mapRowToComponent = (row: ComponentRow): Component => ({
  id: row.id,
  name: row.name,
  type: row.type,
  subtype: row.subtype || undefined,
  serialNumber: row.serial_number || undefined,
  manufacturer: row.manufacturer || undefined,
  model: row.model || undefined,
  specifications: row.specifications ? convertJsonToRecordString(row.specifications) : undefined
});

/**
 * Helper function to convert JSON to Record<string, string>
 */
const convertJsonToRecordString = (json: Json): Record<string, string> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    const result: Record<string, string> = {};
    Object.entries(json).forEach(([key, value]) => {
      result[key] = String(value);
    });
    return result;
  }
  return {};
};

/**
 * Helper function to convert specifications to JSON
 */
const convertSpecificationsToJson = (specifications?: Record<string, string>): Json => {
  if (!specifications) return null;
  return specifications as unknown as Json;
};

/**
 * Fetches all components from the database
 */
export const getComponents = async (): Promise<Component[]> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Transform data to match Component type
    const components: Component[] = data.map(mapRowToComponent);
    
    return components;
  } catch (error) {
    console.error('Error fetching components:', error);
    toast({
      title: "Error fetching components",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Creates a new component in the database
 */
export const createComponent = async (component: Omit<Component, 'id'>): Promise<Component | null> => {
  try {
    // Generate a new ID using a pattern similar to the mock data
    const newId = `CMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Transform the component to match database schema
    const newComponent = {
      id: newId,
      name: component.name,
      type: component.type,
      subtype: component.subtype || null,
      serial_number: component.serialNumber || null,
      manufacturer: component.manufacturer || null,
      model: component.model || null,
      specifications: convertSpecificationsToJson(component.specifications)
    };
    
    const { data, error } = await supabase
      .from('components')
      .insert([newComponent])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Component created",
      description: `${component.name} has been added successfully.`
    });
    
    // Transform response to match Component type
    return mapRowToComponent(data);
  } catch (error) {
    console.error('Error creating component:', error);
    toast({
      title: "Error creating component",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Updates an existing component in the database
 */
export const updateComponent = async (component: Component): Promise<Component | null> => {
  try {
    // Transform the component to match database schema
    const updateData = {
      name: component.name,
      type: component.type,
      subtype: component.subtype || null,
      serial_number: component.serialNumber || null,
      manufacturer: component.manufacturer || null,
      model: component.model || null,
      specifications: convertSpecificationsToJson(component.specifications)
    };
    
    const { data, error } = await supabase
      .from('components')
      .update(updateData)
      .eq('id', component.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Component updated",
      description: `${component.name} has been updated successfully.`
    });
    
    // Transform response to match Component type
    return mapRowToComponent(data);
  } catch (error) {
    console.error('Error updating component:', error);
    toast({
      title: "Error updating component",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Deletes a component from the database
 */
export const deleteComponent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Component deleted",
      description: "The component has been removed successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting component:', error);
    toast({
      title: "Error deleting component",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return false;
  }
};
