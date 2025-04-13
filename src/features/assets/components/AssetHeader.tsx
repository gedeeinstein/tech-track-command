
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus, Upload } from "lucide-react";

interface AssetHeaderProps {
  handleAddEdit: () => void;
}

const AssetHeader: React.FC<AssetHeaderProps> = ({ handleAddEdit }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
        <p className="text-muted-foreground">
          Manage your hardware and software assets
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Download size={16} />
          <span>Export</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Upload size={16} />
          <span>Import</span>
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={handleAddEdit}
        >
          <Plus size={16} />
          <span>Add Asset</span>
        </Button>
      </div>
    </div>
  );
};

export default AssetHeader;
