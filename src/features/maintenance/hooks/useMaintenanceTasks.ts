
import { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTasks, deleteTask, markTaskCompleted } from '@/services/maintenanceTaskService';

interface UseMaintenanceTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  handleDeleteTask: (id: string) => Promise<void>;
  handleMarkCompleted: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export const useMaintenanceTasks = (): UseMaintenanceTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks on hook initialization
  useEffect(() => {
    refreshTasks();
  }, []);

  // Refresh tasks from the database
  const refreshTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.asset?.name && task.asset.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.assembly?.name && task.assembly.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Delete task
  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  // Mark task as completed
  const handleMarkCompleted = async (id: string) => {
    const updatedTask = await markTaskCompleted(id);
    if (updatedTask) {
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    }
  };

  return {
    tasks,
    filteredTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    isLoading,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    handleDeleteTask,
    handleMarkCompleted,
    refreshTasks
  };
};
