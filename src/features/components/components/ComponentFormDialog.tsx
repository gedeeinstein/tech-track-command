
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Component } from "@/features/assemblies/types";
import ComponentForm from "./ComponentForm";

interface ComponentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Component) => void;
  currentComponent: Component | null;
}

const ComponentFormDialog: React.FC<ComponentFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  currentComponent
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <ComponentForm 
          onSubmit={onSubmit} 
          currentComponent={currentComponent} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ComponentFormDialog;
