
export interface Component {
  id: string;
  name: string;
  type: string;
}

export interface Assembly {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Maintenance" | "Decommissioned";
  location: string;
  components: Component[];
  lastMaintenance: string;
  nextMaintenance: string;
}

export type ViewMode = "grid" | "list";
