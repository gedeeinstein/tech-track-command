
import { useState, useEffect } from "react";
import { Component } from "@/features/assemblies/types";
import { getComponents, createComponent, updateComponent, deleteComponent } from "@/services/componentService";

export const useComponents = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch components on mount
  useEffect(() => {
    fetchComponents();
  }, []);

  // Filter components based on search
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (component.manufacturer?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (component.model?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Fetch all components
  const fetchComponents = async () => {
    setIsLoading(true);
    const data = await getComponents();
    setComponents(data);
    setIsLoading(false);
  };

  // Handle add/edit component
  const handleAddEdit = (component: Component | null = null) => {
    setCurrentComponent(component);
    setSelectedType(component?.type || "");
    setFormOpen(true);
  };

  // Handle save component
  const handleSaveComponent = async (values: Component) => {
    if (currentComponent) {
      // Update existing component
      const updatedComponent = await updateComponent(values);
      if (updatedComponent) {
        setComponents(prevComponents => 
          prevComponents.map(c => c.id === currentComponent.id ? updatedComponent : c)
        );
      }
    } else {
      // Add new component
      const newComponent = await createComponent(values);
      if (newComponent) {
        setComponents(prevComponents => [...prevComponents, newComponent]);
      }
    }
    setFormOpen(false);
  };

  // Handle delete component
  const handleDeleteComponent = async (id: string) => {
    const success = await deleteComponent(id);
    if (success) {
      setComponents(prevComponents => prevComponents.filter(c => c.id !== id));
    }
  };

  return {
    components: filteredComponents,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    formOpen,
    setFormOpen,
    currentComponent,
    setCurrentComponent,
    selectedType,
    setSelectedType,
    isLoading,
    handleAddEdit,
    handleSaveComponent,
    handleDeleteComponent
  };
};