
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, QrCode, RefreshCw } from "lucide-react";

interface MaintenanceHeaderProps {
  onNewTask: () => void;
  onScanAsset: () => void;
  isLoading: boolean;
}

const MaintenanceHeader: React.FC<MaintenanceHeaderProps> = ({ 
  onNewTask, 
  onScanAsset,
  isLoading 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Maintenance Tasks</h1>
        <p className="text-muted-foreground">
          Manage maintenance schedules and tasks for assets and assemblies
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onNewTask} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </Button>
        <Button 
          onClick={onScanAsset} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          <span>Scan Asset</span>
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
