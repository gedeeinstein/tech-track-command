
import React, { useState } from "react";
import { AssemblyHeader } from "@/features/assemblies/components/AssemblyHeader";
import { AssemblyList } from "@/features/assemblies/components/AssemblyList";
import { AssemblyGrid } from "@/features/assemblies/components/AssemblyGrid";
import { AssemblyFormDialog } from "@/features/assemblies/components/AssemblyFormDialog";
import { ComponentSelectionDialog } from "@/features/assemblies/components/ComponentSelectionDialog";
import { Assembly, ViewMode } from "@/features/assemblies/types";
import { MOCK_ASSEMBLIES } from "@/features/assemblies/data/mock-data";
import { SearchAndViewControls } from "@/features/assemblies/components/SearchAndViewControls";
import { toast } from "@/components/ui/use-toast";
import { useDialog } from "@/hooks/useDialog";

const Assemblies = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>(MOCK_ASSEMBLIES);
  const [currentAssembly, setCurrentAssembly] = useState<Assembly | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const [isFormOpen, setIsFormOpen] = useDialog(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useDialog(false);

  const handleOpenAssemblyForm = (assembly: Assembly | null = null) => {
    setCurrentAssembly(assembly);
    setSelectedComponents(assembly ? assembly.components.map(c => c.id) : []);
    setIsFormOpen(true);
  };

  const handleComponentSelection = (componentId: string) => {
    setSelectedComponents(prevSelected => 
      prevSelected.includes(componentId)
        ? prevSelected.filter(id => id !== componentId)
        : [...prevSelected, componentId]
    );
  };

  const handleSaveAssembly = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Get form data
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement).value as Assembly["status"];
    const location = (form.elements.namedItem("location") as HTMLInputElement).value;
    const lastMaintenance = (form.elements.namedItem("lastMaintenance") as HTMLInputElement).value;
    const nextMaintenance = (form.elements.namedItem("nextMaintenance") as HTMLInputElement).value;
    
    // Find selected components from available components
    const components = selectedComponents.map(id => {
      const component = MOCK_ASSEMBLIES.flatMap(a => a.components).find(c => c.id === id) || 
                      { id, name: `Component ${id}`, type: "Unknown" };
      return component;
    });
    
    if (currentAssembly) {
      // Update existing assembly
      const updatedAssembly = {
        ...currentAssembly,
        name,
        description,
        status,
        location,
        components,
        lastMaintenance,
        nextMaintenance
      };
      
      setAssemblies(assemblies.map(assembly => 
        assembly.id === currentAssembly.id ? updatedAssembly : assembly
      ));
      
      toast({
        title: "Assembly Updated",
        description: `${name} has been successfully updated.`
      });
    } else {
      // Create new assembly
      const newAssembly: Assembly = {
        id: `ASM${String(assemblies.length + 1).padStart(3, '0')}`,
        name,
        description,
        status,
        location,
        components,
        lastMaintenance,
        nextMaintenance
      };
      
      setAssemblies([...assemblies, newAssembly]);
      toast({
        title: "Assembly Created",
        description: `${name} has been successfully created.`
      });
    }
    
    setIsFormOpen(false);
  };

  const handleDeleteAssembly = (id: string) => {
    setAssemblies(assemblies.filter(assembly => assembly.id !== id));
    toast({
      title: "Assembly Deleted",
      description: "The assembly has been removed from inventory."
    });
  };

  // Filter assemblies based on search query
  const filteredAssemblies = assemblies.filter(assembly => 
    assembly.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assembly.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assembly.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AssemblyHeader onAddNew={() => handleOpenAssemblyForm()} />
      
      <SearchAndViewControls 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      {viewMode === "grid" ? (
        <AssemblyGrid 
          assemblies={filteredAssemblies} 
          onEdit={handleOpenAssemblyForm} 
          onDelete={handleDeleteAssembly} 
        />
      ) : (
        <AssemblyList 
          assemblies={filteredAssemblies} 
          onEdit={handleOpenAssemblyForm} 
          onDelete={handleDeleteAssembly} 
        />
      )}
      
      <AssemblyFormDialog 
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) document.body.style.removeProperty('pointer-events');
        }}
        currentAssembly={currentAssembly}
        selectedComponents={selectedComponents}
        onComponentSelect={handleComponentSelection}
        onOpenComponentDialog={() => setIsComponentDialogOpen(true)}
        onSave={handleSaveAssembly}
      />
      
      <ComponentSelectionDialog 
        open={isComponentDialogOpen}
        onOpenChange={(open) => {
          setIsComponentDialogOpen(open);
          if (!open) document.body.style.removeProperty('pointer-events');
        }}
        selectedComponents={selectedComponents}
        onComponentSelect={handleComponentSelection}
      />
    </div>
  );
};

export default Assemblies;
