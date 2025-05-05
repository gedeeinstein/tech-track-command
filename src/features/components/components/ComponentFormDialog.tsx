
import React from "react";
import { DialogHeader, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";
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
  // When dialog closes, restore pointer-events to body
  React.useEffect(() => {
    return () => {
      document.body.style.removeProperty('pointer-events');
    };
  }, []);
  
  // When open state changes, ensure pointer-events are restored when closing
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.removeProperty('pointer-events');
      }, 100);
    }
  }, [open]);

  return (
    <DialogContent className="sm:max-w-[600px]" onCloseAutoFocus={() => {
      document.body.style.removeProperty('pointer-events');
    }}>
      <DialogHeader>
        <DialogTitle>{currentComponent ? "Edit Component" : "Add New Component"}</DialogTitle>
        <DialogDescription>
          {currentComponent 
            ? "Update the details of the selected component." 
            : "Enter the details of the new component to add it to inventory."}
        </DialogDescription>
      </DialogHeader>
      <ComponentForm 
        onSubmit={onSubmit} 
        currentComponent={currentComponent} 
      />
    </DialogContent>
  );
};

export default ComponentFormDialog;
