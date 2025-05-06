
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMaintenanceTasks } from "@/features/maintenance/hooks/useMaintenanceTasks";
import MaintenanceHeader from "@/features/maintenance/components/MaintenanceHeader";
import MaintenanceFilters from "@/features/maintenance/components/MaintenanceFilters";
import TaskTable from "@/features/maintenance/components/TaskTable";
import TaskFormDialog from "@/features/maintenance/components/TaskFormDialog";
import QRCodeScanner from "@/features/maintenance/components/QRCodeScanner";
import { extractAssetInfo } from "@/features/maintenance/utils/qrScannerUtils";
import { Task, ScannedAsset } from "@/features/maintenance/types";
import { createTask, updateTask } from "@/services/maintenanceTaskService";
import TaskDetails from "@/features/maintenance/components/TaskDetails";
import { useToast } from "@/hooks/use-toast";

const Maintenance: React.FC = () => {
  // Task state management with the custom hook
  const {
    tasks,
    filteredTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    handleDeleteTask,
    handleMarkCompleted,
    refreshTasks,
    isLoading
  } = useMaintenanceTasks();

  const { toast } = useToast();

  // UI State
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<ScannedAsset | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddEdit = (task: Task | null = null) => {
    setCurrentTask(task);
    setFormOpen(true);
    if (task?.scheduledDate) {
      setDate(new Date(task.scheduledDate));
    } else {
      setDate(undefined);
    }
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const handleSaveTask = async (data: any) => {
    try {
      if (currentTask?.id) {
        // Update existing task
        await updateTask({
          ...data,
          id: currentTask.id
        });
        toast({
          title: "Task updated",
          description: "The maintenance task has been successfully updated."
        });
      } else {
        // Create new task
        await createTask(data);
        toast({
          title: "Task created",
          description: "The new maintenance task has been successfully created."
        });
      }
      
      setFormOpen(false);
      setCurrentTask(null);
      refreshTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the maintenance task.",
        variant: "destructive"
      });
    }
  };

  const handleScanSuccess = (decodedData: string) => {
    try {
      const assetInfo = extractAssetInfo(decodedData);
      
      if (assetInfo) {
        setScannedAsset(assetInfo);
        
        // Create a new maintenance task with this asset pre-selected
        setCurrentTask({
          id: "",
          title: "",
          description: "",
          status: "Scheduled",
          priority: "Medium",
          assignedTo: "",
          asset: null, // Will be set in the form based on assetInfo
          assembly: null,
          scheduledDate: "",
          completedDate: null,
          recurring: "None",
          nextOccurrence: null
        });
        
        // Close scanner and open form
        setScannerOpen(false);
        setFormOpen(true);
      }
    } catch (e) {
      console.error("Error parsing QR code data:", e);
      toast({
        title: "Invalid QR Code",
        description: "Could not read asset information from the QR code.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <MaintenanceHeader 
        onNewTask={() => handleAddEdit()} 
        onScanAsset={() => setScannerOpen(true)}
        isLoading={isLoading}
      />

      <MaintenanceFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <TaskTable
        tasks={filteredTasks}
        onEdit={handleAddEdit}
        onDelete={handleDeleteTask}
        onMarkCompleted={handleMarkCompleted}
        onViewDetails={handleViewDetails}
        isLoading={isLoading}
      />

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveTask}
        currentTask={currentTask}
        scannedAsset={scannedAsset}
        date={date}
        setDate={setDate}
      />

      <TaskDetails
        task={selectedTask}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={handleAddEdit}
        onDelete={handleDeleteTask}
        onMarkCompleted={handleMarkCompleted}
        refreshTasks={refreshTasks}
      />

      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          {scannerOpen && (
            <QRCodeScanner 
              onScanSuccess={handleScanSuccess} 
              onClose={() => setScannerOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Maintenance;
