
import { supabase } from "@/integrations/supabase/client";
import { Task, Asset, Assembly } from "@/features/maintenance/types";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

/**
 * Fetch all maintenance tasks
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .select(`
        *,
        asset:asset_id (*),
        assembly:assembly_id (*)
      `);
      
    if (error) {
      throw error;
    }
    
    // Transform the data to match our Task type
    const transformedTasks: Task[] = data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assigned_to,
      asset: task.asset ? { id: task.asset.id, name: task.asset.name } : null,
      assembly: task.assembly ? { id: task.assembly.id, name: task.assembly.name } : null,
      scheduledDate: task.scheduled_date,
      completedDate: task.completed_date,
      recurring: task.recurring,
      nextOccurrence: task.next_occurrence
    }));
    
    return transformedTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast({
      title: "Error fetching tasks",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Create a new maintenance task
 */
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    // Transform the task object to match our database schema
    const taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigned_to: task.assignedTo,
      asset_id: task.asset?.id || null,
      assembly_id: task.assembly?.id || null,
      scheduled_date: task.scheduledDate,
      completed_date: task.completedDate,
      recurring: task.recurring,
      next_occurrence: task.nextOccurrence,
      id: `MT${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`
    };
    
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert([taskData])
      .select(`
        *,
        asset:asset_id (*),
        assembly:assembly_id (*)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Task created",
      description: "The maintenance task has been created successfully."
    });
    
    // Transform the data back to our Task type
    const newTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assigned_to,
      asset: data.asset ? { id: data.asset.id, name: data.asset.name } : null,
      assembly: data.assembly ? { id: data.assembly.id, name: data.assembly.name } : null,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      recurring: data.recurring,
      nextOccurrence: data.next_occurrence
    };
    
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    toast({
      title: "Error creating task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Update an existing maintenance task
 */
export const updateTask = async (task: Task): Promise<Task | null> => {
  try {
    // Transform the task object to match our database schema
    const taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigned_to: task.assignedTo,
      asset_id: task.asset?.id || null,
      assembly_id: task.assembly?.id || null,
      scheduled_date: task.scheduledDate,
      completed_date: task.completedDate,
      recurring: task.recurring,
      next_occurrence: task.nextOccurrence
    };
    
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .update(taskData)
      .eq('id', task.id)
      .select(`
        *,
        asset:asset_id (*),
        assembly:assembly_id (*)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Task updated",
      description: "The maintenance task has been updated successfully."
    });
    
    // Transform the data back to our Task type
    const updatedTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assigned_to,
      asset: data.asset ? { id: data.asset.id, name: data.asset.name } : null,
      assembly: data.assembly ? { id: data.assembly.id, name: data.assembly.name } : null,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      recurring: data.recurring,
      nextOccurrence: data.next_occurrence
    };
    
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      title: "Error updating task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Delete a maintenance task
 */
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('maintenance_tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Task deleted",
      description: "The maintenance task has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    toast({
      title: "Error deleting task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Mark a task as completed
 */
export const markTaskCompleted = async (id: string): Promise<Task | null> => {
  try {
    const today = format(new Date(), "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .update({
        status: "Completed",
        completed_date: today
      })
      .eq('id', id)
      .select(`
        *,
        asset:asset_id (*),
        assembly:assembly_id (*)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Task completed",
      description: "The maintenance task has been marked as completed."
    });
    
    // Transform the data back to our Task type
    const updatedTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assigned_to,
      asset: data.asset ? { id: data.asset.id, name: data.asset.name } : null,
      assembly: data.assembly ? { id: data.assembly.id, name: data.assembly.name } : null,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      recurring: data.recurring,
      nextOccurrence: data.next_occurrence
    };
    
    return updatedTask;
  } catch (error) {
    console.error('Error marking task as completed:', error);
    toast({
      title: "Error completing task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get all assets for dropdown selection
 */
export const getAssets = async (): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('id, name');
    
    if (error) {
      throw error;
    }
    
    return data || [];
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
 * Get all assemblies for dropdown selection
 */
export const getAssemblies = async (): Promise<Assembly[]> => {
  try {
    const { data, error } = await supabase
      .from('assemblies')
      .select('id, name');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching assemblies:', error);
    toast({
      title: "Error fetching assemblies",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};
