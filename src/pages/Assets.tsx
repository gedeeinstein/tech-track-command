
import React, { useState, useEffect } from "react";
import AssetTable from "@/features/assets/components/AssetTable";
import AssetHeader from "@/features/assets/components/AssetHeader";
import AssetFilters from "@/features/assets/components/AssetFilters";
import AssetForm from "@/features/assets/components/AssetForm";
import { toast } from "@/hooks/use-toast";
import { Asset as UIAsset } from "@/features/assemblies/types";
import { getAssets, createAsset, updateAsset, deleteAsset } from "@/services/assetService";
import { MOCK_COMPONENTS, ASSET_TYPES, ASSET_STATUSES } from "@/features/assets/data/mockData";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";
import { useDialog } from "@/hooks/useDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceToUIAsset, uiToServiceAsset } from "@/features/assets/utils/assetConverter";
import { getComponents } from "@/services/componentService";

const Assets = () => {
  const queryClient = useQueryClient();
  const [currentAsset, setCurrentAsset] = useState<UIAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(ASSET_TYPES[0]);
  const [selectedStatus, setSelectedStatus] = useState(ASSET_STATUSES[0]);
  
  const [isFormOpen, setIsFormOpen] = useDialog(false);

  // Fetch assets
  const { data: serviceAssets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets
  });
  
  // Fetch components for the dropdown selections
  const { data: components = [] } = useQuery({
    queryKey: ['components'],
    queryFn: getComponents
  });
  
  // Convert service assets to UI assets
  const assets: UIAsset[] = serviceAssets.map(serviceToUIAsset);

  // Create asset mutation
  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setIsFormOpen(false);
      toast({
        title: "Asset Created",
        description: "The asset has been created successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description: "Failed to create asset. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setIsFormOpen(false);
      toast({
        title: "Asset Updated",
        description: "The asset has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description: "Failed to update asset. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast({
        title: "Asset Deleted",
        description: "The asset has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: "Failed to delete asset. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddEdit = (asset: UIAsset | null = null) => {
    setCurrentAsset(asset);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentAsset) {
        // Update existing asset - Remove any references to updated_at
        const serviceData = {
          id: currentAsset.id,
          ...uiToServiceAsset({ ...currentAsset, ...data })
        };
        await updateAssetMutation.mutateAsync(serviceData);
      } else {
        // Create new asset
        const type = data.type || "Other";
        // Generate inventory number
        const inventoryNumber = generateInventoryNumber(type, assets.length + 1);
        
        // Convert UI data to service data
        const serviceData = uiToServiceAsset({ 
          ...data, 
          inventoryNumber,
          // Set defaults for required fields
          assignedTo: data.assignedTo || "Unassigned",
          location: data.location || "Storage",
          status: data.status || "Active",
          purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
          warranty: data.warranty || new Date().toISOString().split('T')[0]
        } as UIAsset);
        
        await createAssetMutation.mutateAsync(serviceData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteAssetMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete asset error:", error);
    }
  };

  // Filter assets based on search and filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.inventoryNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "All Types" || asset.type === selectedType;
    const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <AssetHeader handleAddEdit={() => handleAddEdit()} />
      
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AssetTable
          assets={filteredAssets}
          handleAddEdit={handleAddEdit}
          handleDeleteAsset={handleDeleteAsset}
        />
      )}
      
      <AssetForm
        open={isFormOpen}
        setOpen={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setCurrentAsset(null);
          }
        }}
        currentAsset={currentAsset}
        assets={assets}
        onSubmit={handleFormSubmit}
        components={components}
      />
    </div>
  );
};

export default Assets;