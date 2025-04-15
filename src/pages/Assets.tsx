
import React, { useState, useEffect } from "react";
import AssetTable from "@/features/assets/components/AssetTable";
import AssetHeader from "@/features/assets/components/AssetHeader";
import AssetFilters from "@/features/assets/components/AssetFilters";
import AssetForm from "@/features/assets/components/AssetForm";
import { toast } from "@/components/ui/use-toast";
import { Asset } from "@/features/assemblies/types";
import { MOCK_ASSETS, MOCK_COMPONENTS, ASSET_TYPES, ASSET_STATUSES } from "@/features/assets/data/mockData";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";
import { useDialog } from "@/hooks/useDialog";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(ASSET_TYPES[0]);
  const [selectedStatus, setSelectedStatus] = useState(ASSET_STATUSES[0]);
  
  const [isFormOpen, setIsFormOpen] = useDialog(false);

  const handleAddEdit = (asset: Asset | null = null) => {
    setCurrentAsset(asset);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (currentAsset) {
      // Update existing asset
      const updatedAsset = { ...currentAsset, ...data };
      setAssets(assets.map(asset => asset.id === currentAsset.id ? updatedAsset : asset));
      toast({
        title: "Asset Updated",
        description: `${data.name} has been successfully updated.`
      });
    } else {
      // Create new asset
      const newId = `A${(assets.length + 1001).toString().substring(1)}`;
      const type = data.type || "Other";
      const inventoryNumber = generateInventoryNumber(type, assets.length + 1);
      
      const newAsset = {
        ...data,
        id: newId,
        inventoryNumber
      };
      
      setAssets([...assets, newAsset]);
      toast({
        title: "Asset Added",
        description: `${data.name} has been successfully added.`
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast({
      title: "Asset Deleted",
      description: "The asset has been removed from inventory."
    });
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
      
      <AssetTable
        assets={filteredAssets}
        handleAddEdit={handleAddEdit}
        handleDeleteAsset={handleDeleteAsset}
      />
      
      <AssetForm
        open={isFormOpen}
        setOpen={(open) => {
          setIsFormOpen(open);
          if (!open) document.body.style.removeProperty('pointer-events');
        }}
        currentAsset={currentAsset}
        assets={assets}
        onSubmit={handleFormSubmit}
        components={MOCK_COMPONENTS}
      />
    </div>
  );
};

export default Assets;
