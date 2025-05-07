
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, QrCode, RefreshCw } from "lucide-react";
import { Loader2 } from "lucide-react";

interface MaintenanceHeaderProps {
  onNewTask: () => void;
  onScanAsset: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const MaintenanceHeader: React.FC<MaintenanceHeaderProps> = ({ 
  onNewTask, 
  onScanAsset, 
  onRefresh,
  isLoading = false 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground">
          Manage maintenance tasks for assets and assemblies
        </p>
      </div>
      <div className="flex space-x-2 w-full sm:w-auto">
        <Button onClick={onScanAsset} size="sm" variant="outline" className="flex-1 sm:flex-none">
          <QrCode className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
        <Button onClick={onRefresh} size="sm" variant="outline" className="flex-1 sm:flex-none" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
        <Button onClick={onNewTask} size="sm" className="flex-1 sm:flex-none">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
