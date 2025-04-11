
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AssemblyHeaderProps {
  onAddNew: () => void;
}

export const AssemblyHeader: React.FC<AssemblyHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assemblies</h1>
        <p className="text-muted-foreground">
          Manage groups of components organized into functional units
        </p>
      </div>
      <Button size="sm" className="flex items-center gap-1" onClick={onAddNew}>
        <Plus size={16} />
        <span>Create Assembly</span>
      </Button>
    </div>
  );
};
