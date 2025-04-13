
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ScanLine } from "lucide-react";

interface MaintenanceHeaderProps {
  onNewTask: () => void;
  onScanAsset: () => void;
}

const MaintenanceHeader: React.FC<MaintenanceHeaderProps> = ({ 
  onNewTask, 
  onScanAsset 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground">
          Schedule and track maintenance tasks for your IT assets
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onScanAsset}
        >
          <ScanLine size={16} />
          <span>Scan Asset</span>
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={onNewTask}
        >
          <Plus size={16} />
          <span>New Task</span>
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
