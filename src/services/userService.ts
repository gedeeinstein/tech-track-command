
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
}

type UserRow = Database['public']['Tables']['users']['Row'];

/**
 * Helper function to convert database row to User
 */
const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  status: row.status,
  lastLogin: row.last_login ? new Date(row.last_login).toLocaleString() : undefined
});

/**
 * Fetches all users from the database
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Transform data to match User type
    const users: User[] = data.map(mapRowToUser);
    
    return users;
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

/**
 * Creates a new user in the database
 */
export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  try {
    // Generate a new ID using a pattern similar to the mock data
    const newId = `U${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Transform the user to match database schema
    const newUser = {
      id: newId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      last_login: user.lastLogin ? new Date(user.lastLogin).toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "User created",
      description: `${user.name} has been added successfully.`
    });
    
    // Transform response to match User type
    return mapRowToUser(data);
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

/**
 * Updates an existing user in the database
 */
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    // Transform the user to match database schema
    const updateData = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      last_login: user.lastLogin ? new Date(user.lastLogin).toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "User updated",
      description: `${user.name} has been updated successfully.`
    });
    
    // Transform response to match User type
    return mapRowToUser(data);
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
