
import { supabase } from "@/integrations/supabase/client";
import { Component } from "@/features/assemblies/types";
import { toast } from "@/hooks/use-toast";

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
    
    return data || [];
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
    
    const newComponent = {
      ...component,
      id: newId
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
    
    return data;
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
    const { data, error } = await supabase
      .from('components')
      .update(component)
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
    
    return data;
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
