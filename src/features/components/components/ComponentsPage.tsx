
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Component } from "@/features/assemblies/types";
import { toast } from "@/components/ui/use-toast";
import ComponentForm from "../components/ComponentForm";
import ComponentList from "../components/ComponentList";
import { useDialog } from "@/hooks/useDialog";
import { MOCK_COMPONENTS } from "@/features/assets/data/mockData";

const ComponentsPage: React.FC = () => {
  const [components, setComponents] = useState<Component[]>(MOCK_COMPONENTS);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [isFormOpen, setIsFormOpen] = useDialog(false);

  const handleAddEdit = (component: Component | null = null) => {
    setCurrentComponent(component);
    setIsFormOpen(true);
  };

  const handleComponentSubmit = (data: Component) => {
    if (currentComponent) {
      // Edit existing component
      setComponents(components.map(comp => 
        comp.id === currentComponent.id ? { ...data, id: currentComponent.id } : comp
      ));
      toast({
        title: "Component Updated",
        description: `${data.name} has been successfully updated.`
      });
    } else {
      // Add new component
      const newComponent = {
        ...data,
        id: `CMP${String(components.length + 1).padStart(3, '0')}`
      };
      setComponents([...components, newComponent]);
      toast({
        title: "Component Added",
        description: `${data.name} has been successfully added.`
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
    toast({
      title: "Component Deleted",
      description: "The component has been removed from inventory."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Manage individual hardware components in your inventory
          </p>
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={() => handleAddEdit()}
        >
          <Plus size={16} />
          <span>Add Component</span>
        </Button>
      </div>

      <ComponentList 
        components={components} 
        onEdit={handleAddEdit}
        onDelete={handleDeleteComponent}
        isLoading={false}
      />

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) document.body.style.removeProperty('pointer-events');
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <ComponentForm 
            onSubmit={handleComponentSubmit} 
            currentComponent={currentComponent} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentsPage;
