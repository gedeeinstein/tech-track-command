
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Department } from "./departmentService";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
  department?: Department | null;  // Add optional department
  departmentId?: string | null;   // Add departmentId for form handling
}

type UserRow = Database['public']['Tables']['users']['Row'] & {
  departments: {
    name: string;
    code: string;
    description: string | null;
  } | null;
};

const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  status: row.status,
  lastLogin: row.last_login ? new Date(row.last_login).toLocaleString() : undefined,
  department: row.departments ? {
    id: row.department_id || '',
    name: row.departments.name,
    code: row.departments.code,
    description: row.departments.description
  } : null,
  departmentId: row.department_id
});

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        departments!inner(name, code, description)
      `);
    
    if (error) {
      throw error;
    }
    
    return (data as UserRow[]).map(mapRowToUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    toast({
      title: "Error fetching users",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  try {
    const newId = `U${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const newUser = {
      id: newId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      last_login: user.lastLogin ? new Date(user.lastLogin).toISOString() : null,
      department_id: user.departmentId
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select(`
        *,
        departments(name, code, description)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "User created",
      description: `${user.name} has been added successfully.`
    });
    
    return mapRowToUser(data as UserRow);
  } catch (error) {
    console.error('Error creating user:', error);
    toast({
      title: "Error creating user",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Update other methods (updateUser, deleteUser) similarly to include department handling
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    const updateData = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      last_login: user.lastLogin ? new Date(user.lastLogin).toISOString() : null,
      department_id: user.departmentId
    };
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select(`
        *,
        departments(name, code, description)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "User updated",
      description: `${user.name} has been updated successfully.`
    });
    
    return mapRowToUser(data as UserRow);
  } catch (error) {
    console.error('Error updating user:', error);
    toast({
      title: "Error updating user",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Deletes a user from the database
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "User deleted",
      description: "The user has been removed successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    toast({
      title: "Error deleting user",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return false;
  }
};
