
import { Asset } from "@/features/assemblies/types";

export const MOCK_ASSETS: Asset[] = [
  {
    id: "A1001",
    inventoryNumber: "IT-FA/KPTM/LAPTOP/IV/2022/001",
    name: "Dell XPS 15",
    type: "Laptop",
    status: "Active",
    location: "IT Department",
    assignedTo: "John Smith",
    purchaseDate: "2022-05-15",
    warranty: "2025-05-15",
    operatingSystem: "Windows 11 Pro",
    user: "jsmith",
    processor: "CMP001",
    motherboard: "CMP002",
    ram: "CMP003",
    storage: "CMP004",
    monitor: "N/A",
    peripherals: ["CMP005", "CMP006"],
    expansionCards: [],
    accessories: ["CMP007"],
    division: "IT Department",
    windowsLicense: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    hostname: "LAPTOP-XPS15-JS"
  },
  {
    id: "A1002",
    inventoryNumber: "IT-FA/KPTM/NETWORKING/I/2023/001",
    name: "Cisco Switch 24-Port",
    type: "Networking",
    status: "Active",
    location: "Server Room",
    assignedTo: "Network Infrastructure",
    purchaseDate: "2023-01-10",
    warranty: "2026-01-10"
  },
  {
    id: "A1003",
    inventoryNumber: "IT-FA/KPTM/PRINTER/XI/2021/001",
    name: "HP LaserJet Pro",
    type: "Printer",
    status: "Maintenance",
    location: "Finance Department",
    assignedTo: "Finance Team",
    purchaseDate: "2021-11-20",
    warranty: "2024-11-20"
  },
  {
    id: "A1004",
    inventoryNumber: "IT-FA/KPTM/SERVER/IX/2022/001",
    name: "Dell PowerEdge R740",
    type: "Server",
    status: "Active",
    location: "Server Room",
    assignedTo: "Infrastructure Team",
    purchaseDate: "2022-09-05",
    warranty: "2025-09-05",
    operatingSystem: "Windows Server 2022",
    hostname: "SRV-POWEREDGE-01"
  },
  {
    id: "A1005",
    inventoryNumber: "IT-FA/KPTM/TABLET/III/2023/001",
    name: "Microsoft Surface Pro",
    type: "Tablet",
    status: "Active",
    location: "Sales Department",
    assignedTo: "Emma Johnson",
    purchaseDate: "2023-03-22",
    warranty: "2025-03-22",
    operatingSystem: "Windows 11 Pro",
    user: "ejohnson",
    windowsLicense: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    hostname: "SURFACE-EJ01"
  },
  {
    id: "A1006",
    inventoryNumber: "IT-FA/KPTM/AUDIOVIDEO/VI/2019/001",
    name: "Polycom Conference System",
    type: "Audio/Video",
    status: "Decommissioned",
    location: "Storage",
    assignedTo: "Unassigned",
    purchaseDate: "2019-06-18",
    warranty: "2022-06-18"
  },
  {
    id: "A1007",
    inventoryNumber: "IT-FA/KPTM/LAPTOP/XI/2022/002",
    name: "Lenovo ThinkPad X1",
    type: "Laptop",
    status: "Active",
    location: "Marketing Department",
    assignedTo: "Alex Williams",
    purchaseDate: "2022-11-01",
    warranty: "2025-11-01",
    operatingSystem: "Windows 10 Pro",
    user: "awilliams",
    windowsLicense: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    hostname: "THINKPAD-AW01"
  },
  {
    id: "A1008",
    inventoryNumber: "IT-FA/KPTM/NETWORKING/II/2023/001",
    name: "Fortinet Firewall",
    type: "Networking",
    status: "Active",
    location: "Server Room",
    assignedTo: "Network Infrastructure",
    purchaseDate: "2023-02-15",
    warranty: "2026-02-15"
  }
];

export const MOCK_COMPONENTS = [
  {
    id: "CMP001",
    name: "Intel Core i7-12700K",
    type: "Processor",
    subtype: "Intel",
    serialNumber: "INTL7890123456",
    manufacturer: "Intel",
    model: "Core i7-12700K",
    specifications: {
      cores: "12",
      threads: "20",
      baseFrequency: "3.6 GHz",
      turboFrequency: "5.0 GHz"
    }
  },
  {
    id: "CMP002",
    name: "ASUS ROG Strix Z690-E",
    type: "Motherboard",
    subtype: "ATX",
    serialNumber: "ASB789012345",
    manufacturer: "Asus",
    model: "ROG Strix Z690-E",
    specifications: {
      chipset: "Z690",
      socket: "LGA1700",
      memorySlots: "4"
    }
  },
  {
    id: "CMP003",
    name: "G.Skill Trident Z5 RGB 32GB",
    type: "RAM",
    subtype: "DDR5",
    serialNumber: "GSK4567890123",
    manufacturer: "G.Skill",
    model: "Trident Z5 RGB",
    specifications: {
      capacity: "32GB (2x16GB)",
      speed: "6000MHz",
      timing: "CL36"
    }
  },
  {
    id: "CMP004",
    name: "Samsung 980 Pro 2TB",
    type: "Storage",
    subtype: "NVMe",
    serialNumber: "SAM1234567890",
    manufacturer: "Samsung",
    model: "980 Pro",
    specifications: {
      capacity: "2TB",
      interface: "PCIe 4.0",
      readSpeed: "7000 MB/s",
      writeSpeed: "5100 MB/s"
    }
  },
  {
    id: "CMP005",
    name: "Logitech MX Keys",
    type: "Peripherals",
    subtype: "Keyboard",
    serialNumber: "LOG7890123456",
    manufacturer: "Logitech",
    model: "MX Keys",
    specifications: {
      type: "Wireless",
      backlighting: "Yes",
      connectionType: "Bluetooth/USB Receiver"
    }
  },
  {
    id: "CMP006",
    name: "Logitech MX Master 3",
    type: "Peripherals",
    subtype: "Mouse",
    serialNumber: "LOG6789012345",
    manufacturer: "Logitech",
    model: "MX Master 3",
    specifications: {
      type: "Wireless",
      dpi: "4000",
      connectionType: "Bluetooth/USB Receiver"
    }
  },
  {
    id: "CMP007",
    name: "Noctua NF-A12x25",
    type: "Accessories",
    subtype: "Case Fan",
    serialNumber: "NOC5678901234",
    manufacturer: "Noctua",
    model: "NF-A12x25",
    specifications: {
      size: "120mm",
      rpm: "2000",
      airflow: "60.1 CFM"
    }
  }
];

export const ASSET_TYPES = [
  "All Types",
  "Desktop",
  "Laptop",
  "Server",
  "Tablet",
  "Printer",
  "Networking",
  "Audio/Video",
  "Mobile",
  "Other"
];

export const ASSET_STATUSES = [
  "All Statuses",
  "Active",
  "Maintenance",
  "Decommissioned"
];
