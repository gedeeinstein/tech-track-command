
import { Assembly } from "../types";

// Mock assemblies data
export const MOCK_ASSEMBLIES: Assembly[] = [
  {
    id: "ASM001",
    name: "Server Rack #1",
    description: "Primary server rack for production environment",
    status: "Active",
    location: "Server Room A",
    components: [
      { id: "A1004", name: "Dell PowerEdge R740", type: "Server" },
      { id: "A1002", name: "Cisco Switch 24-Port", type: "Networking" },
      { id: "A1008", name: "Fortinet Firewall", type: "Networking" }
    ],
    lastMaintenance: "2023-12-10",
    nextMaintenance: "2024-06-10"
  },
  {
    id: "ASM002",
    name: "Finance Workstations",
    description: "Complete workstation setup for finance department",
    status: "Active",
    location: "Finance Department",
    components: [
      { id: "A1005", name: "Microsoft Surface Pro", type: "Tablet" },
      { id: "A1003", name: "HP LaserJet Pro", type: "Printer" }
    ],
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-07-15"
  },
  {
    id: "ASM003",
    name: "Conference Room A System",
    description: "Audio/video system for main conference room",
    status: "Maintenance",
    location: "Main Conference Room",
    components: [
      { id: "A1006", name: "Polycom Conference System", type: "Audio/Video" },
      { id: "A2010", name: "Projector", type: "Audio/Video" }
    ],
    lastMaintenance: "2023-11-20",
    nextMaintenance: "2024-05-20"
  },
  {
    id: "ASM004",
    name: "Developer Workstation Pack",
    description: "Standard development environment",
    status: "Active",
    location: "IT Department",
    components: [
      { id: "A1001", name: "Dell XPS 15", type: "Laptop" },
      { id: "A1007", name: "Lenovo ThinkPad X1", type: "Laptop" }
    ],
    lastMaintenance: "2024-02-05",
    nextMaintenance: "2024-08-05"
  }
];

// Additional mock assets for component selection
export const AVAILABLE_COMPONENTS = [
  { id: "A1001", name: "Dell XPS 15", type: "Laptop" },
  { id: "A1002", name: "Cisco Switch 24-Port", type: "Networking" },
  { id: "A1003", name: "HP LaserJet Pro", type: "Printer" },
  { id: "A1004", name: "Dell PowerEdge R740", type: "Server" },
  { id: "A1005", name: "Microsoft Surface Pro", type: "Tablet" },
  { id: "A1006", name: "Polycom Conference System", type: "Audio/Video" },
  { id: "A1007", name: "Lenovo ThinkPad X1", type: "Laptop" },
  { id: "A1008", name: "Fortinet Firewall", type: "Networking" },
  { id: "A2010", name: "Projector", type: "Audio/Video" },
  { id: "A2011", name: "UPS System", type: "Power" },
  { id: "A2012", name: "Netgear Router", type: "Networking" },
  { id: "A2013", name: "IP Camera", type: "Security" }
];
