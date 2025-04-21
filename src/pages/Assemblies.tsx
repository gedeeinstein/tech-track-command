
import React, { useState } from "react";
import { AssemblyHeader } from "@/features/assemblies/components/AssemblyHeader";
import { AssemblyList } from "@/features/assemblies/components/AssemblyList";
import { AssemblyGrid } from "@/features/assemblies/components/AssemblyGrid";
import { AssemblyFormDialog } from "@/features/assemblies/components/AssemblyFormDialog";
import { ComponentSelectionDialog } from "@/features/assemblies/components/ComponentSelectionDialog";
import { SearchAndViewControls } from "@/features/assemblies/components/SearchAndViewControls";
import { ViewMode, Assembly } from "@/features/assemblies/types";
import { useDialog } from "@/hooks/useDialog";
import { AssemblyDetailsDialog } from "@/features/assemblies/components/AssemblyDetailsDialog";
import { useAssemblies } from "@/features/assemblies/hooks/useAssemblies";
import { toast } from "@/hooks/use-toast";

/**
 * Assemblies Page
 * This main page is focused and delegates its logic/UI to hooks/components.
 */
const Assemblies = () => {
  const {
    assemblies,
    assets,
    getComponentObjects,
    create,
    update,
    remove,
    loading
  } = useAssemblies();

  const [currentAssembly, setCurrentAssembly] = useState<Assembly | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [detailsAssembly, setDetailsAssembly] = useState<Assembly | null>(null);

  const [isFormOpen, setIsFormOpen] = useDialog(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useDialog(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useDialog(false);

  const handleOpenAssemblyForm = (assembly: Assembly | null = null) => {
    setCurrentAssembly(assembly);
    setSelectedComponents(assembly ? assembly.components.map(c => c.id) : []);
    setIsFormOpen(true);
  };

  const handleViewAssemblyDetails = (assembly: Assembly) => {
    setDetailsAssembly(assembly);
    setIsDetailsDialogOpen(true);
  };

  const handleComponentSelection = (componentId: string) => {
    setSelectedComponents(prevSelected =>
      prevSelected.includes(componentId)
        ? prevSelected.filter(id => id !== componentId)
        : [...prevSelected, componentId]
    );
  };

  // Save handler for form dialog
  const handleSaveAssembly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
      const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
      const status = (form.elements.namedItem("status") as HTMLSelectElement).value as Assembly["status"];
      const location = (form.elements.namedItem("location") as HTMLInputElement).value;
      const lastMaintenance = (form.elements.namedItem("lastMaintenance") as HTMLInputElement).value;
      const nextMaintenance = (form.elements.namedItem("nextMaintenance") as HTMLInputElement).value;

      if (!name || !description || !location) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const base = { name, description, status, location, lastMaintenance, nextMaintenance };
      
      console.log("Form data:", base, "Selected components:", selectedComponents);

      if (currentAssembly) {
        const updated = await update(currentAssembly.id, base, selectedComponents);
        if (updated) {
          setIsFormOpen(false);
          toast({
            title: "Assembly updated",
            description: `${name} has been updated successfully.`
          });
        }
      } else {
        const created = await create(base, selectedComponents);
        if (created) {
          setIsFormOpen(false);
          toast({
            title: "Assembly created",
            description: `${name} has been created successfully.`
          });
        }
      }
    } catch (error) {
      console.error("Error saving assembly:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving the assembly",
        variant: "destructive"
      });
    }
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

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : viewMode === "grid" ? (
        <AssemblyGrid
          assemblies={filteredAssemblies}
          onEdit={handleOpenAssemblyForm}
          onDelete={remove}
          onViewDetails={handleViewAssemblyDetails}
        />
      ) : (
        <AssemblyList
          assemblies={filteredAssemblies}
          onEdit={handleOpenAssemblyForm}
          onDelete={remove}
          onViewDetails={handleViewAssemblyDetails}
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
        assets={assets}
      />

      <ComponentSelectionDialog
        open={isComponentDialogOpen}
        onOpenChange={(open) => {
          setIsComponentDialogOpen(open);
          if (!open) document.body.style.removeProperty('pointer-events');
        }}
        selectedComponents={selectedComponents}
        onComponentSelect={handleComponentSelection}
        assets={assets}
      />

      <AssemblyDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        assembly={detailsAssembly}
        onEdit={handleOpenAssemblyForm}
      />
    </div>
  );
};

export default Assemblies;
