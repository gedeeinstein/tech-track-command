
import React, { useState } from "react";
import { Asset } from "@/features/assemblies/types";
import { generateInventoryNumber } from "@/features/assets/utils/inventoryGenerator";
import AssetHeader from "@/features/assets/components/AssetHeader";
import AssetFilters from "@/features/assets/components/AssetFilters";
import AssetTable from "@/features/assets/components/AssetTable";
import AssetForm from "@/features/assets/components/AssetForm";
import { 
  MOCK_ASSETS, 
  MOCK_COMPONENTS, 
  ASSET_TYPES, 
  ASSET_STATUSES 
} from "@/features/assets/data/mockData";

const Assets: React.FC = () => {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [components] = useState(MOCK_COMPONENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [formOpen, setFormOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (asset.inventoryNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesType = selectedType === "All Types" || asset.type === selectedType;
    const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddEdit = (asset: Asset | null = null) => {
    setCurrentAsset(asset);
    setFormOpen(true);
  };

  const onSubmit = (data: any) => {
    if (currentAsset) {
      setAssets(assets.map(a => a.id === currentAsset.id ? {
        ...a,
        ...data
      } : a));
    } else {
      const newId = `A${Math.floor(1000 + Math.random() * 9000)}`;
      const newAsset: Asset = {
        id: newId,
        inventoryNumber: generateInventoryNumber(data.type, assets.length + 1),
        ...data
      };
      setAssets([...assets, newAsset]);
    }
    setFormOpen(false);
    setCurrentAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

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
        open={formOpen}
        setOpen={setFormOpen}
        currentAsset={currentAsset}
        assets={assets}
        onSubmit={onSubmit}
        components={components}
      />
    </div>
  );
};

export default Assets;
