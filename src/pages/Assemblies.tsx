
import React, { useState, useEffect } from "react";
import { AssemblyHeader } from "@/features/assemblies/components/AssemblyHeader";
import { AssemblyList } from "@/features/assemblies/components/AssemblyList";
import { AssemblyGrid } from "@/features/assemblies/components/AssemblyGrid";
import { AssemblyFormDialog } from "@/features/assemblies/components/AssemblyFormDialog";
import { ComponentSelectionDialog } from "@/features/assemblies/components/ComponentSelectionDialog";
import { Assembly, ViewMode } from "@/features/assemblies/types";
import { SearchAndViewControls } from "@/features/assemblies/components/SearchAndViewControls";
import { toast } from "@/components/ui/use-toast";
import { useDialog } from "@/hooks/useDialog";
import {
  fetchAssemblies,
  createAssembly,
  updateAssembly,
  deleteAssembly,
} from "@/services/assemblyService";

// To get asset names/types for the components field in dialog, a fetchAssets util is needed
import { fetchAssets } from "@/services/assetService";
import { Asset } from "@/features/assemblies/types";

const Assemblies = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [currentAssembly, setCurrentAssembly] = useState<Assembly | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [isFormOpen, setIsFormOpen] = useDialog(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useDialog(false);

  const [assets, setAssets] = useState<Asset[]>([]);

  // Fetch data from database on mount
  useEffect(() => {
    fetchAssemblies().then(setAssemblies);
    fetchAssets().then(setAssets);
  }, []);

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

  // Map assetId to Asset information for selectedComponents
  function getComponentObjects(ids: string[]): any[] {
    return ids.map(id => {
      const asset = assets.find(a => a.id === id);
      return { id, name: asset ? asset.name : `Component ${id}`, type: asset ? asset.type : "Unknown" };
    });
  }

  const handleSaveAssembly = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    // get form values
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement).value as Assembly["status"];
    const location = (form.elements.namedItem("location") as HTMLInputElement).value;
    const lastMaintenance = (form.elements.namedItem("lastMaintenance") as HTMLInputElement).value;
    const nextMaintenance = (form.elements.namedItem("nextMaintenance") as HTMLInputElement).value;

    if (currentAssembly) {
      // Update existing
      const updated = await updateAssembly(currentAssembly.id, {
        name,
        description,
        status,
        location,
        lastMaintenance,
        nextMaintenance,
        components: selectedComponents,
      });
      if (updated) {
        setAssemblies(prev =>
          prev.map(a => a.id === currentAssembly.id ? {
            ...updated,
            components: getComponentObjects(selectedComponents),
          } : a)
        );
        setIsFormOpen(false);
      }
    } else {
      // Create new
      const created = await createAssembly({
        name,
        description,
        status,
        location,
        lastMaintenance,
        nextMaintenance,
        components: selectedComponents,
      });
      if (created) {
        setAssemblies(prev => [
          ...prev,
          { ...created, components: getComponentObjects(selectedComponents) }
        ]);
        setIsFormOpen(false);
      }
    }
  };

  const handleDeleteAssembly = async (id: string) => {
    const ok = await deleteAssembly(id);
    if (ok) {
      setAssemblies(prev => prev.filter(asm => asm.id !== id));
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
        currentAssembly={
          currentAssembly
            ? { ...currentAssembly, components: getComponentObjects(selectedComponents) }
            : null
        }
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
