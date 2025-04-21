
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";

const Assemblies = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [currentAssembly, setCurrentAssembly] = useState<Assembly | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [detailsAssembly, setDetailsAssembly] = useState<Assembly | null>(null);

  const [isFormOpen, setIsFormOpen] = useDialog(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useDialog(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useDialog(false);
  
  const [assets, setAssets] = useState<Asset[]>([]);

  // Fetch data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const assembliesData = await fetchAssemblies();
        setAssemblies(assembliesData);
        
        const assetsData = await fetchAssets();
        setAssets(assetsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, []);

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

    try {
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
    } catch (error) {
      console.error("Error saving assembly:", error);
      toast({
        title: "Error saving assembly",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAssembly = async (id: string) => {
    try {
      const ok = await deleteAssembly(id);
      if (ok) {
        setAssemblies(prev => prev.filter(asm => asm.id !== id));
      }
    } catch (error) {
      console.error("Error deleting assembly:", error);
      toast({
        title: "Error deleting assembly",
        description: error instanceof Error ? error.message : "Unknown error",
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

      {viewMode === "grid" ? (
        <AssemblyGrid
          assemblies={filteredAssemblies}
          onEdit={handleOpenAssemblyForm}
          onDelete={handleDeleteAssembly}
          onViewDetails={handleViewAssemblyDetails}
        />
      ) : (
        <AssemblyList
          assemblies={filteredAssemblies}
          onEdit={handleOpenAssemblyForm}
          onDelete={handleDeleteAssembly}
          onViewDetails={handleViewAssemblyDetails}
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

      {/* Assembly Details Dialog */}
      <Dialog 
        open={isDetailsDialogOpen} 
        onOpenChange={(open) => {
          setIsDetailsDialogOpen(open);
          if (!open) document.body.style.removeProperty('pointer-events');
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{detailsAssembly?.name || "Assembly Details"}</DialogTitle>
            <DialogDescription>
              Detailed information about this assembly
            </DialogDescription>
          </DialogHeader>
          
          {detailsAssembly && (
            <ScrollArea className="max-h-[500px] pr-3">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">ID</h3>
                  <p className="text-sm">{detailsAssembly.id}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Status</h3>
                  <p className="text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      detailsAssembly.status === "Active" ? "bg-green-100 text-green-800" :
                      detailsAssembly.status === "Maintenance" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {detailsAssembly.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Description</h3>
                  <p className="text-sm">{detailsAssembly.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Location</h3>
                  <p className="text-sm">{detailsAssembly.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Last Maintenance</h3>
                    <p className="text-sm">{detailsAssembly.lastMaintenance}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Next Maintenance</h3>
                    <p className="text-sm">{detailsAssembly.nextMaintenance}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-1">Components ({detailsAssembly.components.length})</h3>
                  {detailsAssembly.components.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {detailsAssembly.components.map(component => (
                        <div key={component.id} className="p-3 flex items-center">
                          <div className="flex items-center gap-2">
                            {getComponentIcon(component.type)}
                            <div>
                              <div className="font-medium text-sm">{component.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {component.type} • {component.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No components in this assembly</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDetailsDialogOpen(false);
                if (detailsAssembly) handleOpenAssemblyForm(detailsAssembly);
              }}
            >
              Edit
            </Button>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assemblies;
