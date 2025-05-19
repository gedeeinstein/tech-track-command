
import { Asset, Assembly } from "../assemblies/types";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  assignedToName?: string; // Add assignedToName property
  asset: Asset | null;
  assembly: Assembly | null;
  scheduledDate: string;
  completedDate: string | null;
  recurring: string;
  nextOccurrence: string | null;
}

export interface ScannedAsset {
  id: string;
  name: string;
  type: string;
  assetId: string;        // Added this property
  inventoryNumber: string; // Added this property
}
