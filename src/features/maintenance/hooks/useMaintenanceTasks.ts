
import { useState } from 'react';
import { MOCK_TASKS } from '../data/mockData';
import { format } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  asset: { id: string; name: string } | null;
  assembly: { id: string; name: string } | null;
  scheduledDate: string;
  completedDate: string | null;
  recurring: string;
  nextOccurrence: string | null;
}

interface UseMaintenanceTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  handleDeleteTask: (id: string) => void;
  handleMarkCompleted: (id: string) => void;
}

export const useMaintenanceTasks = (): UseMaintenanceTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

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

  const handleDeleteTask = (id: string) => {
    // In a real app, you would delete from your backend
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleMarkCompleted = (id: string) => {
    // In a real app, you would update on your backend
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: "Completed", completedDate: format(new Date(), "yyyy-MM-dd") } 
        : task
    ));
  };

  return {
    tasks,
    filteredTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    handleDeleteTask,
    handleMarkCompleted
  };
};
