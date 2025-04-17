
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Department {
  id: string;
  name: string;
  description: string | null;
}

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching departments:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch departments",
      variant: "destructive"
    });
    return [];
  }
};

export const createDepartment = async (department: Omit<Department, "id">): Promise<Department | null> => {
  try {
    const { data, error } = await supabase
      .from("departments")
      .insert(department)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Department Created",
      description: `${department.name} has been created successfully.`
    });

    return data;
  } catch (error) {
    console.error("Error creating department:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create department",
      variant: "destructive"
    });
    return null;
  }
};

export const updateDepartment = async (id: string, department: Partial<Department>): Promise<Department | null> => {
  try {
    const { data, error } = await supabase
      .from("departments")
      .update(department)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Department Updated",
      description: `${department.name || 'Department'} has been updated successfully.`
    });

    return data;
  } catch (error) {
    console.error("Error updating department:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update department",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteDepartment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast({
      title: "Department Deleted",
      description: "The department has been deleted successfully."
    });

    return true;
  } catch (error) {
    console.error("Error deleting department:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete department",
      variant: "destructive"
    });
    return false;
  }
};
