
import { Asset as ServiceAsset } from "@/services/assetService";
import { Asset as UIAsset } from "@/features/assemblies/types";

/**
 * Converts a service Asset to a UI Asset
 */
export const serviceToUIAsset = (asset: ServiceAsset): UIAsset => {
  return {
    id: asset.id,
    inventoryNumber: asset.inventory_number,
    name: asset.name,
    type: asset.type,
    status: asset.status as "Active" | "Maintenance" | "Decommissioned",
    location: asset.location,
    assignedTo: asset.assigned_to,
    purchaseDate: asset.purchase_date,
    warranty: asset.warranty,
    operatingSystem: asset.operating_system,
    user: asset.user_account,
    processor: asset.processor,
    motherboard: asset.motherboard,
    ram: asset.ram,
    storage: asset.storage,
    monitor: asset.monitor, // This was already correct
    peripherals: asset.peripherals || [],
    expansionCards: asset.expansion_cards || [],
    accessories: asset.accessories || [],
    division: asset.division,
    windowsLicense: asset.windows_license,
    hostname: asset.hostname
  };
};

/**
 * Converts a UI Asset to a service Asset
 */
export const uiToServiceAsset = (asset: UIAsset): Omit<ServiceAsset, 'id' | 'created_at'> => {
  return {
    inventory_number: asset.inventoryNumber,
    name: asset.name,
    type: asset.type,
    status: asset.status,
    location: asset.location,
    assigned_to: asset.assignedTo,
    purchase_date: asset.purchaseDate,
    warranty: asset.warranty,
    operating_system: asset.operatingSystem,
    user_account: asset.user,
    processor: asset.processor,
    motherboard: asset.motherboard,
    ram: asset.ram,
    storage: asset.storage,
    monitor: asset.monitor, // Make sure this matches the correct field
    peripherals: asset.peripherals,
    expansion_cards: asset.expansionCards,
    accessories: asset.accessories,
    division: asset.division,
    windows_license: asset.windowsLicense,
    hostname: asset.hostname
  };
};