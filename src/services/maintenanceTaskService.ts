
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/features/maintenance/types";
import { useToast } from "@/hooks/use-toast";

/**
 * Fetches all maintenance tasks from the database
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    // TypeScript doesn't know about our new tables yet
    // We need to use 'any' to bypass TypeScript's type checking temporarily
    const { data, error } = await (supabase as any)
      .from('maintenance_tasks')
      .select(`
        *,
        asset:asset_id (id, name),
        assembly:assembly_id (id, name)
      `);
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Task type
    const tasks: Task[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      assignedTo: item.assigned_to,
      asset: item.asset,
      assembly: item.assembly,
      scheduledDate: item.scheduled_date,
      completedDate: item.completed_date,
      recurring: item.recurring,
      nextOccurrence: item.next_occurrence
    }));
    
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

/**
 * Creates a new maintenance task in the database
 */
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    // Generate a new ID using a pattern similar to the mock data
    const newId = `MT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Transform the data to match the database schema
    const newTask = {
      id: newId,
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
    
    // Use 'any' to bypass TypeScript's type checking temporarily
    const { data, error } = await (supabase as any)
      .from('maintenance_tasks')
      .insert([newTask])
      .select(`
        *,
        asset:asset_id (id, name),
        assembly:assembly_id (id, name)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Task type
    const createdTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assigned_to,
      asset: data.asset,
      assembly: data.assembly,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      recurring: data.recurring,
      nextOccurrence: data.next_occurrence
    };
    
    return createdTask;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

/**
 * Updates an existing maintenance task in the database
 */
export const updateTask = async (task: Task): Promise<Task | null> => {
  try {
    // Transform the data to match the database schema
    const updateData = {
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
    
    // Use 'any' to bypass TypeScript's type checking temporarily
    const { data, error } = await (supabase as any)
      .from('maintenance_tasks')
      .update(updateData)
      .eq('id', task.id)
      .select(`
        *,
        asset:asset_id (id, name),
        assembly:assembly_id (id, name)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Task type
    const updatedTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assigned_to,
      asset: data.asset,
      assembly: data.assembly,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      recurring: data.recurring,
      nextOccurrence: data.next_occurrence
    };
    
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

/**
 * Marks a task as completed in the database
 */
export const markTaskCompleted = async (id: string): Promise<Task | null> => {
  try {
    const completedDate = new Date().toISOString().split('T')[0];
    
    // Use 'any' to bypass TypeScript's type checking temporarily
    const { data, error } = await (supabase as any)
      .from('maintenance_tasks')
      .update({
        status: 'Completed',
        completed_date: completedDate
      })
      .eq('id', id)
      .select(`
        *,
        asset:asset_id (id, name),
        assembly:assembly_id (id, name)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Task type
    const updatedTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assigned_to,
      asset: data.asset,
      assembly: data.assembly,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      recurring: data.recurring,
      nextOccurrence: data.next_occurrence
    };
    
    return updatedTask;
  } catch (error) {
    console.error('Error marking task as completed:', error);
    return null;
  }
};

/**
 * Deletes a task from the database
 */
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    // Use 'any' to bypass TypeScript's type checking temporarily
    const { error } = await (supabase as any)
      .from('maintenance_tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};
