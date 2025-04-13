
export interface Asset {
  id: string;
  name: string;
}

export interface Assembly {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  asset: Asset | null;
  assembly: Assembly | null;
  scheduledDate: string;
  completedDate: string | null;
  recurring: string;
  nextOccurrence: string | null;
}

export interface ScannedAsset {
  assetId: string;
  inventoryNumber: string;
}
