
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/features/maintenance/types";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches all maintenance tasks from the database
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
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
    const tasks = data.map(item => ({
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
    })) as Task[];
    
    return tasks;
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
      asset_id: task.asset?.id,
      assembly_id: task.assembly?.id,
      scheduled_date: task.scheduledDate,
      completed_date: task.completedDate,
      recurring: task.recurring,
      next_occurrence: task.nextOccurrence
    };
    
    const { data, error } = await supabase
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
    
    toast({
      title: "Task created",
      description: `${task.title} has been added successfully.`
    });
    
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
    toast({
      title: "Error creating task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
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
      asset_id: task.asset?.id,
      assembly_id: task.assembly?.id,
      scheduled_date: task.scheduledDate,
      completed_date: task.completedDate,
      recurring: task.recurring,
      next_occurrence: task.nextOccurrence
    };
    
    const { data, error } = await supabase
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
    
    toast({
      title: "Task updated",
      description: `${task.title} has been updated successfully.`
    });
    
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
    toast({
      title: "Error updating task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Marks a task as completed in the database
 */
export const markTaskCompleted = async (id: string): Promise<Task | null> => {
  try {
    const completedDate = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
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
    
    toast({
      title: "Task completed",
      description: "The task has been marked as completed."
    });
    
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
    toast({
      title: "Error updating task",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Deletes a task from the database
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
      description: "The task has been removed successfully."
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
