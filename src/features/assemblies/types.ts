
export interface Component {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  specifications?: Record<string, string>;
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

export const COMPONENT_TYPES = [
  "Processor",
  "Motherboard",
  "CPU Cooler",
  "RAM",
  "Storage",
  "PSU",
  "Monitor",
  "Case",
  "Peripherals",
  "Expansion Cards",
  "Networking",
  "Accessories",
  "Other"
];

export const COMPONENT_SUBTYPES: Record<string, string[]> = {
  "Processor": ["Intel", "AMD", "ARM"],
  "Motherboard": ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"],
  "CPU Cooler": ["Air Cooler", "Liquid Cooler", "AIO"],
  "RAM": ["DDR3", "DDR4", "DDR5"],
  "Storage": ["SSD", "HDD", "NVMe", "External"],
  "PSU": ["ATX", "SFX", "Modular", "Semi-Modular", "Non-Modular"],
  "Monitor": ["LCD", "LED", "OLED", "Curved", "Ultrawide"],
  "Case": ["Full Tower", "Mid Tower", "Mini Tower", "SFF"],
  "Peripherals": ["Keyboard", "Mouse", "Headphones", "Speakers", "Webcam"],
  "Expansion Cards": ["Sound Card", "Video Card"],
  "Networking": ["Wired Network Adapter", "Wireless Network Adapter", "Bluetooth Adapter"],
  "Accessories": ["Case Fan", "Fan Controller", "Thermal Compound", "Optical Drive", "UPS System"],
  "Other": ["Cable", "Adapter", "Tool"]
};

export const MANUFACTURERS = [
  "Intel",
  "AMD",
  "NVIDIA",
  "Asus",
  "MSI",
  "Gigabyte",
  "AsRock",
  "EVGA",
  "Corsair",
  "G.Skill",
  "Kingston",
  "Crucial",
  "Western Digital",
  "Seagate",
  "Samsung",
  "Dell",
  "HP",
  "Lenovo",
  "NZXT",
  "Cooler Master",
  "Thermaltake",
  "be quiet!",
  "Noctua",
  "Logitech",
  "Razer",
  "SteelSeries",
  "HyperX",
  "Other"
];

export interface Asset {
  id: string;
  inventoryNumber: string;
  name: string;
  type: string;
  status: "Active" | "Maintenance" | "Decommissioned";
  location: string;
  assignedTo: string;
  purchaseDate: string;
  warranty: string;
  operatingSystem?: string;
  user?: string;
  processor?: string;
  motherboard?: string;
  ram?: string;
  storage?: string;
  monitor?: string;
  peripherals?: string[];
  expansionCards?: string[];
  accessories?: string[];
  division?: string;
  windowsLicense?: string;
  hostname?: string;
}

export const OPERATING_SYSTEMS = [
  "Windows 10 Home",
  "Windows 10 Pro",
  "Windows 11 Home",
  "Windows 11 Pro",
  "macOS",
  "Ubuntu",
  "Fedora",
  "Debian",
  "CentOS",
  "Other Linux"
];

export const DIVISIONS = [
  "IT Department",
  "HR Department",
  "Finance Department",
  "Sales Department",
  "Marketing Department",
  "Operations",
  "Customer Support",
  "Research & Development",
  "Executive",
  "Other"
];
