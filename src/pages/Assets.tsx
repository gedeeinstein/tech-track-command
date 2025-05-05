
import React, { useState, useEffect } from "react";
import AssetTable from "@/features/assets/components/AssetTable";
import AssetHeader from "@/features/assets/components/AssetHeader";
import AssetFilters from "@/features/assets/components/AssetFilters";
import AssetForm from "@/features/assets/components/AssetForm";
import { toast } from "@/components/ui/use-toast";
import { Asset } from "@/features/assemblies/types";
import { ASSET_TYPES, ASSET_STATUSES } from "@/features/assets/data/mockData";
import { useDialog } from "@/hooks/useDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAssets, createAsset, updateAsset, deleteAsset } from "@/services/assetService";
import { fetchComponents } from "@/services/componentService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Assets = () => {
  const queryClient = useQueryClient();
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(ASSET_TYPES[0]);
  const [selectedStatus, setSelectedStatus] = useState(ASSET_STATUSES[0]);
  
  const [isFormOpen, setIsFormOpen] = useDialog(false);

  // Fetch assets
  const { data: assets = [], isLoading: isLoadingAssets, isError: isErrorAssets, error: assetsError } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets
  });

  // Fetch components for the form with debugging
  const { 
    data: components = [], 
    isLoading: isLoadingComponents, 
    isError: isErrorComponents,
    error: componentsError
  } = useQuery({
    queryKey: ['components'],
    queryFn: fetchComponents
  });

  // Debug component data on load
  useEffect(() => {
    if (components.length > 0) {
      console.log("Loaded components:", components);
      console.log("Processors:", components.filter(c => c.type === "Processor"));
      console.log("RAM:", components.filter(c => c.type === "RAM"));
    }
  }, [components]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({
        title: "Asset Added",
        description: "The asset has been successfully added."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add asset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, asset }: { id: string; asset: Partial<Asset> }) => 
      updateAsset(id, asset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({
        title: "Asset Updated",
        description: "The asset has been successfully updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update asset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({
        title: "Asset Deleted",
        description: "The asset has been removed from inventory."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete asset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleAddEdit = (asset: Asset | null = null) => {
    console.log("Opening asset form with:", asset);
    setCurrentAsset(asset);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
    if (currentAsset) {
      // Update existing asset
      updateMutation.mutate({
        id: currentAsset.id,
        asset: data
      });
    } else {
      // Create new asset
      createMutation.mutate(data);
    }
    setIsFormOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Filter assets based on search and filters
  const filteredAssets = assets.filter(asset => {
    // Apply search filter
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.inventoryNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    const matchesType = selectedType === "All Types" || asset.type === selectedType;
    
    // Apply status filter
    const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const isLoading = isLoadingAssets || isLoadingComponents;

  return (
    <div className="space-y-6">
      <AssetHeader handleAddEdit={() => handleAddEdit()} />
      
      {isErrorAssets && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {assetsError instanceof Error 
              ? assetsError.message 
              : "Failed to load assets. Please try again later."}
          </AlertDescription>
        </Alert>
      )}

      {isErrorComponents && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Components</AlertTitle>
          <AlertDescription>
            {componentsError instanceof Error 
              ? componentsError.message 
              : "Failed to load components. Component selection in forms may not work correctly."}
          </AlertDescription>
        </Alert>
      )}
      
      <AssetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        assetTypes={ASSET_TYPES}
        assetStatuses={ASSET_STATUSES}
      />
      
      {isLoading ? (
        <div className="p-4 text-center">Loading assets...</div>
      ) : (
        <AssetTable
          assets={filteredAssets}
          handleAddEdit={handleAddEdit}
          handleDeleteAsset={handleDeleteAsset}
        />
      )}
      
      {/* Fix: Only render AssetForm when data is ready */}
      {!isLoadingComponents && (
        <AssetForm
          open={isFormOpen}
          setOpen={(open) => {
            setIsFormOpen(open);
            if (!open) document.body.style.removeProperty('pointer-events');
          }}
          currentAsset={currentAsset}
          assets={assets}
          onSubmit={handleFormSubmit}
          components={components}
        />
      )}
    </div>
  );
};

export default Assets;
