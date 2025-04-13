
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMaintenanceTasks } from "@/features/maintenance/hooks/useMaintenanceTasks";
import MaintenanceHeader from "@/features/maintenance/components/MaintenanceHeader";
import MaintenanceFilters from "@/features/maintenance/components/MaintenanceFilters";
import TaskTable from "@/features/maintenance/components/TaskTable";
import TaskFormDialog from "@/features/maintenance/components/TaskFormDialog";
import QRCodeScanner from "@/features/maintenance/components/QRCodeScanner";
import { extractAssetInfo } from "@/features/maintenance/utils/qrScannerUtils";
import { USERS, ASSETS, ASSEMBLIES } from "@/features/maintenance/data/mockData";
import { ScannedAsset } from "@/features/maintenance/types";

const Maintenance: React.FC = () => {
  // Task state management with the custom hook
  const {
    filteredTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    handleDeleteTask,
    handleMarkCompleted
  } = useMaintenanceTasks();

  // UI State
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<ScannedAsset | null>(null);

  const handleAddEdit = (task: any = null) => {
    setCurrentTask(task);
    setFormOpen(true);
    if (task?.scheduledDate) {
      setDate(new Date(task.scheduledDate));
    } else {
      setDate(undefined);
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the task to your backend
    setFormOpen(false);
    setCurrentTask(null);
  };

  const handleScanSuccess = (decodedData: string) => {
    try {
      const assetInfo = extractAssetInfo(decodedData);
      
      if (assetInfo) {
        setScannedAsset(assetInfo);
        
        // Find the asset in our mock data
        const asset = ASSETS.find(a => a.id === assetInfo.assetId);
        
        // Create a new maintenance task with this asset pre-selected
        setCurrentTask({
          asset: asset ? { id: asset.id, name: asset.name } : null
        });
        
        // Close scanner and open form
        setScannerOpen(false);
        setFormOpen(true);
      }
    } catch (e) {
      console.error("Error parsing QR code data:", e);
    }
  };

  return (
    <div className="space-y-6">
      <MaintenanceHeader 
        onNewTask={() => handleAddEdit()} 
        onScanAsset={() => setScannerOpen(true)} 
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
      />

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveTask}
        currentTask={currentTask}
        scannedAsset={scannedAsset}
        date={date}
        setDate={setDate}
        users={USERS}
        assets={ASSETS}
        assemblies={ASSEMBLIES}
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
