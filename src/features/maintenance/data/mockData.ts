
export const MOCK_TASKS = [
  {
    id: "MT001",
    title: "Server Backup Verification",
    description: "Verify backup integrity and recoverability of production database server",
    status: "Completed",
    priority: "High",
    assignedTo: "John Smith",
    asset: { id: "A1004", name: "Dell PowerEdge R740" },
    assembly: { id: "ASM001", name: "Server Rack #1" },
    scheduledDate: "2024-04-10",
    completedDate: "2024-04-10",
    recurring: "Weekly",
    nextOccurrence: "2024-04-17"
  },
  {
    id: "MT002",
    title: "Network Switch Firmware Update",
    description: "Apply latest firmware updates to core switches",
    status: "In Progress",
    priority: "Medium",
    assignedTo: "Emma Wilson",
    asset: { id: "A1002", name: "Cisco Switch 24-Port" },
    assembly: { id: "ASM001", name: "Server Rack #1" },
    scheduledDate: "2024-04-11",
    completedDate: null,
    recurring: "None",
    nextOccurrence: null
  },
  {
    id: "MT003",
    title: "Workstation Security Scan",
    description: "Run comprehensive security scan on finance department devices",
    status: "Scheduled",
    priority: "Medium",
    assignedTo: "Michael Brown",
    asset: null,
    assembly: { id: "ASM002", name: "Finance Workstations" },
    scheduledDate: "2024-04-12",
    completedDate: null,
    recurring: "Monthly",
    nextOccurrence: "2024-05-12"
  },
  {
    id: "MT004",
    title: "UPS Battery Replacement",
    description: "Replace backup batteries in server room UPS",
    status: "Overdue",
    priority: "High",
    assignedTo: "John Smith",
    asset: { id: "A2011", name: "UPS System" },
    assembly: null,
    scheduledDate: "2024-04-05",
    completedDate: null,
    recurring: "None",
    nextOccurrence: null
  },
  {
    id: "MT005",
    title: "Printer Maintenance",
    description: "Clean and calibrate printer, replace consumables as needed",
    status: "Scheduled",
    priority: "Low",
    assignedTo: "Emma Wilson",
    asset: { id: "A1003", name: "HP LaserJet Pro" },
    assembly: null,
    scheduledDate: "2024-04-14",
    completedDate: null,
    recurring: "Quarterly",
    nextOccurrence: "2024-07-14"
  },
  {
    id: "MT006",
    title: "Software License Audit",
    description: "Review all software licenses and compliance status",
    status: "Scheduled",
    priority: "Medium",
    assignedTo: "Michael Brown",
    asset: null,
    assembly: null,
    scheduledDate: "2024-04-20",
    completedDate: null,
    recurring: "Yearly",
    nextOccurrence: "2025-04-20"
  }
];

export const USERS = [
  { id: "U001", name: "John Smith" },
  { id: "U002", name: "Emma Wilson" },
  { id: "U003", name: "Michael Brown" },
  { id: "U004", name: "Sarah Davis" }
];

export const ASSETS = [
  { id: "A1001", name: "Dell XPS 15" },
  { id: "A1002", name: "Cisco Switch 24-Port" },
  { id: "A1003", name: "HP LaserJet Pro" },
  { id: "A1004", name: "Dell PowerEdge R740" },
  { id: "A1005", name: "Microsoft Surface Pro" },
  { id: "A2011", name: "UPS System" }
];

export const ASSEMBLIES = [
  { id: "ASM001", name: "Server Rack #1" },
  { id: "ASM002", name: "Finance Workstations" },
  { id: "ASM003", name: "Conference Room A System" },
  { id: "ASM004", name: "Developer Workstation Pack" }
];
