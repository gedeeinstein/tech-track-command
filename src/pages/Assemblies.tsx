
import React, { useState } from "react";
import { AssemblyGrid } from "@/features/assemblies/components/AssemblyGrid";
import { AssemblyList } from "@/features/assemblies/components/AssemblyList";
import { AssemblyHeader } from "@/features/assemblies/components/AssemblyHeader";
import { SearchAndViewControls } from "@/features/assemblies/components/SearchAndViewControls";
import { AssemblyFormDialog } from "@/features/assemblies/components/AssemblyFormDialog";
import { ComponentSelectionDialog } from "@/features/assemblies/components/ComponentSelectionDialog";
import { MOCK_ASSEMBLIES } from "@/features/assemblies/data/mock-data";
import { Assembly, ViewMode } from "@/features/assemblies/types";
import "../index.css";

const Assemblies: React.FC = () => {
  const [assemblies, setAssemblies] = useState(MOCK_ASSEMBLIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [currentAssembly, setCurrentAssembly] = useState<Assembly | null>(null);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  // Filter assemblies based on search
  const filteredAssemblies = assemblies.filter(
    (assembly) =>
      assembly.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assembly.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEdit = (assembly: Assembly | null = null) => {
    setCurrentAssembly(assembly);
    if (assembly) {
      setSelectedComponents(assembly.components.map((c) => c.id));
    } else {
      setSelectedComponents([]);
    }
    setFormOpen(true);
  };

  const handleOpenComponentDialog = () => {
    setComponentDialogOpen(true);
  };

  const handleSaveAssembly = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the assembly to your backend
    // For now, just close the dialog
    setFormOpen(false);
    setCurrentAssembly(null);
  };

  const handleDeleteAssembly = (id: string) => {
    // In a real app, you would delete from your backend
    setAssemblies(assemblies.filter((assembly) => assembly.id !== id));
  };

  const toggleComponentSelection = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(
        selectedComponents.filter((id) => id !== componentId)
      );
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };

  return (
    <div className="space-y-6">
      <AssemblyHeader onAddNew={() => handleAddEdit()} />

      <SearchAndViewControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "grid" ? (
        <AssemblyGrid
          assemblies={filteredAssemblies}
          onEdit={handleAddEdit}
          onDelete={handleDeleteAssembly}
        />
      ) : (
        <AssemblyList
          assemblies={filteredAssemblies}
          onEdit={handleAddEdit}
          onDelete={handleDeleteAssembly}
        />
      )}

      <AssemblyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        currentAssembly={currentAssembly}
        selectedComponents={selectedComponents}
        onComponentSelect={toggleComponentSelection}
        onOpenComponentDialog={handleOpenComponentDialog}
        onSave={handleSaveAssembly}
      />

      <ComponentSelectionDialog
        open={componentDialogOpen}
        onOpenChange={setComponentDialogOpen}
        selectedComponents={selectedComponents}
        onComponentSelect={toggleComponentSelection}
      />
    </div>
  );
};

export default Assemblies;
